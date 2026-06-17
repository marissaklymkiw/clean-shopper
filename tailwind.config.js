/**
 * Clean Shopper — Tailwind theme
 *
 * Generated from docs/design.md (the design-system source of truth).
 * Values are taken EXACTLY from the spec — no rounding, no substitutions.
 * Token names match docs/design.md verbatim.
 *
 * All tokens live under `theme.extend`, so they ADD to Tailwind's defaults
 * instead of replacing them: the default color palette, the numeric spacing
 * scale, `white`/`black`/`transparent`/`current`, the default radii/shadows,
 * etc. all stay intact, and our named brand tokens (accent, bg, xs–2xl,
 * sm/md/lg, …) are layered on top. No hand-added keepers are needed.
 */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FAF7F1",
        surface: "#FFFFFF",
        text: { DEFAULT: "#23291F", muted: "#5E6356" },
        accent: { DEFAULT: "#237055", hover: "#1C5944" },
        border: "#E7E2D8",
        success: "#2F7D4F",
        warning: "#7A5C00",
        error: "#B23B33",
        info: "#3A6E8F",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
      fontSize: {
        display: ["3.052rem", { lineHeight: "1.1", fontWeight: "600" }],
        h1: ["2.441rem", { lineHeight: "1.15", fontWeight: "600" }],
        h2: ["1.953rem", { lineHeight: "1.2", fontWeight: "600" }],
        h3: ["1.563rem", { lineHeight: "1.3", fontWeight: "500" }],
        body: ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["0.8rem", { lineHeight: "1.5", fontWeight: "400" }],
      },
      lineHeight: {
        tight: "1.15",
        normal: "1.6",
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2.5rem",
        "2xl": "4rem",
        "3xl": "6rem",
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.625rem",
        lg: "1rem",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(35,41,31,0.05)",
        md: "0 6px 18px rgba(35,41,31,0.07)",
        lg: "0 16px 40px rgba(35,41,31,0.10)",
      },
    },
  },
  plugins: [],
};
