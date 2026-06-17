# Demo Script — Clean Shopper V1

**Goal:** Walk a stakeholder through the full V1 experience in under 5 minutes. Every beat is confirmed working against live Supabase data.

**Start state:** App loaded at `/`, fresh anonymous session, nothing saved or in cart.

---

## Beat 1 — The catalog (30 sec)

> "This is the browse view. Every product is scored and explained — not by a brand, by us."

- Point to the grid: products load from Supabase, each card shows the brand, name, and a safety badge (Clean / Caution / Avoid) with a numeric score.
- Click **Cleaning** category tag — grid filters to cleaning products via a live query.
- Click **All** to reset.

---

## Beat 2 — Search (30 sec)

> "You can search by product name or brand."

- Type **botanica** in the search field — three Botanica products appear.
- Clear the search — grid returns.
- Type something with no match (e.g. **xyznothing**) — no-results state appears with a helpful message.
- Clear the search.

---

## Beat 3 — Product detail + clean evaluation (90 sec)

> "Every product has a full evaluation. Here's what that looks like."

- Click any product card — navigate to `/product/:id`.
- Point to the **header card**: brand, product name, safety badge, certifications.
- Scroll to the **Clean evaluation panel**:
  - Score summary: score / 100, verdict sentence.
  - **Ingredient breakdown**: ordered by label prominence (ingredient #1 = largest by volume). Each ingredient shows its concern level and, where relevant, a reason.
  - **Certifications**: third-party verifications held by this product.

> "The score isn't a black box — you can see exactly which ingredients drove it and why."

---

## Beat 4 — Save and add to cart (60 sec)

> "When you find something you want to track, you have two options."

- Click **Save ♡** — button fills, shows "Saved ♥". This is a bookmark: interest, research, not a buying decision.
- Click **Add to cart** — button fills green, shows "In cart". Cart badge in the nav increments.

> "Saved is for 'I want to remember this.' Cart is 'I'm ready to buy.'"

- Click **← Back** — return to browse.
- Hover a card — Save and + Cart actions appear inline. Save another product from the browse grid.

---

## Beat 5 — Cart (60 sec)

> "The cart keeps both lists in one place."

- Click **Cart** in the navbar — navigate to `/cart`.
- Top section: items in cart. Bottom section: saved for later.
- Click **+ Cart** on a saved item — it moves from saved to cart in one step.

> "This mirrors the Target / Amazon pattern — you can see everything you're tracking and promote items when you're ready."

---

## Beat 6 — Persistence (15 sec)

> "Everything is tied to your anonymous session — no account required."

- Hard-reload the page (Cmd+R / Ctrl+R).
- Cart count, cart items, and saved list are all exactly as left — persisted to Supabase per anonymous user.

---

## What's next (V2)

The V1 catalog is static — scores and ingredient data are pre-seeded. V2 adds the conversational agent: ask "find me a fragrance-free hand soap under $15" and Claude searches, evaluates, and explains the top picks in real time.
