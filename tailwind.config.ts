const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        awaaz: {
          cream: '#f9f6ee',
          teal: '#3a7d7a',
          orange: '#e67e22',
          yellow: '#f1c40f',
          surface: '#ffffff',
          line: '#e5e7eb',
          muted: '#9ca3af'
        }
      },
    },
  },
  plugins: [],
};
export default config;