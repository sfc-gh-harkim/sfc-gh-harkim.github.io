import { tokens } from './src/app/styles/tokens';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: tokens.colors.background,
        text: tokens.colors.text,
        border: tokens.colors.border,
        brand: tokens.colors.brand,
      },
      fontFamily: {
        'inter': ['var(--font-inter)'],
        'plus-jakarta-sans': ['var(--font-plus-jakarta-sans)'],
      },
      spacing: tokens.spacing,
      fontSize: tokens.typography.fontSize,
      lineHeight: tokens.typography.lineHeight,
      transitionDuration: {
        fast: tokens.animation.transition.fast.split(' ')[0],
        base: tokens.animation.transition.base.split(' ')[0],
        slow: tokens.animation.transition.slow.split(' ')[0],
      },
      boxShadow: {
        modal: tokens.shadows.modal,
        input: tokens.shadows.input,
      },
      borderRadius: tokens.radius,
    },
  },
  plugins: [],
} 