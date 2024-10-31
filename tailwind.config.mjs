/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  safelist: ["flex", "hidden", "justify-center", "w-full", "my-20"],
  plugins: [],
};
