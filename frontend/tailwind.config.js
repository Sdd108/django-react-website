/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Ensure Tailwind doesn't conflict with antd
  corePlugins: {
    preflight: false,
  },
} 