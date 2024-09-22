import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkPrimary: "#111111",
        darkSecondary: "#222222",
        bluePrimary: '#2746e6',
        blueSecondary: '#1639e6'
      },
    },
  },
  plugins: [],
};
export default config;
