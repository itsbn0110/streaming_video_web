/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: true, // Vô hiệu hóa normalize mặc định của Tailwind
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
