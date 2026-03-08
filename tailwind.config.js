/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        cute: ['"Kosugi Maru"', 'sans-serif'],
      },
      colors: {
        lightPink: '#ffb6c1',
        lightPurple: '#d8b4fe',
        darkPurple: '#7c3aed'
      }
    },
  },
  plugins: [],
}