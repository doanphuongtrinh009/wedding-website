import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        "2xl": "1280px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        brand: {
          ivory: "hsl(var(--brand-ivory))",
          pearl: "hsl(var(--brand-pearl))",
          blush: "hsl(var(--brand-blush))",
          rose: "hsl(var(--brand-rose))",
          taupe: "hsl(var(--brand-taupe))",
          cocoa: "hsl(var(--brand-cocoa))",
          gold: "hsl(var(--brand-gold))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      spacing: {
        "space-2xs": "var(--space-2xs)",
        "space-xs": "var(--space-xs)",
        "space-sm": "var(--space-sm)",
        "space-md": "var(--space-md)",
        "space-lg": "var(--space-lg)",
        "space-xl": "var(--space-xl)",
        "space-2xl": "var(--space-2xl)",
        "space-3xl": "var(--space-3xl)"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"]
      },
      fontSize: {
        overline: [
          "0.7rem",
          { letterSpacing: "0.2em", lineHeight: "1.45", fontWeight: "600" }
        ],
        body: ["1rem", { lineHeight: "1.78" }],
        display: [
          "clamp(2.55rem, 5vw, 4.9rem)",
          { lineHeight: "1.01", letterSpacing: "-0.034em" }
        ]
      },
      boxShadow: {
        luxury: "0 40px 100px -30px rgba(89, 54, 44, 0.25)",
        soft: "0 20px 50px -20px rgba(89, 54, 44, 0.15)",
        editorial: "0 16px 44px -28px rgba(89, 54, 44, 0.12)"
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.75s cubic-bezier(0.2, 0.7, 0.2, 1) both",
        float: "float 8s ease-in-out infinite"
      }
    }
  },
  plugins: [tailwindAnimate]
};

export default config;
