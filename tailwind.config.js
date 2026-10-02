/** @type {import('tailwindcss').Config} */

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const themed = (name) =>
  Object.fromEntries(
    shades.map((shade) => [shade, `rgb(var(--${name}-${shade}) / <alpha-value>)`])
  );

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        slate: themed('slate'),
        teal: themed('teal'),
        emerald: themed('emerald'),
        amber: themed('amber'),
        red: themed('red'),
      },
    },
  },
  plugins: [],
};
