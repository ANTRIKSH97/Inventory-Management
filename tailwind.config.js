/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // apne project ke paths
  ],
  theme: {
    extend: {
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0px rgba(34,197,94,0.5)' },
          '50%': { boxShadow: '0 0 8px rgba(34,197,94,0.7)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
      },
    },
  },
  plugins: [],
}
