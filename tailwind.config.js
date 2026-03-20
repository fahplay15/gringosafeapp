/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#00C853',
          red: '#FF1744',
          gold: '#FFD600',
          blue: '#2979FF',
          dark: '#0D1117',
          card: '#161B22',
          border: '#30363D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
