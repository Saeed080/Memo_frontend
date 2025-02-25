/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary1: "#383838",
        orange: "#FF4500",
        textgrey: "#C9C9C9",
      },
    },
  },
  plugins: [],
};
