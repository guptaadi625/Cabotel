module.exports = {
  content: [
    './pages/**/*.{html,js,jsx}',
    './components/**/*.{html,js,jsx}',
    './styles/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        cabotel: {
          navy: '#03045e',
          blue: '#0077b6',
          teal: '#00b4d8',
          light: '#90e0ef',
          pale: '#caf0f8',
          orange: '#f77f00',
          amber: '#fcbf49',
          bg: '#f0f8ff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.08)',
        cardHover: '0 8px 30px rgba(0,0,0,0.14)',
      },
    },
  },
  plugins: [],
};
