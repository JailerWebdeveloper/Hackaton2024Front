/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    darkMode: false,
    extend: {
      colors: {
        "color-primary": "#39A900",
        "color-Secondary": "#007832",
        "color-Base": "#FFFFFF",
      },
    },
  },
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
  plugins: [require("daisyui")],
};
