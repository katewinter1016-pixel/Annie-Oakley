import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#D4A017',
          light: '#F0BE3C',
          dark: '#A67C00',
        },
        warm: {
          dark: '#2D1606',
          brown: '#5C3A1E',
        },
      },
    },
  },
  plugins: [],
};
export default config;
