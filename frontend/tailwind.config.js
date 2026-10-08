/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FDFBF6',
          100: '#F8F4EA',
          200: '#F0E9D8',
          300: '#E4D9C0',
        },
        gold: {
          400: '#C9963A',
          500: '#B5832A',
          600: '#9A6E22',
        },
        ink: {
          900: '#1A1209',
          800: '#2C1F10',
          700: '#3E3020',
          600: '#5A4A32',
          500: '#7A6A52',
          400: '#9A8A72',
          300: '#B8A890',
          200: '#D4C8B4',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-light': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 40L40 0M0 0' stroke='%23D4C8B4' stroke-width='0.5' fill='none'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
