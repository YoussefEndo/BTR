-- ============================================================
-- Seed data: 6 categories, 2-3 demo products each with images,
-- dynamic options and values. Demo data only — replace later.
-- Run order: 0001 -> 0002 -> 0003
-- ============================================================

-- ---------- CATEGORIES ----------
insert into public.categories (id, name, slug, description, is_active) values
  ('a0000000-0000-4000-8000-000000000001', 'Tables', 'tables', 'Tables sur mesure pour salle à manger, salon ou bureau.', true),
  ('a0000000-0000-4000-8000-000000000002', 'Placards', 'placards', 'Placards et dressings adaptés à vos espaces.', true),
  ('a0000000-0000-4000-8000-000000000003', 'Meubles TV', 'meubles-tv', 'Meubles TV modernes et fonctionnels.', true),
  ('a0000000-0000-4000-8000-000000000004', 'Bureaux', 'bureaux', 'Bureaux ergonomiques conçus pour votre espace.', true),
  ('a0000000-0000-4000-8000-000000000005', 'Cuisine', 'cuisine', 'Cuisines équipées sur mesure.', true),
  ('a0000000-0000-4000-8000-000000000006', 'Autres', 'autres', 'Autres meubles et aménagements personnalisés.', true)
on conflict (slug) do nothing;

-- ---------- PRODUCTS ----------
insert into public.products (id, category_id, name, slug, description, main_image_url, is_active) values
  -- Tables
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'Table à Manger Chêne', 'table-manger-chene', 'Table à manger en chêne massif, finition mate, dimensions personnalisables.', 'https://picsum.photos/seed/table1/800/600', true),
  ('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'Table Basse Moderne', 'table-basse-moderne', 'Table basse design avec plateau en bois naturel et piètement métallique.', 'https://picsum.photos/seed/table2/800/600', true),
  ('b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'Table Console Extensible', 'table-console-extensible', 'Console extensible idéale pour les petits espaces.', 'https://picsum.photos/seed/table3/800/600', true),
  -- Placards
  ('b0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000002', 'Placard Moderne', 'placard-moderne', 'Placard sur mesure avec portes coulissantes et aménagement intérieur complet.', 'https://picsum.photos/seed/placard1/800/600', true),
  ('b0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000002', 'Dressing Ouvert', 'dressing-ouvert', 'Dressing ouvert modulable avec étagères et tringles ajustables.', 'https://picsum.photos/seed/placard2/800/600', true),
  ('b0000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000002', 'Placard Classique', 'placard-classique', 'Placard classique à portes battantes, finition au choix.', 'https://picsum.photos/seed/placard3/800/600', true),
  -- Meubles TV
  ('b0000000-0000-4000-8000-000000000007', 'a0000000-0000-4000-8000-000000000003', 'Meuble TV Flottant', 'meuble-tv-flottant', 'Meuble TV suspendu avec rangements fermés et niche LED.', 'https://picsum.photos/seed/tv1/800/600', true),
  ('b0000000-0000-4000-8000-000000000008', 'a0000000-0000-4000-8000-000000000003', 'Meuble TV Bois & Métal', 'meuble-tv-bois-metal', 'Meuble TV au style industriel, structure métallique et plateau bois.', 'https://picsum.photos/seed/tv2/800/600', true),
  -- Bureaux
  ('b0000000-0000-4000-8000-000000000009', 'a0000000-0000-4000-8000-000000000004', 'Bureau Minimaliste', 'bureau-minimaliste', 'Bureau épuré avec passe-câbles intégré et rangement discret.', 'https://picsum.photos/seed/bureau1/800/600', true),
  ('b0000000-0000-4000-8000-000000000010', 'a0000000-0000-4000-8000-000000000004', 'Bureau d''Angle', 'bureau-angle', 'Bureau d''angle optimisé pour les coins de pièce.', 'https://picsum.photos/seed/bureau2/800/600', true),
  -- Cuisine
  ('b0000000-0000-4000-8000-000000000011', 'a0000000-0000-4000-8000-000000000005', 'Cuisine Linéaire', 'cuisine-lineaire', 'Cuisine linéaire sur mesure, façades laquées mat.', 'https://picsum.photos/seed/cuisine1/800/600', true),
  ('b0000000-0000-4000-8000-000000000012', 'a0000000-0000-4000-8000-000000000005', 'Îlot de Cuisine', 'ilot-cuisine', 'Îlot central avec plan de travail et rangements intégrés.', 'https://picsum.photos/seed/cuisine2/800/600', true),
  -- Autres
  ('b0000000-0000-4000-8000-000000000013', 'a0000000-0000-4000-8000-000000000006', 'Bibliothèque sur Mesure', 'bibliotheque-sur-mesure', 'Bibliothèque murale adaptée à vos dimensions.', 'https://picsum.photos/seed/autre1/800/600', true),
  ('b0000000-0000-4000-8000-000000000014', 'a0000000-0000-4000-8000-000000000006', 'Tête de Lit Design', 'tete-de-lit-design', 'Tête de lit rembourrée, tissu au choix.', 'https://picsum.photos/seed/autre2/800/600', true)
on conflict (slug) do nothing;

-- ---------- GALLERY IMAGES ----------
insert into public.product_images (product_id, image_url, sort_order) values
  ('b0000000-0000-4000-8000-000000000001', 'https://picsum.photos/seed/table1a/800/600', 1),
  ('b0000000-0000-4000-8000-000000000001', 'https://picsum.photos/seed/table1b/800/600', 2),
  ('b0000000-0000-4000-8000-000000000004', 'https://picsum.photos/seed/placard1a/800/600', 1),
  ('b0000000-0000-4000-8000-000000000004', 'https://picsum.photos/seed/placard1b/800/600', 2),
  ('b0000000-0000-4000-8000-000000000007', 'https://picsum.photos/seed/tv1a/800/600', 1),
  ('b0000000-0000-4000-8000-000000000009', 'https://picsum.photos/seed/bureau1a/800/600', 1),
  ('b0000000-0000-4000-8000-000000000011', 'https://picsum.photos/seed/cuisine1a/800/600', 1);

-- ============================================================
-- PRODUCT OPTIONS + VALUES
-- ============================================================

-- Table à Manger Chêne
insert into public.product_options (id, product_id, name, type, is_required, sort_order) values
  ('c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Longueur (cm)', 'number', true, 1),
  ('c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001', 'Largeur (cm)', 'number', true, 2),
  ('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001', 'Matière', 'select', true, 3),
  ('c0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000001', 'Couleur', 'select', true, 4);

insert into public.option_values (option_id, value, sort_order) values
  ('c0000000-0000-4000-8000-000000000003', 'Chêne massif', 1),
  ('c0000000-0000-4000-8000-000000000003', 'Noyer', 2),
  ('c0000000-0000-4000-8000-000000000003', 'Hêtre', 3),
  ('c0000000-0000-4000-8000-000000000004', 'Naturel', 1),
  ('c0000000-0000-4000-8000-000000000004', 'Blanc', 2),
  ('c0000000-0000-4000-8000-000000000004', 'Noyer foncé', 3);

-- Placard Moderne
insert into public.product_options (id, product_id, name, type, is_required, sort_order) values
  ('c0000000-0000-4000-8000-000000000011', 'b0000000-0000-4000-8000-000000000004', 'Largeur (cm)', 'number', true, 1),
  ('c0000000-0000-4000-8000-000000000012', 'b0000000-0000-4000-8000-000000000004', 'Hauteur (cm)', 'number', true, 2),
  ('c0000000-0000-4000-8000-000000000013', 'b0000000-0000-4000-8000-000000000004', 'Profondeur (cm)', 'number', true, 3),
  ('c0000000-0000-4000-8000-000000000014', 'b0000000-0000-4000-8000-000000000004', 'Couleur', 'select', true, 4),
  ('c0000000-0000-4000-8000-000000000015', 'b0000000-0000-4000-8000-000000000004', 'Nombre de portes', 'select', true, 5),
  ('c0000000-0000-4000-8000-000000000016', 'b0000000-0000-4000-8000-000000000004', 'Finition', 'select', true, 6);

insert into public.option_values (option_id, value, sort_order) values
  ('c0000000-0000-4000-8000-000000000014', 'Blanc', 1),
  ('c0000000-0000-4000-8000-000000000014', 'Noir', 2),
  ('c0000000-0000-4000-8000-000000000014', 'Chêne', 3),
  ('c0000000-0000-4000-8000-000000000015', '2', 1),
  ('c0000000-0000-4000-8000-000000000015', '3', 2),
  ('c0000000-0000-4000-8000-000000000015', '4', 3),
  ('c0000000-0000-4000-8000-000000000016', 'Mat', 1),
  ('c0000000-0000-4000-8000-000000000016', 'Brillant', 2);

-- Meuble TV Flottant
insert into public.product_options (id, product_id, name, type, is_required, sort_order) values
  ('c0000000-0000-4000-8000-000000000021', 'b0000000-0000-4000-8000-000000000007', 'Largeur (cm)', 'number', true, 1),
  ('c0000000-0000-4000-8000-000000000022', 'b0000000-0000-4000-8000-000000000007', 'Hauteur (cm)', 'number', true, 2),
  ('c0000000-0000-4000-8000-000000000023', 'b0000000-0000-4000-8000-000000000007', 'Nombre de tiroirs', 'select', true, 3),
  ('c0000000-0000-4000-8000-000000000024', 'b0000000-0000-4000-8000-000000000007', 'Couleur', 'select', true, 4);

insert into public.option_values (option_id, value, sort_order) values
  ('c0000000-0000-4000-8000-000000000023', '0', 1),
  ('c0000000-0000-4000-8000-000000000023', '2', 2),
  ('c0000000-0000-4000-8000-000000000023', '4', 3),
  ('c0000000-0000-4000-8000-000000000024', 'Blanc mat', 1),
  ('c0000000-0000-4000-8000-000000000024', 'Bois naturel', 2),
  ('c0000000-0000-4000-8000-000000000024', 'Anthracite', 3);

-- Cuisine Linéaire
insert into public.product_options (id, product_id, name, type, is_required, sort_order) values
  ('c0000000-0000-4000-8000-000000000031', 'b0000000-0000-4000-8000-000000000011', 'Longueur (cm)', 'number', true, 1),
  ('c0000000-0000-4000-8000-000000000032', 'b0000000-0000-4000-8000-000000000011', 'Hauteur (cm)', 'number', true, 2),
  ('c0000000-0000-4000-8000-000000000033', 'b0000000-0000-4000-8000-000000000011', 'Profondeur (cm)', 'number', true, 3),
  ('c0000000-0000-4000-8000-000000000034', 'b0000000-0000-4000-8000-000000000011', 'Couleur', 'select', true, 4),
  ('c0000000-0000-4000-8000-000000000035', 'b0000000-0000-4000-8000-000000000011', 'Finition', 'select', true, 5),
  ('c0000000-0000-4000-8000-000000000036', 'b0000000-0000-4000-8000-000000000011', 'Configuration', 'textarea', false, 6);

-- Bureau Minimaliste
insert into public.product_options (id, product_id, name, type, is_required, sort_order) values
  ('c0000000-0000-4000-8000-000000000041', 'b0000000-0000-4000-8000-000000000009', 'Largeur (cm)', 'number', true, 1),
  ('c0000000-0000-4000-8000-000000000042', 'b0000000-0000-4000-8000-000000000009', 'Profondeur (cm)', 'number', true, 2),
  ('c0000000-0000-4000-8000-000000000043', 'b0000000-0000-4000-8000-000000000009', 'Couleur', 'select', false, 3);

insert into public.option_values (option_id, value, sort_order) values
  ('c0000000-0000-4000-8000-000000000043', 'Chêne', 1),
  ('c0000000-0000-4000-8000-000000000043', 'Blanc', 2),
  ('c0000000-0000-4000-8000-000000000043', 'Noir', 3);
