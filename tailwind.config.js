/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#003C71',
        secondary: '#607D8B',
        background: '#F8FAFC',
      },
    },
  },
  plugins: [],
};
