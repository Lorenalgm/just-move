/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        move: {
          bg: '#0D1B17',
          dark: '#091411',
          card: '#162C25',
          cardLight: '#1C372E',
          border: '#244A3F',
          orange: '#FF6B2C',
          orangeHover: '#FF7D42',
          orangeLight: '#FF8A50',
          mint: '#00E89D',
          mintDark: '#00B87C',
          yellow: '#F59E0B',
          red: '#EF4444',
          gray: '#8EA49D',
          textMuted: '#58746B'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
