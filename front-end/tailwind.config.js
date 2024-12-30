import { readBuilderProgram } from "typescript";

/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#bcb8b1",
        primary: "#f4f3ee",
        secondary: "#e0afa0",
        text: "#463f3a",
        dark: "#8a817c",
      },
    },
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
    },
  },
  plugins: [],
};
