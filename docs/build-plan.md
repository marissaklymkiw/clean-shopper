# Build Plan — Clean Shopper V1

**Last updated:** 2026-06-14 (Sessions 1–5 complete)
**Scope:** V1 / Phase 1 only — the five locked features in [feature-plan.md](feature-plan.md).
**Companions:** [project-context.md](project-context.md) · [database-schema.md](database-schema.md) · [component-spec.md](component-spec.md) · [design.md](design.md)

Work is grouped into **focused build sessions, ordered by dependency**. Each session lists: what we're building, the context Claude Code needs loaded, a definition of done, and what the next session opens with. The database and Supabase setup come first; no UI is built on mock data after Session 3.

Every definition of done is written as a set of **demonstrations** — each in the form *"I can do X and observe Y"* — so the session is closed only when each one can be acted out and watched, not argued. If you can't perform the action and see the result, it isn't done.

> **Starting state (already in the repo, do not rebuild):** schema migrations (`supabase/migrations/`), a placeholder seed (`supabase/seed.sql`, 25 products), the Supabase client + `ensureSession()` ([src/lib/supabase.ts](../src/lib/supabase.ts)), the data access layer ([src/lib/catalog.ts](../src/lib/catalog.ts)), the design system, the component spec, and three components (`NavBar`, `CategoryTag`, `ProductCard`). [BrowsePage.tsx](../src/pages/BrowsePage.tsx) exists but renders a **hardcoded array** — replacing that is the spine of this plan.
>
> **Schema note:** `products` has no `slug` column — products are identified by `id` (UUID). The detail route will be `/product/:id`. The `slug` column exists only on `categories`, `brands`, and `certifications`.

---

## ✅ Session 1 — Database & Supabase setup *(complete)*

**What we're building.** A live Supabase project running the existing schema, seeded with the **full catalog**, with anonymous auth enabled and the app connected via env vars. Also: a quick review pass confirming the schema supports all five V1 features (category hierarchy, search-able product/brand fields, `clean_score`, `product_ingredients`, `certifications`, `cart_items`) and that search has the indexes it needs.

> **When do products get built?** Products are **seeded here, in Session 1** — there is no separate "build products" session, because products are catalog *data*, not a feature increment. `seed.sql` loads everything in foreign-key order: `categories` → subcategories → `products` (each `product.category_id` references a category, so **categories must exist first**) → `ingredients` + `product_ingredients` → `certifications` + `product_certifications`. From the end of this session onward, every later session has real products to read.

**Context Claude Code needs.** [supabase-setup.md](supabase-setup.md), [database-schema.md](database-schema.md), `supabase/migrations/*.sql`, `supabase/seed.sql`, [src/lib/supabase.ts](../src/lib/supabase.ts), `.env.example`.

**Definition of done — demonstrations.** Each is "I can do X and observe Y":
- *I can* run both migrations + the seed in the Supabase SQL Editor *and observe* "Success" with no errors, then *I can* open the Table Editor *and observe* seeded rows in `categories`, `products`, and `certifications`.
- *I can* enable anonymous sign-ins and fill `.env.local` with the real URL + anon key, then *I can* load the running app *and observe* a new anonymous user appear under Supabase → Authentication → Users and its session id logged in the browser console (from `ensureSession()`).
- **Data-fixture verification — run before any rendering is built** (record each query + expected result so it can be re-run after a seed change):
  - *I can* run a `select count(*)` per table *and observe* the counts match `seed.sql`'s known totals (top-level categories, subcategories, products, certifications).
  - *I can* run an orphan/null check *and observe* zero rows returned — i.e. every `product` resolves to a real `category_id` and `brand_id`, every `clean_score` is non-null, and every `product_ingredients.position` is populated.
  - *I can* run one representative joined query for a single product slug *and observe* it returns the full shape Sessions 3–5 render: brand, category, `clean_score`, ingredient breakdown ordered by `position` (with `concern_level`/`concern_reason`), and certifications.

**Next session opens with.** A connected, seeded, **fixture-verified** database and a working anonymous session — the data shape Sessions 3–5 will render is already confirmed correct, so the app layer can be built against known-good data.

---

## ✅ Session 2 — Data access layer + session bootstrap *(complete)*

**What we're building.** A typed data-access module (e.g. `src/lib/catalog.ts`) with the queries every later session reuses: `getCategories()`, `getProducts({ categoryId })`, `getProductBySlug(slug)`, `searchProducts(query)`. Call `ensureSession()` on app start ([src/main.tsx](../src/main.tsx) / App) so RLS-scoped queries work. Define the single mapping used everywhere: `clean_score` (0–100) → `ProductCard`'s `safety` (`"clean" | "caution" | "avoid"`) + `score`.

**Context Claude Code needs.** [database-schema.md](database-schema.md), [src/lib/supabase.ts](../src/lib/supabase.ts), [component-spec.md](component-spec.md) (`ProductCard` props + `SafetyLevel`), [feature-plan.md](feature-plan.md).

**Definition of done — demonstrations.** Each is "I can do X and observe Y":
- *I can* reload the app *and observe* in the console that `ensureSession()` resolves once, before any catalog query fires.
- *I can* call the temporary debug fetch *and observe* real seeded products from Supabase logged to the console (not the mock array), each with its derived `safety` level (`clean`/`caution`/`avoid`) from the `clean_score` mapping.
- *I can* run `tsc` / open the editor *and observe* no type errors and no `any` on the catalog query return shapes.

**Next session opens with.** Working typed queries returning live catalog data and a known score→safety mapping — ready to render in the browse UI.

---

## ✅ Session 3 — Browse by category *(Feature 1 — first live screen)* *(complete)*

**What we're building.** Replace `BrowsePage`'s hardcoded `PRODUCTS`/`CATEGORIES` with live data: category tags from the real `categories` hierarchy, product grid from `getProducts({ categoryId })`. Real loading, empty, and error states. Cards now show the real clean signal (`SafetyBadge` + score) — this is where the **clean evaluation first appears at listing level**.

**Context Claude Code needs.** [src/pages/BrowsePage.tsx](../src/pages/BrowsePage.tsx), the Session-2 catalog module, [component-spec.md](component-spec.md), [design.md](design.md).

**Definition of done — demonstrations.** Each is "I can do X and observe Y":
- *I can* load the browse page *and observe* the grid populated with seeded products from Supabase — and *I can* search `BrowsePage.tsx` *and observe* no hardcoded `PRODUCTS`/`CATEGORIES` array remains.
- *I can* click a category tag *and observe* the grid filter to that category's products (via a real query, confirmable in the network tab).
- *I can* open a category that has no products *and observe* the empty state, and *I can* throttle/disconnect the network *and observe* the loading state then the error state.

**Next session opens with.** A live, category-filtered catalog grid built on the shared query layer — ready to add search over the same data.

---

## ✅ Session 4 — Search *(Feature 2)* *(complete)*

**What we're building.** A search input (in `NavBar`) wired to `searchProducts(query)` across product name, brand name, and keyword (`ilike`). Debounced input, results rendering reusing `ProductCard`, a distinct no-results state, and a clear/reset back to browse.

**Context Claude Code needs.** [src/components/NavBar.tsx](../src/components/NavBar.tsx), `BrowsePage` / results view, the catalog module (`searchProducts`), [component-spec.md](component-spec.md).

**Definition of done — demonstrations.** Each is "I can do X and observe Y":
- *I can* type a known product **name** fragment *and observe* the matching seeded product(s) appear in results.
- *I can* type a known **brand** name *and observe* that brand's seeded products appear.
- *I can* type a query with no matches *and observe* the no-results state, then *I can* clear the input *and observe* the browse grid return.

**Next session opens with.** Users can find a specific product — next we let them open it.

---

## ✅ Session 5 — Product detail view + clean evaluation *(Features 3 & 4)* *(complete)*

**What we're building.** Client routing (`react-router`) so a card → `/product/:slug` — the first second route, hence routing lands here. The detail page: product header (name, brand, category, image, price) and the **clean evaluation panel** — the stored `clean_score`, the safety verdict, an ordered ingredient breakdown from `product_ingredients` (by `position` = prominence) with each ingredient's `concern_level` / `concern_reason`, the `certifications` held, and the reasoning. Loading + not-found states. (Per the *Clean standard (V1 definition)* in [project-context.md](project-context.md) §7, V1 **displays and explains** the stored `clean_score`; live recomputation is out of scope.)

**Context Claude Code needs.** [database-schema.md](database-schema.md) (`product_ingredients.position`, `ingredients.concern_*`, `certifications`), `getProductBySlug`, [component-spec.md](component-spec.md), [design.md](design.md), [project-context.md](project-context.md) §7.

**Definition of done — demonstrations.** Each is "I can do X and observe Y":
- *I can* click any product card *and observe* its detail page open at a shareable `/product/:slug` URL — and *I can* paste that URL into a fresh tab *and observe* the same product load directly.
- *I can* read the detail page *and observe* the stored `clean_score`, the safety verdict, an ingredient breakdown **ordered by prominence** with each ingredient's concern level/reason, and the certifications held — all matching the seeded data for that product.
- *I can* visit an unknown `/product/:slug` *and observe* a not-found state, and *I can* go browse → card → detail → browser Back *and observe* I land back on the browse grid.

**Next session opens with.** A full product page with its clean rating explained — ready to let users save products from browse, search, and detail.

---

## Session 6 — Save to a personal list *(Feature 5 — closes the loop)* ← next

**What we're building.** Wire the currently no-op `onAddToCart` to insert/remove `cart_items` for the anonymous user (RLS-scoped). A saved-list view, `NavBar` `cartCount` reflecting the real count, a saved/unsaved toggle on cards and the detail page, and persistence verified across reloads. Instrument the V1 proxy metric (detail-view → save) noted in [feature-plan.md](feature-plan.md).

**Context Claude Code needs.** [database-schema.md](database-schema.md) (`cart_items`), [src/components/ProductCard.tsx](../src/components/ProductCard.tsx) (`onAddToCart`), [src/components/NavBar.tsx](../src/components/NavBar.tsx) (`cartCount`), the catalog/cart module, [feature-plan.md](feature-plan.md).

**Definition of done — demonstrations.** Each is "I can do X and observe Y":
- *I can* save a product from a card **or** from its detail page *and observe* the nav count increment and the item appear in the saved-list view (and a new `cart_items` row in the Supabase Table Editor).
- *I can* do a **full page reload** *and observe* the saved list still intact — proving server-side persistence per anonymous user, not local component state.
- *I can* remove a saved item *and observe* it disappear from the saved list, the nav count, and the `cart_items` table.

**Next session opens with.** V1 is feature-complete — all five features live on the seeded catalog. Opens into the final polish & demo-readiness pass.

---

## Session 7 — Polish, states & demo readiness *(buffer / hardening)*

**What we're building.** A QA pass against the demo: consistent loading/empty/error/not-found states, keyboard + focus + contrast accessibility check on the new screens, responsive check, and a full demo dry-run of the core path (browse/search → detail with clean evaluation → save → reload). Reconcile [project-context.md](project-context.md) §5 metrics to the browse-first North Star proxy if not already done.

**Context Claude Code needs.** [design.md](design.md), [component-spec.md](component-spec.md), all V1 pages, [project-context.md](project-context.md) §5.

**Definition of done — demonstrations.** Each is "I can do X and observe Y":
- *I can* run the full core path as a fresh anonymous user — browse/search → detail with clean evaluation → save → reload — *and observe* it complete end to end with no console errors.
- *I can* visit every V1 screen and trigger each state (loading, empty, error, not-found) *and observe* it render consistently against the design system.
- *I can* run the demo script start to finish *and observe* it lands every beat without a dead end or placeholder.

**Next session opens with.** A shippable V1 demo. Next phase is V2 — the conversational agent ([feature-plan.md](feature-plan.md) Phase 2).

---

## Dependency order at a glance

```
1. DB & Supabase setup  ─┐
2. Data access layer    ─┴─►  (no UI on mock data past here)
3. Browse by category   ───►  reuses query layer
4. Search               ───►  reuses query layer
5. Detail + clean eval  ───►  adds routing
6. Save to list         ───►  closes the loop, real persistence
7. Polish & demo        ───►  shippable V1
```

| Session | Feature(s) | Demonstrable proof |
|---|---|---|
| 1 | — (foundation) | Anon user in Supabase Auth; seeded tables; fixture checks pass (counts, no orphans, full joined read) |
| 2 | — (bridge) | Real products logged from Supabase |
| 3 ✅ | Browse by category | Live grid, category filter, no mock array |
| 4 ✅ | Search | Name + brand search returns seeded matches |
| 5 ✅ | Detail view + Clean evaluation | `/product/:id` with ingredient breakdown |
| 6 | Save to a personal list | Saved items survive a reload |
| 7 | — (hardening) | Core path runs clean end to end |
