-- ============================================================
-- 0016 — Serve category images locally
--
-- The Unsplash URLs seeded in 0015 made next/image's optimizer
-- fetch from images.unsplash.com at request time; that upstream
-- proved slow/unreliable (500/504 on /_next/image). The same
-- photos now live in public/categories/<slug>.jpg, so point
-- image_url at the local copies.
--
-- Admin uploads (Storage URLs) are untouched: only rows still
-- pointing at Unsplash are rewritten.
-- ============================================================

update public.categories set image_url = '/categories/tables.jpg'
  where slug = 'tables' and image_url like 'https://images.unsplash.com/%';

update public.categories set image_url = '/categories/placards.jpg'
  where slug = 'placards' and image_url like 'https://images.unsplash.com/%';

update public.categories set image_url = '/categories/meubles-tv.jpg'
  where slug = 'meubles-tv' and image_url like 'https://images.unsplash.com/%';

update public.categories set image_url = '/categories/bureaux.jpg'
  where slug = 'bureaux' and image_url like 'https://images.unsplash.com/%';

update public.categories set image_url = '/categories/cuisine.jpg'
  where slug = 'cuisine' and image_url like 'https://images.unsplash.com/%';

update public.categories set image_url = '/categories/autres.jpg'
  where slug = 'autres' and image_url like 'https://images.unsplash.com/%';

update public.categories set image_url = '/categories/meubles-a-chaussures.jpg'
  where slug = 'meubles-a-chaussures' and image_url like 'https://images.unsplash.com/%';

update public.categories set image_url = '/categories/buffets-commodes.jpg'
  where slug = 'buffets-commodes' and image_url like 'https://images.unsplash.com/%';
