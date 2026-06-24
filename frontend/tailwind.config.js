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
          50: "#faf6f0",
          100: "#efe0cb",
          200: "#d8bf98",
          300: "#b79362",
          400: "#8a6439",
          500: "#5f4329",
          600: "#49311f",
          700: "#342419",
          800: "#1f1712",
          900: "#14110e",
        },
        surface: {
          50: "#fffaf4",
          100: "#faf6f0",
          200: "#f3ebe0",
          300: "#e7d2b8",
        },
      },
      fontFamily: {
        vazirmatn: ["var(--font-vazirmatn)", "Tahoma", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "900" }],
        "display-md": ["2.75rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "900" }],
        "display-sm": ["2rem", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "900" }],
      },
      boxShadow: {
        glass: "0 14px 45px rgba(36, 26, 19, 0.08)",
        "glass-lg": "0 24px 70px rgba(36, 26, 19, 0.12)",
        card: "0 8px 24px rgba(36, 26, 19, 0.06)",
        "card-hover": "0 24px 56px rgba(36, 26, 19, 0.12)",
        gold: "0 16px 34px rgba(185, 130, 50, 0.26)",
        glow: "0 0 80px rgba(201, 151, 77, 0.18)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
