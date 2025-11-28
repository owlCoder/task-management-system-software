module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: "#1726B8",
        accent: "#2F77FF",
        "muted-accent": "#8BE9FF",
        "soft-bg": "#EAF6FF",
        muted: "#6b6b6b"
      },
      fontFamily: {
        primary: ["Questrial", "system-ui", "sans-serif"],
        secondary: ['"Roboto Serif"', "serif"],
      },
    }
  },
  plugins: [],
};