/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
        accent: "#f59e42",
        // Alias for Kavia branding
        "kavia-orange": "#f59e42",
        "kavia-blue": "#3b82f6",
        "kavia-slate": "#64748b"
      }
    },
  },
  plugins: [],
};
