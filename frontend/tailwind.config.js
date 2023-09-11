module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], // Add this line
      },
      colors: {
        "yale-blue": "#1B4079",
        "air-force-blue": "#4D7C8A",
        "dodger-blue": "#3590F3",
        "azure-blue": "#508bc3",
        "baby-powder": "#fffffc",
        "bkg-primary": "hsl(var(--color-primary-100) / <alpha-value>)",
        "bkg-primary-hover": "hsl(var(--color-primary-400) / <alpha-value>)",
        "bkg-body": "hsl(var(--color-surface-mixed-100) / <alpha-value>)",
        "bkg-card": "hsl(var(--color-surface-mixed-200) / <alpha-value>)",
        "bkg-button": "hsl(var(--color-surface-mixed-300) / <alpha-value>)",
        "bkg-nav": "hsl(var(--color-surface-mixed-400) / <alpha-value>)",
        "bkg-modal": "hsl(var(--color-surface-mixed-500) / <alpha-value>)",
        "bkg-text": "hsl(var(--color-surface-mixed-600) / <alpha-value>)",
        "txt-1": "hsl(var(--color-text-1) / <alpha-value>)",
        "txt-2": "hsl(var(--color-text-2) / <alpha-value>)",
        "txt-hover": "hsl(var(--color-hover) / <alpha-value>)",
        "bkg-comp1": "hsl(var(--color-comp-1) / <alpha-value>)",
        "bkg-comp2": "hsl(var(--color-comp-2) / <alpha-value>)",
        "bkg-comp3": "hsl(var(--color-comp-3) / <alpha-value>)",
        "bkg-comp-button1": "hsl(var(--color-comp-button-1) / <alpha-value>)",
      },
      boxShadow: {
        nav: "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
      },
      backgroundImage: {
        login: "url('./images/heartbeat-login-bg-no-g.png')",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
