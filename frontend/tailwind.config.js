/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#252525',
        'surface-hover': '#2e2e2e',
        'surface-border': 'rgba(255, 255, 255, 0.06)',
        accent: '#ffffff',
        'accent-dim': '#f3f4f6',
        muted: '#6b7280',
        danger: '#f87171',
        // Brand green — used sparingly
        'accent-green': '#22c55e',
        'accent-green-dark': '#16a34a',
        // Neutral nav colors
        'nav-inactive': '#4b5563',
        'nav-active': '#ffffff',
      },
      fontFamily: {
        sans: ['"Neue Montreal"', 'sans-serif'],
        display: ['"Neue Montreal"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fab-menu-in': 'fabMenuIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fab-menu-out': 'fabMenuOut 0.15s ease-in forwards',
        'overlay-in': 'overlayIn 0.2s ease-out forwards',
        'overlay-out': 'overlayOut 0.15s ease-in forwards',
      },
      keyframes: {
        fabMenuIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fabMenuOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(8px)' },
        },
        overlayIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        overlayOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
