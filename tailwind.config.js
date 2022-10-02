/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      tiny: "12px",
      base: "16px",
      sm: "18px",
      md: "24",
      lg: "36px",
      xl: "60px",
    },
    extend: {
      fontFamily: {
        inriaSans: ["Inria Sans", "sans-serif"],
      },
      colors: {
        "purple-link": "#5551FF", // light purple
        "midnight-black": "#282828", // midnight-black
        peachy: "#fabb92",
        yellowy: "#fcdd90",
      },
    },
  },
  plugins: [],
};
