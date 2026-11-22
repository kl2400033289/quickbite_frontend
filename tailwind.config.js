/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#FAF8F5',
          100: '#F5F0EA',
          200: '#EBE5DC',
          300: '#DDD5C7',
          400: '#C2B8A6',
          500: '#9E937F',
        },
        tangerine: {
          50: '#FFF5F0',
          100: '#FFE8DC',
          200: '#FFD1BB',
          300: '#FFAA85',
          400: '#FF7D49',
          500: '#FF5A1F', // Primary vibrant tangerine
          600: '#E5450C',
          700: '#BF3305',
          800: '#982907',
          900: '#7C240A',
        },
        charcoal: {
          700: '#343B43',
          800: '#22272E',
          850: '#1A1E24',
          900: '#14171B', // Primary deep charcoal
          950: '#0C0E11',
        },
        olive: {
          50: '#F4F6F3',
          100: '#E6EBE4',
          200: '#C7D4C3',
          500: '#5E745A',
          600: '#4A5B48', // Muted olive
          700: '#384637',
          800: '#2A3429',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 30px -10px rgba(20, 23, 27, 0.05), 0 2px 6px -1px rgba(20, 23, 27, 0.02)',
        'card-hover': '0 20px 40px -12px rgba(20, 23, 27, 0.12), 0 4px 12px -2px rgba(20, 23, 27, 0.04)',
        'glow-tangerine': '0 8px 30px rgba(255, 90, 31, 0.35)',
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      },
    },
  },
  plugins: [],
}
