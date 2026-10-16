/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ayu: {
          bg: '#0A0C10',
          card: '#12161F',
          surface: '#1A202C',
          muted: '#273142',
          border: '#2A3446',
          coral: '#FF4154',
          'coral-hover': '#FF5E6F',
          'coral-dark': '#D92A3D',
          gold: '#E5A93C',
          'gold-light': '#FCD34D',
          text: '#F1F5F9',
          'text-muted': '#94A3B8',
          'text-subtle': '#64748B',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      aspectRatio: {
        '9/16': '9 / 16',
        '16/9': '16 / 9',
        '3/4': '3 / 4',
        '2/3': '2 / 3',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
