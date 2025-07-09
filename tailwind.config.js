/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'comic': ['Comic Neue', 'cursive'],
      },
      colors: {
        'doggo': {
          'primary': '#5A3E36',
          'secondary': '#FFF5E6',
          'accent': '#FF9F1C',
          'table': '#D4A76A',
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 