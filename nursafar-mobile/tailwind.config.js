/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#EBF4FF",
          100: "#C3DCF9",
          200: "#9BC5F3",
          300: "#72AEED",
          400: "#4A97E7",
          500: "#2B6CB0",
          600: "#235A96",
          700: "#1A477B",
          800: "#123561",
          900: "#0A2246",
        },
        gold: {
          400: "#D4AF37",
          500: "#C5A028",
        },
      },
    },
  },
  plugins: [],
};


