/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        surface: {
          50:  '#fafafa',
          100: '#f4f4f5',
          800: '#18181b',
          850: '#131316',
          900: '#09090b',
          950: '#030303',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'neural-gradient': 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        'brand-gradient': 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #6d28d9 100%)',
        'glow-radial': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.3), transparent)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 20px rgba(124,58,237,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(124,58,237,0.7), 0 0 80px rgba(124,58,237,0.3)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        'brand': '0 4px 30px rgba(124,58,237,0.4)',
        'brand-lg': '0 8px 50px rgba(124,58,237,0.5)',
      },
    },
  },
  plugins: [],
}
