import type { Config } from "tailwindcss";

// Светлая бумага, почти чёрный текст и один неоново-салатовый акцент.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F5F1", // фон
        ink: "#232321", // основной текст и тёмные блоки
        muted: "#5A5A55", // вторичный текст
        line: "#D6D6CE", // линии
        lime: "#BBFF00", // единственный акцент
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
