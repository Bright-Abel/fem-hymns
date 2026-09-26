/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          // Primary Logo Blue
          blue: {
            DEFAULT: '#005697',
            light: '#0A70BE',
            dark: '#003E6E',
            surface: '#EBF4FB', // light tint for soft badges/active states
          },
          // Accent Logo Red
          red: {
            DEFAULT: '#E31D2B',
            light: '#F04853',
            dark: '#B81420',
            surface: '#FDE8E9', // soft red tint
          },
          // App Dark Theme Surfaces (Deep tinted slate)
          dark: {
            bg: '#0B131F', // Main screen background
            card: '#132032', // Cards and inputs
            border: '#1D2F47', // Card borders & dividers
            surface: '#1A2B42', // Secondary container
          },
          // App Light Theme Surfaces
          light: {
            bg: '#F8FAFC',
            card: '#FFFFFF',
            border: '#E2E8F0',
            surface: '#F1F5F9',
          },
        },
      },
      fontFamily: {
        rubik: ['rubik-regular', 'sans-serif'],
        'rubik-bold': ['rubik-bold', 'sans-serif'],
        'rubik-extrabold': ['rubik-extrabold', 'sans-serif'],
        'rubik-medium': ['rubik-medium', 'sans-serif'],
        'rubik-semibold': ['rubik-semibold', 'sans-serif'],
        'rubik-light': ['rubik-light', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
