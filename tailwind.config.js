/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        background: {
          primary: '#0a0a0a',
          secondary: '#1a1a1a',
          card: '#1f1f1f',
        },
        // Accent colors
        accent: {
          gold: '#F0B90B',
          'gold-dark': '#D9A309',
        },
        // Trading colors
        trading: {
          long: '#2D5F4F',
          'long-hover': '#3A7561',
          short: '#5F2D2D',
          'short-hover': '#733737',
          positive: '#10B981',
          negative: '#EF4444',
        },
        // UI colors
        ui: {
          wallet: '#4A5568',
          'wallet-hover': '#5A6578',
          border: '#2a2a2a',
          'text-primary': '#FFFFFF',
          'text-secondary': '#9CA3AF',
          'text-tertiary': '#6B7280',
        },
        // Chart colors
        chart: {
          line: '#F0B90B',
          grid: '#2a2a2a',
          tooltip: '#2D5F4F',
        },
      },
    },
  },
  plugins: [],
}
