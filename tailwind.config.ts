import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import tailwindcssAnimate from "tailwindcss-animate";

const maxWidthVariants = {
  "message-xs": "400px",
  "message-xl": "980px",
  "phone-xl": "480px",
  "phone-lg": "360px",
  "phone-340": "340px",
  "phone-md": "300px",
  "phone-sm": "260px",
  "tablet-md": "650px",
  "tablet-sm": "565px",
  "tablet-lg": "865px",
  "tablet-xl": "1050px",
  "laptop-sm": "1280px",
} as const;

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern:
        /bg-(blue|green|purple|yellow|pink|indigo|red|teal|orange|emerald|cyan|rose)-100/,
    },
    {
      pattern:
        /text-(blue|green|purple|yellow|pink|indigo|red|teal|orange|emerald|cyan|rose)-800/,
    },
    {
      pattern:
        /bg-(blue|green|purple|yellow|pink|indigo|red|teal|orange|emerald|cyan|rose)-500\/15/,
      variants: ["dark"],
    },
    {
      pattern:
        /text-(blue|green|purple|yellow|pink|indigo|red|teal|orange|emerald|cyan|rose)-300/,
      variants: ["dark"],
    },
  ],
  theme: {
    extend: {
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": {
            opacity: "1",
          },
          "20%,50%": {
            opacity: "0",
          },
        },
        // Incoming-call ring: a square expands and fades outward from the
        // caller avatar. Square rather than round to match the avatar and the
        // rest of the surface.
        "call-ring": {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
        // Gentle breathing on the avatar and the accept button, so the dialog
        // reads as an active call rather than a still image.
        "call-pulse": {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
        },
        "call-dot": {
          "0%,80%,100%": { opacity: "0.25" },
          "40%": { opacity: "1" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "call-ring": "call-ring 1.8s cubic-bezier(0.2, 0.6, 0.35, 1) infinite",
        "call-pulse": "call-pulse 1.8s ease-in-out infinite",
        "call-dot": "call-dot 1.2s ease-in-out infinite",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    plugin(({ addVariant }) => {
      Object.entries(maxWidthVariants).forEach(([name, width]) => {
        addVariant(name, `@media (max-width: ${width})`);
      });
    }),
  ],
} satisfies Config;
