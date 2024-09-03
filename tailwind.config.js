/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
   './pages/**/*.{js,ts,jsx,tsx}',  // Tutti i file all'interno di pages
    './components/**/*.{js,ts,jsx,tsx}',  // Se hai una cartella components
    // Se hai file CSS in styles
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        'xs': '480px'
      }
    },
  },
  plugins: [],
}
