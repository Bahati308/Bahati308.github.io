/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        night: {
          900: '#050617',
          800: '#0b1028',
        },
      }
    },
  },
  plugins: [],
}

