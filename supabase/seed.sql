-- Clean Shopper — seed data (PLACEHOLDER)
-- 25 products with invented brands, realistic ingredients/scores, until the
-- real product API is wired in. Safe to re-run: every insert is guarded with
-- ON CONFLICT DO NOTHING against a natural key (slug / name / barcode).
--
-- Run after the schema migration, via the Supabase SQL Editor.

-- ─── Categories: top level ────────────────────────────────────────────────
insert into categories (slug, name, sort_order) values
  ('cleaning',      'Cleaning',      1),
  ('personal-care', 'Personal Care', 2),
  ('pantry',        'Pantry',        3)
on conflict (slug) do nothing;

-- ─── Categories: subcategories (linked to parent by slug) ──────────────────
insert into categories (slug, name, parent_id, sort_order)
select v.slug, v.name, p.id, v.sort_order
from (values
  ('dish-soap',           'Dish Soap',           'cleaning',      1),
  ('all-purpose-cleaner', 'All-Purpose Cleaner', 'cleaning',      2),
  ('laundry-detergent',   'Laundry Detergent',   'cleaning',      3),
  ('hand-soap',           'Hand Soap',           'cleaning',      4),
  ('shampoo',             'Shampoo',             'personal-care', 1),
  ('conditioner',         'Conditioner',         'personal-care', 2),
  ('body-wash',           'Body Wash',           'personal-care', 3),
  ('deodorant',           'Deodorant',           'personal-care', 4),
  ('toothpaste',          'Toothpaste',          'personal-care', 5),
  ('lotion',              'Lotion',              'personal-care', 6),
  ('sunscreen',           'Sunscreen',           'personal-care', 7),
  ('snacks',              'Snacks',              'pantry',        1),
  ('cooking-oil',         'Cooking Oil',         'pantry',        2),
  ('pasta-sauce',         'Pasta Sauce',         'pantry',        3),
  ('nut-butter',          'Nut Butter',          'pantry',        4)
) as v(slug, name, parent_slug, sort_order)
join categories p on p.slug = v.parent_slug
on conflict (slug) do nothing;

-- ─── Certifications ────────────────────────────────────────────────────────
insert into certifications (slug, name, issuing_body, description) values
  ('ewg-verified',    'EWG Verified',             'Environmental Working Group', 'Meets EWG''s strictest standards for ingredient safety and transparency.'),
  ('usda-organic',    'USDA Organic',             'US Department of Agriculture', 'Produced without synthetic pesticides, fertilizers, or GMOs.'),
  ('b-corp',          'Certified B Corporation',  'B Lab',                        'Meets high standards of social and environmental performance.'),
  ('leaping-bunny',   'Leaping Bunny',            'Cruelty Free International',   'Certified free of animal testing.'),
  ('non-gmo-project', 'Non-GMO Project Verified', 'Non-GMO Project',             'Verified to avoid genetically modified organisms.'),
  ('fair-trade',      'Fair Trade Certified',     'Fair Trade USA',              'Supports fair wages and safe working conditions.')
on conflict (slug) do nothing;

-- ─── Ingredients (shared catalog with safety assessment) ───────────────────
insert into ingredients (name, concern_level, concern_reason, aliases) values
  ('Water',                   'none',    null,                                                                  '{Aqua}'),
  ('Aloe Vera',               'none',    null,                                                                  '{"Aloe Barbadensis Leaf Juice"}'),
  ('Coconut Oil',             'none',    null,                                                                  '{"Cocos Nucifera Oil"}'),
  ('Shea Butter',             'none',    null,                                                                  '{"Butyrospermum Parkii"}'),
  ('Citric Acid',             'none',    null,                                                                  '{}'),
  ('Baking Soda',             'none',    null,                                                                  '{"Sodium Bicarbonate"}'),
  ('Glycerin',                'none',    null,                                                                  '{"Vegetable Glycerin"}'),
  ('Castile Soap',            'none',    null,                                                                  '{}'),
  ('Essential Oil Blend',     'none',    null,                                                                  '{}'),
  ('Organic Oats',            'none',    null,                                                                  '{"Avena Sativa"}'),
  ('Sea Salt',                'none',    null,                                                                  '{}'),
  ('Olive Oil',               'none',    null,                                                                  '{"Olea Europaea"}'),
  ('Organic Tomatoes',        'none',    null,                                                                  '{Tomatoes}'),
  ('Garlic',                  'none',    null,                                                                  '{}'),
  ('Almonds',                 'none',    null,                                                                  '{}'),
  ('Sodium Laureth Sulfate',  'caution', 'Milder than SLS but can be contaminated with 1,4-dioxane.',           '{SLES}'),
  ('Cocamidopropyl Betaine',  'caution', 'Possible skin irritant or allergen for sensitive users.',             '{}'),
  ('Phenoxyethanol',          'caution', 'Preservative that can irritate skin at higher concentrations.',       '{}'),
  ('Fragrance (Parfum)',      'caution', 'Undisclosed mixture; common allergen and may conceal phthalates.',    '{Parfum,Fragrance}'),
  ('Palm Oil',                'caution', 'Linked to deforestation and habitat loss when not sustainably sourced.', '{}'),
  ('Titanium Dioxide',        'caution', 'Safe topically, but inhaling the loose powder is a concern.',         '{}'),
  ('Enriched Wheat Flour',    'caution', 'Refined flour stripped of fiber and most nutrients.',                 '{}'),
  ('Parabens',                'avoid',   'Endocrine disruptor that can mimic estrogen.',                        '{Methylparaben,Propylparaben}'),
  ('Sodium Lauryl Sulfate',   'avoid',   'Harsh surfactant; common skin and eye irritant.',                    '{SLS}'),
  ('Triclosan',               'avoid',   'Antibacterial linked to hormone disruption and resistance.',          '{}'),
  ('Phthalates',              'avoid',   'Endocrine disruptor often hidden inside "fragrance".',                '{}'),
  ('Formaldehyde',            'avoid',   'Known human carcinogen.',                                             '{}'),
  ('Synthetic Dyes',          'avoid',   'Petroleum-based dyes linked to hyperactivity in children.',           '{"Yellow 5","Red 40"}'),
  ('Oxybenzone',              'avoid',   'Hormone disruptor and harmful to coral reefs.',                       '{}'),
  ('High Fructose Corn Syrup','avoid',   'Added sugar linked to metabolic problems.',                           '{HFCS}'),
  ('Aspartame',               'avoid',   'Artificial sweetener with a contested safety profile.',               '{}'),
  ('Aluminum Compounds',      'avoid',   'Antiperspirant active with absorption concerns.',                     '{"Aluminum Zirconium"}')
on conflict (name) do nothing;

-- ─── Brands (first-class catalog) ──────────────────────────────────────────
insert into brands (slug, name) values
  ('verdant-home', 'Verdant Home'),
  ('brightleaf',   'BrightLeaf'),
  ('sparkleco',    'SparkleCo'),
  ('purewash',     'PureWash'),
  ('botanica',     'Botanica'),
  ('glosslab',     'GlossLab'),
  ('pureglow',     'PureGlow'),
  ('freshco',      'FreshCo'),
  ('smiletrue',    'SmileTrue'),
  ('sunkind',      'SunKind'),
  ('field-grain',  'Field & Grain'),
  ('snacktime',    'SnackTime'),
  ('cucina-verde', 'Cucina Verde'),
  ('nuthouse',     'NutHouse')
on conflict (slug) do nothing;

-- ─── Products (linked to category + brand by slug; barcode is the natural key)
-- Upsert so brand_id is backfilled even if an earlier seed already ran.
insert into products (name, brand_id, barcode, category_id, clean_score)
select v.name, b.id, v.barcode, c.id, v.clean_score
from (values
  ('Pure Citrus Dish Soap',        'verdant-home', 'SEED-0001', 'dish-soap',           88),
  ('Everyday Dish Liquid',         'brightleaf',   'SEED-0002', 'dish-soap',           62),
  ('All-Purpose Surface Spray',    'verdant-home', 'SEED-0003', 'all-purpose-cleaner', 90),
  ('Lemon Power Cleaner',          'sparkleco',    'SEED-0004', 'all-purpose-cleaner', 45),
  ('Plant-Based Laundry Detergent','purewash',     'SEED-0005', 'laundry-detergent',   84),
  ('Ultra Clean Laundry Pods',     'brightleaf',   'SEED-0006', 'laundry-detergent',   55),
  ('Gentle Hand Soap',             'botanica',     'SEED-0007', 'hand-soap',           86),
  ('Antibacterial Hand Soap',      'sparkleco',    'SEED-0008', 'hand-soap',           40),
  ('Nourishing Shampoo',           'botanica',     'SEED-0009', 'shampoo',             82),
  ('Daily Clarifying Shampoo',     'glosslab',     'SEED-0010', 'shampoo',             50),
  ('Hydrating Conditioner',        'botanica',     'SEED-0011', 'conditioner',         85),
  ('Coconut Body Wash',            'pureglow',     'SEED-0012', 'body-wash',           80),
  ('Refreshing Body Wash',         'glosslab',     'SEED-0013', 'body-wash',           48),
  ('Mineral Deodorant',            'pureglow',     'SEED-0014', 'deodorant',           83),
  ('Long-Lasting Deodorant',       'freshco',      'SEED-0015', 'deodorant',           42),
  ('Fluoride-Free Toothpaste',     'smiletrue',    'SEED-0016', 'toothpaste',          78),
  ('Whitening Toothpaste',         'smiletrue',    'SEED-0017', 'toothpaste',          58),
  ('Shea Body Lotion',             'pureglow',     'SEED-0018', 'lotion',              87),
  ('Mineral Sunscreen SPF 30',     'sunkind',      'SEED-0019', 'sunscreen',           81),
  ('Sport Sunscreen SPF 50',       'sunkind',      'SEED-0020', 'sunscreen',           44),
  ('Organic Oat Crackers',         'field-grain',  'SEED-0021', 'snacks',              88),
  ('Cheesy Snack Crackers',        'snacktime',    'SEED-0022', 'snacks',              46),
  ('Cold-Pressed Olive Oil',       'field-grain',  'SEED-0023', 'cooking-oil',         92),
  ('Organic Marinara Sauce',       'cucina-verde', 'SEED-0024', 'pasta-sauce',         85),
  ('Almond Butter',                'nuthouse',     'SEED-0025', 'nut-butter',          90)
) as v(name, brand_slug, barcode, cat_slug, clean_score)
join categories c on c.slug = v.cat_slug
join brands b on b.slug = v.brand_slug
on conflict (barcode) do update
  set brand_id    = excluded.brand_id,
      category_id = excluded.category_id,
      name        = excluded.name,
      clean_score = excluded.clean_score;

-- ─── Product ↔ Ingredient (position = label order = prominence) ────────────
insert into product_ingredients (product_id, ingredient_id, position)
select p.id, i.id, v.position
from (values
  ('SEED-0001','Water',1),('SEED-0001','Coconut Oil',2),('SEED-0001','Citric Acid',3),('SEED-0001','Essential Oil Blend',4),
  ('SEED-0002','Water',1),('SEED-0002','Sodium Laureth Sulfate',2),('SEED-0002','Cocamidopropyl Betaine',3),('SEED-0002','Fragrance (Parfum)',4),
  ('SEED-0003','Water',1),('SEED-0003','Citric Acid',2),('SEED-0003','Castile Soap',3),('SEED-0003','Essential Oil Blend',4),
  ('SEED-0004','Water',1),('SEED-0004','Fragrance (Parfum)',2),('SEED-0004','Synthetic Dyes',3),('SEED-0004','Triclosan',4),
  ('SEED-0005','Water',1),('SEED-0005','Coconut Oil',2),('SEED-0005','Baking Soda',3),('SEED-0005','Essential Oil Blend',4),
  ('SEED-0006','Water',1),('SEED-0006','Sodium Laureth Sulfate',2),('SEED-0006','Fragrance (Parfum)',3),('SEED-0006','Synthetic Dyes',4),
  ('SEED-0007','Water',1),('SEED-0007','Castile Soap',2),('SEED-0007','Glycerin',3),('SEED-0007','Aloe Vera',4),
  ('SEED-0008','Water',1),('SEED-0008','Triclosan',2),('SEED-0008','Fragrance (Parfum)',3),('SEED-0008','Sodium Lauryl Sulfate',4),
  ('SEED-0009','Water',1),('SEED-0009','Coconut Oil',2),('SEED-0009','Glycerin',3),('SEED-0009','Cocamidopropyl Betaine',4),
  ('SEED-0010','Water',1),('SEED-0010','Sodium Lauryl Sulfate',2),('SEED-0010','Fragrance (Parfum)',3),('SEED-0010','Parabens',4),
  ('SEED-0011','Water',1),('SEED-0011','Shea Butter',2),('SEED-0011','Aloe Vera',3),('SEED-0011','Glycerin',4),
  ('SEED-0012','Water',1),('SEED-0012','Coconut Oil',2),('SEED-0012','Glycerin',3),('SEED-0012','Cocamidopropyl Betaine',4),
  ('SEED-0013','Water',1),('SEED-0013','Sodium Laureth Sulfate',2),('SEED-0013','Fragrance (Parfum)',3),('SEED-0013','Parabens',4),
  ('SEED-0014','Baking Soda',1),('SEED-0014','Coconut Oil',2),('SEED-0014','Shea Butter',3),('SEED-0014','Essential Oil Blend',4),
  ('SEED-0015','Aluminum Compounds',1),('SEED-0015','Phthalates',2),('SEED-0015','Fragrance (Parfum)',3),
  ('SEED-0016','Baking Soda',1),('SEED-0016','Coconut Oil',2),('SEED-0016','Essential Oil Blend',3),('SEED-0016','Sea Salt',4),
  ('SEED-0017','Water',1),('SEED-0017','Sodium Lauryl Sulfate',2),('SEED-0017','Synthetic Dyes',3),('SEED-0017','Fragrance (Parfum)',4),
  ('SEED-0018','Water',1),('SEED-0018','Shea Butter',2),('SEED-0018','Aloe Vera',3),('SEED-0018','Glycerin',4),
  ('SEED-0019','Water',1),('SEED-0019','Titanium Dioxide',2),('SEED-0019','Shea Butter',3),('SEED-0019','Aloe Vera',4),
  ('SEED-0020','Water',1),('SEED-0020','Oxybenzone',2),('SEED-0020','Fragrance (Parfum)',3),('SEED-0020','Parabens',4),
  ('SEED-0021','Organic Oats',1),('SEED-0021','Olive Oil',2),('SEED-0021','Sea Salt',3),
  ('SEED-0022','Enriched Wheat Flour',1),('SEED-0022','High Fructose Corn Syrup',2),('SEED-0022','Synthetic Dyes',3),('SEED-0022','Palm Oil',4),
  ('SEED-0023','Olive Oil',1),
  ('SEED-0024','Organic Tomatoes',1),('SEED-0024','Olive Oil',2),('SEED-0024','Garlic',3),('SEED-0024','Sea Salt',4),
  ('SEED-0025','Almonds',1),('SEED-0025','Sea Salt',2)
) as v(barcode, ingredient_name, position)
join products p on p.barcode = v.barcode
join ingredients i on i.name = v.ingredient_name
on conflict do nothing;

-- ─── Product ↔ Certification ───────────────────────────────────────────────
insert into product_certifications (product_id, certification_id)
select p.id, c.id
from (values
  ('SEED-0001','ewg-verified'),('SEED-0001','leaping-bunny'),
  ('SEED-0003','ewg-verified'),('SEED-0003','b-corp'),
  ('SEED-0005','ewg-verified'),
  ('SEED-0007','leaping-bunny'),
  ('SEED-0009','leaping-bunny'),
  ('SEED-0011','ewg-verified'),('SEED-0011','leaping-bunny'),
  ('SEED-0014','leaping-bunny'),
  ('SEED-0018','ewg-verified'),('SEED-0018','leaping-bunny'),
  ('SEED-0019','ewg-verified'),
  ('SEED-0021','usda-organic'),('SEED-0021','non-gmo-project'),
  ('SEED-0023','usda-organic'),('SEED-0023','non-gmo-project'),
  ('SEED-0024','usda-organic'),('SEED-0024','non-gmo-project'),
  ('SEED-0025','non-gmo-project')
) as v(barcode, slug)
join products p on p.barcode = v.barcode
join certifications c on c.slug = v.slug
on conflict do nothing;
