/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#161613',
        paper: '#FBFAF7',
        cream: '#F4F2EC',
        line: '#E8E6DD',
        mute: '#74736B',
        leaf: '#177245',
        lime: '#D9F99D',
        mint: '#DFF2E4',
        peach: '#FFE7CC',
        brand: {
          50: '#f0f9fa',
          100: '#d7f0f3',
          200: '#b2e2e8',
          300: '#7ecec8',
          400: '#3eb2ba',
          500: '#087E8B', // primary teal from blueprint
          600: '#066772',
          700: '#08535c',
          800: '#0d434a',
          900: '#123B4A', // dark / headings from blueprint
          950: '#071f28',
        },
        accent: {
          50: '#f2fbf7',
          100: '#e1f6ed',
          500: '#55A88F', // soft green from blueprint
          600: '#3e8f77',
        },
        surface: {
          50: '#F8FAFB',
          100: '#F4F8F9', // blueprint page background
          200: '#E9EFF1',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(18, 59, 74, 0.05)',
        'elevated': '0 10px 25px -3px rgba(18, 59, 74, 0.08), 0 4px 6px -4px rgba(18, 59, 74, 0.04)',
        'soft': '0 1px 2px rgba(22,22,19,.04), 0 12px 32px -16px rgba(22,22,19,.12)',
        'lift': '0 2px 4px rgba(22,22,19,.05), 0 24px 48px -20px rgba(22,22,19,.18)',
      }
    },
  },
  plugins: [],
}
