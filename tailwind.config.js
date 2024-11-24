/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Poppins Medium'],
        secondary: ['Inter'],
      },
      colors: {
        primary: '#29c8f0',
        secondary: '#023e8a',
        tertiary: '#9ce0ff',
        fourth: '#d8f8ff',
        primary_trans: 'rgba(41, 200, 240, 0.25)',
        secondary_trans: 'rgba(2, 62, 138, 0.2)',
        font: '#09314a',
        gray_1: '#3b444a',
        gray_2: 'rgba(59, 68, 74, 0.7)',
        gray_3: '#79a2a4',
        gray_4: 'rgba(59, 68, 74, 0.15)',
        background: '#f2fdff',
        danger: '#ff3b30',
        warning: '#ffcc00',
        success: '#34c759',
        danger_dark: '#ca1c13',
        warning_dark: '#c39d04',
        success_dark: '#16a139',
        danger_trans: 'rgba(255, 59, 48, 0.25)',
        warning_trans: 'rgba(255, 204, 0, 0.25)',
        success_trans: 'rgba(52, 199, 89, 0.25)',
      },
      gridTemplateColumns: {
        '70/30': '70% 28%',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
