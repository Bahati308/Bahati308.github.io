/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'sky-blue': '#87CEEB',
        'gold': '#FFD700',
        skyblue: '#87CEEB', // Alternative without hyphen
        sky: {
          blue: '#87CEEB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.02em',
        normal: '-0.01em',
      },
      lineHeight: {
        tighter: 1.1,
        tight: 1.2,
        relaxed: 1.7,
      },
    },
  },
  plugins: [],
}
