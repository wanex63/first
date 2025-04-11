module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ваши кастомные цвета
        'kino': {
          'yellow': '#FFD80A',
          'dark': '#1F1F1F',
          'gray': '#2F2F2F'
        },
        // Стандартные цвета amber
        'amber': {
          400: '#fbbf24',
          500: '#f59e0b'
        }
      }
    },
  },
  plugins: [],
}