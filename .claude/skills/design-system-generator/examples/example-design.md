# Design System: Maker's Field (example output)

> This is a sample of what the skill produces. It was generated for a fictional small-batch ceramics studio site, from the direction "natural and warm" with the feeling "calm, handmade, trustworthy." Use it to see the level of detail and structure to expect.

**Direction:** Natural and warm, with a single earthen accent
**Feeling:** Calm, handmade, trustworthy
**Generated for:** A small ceramics studio selling directly to customers

---

## 1. Color

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#faf9f6` | Page background, primary surface |
| Surface | `#ffffff` | Cards, raised panels |
| Text primary | `#1c1b18` | Headings and body text |
| Text muted | `#6b6862` | Secondary text, captions |
| Accent | `#b5532a` | Primary actions, links, emphasis |
| Accent hover | `#963f1c` | Hover/active state of accent |
| Border | `#e6e3dc` | Dividers, input borders |
| Success | `#3f7d4f` | Positive states |
| Warning | `#b8860b` | Caution states |
| Error | `#b23b3b` | Errors, destructive actions |
| Info | `#3a6ea5` | Informational states |

**Contrast check (WCAG AA):**
- Text primary on Background: 16.4:1 (pass, exceeds AAA)
- Text muted on Background: 5.3:1 (pass for body)
- White text on Accent background: 5.0:1 (pass for body)

The palette is warm and low-glare. The background is a soft off-white rather than pure white, which suits the handmade feeling. One terracotta accent carries all the emphasis so the interface stays quiet.

---

## 2. Typography

**Display / headings:** Fraunces (Google Fonts). A soft serif with character that reads as crafted rather than corporate.
**Body:** Inter (Google Fonts). A clean, highly legible sans that keeps long copy comfortable.

Type scale (base 16px, ratio 1.25):

| Token | Size | Line height | Weight | Usage |
|-------|------|-------------|--------|-------|
| Display | 48.8px | 1.15 | 600 | Hero, page title |
| H1 | 39.1px | 1.15 | 600 | Section title |
| H2 | 31.3px | 1.2 | 600 | Subsection |
| H3 | 25px | 1.3 | 600 | Card title |
| Body | 16px | 1.6 | 400 | Paragraphs |
| Small | 12.8px | 1.5 | 400 | Captions, labels |

---

## 3. Spacing, radius, elevation

**Spacing scale** (base 4px): `xs 4px · sm 8px · md 16px · lg 24px · xl 40px · 2xl 64px`
**Radius:** `sm 4px · md 8px · lg 16px · full 9999px`
**Shadow:**
- `sm`: `0 1px 2px rgba(28,27,24,0.06)`
- `md`: `0 4px 12px rgba(28,27,24,0.08)`
- `lg`: `0 12px 32px rgba(28,27,24,0.12)`

Soft, generous spacing and gently rounded corners support the warm direction. Shadows are subtle and low-contrast so nothing feels harsh.

---

## 4. Components

**Button — primary:** background Accent, white text, radius md, padding sm/lg, hover swaps to Accent hover.
**Button — secondary:** transparent background, Accent text, 1px Accent border, radius md.
**Button — disabled:** Border background, Text muted, no pointer.
**Card:** Surface background, 1px Border, radius lg, shadow md, padding lg.
**Input:** Surface background, 1px Border, radius md. Focus shows a 2px Accent outline.
**Link:** Accent color, underline with 2px offset, hover to Accent hover.

---

## 5. Voice

**Person:** Second person, speaking to the customer directly.
**Rhythm:** Short and warm. Plain words. No marketing inflation.
**Tone:** Speak like a maker who is proud of the work but not loud about it. Describe what something is and why it was made that way. Let the product carry the weight.

---

## 6. Tokens — CSS custom properties

```css
:root {
  /* color */
  --color-bg: #faf9f6;
  --color-surface: #ffffff;
  --color-text: #1c1b18;
  --color-text-muted: #6b6862;
  --color-accent: #b5532a;
  --color-accent-hover: #963f1c;
  --color-border: #e6e3dc;
  --color-success: #3f7d4f;
  --color-warning: #b8860b;
  --color-error: #b23b3b;
  --color-info: #3a6ea5;

  /* typography */
  --font-display: "Fraunces", serif;
  --font-body: "Inter", sans-serif;
  --text-display: 3.052rem;
  --text-h1: 2.441rem;
  --text-h2: 1.953rem;
  --text-h3: 1.563rem;
  --text-body: 1rem;
  --text-small: 0.8rem;
  --leading-tight: 1.15;
  --leading-normal: 1.6;

  /* spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2.5rem;
  --space-2xl: 4rem;

  /* radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* shadow */
  --shadow-sm: 0 1px 2px rgba(28,27,24,0.06);
  --shadow-md: 0 4px 12px rgba(28,27,24,0.08);
  --shadow-lg: 0 12px 32px rgba(28,27,24,0.12);
}
```

---

## 7. Tokens — Tailwind theme

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        bg: "#faf9f6",
        surface: "#ffffff",
        text: { DEFAULT: "#1c1b18", muted: "#6b6862" },
        accent: { DEFAULT: "#b5532a", hover: "#963f1c" },
        border: "#e6e3dc",
        success: "#3f7d4f",
        warning: "#b8860b",
        error: "#b23b3b",
        info: "#3a6ea5",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
      fontSize: {
        display: ["3.052rem", { lineHeight: "1.15" }],
        h1: ["2.441rem", { lineHeight: "1.15" }],
        h2: ["1.953rem", { lineHeight: "1.2" }],
        h3: ["1.563rem", { lineHeight: "1.3" }],
        small: ["0.8rem", { lineHeight: "1.5" }],
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "1rem",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(28,27,24,0.06)",
        md: "0 4px 12px rgba(28,27,24,0.08)",
        lg: "0 12px 32px rgba(28,27,24,0.12)",
      },
    },
  },
};
```
