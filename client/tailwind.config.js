/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        primary : "#00acff",
        secondary : "#0690d4",
        tertiary : "#63c6f7"
      }
    },
  },
  plugins: [],
}

