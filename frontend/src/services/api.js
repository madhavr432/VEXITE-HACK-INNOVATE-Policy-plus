import axios from 'axios';

/**
 * URL normalization helper:
 * - Strips trailing slashes
 * - Prevents double `/api/api` if environment variable accidentally included `/api`
 */
function normalizeBaseUrl(url) {
  if (!url) return '';
  const cleaned = url.trim().replace(/\/+$/, '');
  return cleaned.endsWith('/api') ? cleaned.slice(0, -4) : cleaned;
}

/**
 * Resolve the API base URL:
 * - In production (Vercel deployment) or when accessed from a remote domain:
 *   If VITE_API_URL is unset or contains 'localhost', we use '' (relative URL).
 *   This ensures requests like `/api/bus/simulate` go to same-origin and are seamlessly
 *   reverse-proxied to the Render backend via Vercel rewrites (zero CORS, zero localhost issues).
 * - If VITE_API_URL points to an explicit remote backend (e.g. Render), that can also be used.
 * - In local development (`npm run dev`), defaults to '' which Vite's dev server proxies
 *   to http://localhost:8000.
 */
function resolveBaseUrl() {
  const envUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '').trim();
  const isBrowser = typeof window !== 'undefined';
  const isRemoteHost = isBrowser && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  const isProduction = import.meta.env.PROD || isRemoteHost;

  if (isProduction) {
    // If an environment variable is set to localhost, ignore it in production!
    if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return normalizeBaseUrl(envUrl);
    }
    // Default to same-origin relative proxy on Vercel deployment
    return '';
  }

  // Local development: use envUrl if valid, otherwise empty string for Vite proxy
  if (envUrl) {
    return normalizeBaseUrl(envUrl);
  }
  return '';
}

export const API_URL = resolveBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // 45-second timeout to smoothly accommodate Render free-tier cold-start spins
  timeout: 45000,
});

/**
 * Centralized response interceptor for Render cold starts and error normalization.
 * Generates userMessage on the error object without exposing raw Axios stack traces.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let userMessage = 'Unable to connect to the Policy+ backend. Please try again.';

    if (error.code === 'ECONNABORTED' || (error.message && error.message.toLowerCase().includes('timeout'))) {
      userMessage = 'Policy+ backend is waking up. Please try again in a moment.';
    } else if (!error.response) {
      // Network disconnect, DNS failure, or sleeping Render container
      userMessage = 'Policy+ backend is waking up. Please try again in a moment.';
    } else {
      const status = error.response.status;
      if (status === 502 || status === 503 || status === 504) {
        userMessage = 'Policy+ backend is waking up. Please try again in a moment.';
      } else if (status === 422) {
        const detail = error.response.data?.detail;
        if (typeof detail === 'string') {
          userMessage = detail;
        } else if (Array.isArray(detail)) {
          userMessage = detail.map((d) => d.msg || d.message || JSON.stringify(d)).join(', ') || 'Invalid input provided.';
        } else {
          userMessage = 'Invalid policy input parameters. Please check values.';
        }
      } else if (status === 400) {
        userMessage = error.response.data?.detail || 'Invalid request. Please verify inputs.';
      } else if (status >= 500) {
        userMessage = error.response.data?.detail || 'Policy+ backend encountered an internal error. Please try again.';
      }
    }

    error.userMessage = userMessage;
    return Promise.reject(error);
  }
);

/**
 * Platform health check
 */
export async function getHealth() {
  const response = await api.get('/api/health');
  return response.data;
}

/**
 * Bus Policy module status
 */
export async function getBusStatus() {
  const response = await api.get('/api/bus');
  return response.data;
}

/**
 * GST Policy module status
 */
export async function getGstStatus() {
  const response = await api.get('/api/gst');
  return response.data;
}

/**
 * Standard Bus API helpers
 */
export const simulateBusPolicy = (data) => api.post('/api/bus/simulate', data);
export const getBusScenarios = (data) => api.post('/api/bus/scenarios', data);
export const stressTestBusPolicy = (data) => api.post('/api/bus/stress-test', data);
export const calculateBusRisk = (data) => api.post('/api/bus/risk', data);

/**
 * Standard Gemini AI Policy Analyst helper
 */
export const analyzePolicyWithGemini = (data) => api.post('/api/ai/analyze-policy', data, { timeout: 60000 });

export default api;

