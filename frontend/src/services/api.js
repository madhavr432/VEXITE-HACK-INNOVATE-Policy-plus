import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

/**
 * Fetch general platform health status
 */
export async function getHealth() {
  const response = await api.get('/api/health');
  return response.data;
}

/**
 * Fetch Bus Policy module status
 */
export async function getBusStatus() {
  const response = await api.get('/api/bus');
  return response.data;
}

/**
 * Fetch GST Policy module status
 */
export async function getGstStatus() {
  const response = await api.get('/api/gst');
  return response.data;
}

export default api;
