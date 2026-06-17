# Feature Plan & Phasing — Clean Shopper

**Last updated:** 2026-06-14
**Companion to:** [project-context.md](project-context.md) (problem, ICP, constraints, decisions) and [database-schema.md](database-schema.md) (the backend that powers these features).

This document is the source of truth for **what ships when**. Four phases. V1 (Phase 1) is **locked to five features**; later phases are a documented record of intent, not a commitment.

---

## Phase 1 — V1: Clean-product catalog (LOCKED — 5 features)

V1 is a **browse-first catalog** of clean products, backed by Supabase (anonymous auth). No conversational interface in V1 — see Phase 2. The five features:

| # | Feature | What it is | Backing |
|---|---|---|---|
| 1 | **Browse by category** | Navigate products through the category hierarchy (Personal Care → Shampoo, etc.). | `categories` (self-ref hierarchy) + `products` |
| 2 | **Search** | Find products by name, brand, or keyword. | `products`, `brands` |
| 3 | **Product detail view** | Full product page: brand, category, ingredients, certifications. | `products` + `product_ingredients` + `ingredients` + `certifications` |
| 4 | **Clean evaluation** | The differentiator: objective `clean_score` + ingredient/cert breakdown with reasoning, shown on the detail view and as a `SafetyBadge` signal on listings. Defined by the *Clean standard (V1 definition)* in [project-context.md](project-context.md) §7. | `clean_score` (cached, objective) |
| 5 | **Save to a personal list** | Persist products to a personal list per anonymous user. | `cart_items` |

**Why these five.** Features 1–3 and 5 are the professor's recommended scope — a tight, conventional catalog the user can navigate without any AI. Feature 4 is the one addition that keeps the product *Clean Shopper* and not a generic shopping list: without the clean evaluation surfaced in the catalog, nothing about the browse experience is about cleanliness. All five are already supported by the existing Supabase schema and the existing components (`ProductCard`, `SafetyBadge`, `CategoryTag`).

**Metric consequence (flag).** The original North Star — *recommendation → add-to-cart rate* — assumed AI recommendations, which now live in Phase 2. The V1 proxy is **product-detail-view → save-to-list rate**. [project-context.md](project-context.md) §5 should be reconciled to V1's browse-first reality.

---

## Phase 2 — V2: Conversational agent (DEFERRED from V1)

The original vision — an AI agent over a conversational interface — moved here so V1 could ship a focused catalog in one week. Phase 2 layers the agent *on top of* the Phase 1 catalog: the agent searches/recommends from the same `products` it helped you browse. Deferred features:

- **Chat interface** — the conversational surface (session-scoped; conversation content is not persisted, per the V1 privacy constraint).
- **Product research via Claude** — real-time web search + ingredient-safety data (EWG Skin Deep) to evaluate products against the clean standard.
- **Recommendation cards** — structured, researched recommendations with the clean verdict.
- **Transparent reasoning** — every recommendation shows *why*, so the tool earns trust on safety claims.

**Why deferred, not dropped.** Chat is the product's original differentiator and the eventual headline. It's deferred purely for V1 timebox reasons; the catalog and schema built in Phase 1 are exactly what the agent needs to be useful, so this is the natural next phase.

---

## Phase 3 — Preferences & personalization

- **Save preferences** — ingredients to avoid, trusted brands, required certifications.
- **Auto-apply** preferences to listings and recommendations (the personalization loop).
- **Preference management UI**.

Backed by `avoided_ingredients`, `trusted_brands`, `preferred_certifications`. Personalizes the objective `clean_score` at query time — the overlay described in [project-context.md](project-context.md) §7.

---

## Phase 4 — Decision support

- **Side-by-side comparison** of 2+ products on ingredients, certs, and fit to saved preferences.
- **Clear recommendation** — a single pick with reasoning.

Backed by `comparisons` + `comparison_items`. The capstone — depends on the catalog (Phase 1) and personalization (Phase 3) to be valuable.

---

## At a glance

| Phase | Theme | Status |
|---|---|---|
| 1 (V1) | Clean-product catalog | **Locked — 5 features, due 2026-06-20/21** |
| 2 (V2) | Conversational agent | Documented; deferred from V1 |
| 3 | Preferences & personalization | Planned |
| 4 | Decision support (comparison) | Planned |
