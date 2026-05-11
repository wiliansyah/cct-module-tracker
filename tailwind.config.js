/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Baris ini wajib agar Tailwind membaca file App.tsx Anda
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
