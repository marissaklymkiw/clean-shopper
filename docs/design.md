# Design System: Clean Shopper

> This file is the source of truth for the visual direction of this project. When building, read this file and apply these tokens. Do not introduce colors, fonts, spacing, or radii that are not defined here.

**Direction:** Natural and warm, with a single vivid jade-green accent on a cream neutral base
**Feeling:** Trustworthy and approachable — a wellness sensibility that reads as credible, not clinical (in the spirit of Thrive Market / Grove Collaborative)
**Generated for:** Ingredient-conscious shoppers researching cleaner home, personal care, and pantry products via a conversational, Claude-backed assistant. Light mode only for V1.

---

## 1. Color

State the role of every color. Do not add colors outside this list.

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#FAF7F1` | Warm cream page background, primary surface |
| Surface | `#FFFFFF` | Cards, raised panels, message bubbles, inputs |
| Text primary | `#23291F` | Headings and body text (deep warm green-charcoal) |
| Text muted | `#5E6356` | Secondary text, captions, metadata |
| Accent | `#2B8463` | Primary actions, links, emphasis, brand (vivid jade green) |
| Accent hover | `#237055` | Hover/active state of accent |
| Border | `#E7E2D8` | Dividers, input borders, card outlines (warm sand) |
| Success | `#2F7D4F` | "Meets your standards" / positive states |
| Warning | `#B8860B` | "Check this" / caution states (warm amber) |
| Error | `#B23B33` | Avoided ingredient flag, errors, destructive actions |
| Info | `#3A6E8F` | Neutral informational states (muted slate blue) |

**Contrast check (WCAG AA):**
- Text primary on Background: **~14:1** (pass — exceeds AAA 7:1 for body)
- Text muted on Background: **~5.8:1** (pass — body 4.5:1)
- Accent text (white) on Accent background: **~4.6:1** (pass — body 4.5:1; safe for button labels)
- Accent on Background (links): **~4.3:1** (large text/UI pass at 3:1; just under body 4.5:1 — see note)

> Note: One accent only, per the chosen "neutral + one accent" direction. The accent was brightened to a vivid jade (`#2B8463`) per request. At this lightness, white-on-accent button labels still clear AA (~4.6:1), but accent-colored *body-size link text* on the cream background lands at ~4.3:1, marginally below AA 4.5:1. Links are underlined (a non-color affordance), and for dense link-heavy text use **Accent hover** (`#237055`, ~5.6:1 on background) as the resting link color to stay fully AA. Going lighter (e.g. the originally requested `#3A9D7C`) would drop white-on-accent to ~3.3:1 and fail AA for button labels. Success (`#2F7D4F`) reads as a warmer, more yellow-green than the cooler jade accent, so a "meets your standards" badge stays distinguishable from brand chrome.

---

## 2. Typography

**Display / headings:** Fraunces (Google Fonts) — a soft, warm serif that signals craft and care without feeling corporate.
**Body:** Plus Jakarta Sans (Google Fonts) — a friendly humanist sans that stays highly readable in dense comparison and ingredient content.

Type scale (base 16px, ratio 1.25 — major third):

| Token | Size | Line height | Weight | Usage |
|-------|------|-------------|--------|-------|
| Display | 49px (3.052rem) | 1.1 | 600 | Hero, landing headline |
| H1 | 39px (2.441rem) | 1.15 | 600 | Page title |
| H2 | 31px (1.953rem) | 1.2 | 600 | Section title |
| H3 | 25px (1.563rem) | 1.3 | 500 | Card title, product name |
| Body | 16px (1rem) | 1.6 | 400 | Paragraphs, chat messages |
| Small | 13px (0.8rem) | 1.5 | 400 | Captions, labels, badges |

Headings use Fraunces; everything else uses Plus Jakarta Sans. Body weight 400 with 500 for emphasis; buttons and labels 500–600.

---

## 3. Spacing, radius, elevation

**Spacing scale** (base 4px, generous at the top end): `xs 4px · sm 8px · md 16px · lg 24px · xl 40px · 2xl 64px`
**Radius:** `sm 6px · md 10px · lg 16px · full 9999px` (soft, never sharp — matches the warm direction)
**Shadow:** soft, diffuse, warm-tinted (using the dark green-charcoal at low opacity) rather than hard neutral drops.
- `sm`: `0 1px 2px rgba(35,41,31,0.05)`
- `md`: `0 6px 18px rgba(35,41,31,0.07)`
- `lg`: `0 16px 40px rgba(35,41,31,0.10)`

---

## 4. Components

Describe each in terms of the tokens above.

**Button — primary:** background Accent, text `#FFFFFF`, radius `md`, padding `sm` vertical / `lg` horizontal, weight 500, hover Accent hover. Used for the single most important action in a view (e.g. "Add to cart").
**Button — secondary:** transparent background, text Accent, 1px Accent border, radius `md`, same padding. Hover: Accent-hover text and border, optional faint Accent tint fill. Used for alternative actions (e.g. "Compare").
**Button — disabled:** background Border, text Text muted, no border, `not-allowed` cursor, no hover change.
**Card:** background Surface, 1px Border, radius `lg`, shadow `md`, padding `lg`. The default container for product results and recommendations.
**Input:** background Surface, 1px Border, radius `md`, padding `sm`/`md`, Text primary. Focus: 2px Accent outline with 1px offset and Accent border. Used for the chat composer and preference fields.
**Link:** color Accent, underline with 2px offset, hover Accent hover. Inline links in body and message copy.

**Badges (clean-standards signals):** small pills at `small` size, radius `full`. "Meets your standards" → Success text on a faint Success tint; "Avoided ingredient" → Error text on a faint Error tint; certification chips → Text muted on Surface with a Border outline. Keep them quiet so they inform without alarming.

---

## 5. Voice

**Person:** Second person ("you," "your standards"). The assistant talks *to* the shopper.
**Rhythm:** Warm and explanatory, but economical. Lead with the recommendation or answer, then the reasoning. Short sentences for verdicts; a little more room when explaining why an ingredient matters.
**Tone:** Knowledgeable and reassuring, never preachy or fear-mongering. You make clean choices feel achievable, not overwhelming. State safety findings plainly and cite the basis ("per EWG's Skin Deep…") so trust is earned, not asserted. Approachable over clinical — a helpful, well-read friend who happens to know ingredients cold.

---

## 6. Tokens — CSS custom properties

```css
:root {
  /* color */
  --color-bg: #FAF7F1;
  --color-surface: #FFFFFF;
  --color-text: #23291F;
  --color-text-muted: #5E6356;
  --color-accent: #2B8463;
  --color-accent-hover: #237055;
  --color-border: #E7E2D8;
  --color-success: #2F7D4F;
  --color-warning: #B8860B;
  --color-error: #B23B33;
  --color-info: #3A6E8F;

  /* typography */
  --font-display: "Fraunces", serif;
  --font-body: "Plus Jakarta Sans", sans-serif;
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
  --radius-sm: 0.375rem;
  --radius-md: 0.625rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* shadow */
  --shadow-sm: 0 1px 2px rgba(35,41,31,0.05);
  --shadow-md: 0 6px 18px rgba(35,41,31,0.07);
  --shadow-lg: 0 16px 40px rgba(35,41,31,0.10);
}
```

---

## 7. Tokens — Tailwind theme

For projects using Tailwind, add this to `tailwind.config.js` under `theme.extend`. The values mirror the CSS variables above. (Tailwind is not yet installed in this project; this block is ready for when it is.)

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        bg: "#FAF7F1",
        surface: "#FFFFFF",
        text: { DEFAULT: "#23291F", muted: "#5E6356" },
        accent: { DEFAULT: "#2B8463", hover: "#237055" },
        border: "#E7E2D8",
        success: "#2F7D4F",
        warning: "#B8860B",
        error: "#B23B33",
        info: "#3A6E8F",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
      fontSize: {
        display: ["3.052rem", { lineHeight: "1.1" }],
        h1: ["2.441rem", { lineHeight: "1.15" }],
        h2: ["1.953rem", { lineHeight: "1.2" }],
        h3: ["1.563rem", { lineHeight: "1.3" }],
        small: ["0.8rem", { lineHeight: "1.5" }],
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.625rem",
        lg: "1rem",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(35,41,31,0.05)",
        md: "0 6px 18px rgba(35,41,31,0.07)",
        lg: "0 16px 40px rgba(35,41,31,0.10)",
      },
    },
  },
};
```
