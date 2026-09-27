import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        base: "#15171A",
        surface: "#1D2023",
        surface2: "#24272B",
        border: "#2C3033",
        ink: "#ECEAE5",
        muted: "#9A9FA6",
        moss: {
          DEFAULT: "#4F6D5A",
          light: "#6D8C77",
          dark: "#37493E",
        },
        bronze: {
          DEFAULT: "#B08D57",
          light: "#C9AA7C",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
