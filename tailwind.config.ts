import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        filmDark: "#1C1815",
        filmDarkEdge: "#12100D",
        filmPaper: "#EDE6D6",
        filmInk: "#14110E",
        filmAmber: "#E8A33D",
        filmAmberDim: "#8C6423",
        filmSafety: "#C4432E",
        filmPaperDim: "#B7AE9A",
        filmTeal: "#4A6B5A",
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        mono: ['"Courier New"', "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
