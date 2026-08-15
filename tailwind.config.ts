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
  // No safelist. It previously force-generated a 48-class matrix of raw palette
  // shades for the tag chips; those chips now use categorical tokens that
  // appear as literal strings in utils/constants/ui.constant.ts, which the
  // content globs above already scan.
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
        // Status families. Each mirrors the five roles declared in
        // globals.css and resolves per theme on its own, so `bg-success-subtle`
        // is correct in both modes with no `dark:` variant alongside it.
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          accent: "hsl(var(--success-accent))",
          subtle: "hsl(var(--success-subtle))",
          border: "hsl(var(--success-border))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          accent: "hsl(var(--warning-accent))",
          subtle: "hsl(var(--warning-subtle))",
          border: "hsl(var(--warning-border))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
          accent: "hsl(var(--info-accent))",
          subtle: "hsl(var(--info-subtle))",
          border: "hsl(var(--info-border))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          accent: "hsl(var(--destructive-accent))",
          subtle: "hsl(var(--destructive-subtle))",
          border: "hsl(var(--destructive-border))",
        },
        // Categorical — for labels that differ in kind, not severity.
        // Never borrow a status token for these; see globals.css.
        category: {
          violet: {
            DEFAULT: "hsl(var(--category-violet))",
            accent: "hsl(var(--category-violet-accent))",
            subtle: "hsl(var(--category-violet-subtle))",
          },
          magenta: {
            DEFAULT: "hsl(var(--category-magenta))",
            accent: "hsl(var(--category-magenta-accent))",
            subtle: "hsl(var(--category-magenta-subtle))",
          },
          teal: {
            DEFAULT: "hsl(var(--category-teal))",
            accent: "hsl(var(--category-teal-accent))",
            subtle: "hsl(var(--category-teal-subtle))",
          },
          orange: {
            DEFAULT: "hsl(var(--category-orange))",
            accent: "hsl(var(--category-orange-accent))",
            subtle: "hsl(var(--category-orange-subtle))",
          },
          indigo: {
            DEFAULT: "hsl(var(--category-indigo))",
            accent: "hsl(var(--category-indigo-accent))",
            subtle: "hsl(var(--category-indigo-subtle))",
          },
          lime: {
            DEFAULT: "hsl(var(--category-lime))",
            accent: "hsl(var(--category-lime-accent))",
            subtle: "hsl(var(--category-lime-subtle))",
          },
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
      // --radius is 0 (the UI is square), so the shadcn ladder would otherwise
      // compute negative values. max() floors them instead of leaning on
      // browsers to clamp. The only consumer left is the Avatar `rounded`
      // prop; everything else is rounded-none or rounded-full outright.
      borderRadius: {
        lg: "var(--radius)",
        md: "max(0px, calc(var(--radius) - 2px))",
        sm: "max(0px, calc(var(--radius) - 4px))",
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
