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
          light: 'var(--color-primary-light)',
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: {
          light: 'var(--color-secondary-light)',
          DEFAULT: 'var(--color-secondary)',
          dark: 'var(--color-secondary-dark)',
        },
      },
      maxWidth: {
        custom: 'var(--max-width-custom)',
      },
    },
  },
  safelist: [
    { pattern: /grid-cols-\d/, variants: ['lg'] },
    { pattern: /col-span-\d/, variants: ['lg'] },
  ],
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

