-- Clean Shopper — initial database schema
-- Target: Supabase (Postgres + RLS + anonymous auth)
--
-- Design notes:
--   * Shared catalog tables (categories, ingredients, products, certifications)
--     are public-read and normalized — one row per real-world thing.
--   * clean_score is OBJECTIVE (derived from a product's ingredients).
--     Personalization happens at query time by comparing a user's avoided
--     ingredients / required certifications against the product.
--   * User-owned tables are scoped to auth.uid() via RLS.
--   * No conversation history is stored — sessions hold metric timestamps only.

-- ─────────────────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────────────────
create type preference_strength as enum ('required', 'preferred'); -- hard rule vs nice-to-have

-- ═════════════════════════════════════════════════════════════════════════
-- SHARED CATALOG  (public read, admin/seed write)
-- ═════════════════════════════════════════════════════════════════════════

-- Categories — self-referencing hierarchy (category → subcategory → …)
create table categories (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid references categories(id) on delete cascade,  -- null = top level
  slug        text unique not null,          -- 'personal-care', 'shampoo'
  name        text not null,                 -- 'Personal Care', 'Shampoo'
  description text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index categories_parent_id_idx on categories (parent_id);

-- Ingredients — normalized, queryable, with a safety assessment
create table ingredients (
  id             uuid primary key default gen_random_uuid(),
  name           text unique not null,
  concern_level  text not null default 'none'
                   check (concern_level in ('none', 'caution', 'avoid')),
  concern_reason text,                        -- "artificial dye linked to hyperactivity"
  aliases        text[] not null default '{}',-- alternate names found on labels
  created_at     timestamptz not null default now()
);

-- Certifications — controlled vocabulary (EWG Verified, USDA Organic, B Corp, …)
create table certifications (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,          -- 'ewg-verified'
  name         text not null,                 -- 'EWG Verified'
  issuing_body text,
  description  text
);

-- Products — one shared catalog row per real-world product
create table products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  brand        text,
  barcode      text unique,                   -- UPC/EAN: product identity + dedup
  category_id  uuid references categories(id) on delete set null,
  image_url    text,
  retailer_url text,                          -- link-out (no checkout in scope)
  clean_score  integer check (clean_score between 0 and 100), -- derived/cached from ingredients
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index products_category_id_idx on products (category_id);

-- Product ↔ Ingredient junction. position = label order = prominence.
create table product_ingredients (
  product_id    uuid not null references products(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id) on delete cascade,
  position      integer not null,             -- 1 = first/most prominent on the label
  primary key (product_id, ingredient_id)
);
create index product_ingredients_ingredient_idx on product_ingredients (ingredient_id);

-- Product ↔ Certification junction.
create table product_certifications (
  product_id       uuid not null references products(id) on delete cascade,
  certification_id uuid not null references certifications(id) on delete cascade,
  primary key (product_id, certification_id)
);

-- ═════════════════════════════════════════════════════════════════════════
-- USER-OWNED  (RLS: each user sees only their own rows)
-- ═════════════════════════════════════════════════════════════════════════

-- Profiles — 1:1 with auth.users (anonymous or upgraded accounts)
create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Preferences: ingredients to avoid. FK to the catalog when known,
-- free-text name as a fallback for ingredients not yet catalogued.
create table avoided_ingredients (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete set null,
  name          text not null,                -- canonical or user-entered name
  strength      preference_strength not null default 'required',
  note          text,
  created_at    timestamptz not null default now()
);
-- case-insensitive uniqueness needs a unique INDEX (constraints can't hold expressions).
-- This index also serves user_id lookups via its leftmost column.
create unique index avoided_ingredients_user_name_idx
  on avoided_ingredients (user_id, lower(name));

-- Preferences: trusted brands.
create table trusted_brands (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  note       text,
  created_at timestamptz not null default now()
);
create unique index trusted_brands_user_name_idx
  on trusted_brands (user_id, lower(name));

-- Preferences: certifications that matter to the user.
create table preferred_certifications (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  certification_id uuid not null references certifications(id) on delete cascade,
  strength         preference_strength not null default 'preferred',
  created_at       timestamptz not null default now(),
  unique (user_id, certification_id)
);

-- Cart — persists across sessions. References the shared product catalog.
create table cart_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  quantity   integer not null default 1 check (quantity > 0),
  note       text,
  added_at   timestamptz not null default now(),
  unique (user_id, product_id)
);
create index cart_items_user_idx on cart_items (user_id);

-- Sessions — metric timestamps ONLY (no chat content is stored).
create table sessions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references auth.users(id) on delete cascade,
  started_at              timestamptz not null default now(),
  first_recommendation_at timestamptz,        -- → time-to-recommendation metric
  ended_at                timestamptz
);
create index sessions_user_idx on sessions (user_id);

-- Recommendations — powers the North Star (recommendation → cart action).
create table recommendations (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  session_id       uuid references sessions(id) on delete set null,
  product_id       uuid not null references products(id) on delete cascade,
  query            text,                       -- what the user asked
  position         integer,                    -- rank in the rec list
  reasoning        text,                       -- per-user, personalized explanation
  adheres_to_prefs boolean,                    -- → preference-adherence metric
  added_to_cart_at timestamptz,                -- null = not actioned (North Star)
  created_at       timestamptz not null default now()
);
create index recommendations_user_idx on recommendations (user_id);

-- Comparisons — the "help me decide" job.
create table comparisons (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  session_id        uuid references sessions(id) on delete set null,
  summary           text,                      -- Claude's side-by-side verdict
  chosen_product_id uuid references products(id) on delete set null,
  decided_at        timestamptz,               -- null = no decision (→ decision rate)
  created_at        timestamptz not null default now()
);
create index comparisons_user_idx on comparisons (user_id);

create table comparison_items (
  id            uuid primary key default gen_random_uuid(),
  comparison_id uuid not null references comparisons(id) on delete cascade,
  product_id    uuid not null references products(id) on delete cascade,
  position      integer,
  unique (comparison_id, product_id)
);

-- ═════════════════════════════════════════════════════════════════════════
-- Triggers: keep updated_at fresh; auto-create a profile per new auth user
-- ═════════════════════════════════════════════════════════════════════════
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on profiles
  for each row execute function set_updated_at();
create trigger products_updated_at before update on products
  for each row execute function set_updated_at();

create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ═════════════════════════════════════════════════════════════════════════
-- Row-Level Security
-- ═════════════════════════════════════════════════════════════════════════

-- Shared catalog: readable by everyone, no client writes.
alter table categories             enable row level security;
alter table ingredients            enable row level security;
alter table certifications         enable row level security;
alter table products               enable row level security;
alter table product_ingredients    enable row level security;
alter table product_certifications enable row level security;

create policy "catalog read" on categories             for select using (true);
create policy "catalog read" on ingredients            for select using (true);
create policy "catalog read" on certifications         for select using (true);
create policy "catalog read" on products               for select using (true);
create policy "catalog read" on product_ingredients    for select using (true);
create policy "catalog read" on product_certifications for select using (true);

-- User-owned: each user reads/writes only their own rows.
alter table profiles                 enable row level security;
alter table avoided_ingredients      enable row level security;
alter table trusted_brands           enable row level security;
alter table preferred_certifications enable row level security;
alter table cart_items               enable row level security;
alter table sessions                 enable row level security;
alter table recommendations          enable row level security;
alter table comparisons              enable row level security;
alter table comparison_items         enable row level security;

create policy "self" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "self" on avoided_ingredients
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "self" on trusted_brands
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "self" on preferred_certifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "self" on cart_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "self" on sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "self" on recommendations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "self" on comparisons
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- comparison_items has no user_id — scope it through its parent comparison.
create policy "self via parent" on comparison_items
  for all using (
    exists (select 1 from comparisons c
            where c.id = comparison_items.comparison_id and c.user_id = auth.uid())
  )
  with check (
    exists (select 1 from comparisons c
            where c.id = comparison_items.comparison_id and c.user_id = auth.uid())
  );
