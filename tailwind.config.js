/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0A2946', 80: '#3B5169', 60: '#6D7E8F' },
        cream: { DEFAULT: '#F3E3C9', light: '#FAF3E6' },
        sage: { DEFAULT: '#D2D4BF', light: '#E7E8DB' },
        brown: '#8B5F3C',
      },
      fontFamily: { sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
