module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kino': {
          'yellow': 'var(--color-kino-yellow)',
          'dark': 'var(--color-kino-dark)',
          'gray': 'var(--color-kino-gray)',
        }
      },
    },
  },
  plugins: [],
}