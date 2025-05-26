/ @type {import('tailwindcss').Config} */;
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        water: '#007dab',
        ghost: '#f1f1f1', 
      },
    },
  },
  plugins: [],
};
