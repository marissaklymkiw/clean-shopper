-- Add brands as a first-class catalog entity (was a free-text column on products).

create table brands (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  website     text,
  description text,
  created_at  timestamptz not null default now()
);

-- Shared catalog: public read, no client writes (same as categories/ingredients).
alter table brands enable row level security;
create policy "catalog read" on brands for select using (true);

-- Products now reference a brand row instead of holding the name as text.
alter table products add column brand_id uuid references brands(id) on delete set null;
create index products_brand_id_idx on products (brand_id);
alter table products drop column brand;   -- placeholder data only; re-seeded with brand_id

-- Preference: trusted brands reference the catalog when known.
-- Keep the free-text `name` as a fallback for brands not yet catalogued
-- (mirrors how avoided_ingredients references ingredients).
alter table trusted_brands add column brand_id uuid references brands(id) on delete set null;
