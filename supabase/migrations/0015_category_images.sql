-- ============================================================
-- 0015 — Category images
--
-- Every active category had image_url = NULL, so the homepage
-- category grid rendered flat dark placeholders. Seed curated,
-- verified (HTTP 200) Unsplash photos, one per category.
--
-- These are defaults only: admins can replace them at
-- /admin/categories (image upload, same Storage bucket as
-- product images).
-- ============================================================

update public.categories set image_url = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'
  where slug = 'tables' and image_url is null;

update public.categories set image_url = 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80'
  where slug = 'placards' and image_url is null;

update public.categories set image_url = 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80'
  where slug = 'meubles-tv' and image_url is null;

update public.categories set image_url = 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80'
  where slug = 'bureaux' and image_url is null;

update public.categories set image_url = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80'
  where slug = 'cuisine' and image_url is null;

update public.categories set image_url = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
  where slug = 'autres' and image_url is null;

update public.categories set image_url = 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=1200&q=80'
  where slug = 'meubles-a-chaussures' and image_url is null;

update public.categories set image_url = 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80'
  where slug = 'buffets-commodes' and image_url is null;
