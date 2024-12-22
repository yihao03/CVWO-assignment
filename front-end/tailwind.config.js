import { readBuilderProgram } from "typescript";

/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#BFBFBF",
        secondary: "#8C8C8C",
        text: "#0D0D0D",
        light: "#F2F2F2",
        dark: "#404040",
      },
    },
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
    },
  },
  plugins: [],
};
