# Design System: [PROJECT NAME]

> This file is the source of truth for the visual direction of this project. When building, read this file and apply these tokens. Do not introduce colors, fonts, spacing, or radii that are not defined here.

**Direction:** [one line, e.g. "Modern and clean with a single warm accent"]
**Feeling:** [one line, e.g. "Calm, credible, in control"]
**Generated for:** [audience or purpose, if known]

---

## 1. Color

State the role of every color. Do not add colors outside this list.

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#______` | Page background, primary surface |
| Surface | `#______` | Cards, raised panels |
| Text primary | `#______` | Headings and body text |
| Text muted | `#______` | Secondary text, captions |
| Accent | `#______` | Primary actions, links, emphasis |
| Accent hover | `#______` | Hover/active state of accent |
| Border | `#______` | Dividers, input borders |
| Success | `#______` | Positive states |
| Warning | `#______` | Caution states |
| Error | `#______` | Errors, destructive actions |
| Info | `#______` | Informational states |

**Contrast check (WCAG AA):**
- Text primary on Background: __:1 (pass / fail for body 4.5:1)
- Text muted on Background: __:1
- Accent text on Accent background: __:1

---

## 2. Typography

**Display / headings:** [Font name], [source: Google Fonts / system stack]
**Body:** [Font name], [source]

Type scale (base 16px, ratio [e.g. 1.25]):

| Token | Size | Line height | Weight | Usage |
|-------|------|-------------|--------|-------|
| Display | __px | __ | __ | Hero, page title |
| H1 | __px | __ | __ | Section title |
| H2 | __px | __ | __ | Subsection |
| H3 | __px | __ | __ | Card title |
| Body | 16px | __ | 400 | Paragraphs |
| Small | __px | __ | 400 | Captions, labels |

---

## 3. Spacing, radius, elevation

**Spacing scale** (base [4px / 8px]): `xs __ · sm __ · md __ · lg __ · xl __ · 2xl __`
**Radius:** `sm __ · md __ · lg __ · full 9999px`
**Shadow:**
- `sm`: [value]
- `md`: [value]
- `lg`: [value]

---

## 4. Components

Describe each in terms of the tokens above.

**Button — primary:** background Accent, text [color], radius [token], padding [tokens], hover Accent hover.
**Button — secondary:** [description]
**Button — disabled:** [description]
**Card:** background Surface, border Border, radius [token], shadow [token], padding [token].
**Input:** background [color], border Border, radius [token], focus state [description].
**Link:** color Accent, [underline behavior], hover [description].

---

## 5. Voice

**Person:** [first / second / third]
**Rhythm:** [e.g. short and direct, or warm and explanatory]
**Tone:** [2-3 sentences on how interface copy should read]

---

## 6. Tokens — CSS custom properties

```css
:root {
  /* color */
  --color-bg: #______;
  --color-surface: #______;
  --color-text: #______;
  --color-text-muted: #______;
  --color-accent: #______;
  --color-accent-hover: #______;
  --color-border: #______;
  --color-success: #______;
  --color-warning: #______;
  --color-error: #______;
  --color-info: #______;

  /* typography */
  --font-display: "______", sans-serif;
  --font-body: "______", sans-serif;
  --text-display: ___rem;
  --text-h1: ___rem;
  --text-h2: ___rem;
  --text-h3: ___rem;
  --text-body: 1rem;
  --text-small: ___rem;
  --leading-tight: ___;
  --leading-normal: ___;

  /* spacing */
  --space-xs: ___rem;
  --space-sm: ___rem;
  --space-md: ___rem;
  --space-lg: ___rem;
  --space-xl: ___rem;
  --space-2xl: ___rem;

  /* radius */
  --radius-sm: ___rem;
  --radius-md: ___rem;
  --radius-lg: ___rem;
  --radius-full: 9999px;

  /* shadow */
  --shadow-sm: ______;
  --shadow-md: ______;
  --shadow-lg: ______;
}
```

---

## 7. Tokens — Tailwind theme

For projects using Tailwind, add this to `tailwind.config.js` under `theme.extend`. The values mirror the CSS variables above.

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        bg: "#______",
        surface: "#______",
        text: { DEFAULT: "#______", muted: "#______" },
        accent: { DEFAULT: "#______", hover: "#______" },
        border: "#______",
        success: "#______",
        warning: "#______",
        error: "#______",
        info: "#______",
      },
      fontFamily: {
        display: ["______", "sans-serif"],
        body: ["______", "sans-serif"],
      },
      fontSize: {
        display: ["___rem", { lineHeight: "___" }],
        h1: ["___rem", { lineHeight: "___" }],
        h2: ["___rem", { lineHeight: "___" }],
        h3: ["___rem", { lineHeight: "___" }],
        small: ["___rem", { lineHeight: "___" }],
      },
      borderRadius: {
        sm: "___rem",
        md: "___rem",
        lg: "___rem",
      },
      boxShadow: {
        sm: "______",
        md: "______",
        lg: "______",
      },
    },
  },
};
```
