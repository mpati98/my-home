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
        // Workspace dark theme
        bg:       "#111214",
        surface:  "#16181d",
        border:   "#1e2128",
        muted:    "#2a2d35",
        dim:      "#374151",
        subtle:   "#4b5563",
        text:     "#9ca3af",
        bright:   "#e8e3d5",
        // Accents
        sage:     "#a3c47a",
        gold:     "#c9a96e",
        sky:      "#7dd3fc",
        // Library
        cream:    "#f5f0e8",
        ink:      "#1a1612",
        sepia:    "#7a6a56",
        parchment:"#ede8df",
      },
      fontFamily: {
        mono:     ["IBM Plex Mono", "monospace"],
        sans:     ["IBM Plex Sans", "sans-serif"],
        serif:    ["Cormorant Garant", "Playfair Display", "serif"],
        courier:  ["Courier Prime", "monospace"],
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        loaderIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        spinRing: {
          to: { transform: "rotate(360deg)" },
        },
        glowPulse: {
          "0%,100%": { opacity: "0.4", transform: "translate(-50%,-50%) scale(0.8)" },
          "50%":     { opacity: "1",   transform: "translate(-50%,-50%) scale(1.2)" },
        },
        navPulse: {
          "0%":   { opacity: "0.3", transform: "scale(0.8)" },
          "100%": { opacity: "1",   transform: "scale(1.2)" },
        },
        dropIn: {
          "0%":   { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up":    "fadeUp 0.4s ease both",
        "slide-up":   "slideUp 0.3s 0.08s ease both",
        "loader-in":  "loaderIn 0.15s ease forwards",
        "spin-ring":  "spinRing 0.85s linear infinite",
        "glow-pulse": "glowPulse 1.2s ease-in-out infinite",
        "nav-pulse":  "navPulse 0.8s ease-in-out infinite alternate",
        "drop-in":    "dropIn 0.18s ease",
      },
    },
  },
  plugins: [],
};
export default config;
