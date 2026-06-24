/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff8ec",
          100: "#f9ead0",
          200: "#f4d8a7",
          300: "#eabe75",
          400: "#dfa650",
          500: "#c9974d",
          600: "#a87731",
          700: "#845924",
          800: "#61411d",
          900: "#3f2c18",
        },
        espresso: {
          50: "#fbf6ee",
          100: "#efe0cb",
          200: "#d8bf98",
          300: "#b79362",
          400: "#8a6439",
          500: "#5f4329",
          600: "#49311f",
          700: "#342419",
          800: "#241a13",
          900: "#17130f",
        },
        surface: {
          50: "#fffaf2",
          100: "#fbf6ee",
          200: "#f2e7d7",
          300: "#e7d2b8",
        },
      },
      fontFamily: {
        vazirmatn: ["Vazirmatn", "sans-serif"],
      },
      boxShadow: {
        glass: "0 14px 45px rgba(36, 26, 19, 0.10)",
        "glass-lg": "0 24px 70px rgba(36, 26, 19, 0.14)",
        card: "0 10px 28px rgba(36, 26, 19, 0.07)",
        "card-hover": "0 20px 48px rgba(36, 26, 19, 0.13)",
        gold: "0 16px 34px rgba(185, 130, 50, 0.28)",
      },
    },
  },
  plugins: [],
};
