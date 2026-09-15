import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        background: {
          50: 'oklch(var(--background-50) / <alpha-value>)',
          100: 'oklch(var(--background-100) / <alpha-value>)',
          200: 'oklch(var(--background-200) / <alpha-value>)',
          300: 'oklch(var(--background-300) / <alpha-value>)',
          400: 'oklch(var(--background-400) / <alpha-value>)',
          500: 'oklch(var(--background-500) / <alpha-value>)',
          600: 'oklch(var(--background-600) / <alpha-value>)',
          700: 'oklch(var(--background-700) / <alpha-value>)',
          800: 'oklch(var(--background-800) / <alpha-value>)',
          900: 'oklch(var(--background-900) / <alpha-value>)',
          950: 'oklch(var(--background-950) / <alpha-value>)',
        },
        foreground: {
          50: 'oklch(var(--foreground-50) / <alpha-value>)',
          100: 'oklch(var(--foreground-100) / <alpha-value>)',
          200: 'oklch(var(--foreground-200) / <alpha-value>)',
          300: 'oklch(var(--foreground-300) / <alpha-value>)',
          400: 'oklch(var(--foreground-400) / <alpha-value>)',
          500: 'oklch(var(--foreground-500) / <alpha-value>)',
          600: 'oklch(var(--foreground-600) / <alpha-value>)',
          700: 'oklch(var(--foreground-700) / <alpha-value>)',
          800: 'oklch(var(--foreground-800) / <alpha-value>)',
          900: 'oklch(var(--foreground-900) / <alpha-value>)',
          950: 'oklch(var(--foreground-950) / <alpha-value>)',
        },
        primary: {
          50: 'oklch(var(--primary-50) / <alpha-value>)',
          100: 'oklch(var(--primary-100) / <alpha-value>)',
          200: 'oklch(var(--primary-200) / <alpha-value>)',
          300: 'oklch(var(--primary-300) / <alpha-value>)',
          400: 'oklch(var(--primary-400) / <alpha-value>)',
          500: 'oklch(var(--primary-500) / <alpha-value>)',
          600: 'oklch(var(--primary-600) / <alpha-value>)',
          700: 'oklch(var(--primary-700) / <alpha-value>)',
          800: 'oklch(var(--primary-800) / <alpha-value>)',
          900: 'oklch(var(--primary-900) / <alpha-value>)',
          950: 'oklch(var(--primary-950) / <alpha-value>)',
        },
        accent: {
          50: 'oklch(var(--accent-50) / <alpha-value>)',
          100: 'oklch(var(--accent-100) / <alpha-value>)',
          200: 'oklch(var(--accent-200) / <alpha-value>)',
          300: 'oklch(var(--accent-300) / <alpha-value>)',
          400: 'oklch(var(--accent-400) / <alpha-value>)',
          500: 'oklch(var(--accent-500) / <alpha-value>)',
          600: 'oklch(var(--accent-600) / <alpha-value>)',
          700: 'oklch(var(--accent-700) / <alpha-value>)',
          800: 'oklch(var(--accent-800) / <alpha-value>)',
          900: 'oklch(var(--accent-900) / <alpha-value>)',
          950: 'oklch(var(--accent-950) / <alpha-value>)',
        },
        success: {
          500: 'oklch(0.62 0.14 155)',
          600: 'oklch(0.52 0.12 155)',
        },
        warning: {
          500: 'oklch(0.72 0.14 75)',
          600: 'oklch(0.62 0.12 75)',
        },
        danger: {
          500: 'oklch(0.58 0.18 25)',
          600: 'oklch(0.50 0.16 25)',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.35s ease-out forwards',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-in-right': 'slideInRight 0.28s ease-out forwards',
        'slide-up': 'slideUp 0.28s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        product: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
