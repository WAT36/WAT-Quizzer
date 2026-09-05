/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      spacing: {
        '25': '6.25rem' // 100px
      },
      zIndex: {
        '10000': '10000',
        '10001': '10001'
      }
    }
  },
  plugins: []
};
