import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff', 100: '#d9eaff', 200: '#bcdaff', 300: '#8ec1ff',
          400: '#599fff', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a',
        },
        mint: {
          50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
          400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
        },
        coral: {
          50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af',
          400: '#fb7185', 500: '#f43f5e', 600: '#e11d48',
        },
        sunny: {
          50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
          400: '#fbbf24', 500: '#f59e0b',
        },
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(59, 130, 246, 0.10), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -4px rgba(59, 130, 246, 0.14), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'soft-coral': '0 8px 30px -4px rgba(244, 63, 94, 0.20)',
        'soft-mint': '0 8px 30px -4px rgba(16, 185, 129, 0.20)',
        pop: '0 6px 0 0 rgba(37, 99, 235, 0.25)',
      },
      backgroundImage: {
        'gradient-pop': 'linear-gradient(135deg, #eef6ff 0%, #ecfdf5 50%, #fff1f2 100%)',
        'gradient-hero': 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
        'gradient-coral': 'linear-gradient(135deg, #fb7185 0%, #f59e0b 100%)',
        'gradient-mint': 'linear-gradient(135deg, #34d399 0%, #3b82f6 100%)',
        'gradient-soft': 'linear-gradient(180deg, #ffffff 0%, #eef6ff 100%)',
        'dots': 'radial-gradient(circle, rgba(59, 130, 246, 0.10) 1px, transparent 1px)',
      },
      backgroundSize: { 'dots': '20px 20px', 'dots-sm': '14px 14px' },
      borderRadius: { '4xl': '2rem' },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pop-in': 'pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        wiggle: { '0%, 100%': { transform: 'rotate(-3deg)' }, '50%': { transform: 'rotate(3deg)' } },
        'pop-in': { '0%': { transform: 'scale(0.8)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-up': { '0%': { transform: 'translateY(16px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
      fontFamily: {
        sans: ['"Hiragino Sans"', '"Hiragino Kaku Gothic ProN"', '"Noto Sans JP"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
