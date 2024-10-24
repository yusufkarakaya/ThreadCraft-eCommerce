/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'main-text': 'rgba(18, 48, 38, 0.75)',
      },
    },
  },
  plugins: [],
}
