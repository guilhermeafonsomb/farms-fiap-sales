/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#EBF2E8",
          400: "#4DDE21",
          500: "#61944F",
        },
        black: "#121C0D",
        white: "#FAFAF7",
      },
    },
  },

  plugins: [],
};
