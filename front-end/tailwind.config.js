import { readBuilderProgram } from 'typescript';

/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#A69485',
        secondary: '#8C6249',
        text: '#0D0D0D',
        light: '#D9C6BA',
        dark: '#402319;'
      }
    },
  },
  plugins: [],
}