<<<<<<< HEAD
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Green Eco Theme
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e", // Main vibrant green accent
          600: "#16a34a", // Primary action color
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#0f5132", // Darkest green
        },
        // Accent greens for variety
        accent: {
          light: "#a7f3d0",
          medium: "#34d399",
          dark: "#059669",
        },
        // Earth tones
        earth: {
          50: "#faf7f2",
          100: "#f5ede0",
          200: "#e8d4b8",
          300: "#d9b88a",
          400: "#c99d5f",
          500: "#b8823a",
          600: "#9a6a2f",
          700: "#7a5326",
          800: "#5c3f1d",
          900: "#3e2a14",
        },
        // Sky/nature blues
        sky: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
      },
    },
  },
  plugins: [],
};
export default config;

=======
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
      },
    },
  },
  plugins: [],
};
export default config;

>>>>>>> ecfd585949ee2b6ad491da616ffcfe0ecb9ac62f
