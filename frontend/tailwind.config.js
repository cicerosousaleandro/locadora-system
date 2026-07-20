/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9', // Azul principal
          600: '#0284c7', // Azul hover (mais escuro)
          700: '#0369a1',
          900: '#0c4a6e', // Azul escuro para títulos
        },
        slate: {
          850: '#1e293b', // Fundo escuro elegante
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}