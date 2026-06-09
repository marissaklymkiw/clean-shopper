# Component Specification — Clean Shopper

> Specs for the core reusable UI components of Clean Shopper V1. Every visual value
> below is a **design token** from [tailwind.config.js](../tailwind.config.js), which is
> generated from [docs/design.md](design.md) (the design-system source of truth).
> **No hardcoded colors, font sizes, or spacing.** If a value you need isn't a token,
> add it to `design.md` + `tailwind.config.js` first — don't inline it.

## Token quick-reference

These are the exact Tailwind classes available (from `theme.extend`):

- **Color** — `bg`, `surface`, `accent` / `accent-hover`, `text` (DEFAULT) / `text-muted`, `border`, `success`, `warning`, `error`, `info`. Used as `bg-*`, `text-*`, `border-*` (e.g. `bg-accent`, `text-text-muted`, `border-border`). Faint tints use the opacity modifier, e.g. `bg-success/10`.
- **Type** — family `font-display` (Fraunces) / `font-body` (Plus Jakarta Sans); size `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-small` (each bakes in its line-height + weight).
- **Spacing** — `xs sm md lg xl 2xl` as `p-*`, `px-*`, `py-*`, `gap-*`, `m-*` (e.g. `p-lg`, `gap-md`).
- **Radius** — `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full`.
- **Shadow** — `shadow-sm`, `shadow-md`, `shadow-lg`.

> **Note on "primary":** there is no `primary` color token. The single brand/action color is `accent`. Primary buttons are `bg-accent text-surface`; secondary buttons are outlined in `accent`. White-on-accent labels (`text-surface`) clear WCAG AA (~4.6:1).

---

## 1. ProductCard

**Purpose:** Displays one researched product with its clean-standards verdict, category, and reasoning, with an optional add-to-cart action.

**Props**

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `name` | `string` | required | Product name (card title). |
| `safety` | `"clean" \| "caution" \| "avoid"` | required | Verdict; drives the `SafetyBadge`. |
| `score` | `number` | optional | 0–100 safety score shown alongside the verdict label (e.g. "Clean · 92"). |
| `category` | `string` | required | Category label (rendered as a `CategoryTag`). |
| `description` | `string` | required | Short reasoning / summary. |
| `price` | `string` | optional | Display price; shows the footer + CTA when present. |
| `imageUrl` | `string` | optional | Product thumbnail. |
| `loading` | `boolean` | optional | Render the skeleton instead of content. |
| `onAddToCart` | `() => void` | optional | Renders a primary `Button` when provided. |
| `className` | `string` | optional | Layout overrides (width, grid placement). |

**Visual structure**

- Container: `<article>` — `flex flex-col gap-md rounded-lg border border-border bg-surface p-lg shadow-md`.
- Header row: `flex items-start justify-between gap-sm` — title `font-display text-h3 text-text`; `SafetyBadge` aligned right (`shrink-0`).
- `CategoryTag` on its own row (`self-start`).
- Description: `text-body text-text-muted`.
- Optional footer: `flex items-center justify-between gap-md` — price `text-body text-text`; primary `Button` for add-to-cart.

**States**

- **Default:** `shadow-md`.
- **Hover:** `hover:shadow-lg transition-shadow` (lifts on pointer).
- **Loading:** skeleton blocks `bg-border/40 rounded-md animate-pulse` in place of title/description; no badge.
- **Empty / Error:** not handled here — an empty result set is an `EmptyState` at the list level; a failed fetch surfaces at the list/page level, not per-card.

**Usage rules**

- **Use** for each product in chat recommendations, the comparison view, and the saved cart.
- **Don't use** for non-product content, and don't stack more than one verdict badge per card — the single `SafetyBadge` is the at-a-glance signal.

---

## 2. SafetyBadge

**Purpose:** A small pill that signals a product or ingredient's clean-standards verdict at a glance.

**Props**

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `level` | `"clean" \| "caution" \| "avoid"` | required | Maps to success / warning / error tints. |
| `label` | `string` | optional | Overrides the default label ("Clean" / "Caution" / "Avoid"). |
| `className` | `string` | optional | Layout overrides. |

**Visual structure**

- `inline-flex items-center rounded-full px-sm py-xs text-small` (the `text-small` token carries weight 400 — emphasis comes from the tint, not the weight).
- Tints by level:
  - `clean` → `bg-success/10 text-success`
  - `caution` → `bg-warning/10 text-warning`
  - `avoid` → `bg-error/10 text-error`
- Always include an `aria-label` (e.g. `Safety score: Clean`).

**States**

- **Default** only. This is a static display indicator — no hover, loading, empty, or error states.

**Usage rules**

- **Use** on product cards, comparison rows, and ingredient rows to convey a verdict.
- **Don't use** as a button or interactive control, don't bold it, and don't show more than one per product. For non-verdict labels (category, certification) use `CategoryTag`.

---

## 3. SearchBar

**Purpose:** The conversational composer where the user types what they're looking for and submits it to Clean Shopper.

**Props**

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `value` | `string` | required | Controlled input value. |
| `onChange` | `(value: string) => void` | required | Fires on each keystroke. |
| `onSubmit` | `() => void` | required | Fires on send / Enter. |
| `placeholder` | `string` | optional | Defaults to a prompt like "Describe what you're looking for…". |
| `loading` | `boolean` | optional | Request in flight; disables submit + shows spinner. |
| `disabled` | `boolean` | optional | Fully disables the field and button. |
| `error` | `string` | optional | Inline validation message. |
| `className` | `string` | optional | Layout overrides. |

**Visual structure**

- Container: `<form>` — `flex items-center gap-sm`.
- Field: `flex-1 bg-surface border border-border rounded-md px-md py-sm text-body text-text placeholder:text-text-muted`.
- Submit: primary `Button` (`bg-accent text-surface rounded-md px-lg py-sm`).
- Optional error line below: `text-small text-error`.

**States**

- **Default:** `border-border`.
- **Hover:** submit button `hover:bg-accent-hover`.
- **Focus:** field `focus:outline focus:outline-2 focus:outline-accent focus:outline-offset-1 focus:border-accent`.
- **Loading:** submit shows spinner, `aria-busy`, interaction disabled.
- **Disabled:** field + button `bg-border text-text-muted cursor-not-allowed`, no hover.
- **Error:** field `border-error`; helper line `text-error text-small`.

**Usage rules**

- **Use** as the primary chat composer and any free-text product-search entry — input the user *sends*.
- **Don't use** for discrete labeled form values (use `InputField`), or for instant client-side filtering of a static list (no submit step needed there).

---

## 4. CategoryTag

**Purpose:** A quiet, outlined pill that labels a product's category or a certification it carries.

**Props**

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `label` | `string` | required | Tag text (e.g. "All-purpose cleaner", "EWG Verified"). |
| `interactive` | `boolean` | optional | Enables hover affordance when used as a filter. |
| `onClick` | `() => void` | optional | Filter selection handler. |
| `className` | `string` | optional | Layout overrides. |

**Visual structure**

- `inline-flex items-center self-start rounded-full border border-border bg-surface px-sm py-xs text-small text-text-muted`.

**States**

- **Default:** static, `text-text-muted` on a `border-border` outline.
- **Hover (only when `interactive`):** `hover:border-accent hover:text-accent`.
- No loading / empty / error states.

**Usage rules**

- **Use** for category labels and certification chips (EWG Verified, USDA Organic, B Corp).
- **Don't use** for safety verdicts (use `SafetyBadge`) and don't fill it with color — keep it quiet so the verdict badge stays the focal signal.

---

## 5. NavBar

**Purpose:** The persistent top bar across every view, holding the brand, primary navigation, and the cart entry point.

**Props**

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `active` | `"home" \| "chat" \| "compare" \| "preferences"` | optional | Highlights the current section. Defaults to `"home"`. |
| `cartCount` | `number` | optional | Item count badge on the cart control. |
| `onNavigate` | `(key: "home" \| "chat" \| "compare" \| "preferences") => void` | optional | Nav-item click handler. |
| `onOpenCart` | `() => void` | optional | Cart click handler. |
| `className` | `string` | optional | Layout overrides. |

**Visual structure**

- Container: `<header>` — `flex items-center justify-between gap-lg bg-surface border-b border-border px-lg py-sm shadow-sm`.
- Brand wordmark: `font-display text-h3 text-text`.
- Nav: `flex items-center gap-lg`; items are Home, Chat, Compare, Preferences, each `text-body font-medium text-text-muted`.
- Cart: secondary `Button` with a count pill — `rounded-full bg-accent text-surface text-small px-sm`.

**States**

- **Default:** nav items `text-text-muted`.
- **Hover:** nav item `hover:text-accent`.
- **Active:** current item `text-accent`.
- **Empty:** when `cartCount` is `0`/undefined, hide the count pill (cart icon still shown).
- No loading / error states.

**Usage rules**

- **Use** once, at the top of every view, as the global frame.
- **Don't use** it for in-page section tabs (those belong in the content area), don't nest navbars, and keep CTAs out of it beyond the cart entry point.

---

## 6. Button (primary & secondary)

**Purpose:** The single styled action control, in a high-emphasis filled `primary` variant and a low-emphasis outlined `secondary` variant.

**Props**

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `children` | `ReactNode` | required | Button label / content. |
| `variant` | `"primary" \| "secondary"` | optional | Defaults to `"primary"`. |
| `type` | `"button" \| "submit"` | optional | Defaults to `"button"`. |
| `disabled` | `boolean` | optional | Non-interactive state. |
| `loading` | `boolean` | optional | Shows spinner; implies disabled interaction. |
| `onClick` | `() => void` | optional | Click handler. |
| `className` | `string` | optional | Layout overrides. |

**Visual structure**

- Base (both variants): `inline-flex items-center justify-center gap-sm rounded-md px-lg py-sm text-body font-medium transition-colors`.
- **Primary:** `bg-accent text-surface`.
- **Secondary:** `bg-transparent text-accent border border-accent`.

**States**

- **Default:** as above.
- **Hover:** primary `hover:bg-accent-hover`; secondary `hover:text-accent-hover hover:border-accent-hover hover:bg-accent/5`.
- **Focus:** `focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2`.
- **Loading:** spinner + `aria-busy`; pointer events disabled.
- **Disabled:** `bg-border text-text-muted border-transparent cursor-not-allowed`, no hover change.
- No empty / error states.

**Usage rules**

- **Use** primary for the single most important action in a view (Add to cart, Send); secondary for an alternative action (Compare, Cancel).
- **Don't use** two primary buttons in one view, and don't use a button for inline text navigation — that's a `Link`.

---

## 7. InputField

**Purpose:** A single labeled text field for discrete form and preference entry.

**Props**

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `label` | `string` | required | Visible field label. |
| `value` | `string` | required | Controlled value. |
| `onChange` | `(value: string) => void` | required | Fires on change. |
| `name` | `string` | optional | Form field name. |
| `type` | `string` | optional | Input type; defaults to `"text"`. |
| `placeholder` | `string` | optional | Placeholder copy. |
| `helperText` | `string` | optional | Guidance shown below the field. |
| `error` | `string` | optional | Validation message; overrides helper styling. |
| `required` | `boolean` | optional | Marks the field required. |
| `disabled` | `boolean` | optional | Non-interactive state. |
| `className` | `string` | optional | Layout overrides. |

**Visual structure**

- Wrapper: `flex flex-col gap-xs`.
- Label: `text-small text-text-muted`.
- Input: `bg-surface border border-border rounded-md px-md py-sm text-body text-text placeholder:text-text-muted`.
- Helper / error line: `text-small` — helper `text-text-muted`, error `text-error`.

**States**

- **Default:** `border-border`.
- **Focus:** `focus:outline focus:outline-2 focus:outline-accent focus:outline-offset-1 focus:border-accent`.
- **Error:** `border-error`; message `text-error text-small`.
- **Disabled:** `bg-border text-text-muted cursor-not-allowed`.
- **Empty:** placeholder shown in `text-text-muted`.
- No loading state.

**Usage rules**

- **Use** for discrete labeled values — adding an avoided ingredient, a trusted brand, a preference name.
- **Don't use** for the chat composer (use `SearchBar`) and never render it without a `label` (placeholders aren't labels).

---

## 8. EmptyState

**Purpose:** A centered placeholder shown when a surface has no content yet, optionally offering a recovery action.

**Props**

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `title` | `string` | required | Primary message. |
| `description` | `string` | optional | Supporting copy. |
| `icon` | `ReactNode` | optional | Illustrative glyph. |
| `action` | `ReactNode` | optional | Usually a primary `Button`. |
| `tone` | `"neutral" \| "error"` | optional | Defaults to `"neutral"`; `"error"` for failure copy. |
| `className` | `string` | optional | Layout overrides. |

**Visual structure**

- Container: `flex flex-col items-center text-center gap-md p-xl`.
- Icon: `text-text-muted` (or `text-error` when `tone="error"`).
- Title: `font-display text-h3 text-text`.
- Description: `text-body text-text-muted max-w-prose`.
- Action: primary `Button`.

**States**

- **Default (neutral):** the empty state itself.
- **Error:** same layout with `tone="error"` — icon `text-error`, copy describes the failure, action retries.
- No hover / loading state — a *loading* placeholder uses skeletons, not this component.

**Usage rules**

- **Use** for the empty cart, the pre-conversation chat surface, and no-results states.
- **Don't use** for transient loading (use skeletons) and don't hide the primary recovery action below the fold.

---

*Generated against `tailwind.config.js`. Keep this spec in sync with `docs/design.md` — if a component needs a value that isn't a token, add the token there first.*
