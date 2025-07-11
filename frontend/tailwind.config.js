/** @type {import('tailwindcss').Config} */
export default {
   content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          light: '#3b82f6',  // blue-500
          dark: '#1e40af',   // blue-800
        },
        accent: {
          DEFAULT: '#f59e42', // orange-400
          light: '#fbbf24',   // orange-300
          dark: '#b45309',    // orange-800
        },
        success: {
          DEFAULT: '#22c55e', // green-500
        },
        warning: {
          DEFAULT: '#facc15', // yellow-400
        },
        danger: {
          DEFAULT: '#ef4444', // red-500
        },
        neutral: {
          DEFAULT: '#64748b', // slate-500
          light: '#f1f5f9',   // slate-100
          dark: '#334155',    // slate-800
        },
        brand: {
          blue: '#2563eb',
          green: '#22c55e',
          purple: '#8b5cf6',
        }
      }
    },
  },
  plugins: [],
}

