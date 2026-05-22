import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        muted: "#64748b",
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          500: "#2563eb",
          600: "#2563eb", // Stripe Blue
          700: "#1d4ed8",
          900: "#1e3a8a"
        },
        success: {
          50: "#ecfdf5",
          500: "#10b981",
          600: "#059669"
        },
        coral: "#f43f5e",
        gold: "#eab308"
      },
      boxShadow: {
        soft: "0 8px 30px rgb(0 0 0 / 0.04)",
        premium: "0 20px 50px -12px rgb(0 0 0 / 0.08)",
        glow: "0 0 40px rgb(37 99 235 / 0.15)",
        "glow-green": "0 0 40px rgb(16 185 129 / 0.15)",
        "glow-red": "0 0 40px rgb(244 63 94 / 0.15)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.04)"
      },
      borderRadius: {
        "3xl": "24px"
      }
    }
  },
  plugins: []
};

export default config;
