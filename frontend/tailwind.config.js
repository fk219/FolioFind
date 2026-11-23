/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F1EEE6',
        parchment: '#E2DDCF',
        ink: '#17201B',
        oxblood: '#274C3D',
        olive: '#6C7357',
        brass: '#A77D42',
        muted: 'rgba(23,32,27,0.62)',
        line: 'rgba(23,32,27,0.17)'
      },
      fontFamily: {
        sans: ['Karla', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace']
      },
      maxWidth: {
        '8xl': '90rem'
      },
      boxShadow: {
        cover: '8px 14px 28px rgba(30, 26, 22, 0.18)',
        'cover-hover': '12px 22px 38px rgba(30, 26, 22, 0.24)'
      }
    }
  },
  plugins: []
};
