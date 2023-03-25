const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      primary: { ...colors.teal, DEFAULT: colors.teal[500] },
      gray: { ...colors.stone, DEFAULT: colors.stone[500] },
      yellow: { ...colors.amber, DEFAULT: colors.amber[500] },
      red: { ...colors.red, DEFAULT: colors.red[500] },
      green: { ...colors.green, DEFAULT: colors.green[500] },
      black: colors.black,
      white: colors.white,
      mauve: { DEFAULT: 'hsl(30, 30%, 99%)', dark: 'hsl(30, 30%, 20%)' },
      transparent: colors.transparent,
    },

    fontFamily: {
      sans: ['InterVariable', ...defaultTheme.fontFamily.sans],
      mono: ['JetBrains MonoVariable', ...defaultTheme.fontFamily.mono],
    },

    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
