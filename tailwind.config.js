/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      '2xsm': '320px',
      'xsm': '425px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontSize: {
        'theme-sm': ['var(--text-theme-sm)', {
          lineHeight: 'var(--text-theme-sm--line-height)'
        }],
      },
      colors: {
        brand: {
          50: '#e6ebff',   // Lightest shade
          100: '#ccd6ff',  // Lighter shade
          400: '#4d66ff',  // Light shade
          500: '#1333ff',  // Main blue
          600: '#0f29cc',  // Darker shade
        },
        success: {
          50: '#ecfdf5',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        error: {
          50: '#fef2f2',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626'
        },
        warning: {
          50: '#fff7ed',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c'
        },
        gray: {
          850: '#1a212e', // Custom darker shade between gray-800 and gray-900
        },
      },
      boxShadow: {
        'theme-sm': '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
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
    {
      pattern: /bg-(brand|success|error|warning)-(400|500)/,
      variants: ['dark', 'hover'],
    },
    {
      pattern: /bg-(brand|success|error|warning)-(400|500)\/10/,
      variants: ['dark', 'hover'],
    },
  ],
  plugins: [],
}

