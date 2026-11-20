/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F4EEDF',
        parchment: '#E9DFC9',
        ink: '#1E1A16',
        oxblood: '#6B2A2A',
        olive: '#5C6245',
        brass: '#B38B4D',
        muted: 'rgba(30,26,22,0.62)',
        line: 'rgba(30,26,22,0.16)'
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
