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
        brand: {
          50: '#ecf3ff',
          100: '#e0ebff',
          400: '#6B7FFF',
          500: '#465fff',
          600: '#3641f5',
        },
        success: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626'
        },
        warning: {
          50: '#fff7ed',
          500: '#f97316',
          600: '#ea580c'
        },
      },
    },
  },
  safelist: [
    'bg-primary',
    'bg-success',
    'bg-danger',
    'bg-warning',
    'border-primary',
    'border-success',
    'border-danger',
    'border-warning',
  ],
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

