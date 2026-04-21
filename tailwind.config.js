/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          50:  '#eef4ff',
          100: '#dbe6ff',
          200: '#b9ccff',
          300: '#8ea9ff',
          400: '#5f82ff',
          500: '#3b5bff',
          600: '#2e42f5',
          700: '#2632d4',
          800: '#222dab',
          900: '#1f2987',
        },
        glass: {
          light: 'rgba(255,255,255,0.62)',
          lighter: 'rgba(255,255,255,0.78)',
          dark: 'rgba(22,22,28,0.55)',
          darker: 'rgba(10,10,14,0.72)',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        'ios': '1.25rem',
        'ios-lg': '1.75rem',
        'ios-xl': '2.25rem',
      },
      boxShadow: {
        'glass': '0 1px 0 0 rgba(255,255,255,0.5) inset, 0 -1px 0 0 rgba(0,0,0,0.04) inset, 0 20px 60px -20px rgba(10,20,60,0.18), 0 8px 24px -12px rgba(10,20,60,0.12)',
        'glass-dark': '0 1px 0 0 rgba(255,255,255,0.08) inset, 0 -1px 0 0 rgba(0,0,0,0.35) inset, 0 20px 60px -20px rgba(0,0,0,0.55), 0 8px 24px -12px rgba(0,0,0,0.35)',
        'pill': '0 6px 20px -8px rgba(10,20,60,0.35), 0 1px 0 rgba(255,255,255,0.6) inset',
        'float': '0 30px 80px -30px rgba(10,20,60,0.35)',
      },
      backdropBlur: {
        'ios': '28px',
        'ios-lg': '40px',
      },
      animation: {
        'sheet-in': 'sheetIn .42s cubic-bezier(.22,1,.36,1)',
        'fade-in':  'fadeIn .3s ease',
        'pop':      'pop .5s cubic-bezier(.22,1,.36,1)',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
      },
      keyframes: {
        sheetIn: {
          '0%':   { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        pop:    {
          '0%':   { transform: 'scale(.6)', opacity: 0 },
          '60%':  { transform: 'scale(1.08)', opacity: 1 },
          '100%': { transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: .7, transform: 'scale(1)' },
          '50%':     { opacity: 1,  transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}
