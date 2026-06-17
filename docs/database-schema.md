# Database Schema

**Project:** Clean Shopper
**Backend:** Supabase (Postgres + Row-Level Security + anonymous auth)
**Source of truth:** the migrations in [`supabase/migrations/`](../supabase/migrations/), applied in filename order.

This document explains the schema and the reasoning behind it. The SQL migration is canonical — if the two ever disagree, the migration wins.

---

## Why a backend now?

V1 was spec'd as `localStorage`-only ([project-context.md](project-context.md), §6). Moving to Supabase is the "anonymous-ID backend store" that same doc names as the natural next step. The key choice that keeps the "no accounts" spirit:

**Use Supabase anonymous auth.** `signInAnonymously()` creates a real `auth.users` row (`is_anonymous = true`) and a stable `user_id` per device — no email or password. That gives durable storage, free per-user isolation via RLS, and a clean upgrade path later (link an email to the existing anon user and all their data carries over).

---

## Two layers

The schema splits into a **shared catalog** and **user-owned data**.

### Shared catalog (public read, normalized)
One row per real-world thing, reused across all users.

| Table | Purpose |
|---|---|
| `categories` | Self-referencing hierarchy (`parent_id`): Personal Care → Shampoo, etc. |
| `brands` | First-class brand catalog. Products reference `brand_id`; user `trusted_brands` can too. |
| `ingredients` | Normalized ingredient list with a safety assessment (`concern_level`, `concern_reason`, `aliases`). |
| `products` | One catalog row per product. Carries `barcode`, `brand_id`, `category_id`, and a derived `clean_score`. |
| `product_ingredients` | Junction. `position` = label order = prominence (ingredient #1 is the bulk of the product). |
| `certifications` | Controlled vocabulary (EWG Verified, USDA Organic, B Corp). |
| `product_certifications` | Junction: which certs a product holds. |

**`clean_score` is objective.** It's derived from the product's ingredients and stored as a cached value on `products`. It is *not* personalized. Personalization happens at **query time** by comparing a user's `avoided_ingredients` / `preferred_certifications` against the product. This is why products are shared, not per-user.

### User-owned data (RLS-scoped to `auth.uid()`)

| Table | Purpose |
|---|---|
| `profiles` | 1:1 with `auth.users`. Auto-created by a trigger on signup. |
| `avoided_ingredients` | Ingredients to avoid. FK to the catalog when known; free-text `name` fallback otherwise. |
| `trusted_brands` | Brands the user trusts. FK to the `brands` catalog when known; free-text `name` fallback. |
| `preferred_certifications` | Certs the user cares about (`required` vs `preferred`). |
| `cart_items` | The persistent cart. References shared `products`. |
| `sessions` | **Metric timestamps only** — no chat content is stored. |
| `recommendations` | Per-user recommendation events + personalized reasoning. |
| `comparisons` / `comparison_items` | Side-by-side comparisons and the chosen winner. |

---

## How it maps to the V1 features

- **Recommend products** → `recommendations` (per-user reasoning) referencing shared `products`.
- **Save preferences** → `avoided_ingredients`, `trusted_brands`, `preferred_certifications`.
- **Persistent cart** → `cart_items`, durable per `user_id`.
- **Compare side-by-side** → `comparisons` + `comparison_items`.

## How it instruments the success metrics

| Metric (from §5) | Where it comes from |
|---|---|
| **North Star** — recommendation → action | `recommendations.added_to_cart_at` (null = not actioned) |
| Time to recommendation | `sessions.first_recommendation_at − started_at` |
| Preference-adherence | `recommendations.adheres_to_prefs` |
| Comparison-to-decision | `comparisons.decided_at` / `chosen_product_id` |
| Return usage | `sessions` per `user_id` over time |

> No conversation history is persisted — only the timestamps needed to measure the above, honoring the V1 privacy constraint.

---

## Notes & open choices

- **Barcode vs. V1 scope:** barcode *scanning* is out of V1 scope, but the `barcode` column earns its place as a unique product identifier (dedup, lookups). The scanner is a later feature.
- **Categories depth:** `parent_id` allows unlimited nesting. If you ever want to *guarantee* exactly two levels, swap to an explicit `categories` + `subcategories` pair.
- **Preferences by category:** currently global across all products. If users should scope rules to a category ("only clean *shampoo* brands"), add an optional `category_id` to the preference tables.
- **`clean_score` derivation:** stored as a cached integer (0–100). Recompute it whenever a product's `product_ingredients` change (app logic or a DB trigger).

---

## Migrating existing localStorage data

On a returning V1 user's first load of the Supabase build: sign in anonymously, then read their existing localStorage cart + preferences and bulk-insert into the matching tables for the new `user_id`. After a successful sync, treat localStorage as a write-through cache or clear it.
