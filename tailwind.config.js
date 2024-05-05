/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
    colors: {
      'color1': "#0D0D0D",
      'color2': "#131313",
      'color3': "#1A1A1A",
      'color4': "#262626",
      'color5': "#808080",
      'color6': "#1C1C1C",
      'color7': "#C0C0C0"
    },
   }
  },
  plugins: [],
}

