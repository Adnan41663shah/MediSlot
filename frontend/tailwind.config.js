/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fill, minmax(220px, 1fr))'
      },
      colors: {
        primary: {
          DEFAULT: '#0D9488',
          dark: '#0F766E',
          light: '#5EEAD4',
          muted: '#CCFBF1',
        },
        accent: {
          DEFAULT: '#C2410C',
          hover: '#9A3412',
          light: '#FED7AA',
        },
        surface: {
          warm: '#FFFBEB',
          card: '#FFFFFF',
          muted: '#F5F5F4',
        },
        text: {
          primary: '#1C1917',
          secondary: '#57534E',
          muted: '#78716C',
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(13, 148, 136, 0.08), 0 10px 20px -2px rgba(13, 148, 136, 0.04)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'card-hover': '0 10px 40px -10px rgba(13, 148, 136, 0.15)',
      }
    },
  },
  plugins: [],
}