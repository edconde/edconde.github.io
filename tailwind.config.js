module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4f46e5',
          dark: '#6366f1',
        },
        secondary: {
          light: '#7c3aed',
          dark: '#8b5cf6',
        },
        background: {
          light: '#ffffff',
          dark: '#111827',
        }
      },
      backgroundColor: {
        'card-light': 'rgba(255, 255, 255, 0.98)',
        'card-dark': 'rgba(31, 41, 55, 0.98)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}