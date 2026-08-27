import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#002610",
        "primary-container": "#053e1f",
        "surface-deep": "#043119",
        "on-primary": "#ffffff",
        "on-primary-container": "#75aa81",
        "primary-fixed": "#b8f0c3",
        "primary-fixed-dim": "#9cd3a8",
        "on-primary-fixed": "#00210d",
        "on-primary-fixed-variant": "#1c502f",
        "inverse-primary": "#9cd3a8",

        "secondary": "#755b00",
        "secondary-container": "#fdcc27",
        "secondary-fixed": "#ffe08e",
        "secondary-fixed-dim": "#f1c017",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#6f5700",
        "on-secondary-fixed": "#241a00",
        "on-secondary-fixed-variant": "#584400",

        "tertiary": "#3e0f19",
        "tertiary-container": "#59242d",
        "tertiary-fixed": "#ffd9dd",
        "tertiary-fixed-dim": "#ffb2bb",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#d48a93",
        "on-tertiary-fixed": "#380a14",
        "on-tertiary-fixed-variant": "#6e353e",

        "surface": "#f8f9fa",
        "surface-dim": "#d9dadb",
        "surface-bright": "#f8f9fa",
        "surface-variant": "#e1e3e4",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f4f5",
        "surface-container": "#edeeef",
        "surface-container-high": "#e7e8e9",
        "surface-container-highest": "#e1e3e4",

        "on-surface": "#191c1d",
        "on-surface-variant": "#414941",
        "inverse-surface": "#2e3132",
        "inverse-on-surface": "#f0f1f2",

        "outline": "#717971",
        "outline-variant": "#c0c9bf",
        "surface-tint": "#366945",

        "background": "#f8f9fa",
        "on-background": "#191c1d",

        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "sm": "0.25rem",
        "md": "0.75rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "2xl": "2rem",
        "full": "9999px",
      },
      spacing: {
        "margin-mobile": "16px",
        "container-max": "1640px",
        "margin-desktop": "32px",
        "gutter": "24px",
        "base": "8px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
      },
      boxShadow: {
        "ambient": "0 10px 30px rgba(0,0,0,0.06)",
        "ambient-hover": "0 20px 40px rgba(0,0,0,0.10)",
        "gold-glow": "0 8px 25px rgba(253,204,39,0.35)",
        "forest-glow": "0 12px 32px rgba(0,38,16,0.30)",
      },
    },
  },
  plugins: [],
};

export default config;
