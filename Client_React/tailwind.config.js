/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      main: ["Poppins", " sans-serif;"],
    },
    listStyleType: {
      decimal: "decimal",
      square: "square",
      roman: "upper-roman",
    },
    extend: {
      animation: {
        "slide-top":
          "slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
        "slide-top-input": "slide-top-input 0.2s linear both",
        "slide-right":
          "slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
        "slide-left":
          "slide-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
      },
      flex: {
        1: "1 1 0%",
        2: "2 2 0%",
        3: "3 3 0%",
        4: "4 4 0%",
        5: "5 5 0%",
        6: "6 6 0%",
        7: "7 7 0%",
        8: "8 8 0%",
      },
      gridTemplateRows: {
        // Simple 10 row grid
        10: "repeat(10, minmax(0, 1fr))",
      },
      gridRow: {
        "span-7": "span 7 / span 7",
      },
      width: {
        main: "1220px",
      },
      backgroundColor: {
        main: "#ee3131",
        overlay: "rgba(0,0,0,0.3)",
      },
      colors: {
        main: "#ee3131",
        text: "#505050",
      },
      keyframes: {
        "slide-top": {
          "0%": {
            " -webkit-transform": "translateY(0);",
            transform: "translateY(0);",
          },
          " 100%": {
            "-webkit-transform": " translateY(-100px);",
            transform: "translateY(-30px);",
          },
        },
        "slide-top-input": {
          "0%": {
            " -webkit-transform": "translateY(10px);",
            transform: "translateY(10px);",
          },
          " 100%": {
            "-webkit-transform": " translateY(0px);",
            transform: "translateY(0px);",
          },
        },
        "slide-right": {
          "0%": {
            " -webkit-transform": "translateX(-100%);",
            transform: "translateX(-100%);",
          },
          "100%": {
            "-webkit-transform": " translateX(0px);",
            transform: "translateX(0px);",
          },
        },
        "slide-left": {
          "0%": {
            " -webkit-transform": "translateX(0px);",
            transform: "translateX(0px);",
          },
          "100%": {
            "-webkit-transform": "translateX(-100%);",
            transform: "translateX(-100%);",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp"), require("@tailwindcss/forms")],
  // plugins: [require("@tailwindcss/")],
};