/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066CC',
          light: '#4D94FF',
          dark: '#004D99'
        },
        secondary: {
          DEFAULT: '#FF6B35',
          light: '#FF8A5B',
          dark: '#E54B1C'
        },
        accent: '#00CC66',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)',
        'travel': '0 8px 32px rgba(0, 102, 204, 0.12)',
        'booking': '0 4px 20px rgba(255, 107, 53, 0.15)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      },
      backgroundImage: {
        'travel-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'weather-gradient': 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
        'weather-card': 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',


        'destination-overlay': 'linear-gradient(0deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)'
      }
    }
  },
  plugins: [],
  darkMode: 'class',
}