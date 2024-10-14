import { transform } from 'typescript';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
          'moderustic': ['Moderustic', 'sans-serif'],
          'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'pinata-anim': 'pinata 2.4s ease-in-out infinite alternate',
        '_pinata-anim': '_pinata 2s ease-in-out infinite alternate',
      },
      keyframes: {
        pinata: {
          '0%': {
            transform: 'translateY(7px) scaleX(-1) rotate(45deg)'
          },
          '100%': {
            transform: 'translateY(-6px) scaleX(-1) rotate(41deg)'
          }
        },
        _pinata: {
          '0%': {
            transform: 'translateY(9px) rotate(45deg)'
          },
          '100%': {
            transform: 'translateY(-8px) rotate(41deg)'
          }
        },
      }
    },
  },
  plugins: [],
}