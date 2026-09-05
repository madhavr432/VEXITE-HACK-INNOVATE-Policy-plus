/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light & Dark canvas tokens
        canvas: {
          DEFAULT: '#f8fafc',
          dark: '#0b0f19',
          subtle: '#f1f5f9',
          'subtle-dark': '#131b2e',
          surface: '#ffffff',
          'surface-dark': '#141c2e',
          border: '#e2e8f0',
          'border-dark': '#1e293b',
        },
        // Typography tokens
        ink: {
          DEFAULT: '#090d1a',
          muted: '#475569',
          subtle: '#64748b',
          faint: '#94a3b8',
        },
        // AI Violet accent
        ai: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Policy indigo brand
        policy: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'soft-xs': '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'soft-sm': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'soft-md': '0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -2px rgba(15, 23, 42, 0.04)',
        'soft-lg': '0 10px 25px -4px rgba(15, 23, 42, 0.08), 0 4px 10px -3px rgba(15, 23, 42, 0.04)',
        'soft-xl': '0 20px 35px -6px rgba(15, 23, 42, 0.09), 0 8px 16px -4px rgba(15, 23, 42, 0.04)',
        'ai-glow': '0 0 25px -3px rgba(124, 58, 237, 0.15)',
        'ai-glow-dark': '0 0 40px -5px rgba(139, 92, 246, 0.25)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      }
    },
  },
  plugins: [],
}
