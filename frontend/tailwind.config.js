module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "yale-blue": "#1B4079",
        "air-force-blue": "#4D7C8A",
        "dodger-blue": "#3590F3",
        "azure-blue": "#508bc3",
        "baby-powder": "#fffffc",
        "bkg-primary": "hsl(var(--color-primary-100) / <alpha-value>)",
        "bkg-body": "hsl(var(--color-surface-mixed-100) / <alpha-value>)",
        "bkg-card": "hsl(var(--color-surface-mixed-200) / <alpha-value>)",
        "bkg-button": "hsl(var(--color-surface-mixed-300) / <alpha-value>)",
        "bkg-nav": "hsl(var(--color-surface-mixed-400) / <alpha-value>)",
        "bkg-modal": "hsl(var(--color-surface-mixed-500) / <alpha-value>)",
        "bkg-text": "hsl(var(--color-surface-mixed-600) / <alpha-value>)",
      },
      backgroundImage: {
        login: "url('./images/login-background4.png')",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
