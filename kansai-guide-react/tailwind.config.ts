import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg:   "#0C0D16",
        bg1:  "#12141F",
        card: "#1C1F30",
        red:  "#E53030",
        ora:  "#FF6B35",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans:  ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        grad: "linear-gradient(135deg, #E53030, #FF6B35)",
      },
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "shimmer-spin": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "wa-ring": {
          "0%,100%": { transform: "scale(1)", opacity: "0.8" },
          "60%":     { transform: "scale(1.3)", opacity: "0" },
        },
        "pulse-glow": {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(229,48,48,0)" },
          "50%":     { boxShadow: "0 0 24px 4px rgba(229,48,48,0.22)" },
        },
      },
      animation: {
        marquee:       "marquee 42s linear infinite",
        "shimmer-spin":"shimmer-spin 3.5s linear infinite",
        "wa-ring":     "wa-ring 2.2s ease-in-out infinite",
        "pulse-glow":  "pulse-glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
