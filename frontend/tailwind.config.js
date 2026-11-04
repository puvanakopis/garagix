/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gx: {
          primary: {
            DEFAULT: '#d70006',
            hover: '#b80005',
            glow: 'rgba(215, 0, 6, 0.35)',
            subtle: 'rgba(215, 0, 6, 0.12)'
          },
          accent: {
            DEFAULT: '#f97316',
          },
          canvas: '#0e0d0d',
          surface: {
            DEFAULT: '#100e0f',
            elevated: '#121111'
          },
          card: {
            DEFAULT: '#141314',
            hover: '#1a1a1a'
          },
          border: {
            subtle: '#1c1c1d',
            DEFAULT: '#222222',
            highlight: '#323232',
            primary: 'rgba(215, 0, 6, 0.5)'
          },
          text: {
            primary: '#ffffff',
            secondary: '#878f97',
            muted: '#74787c',
            dim: '#58595b'
          }
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Oxanium', 'Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'gx-sm': '0 2px 4px rgba(0, 0, 0, 0.5)',
        'gx-md': '0 4px 16px rgba(0, 0, 0, 0.6)',
        'gx-lg': '0 10px 30px rgba(0, 0, 0, 0.8)',
        'gx-glow': '0 0 24px rgba(215, 0, 6, 0.35)',
      },
      backgroundImage: {
        'hero-overlay': 'linear-gradient(90deg, rgba(14, 13, 13, 0.98) 0%, rgba(14, 13, 13, 0.92) 45%, rgba(14, 13, 13, 0.4) 80%, rgba(14, 13, 13, 0.1) 100%)',
      },
      transitionDuration: {
        '400': '400ms',
      }
    },
  },
  plugins: [],
}

