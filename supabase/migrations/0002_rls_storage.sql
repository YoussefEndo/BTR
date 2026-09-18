-- ============================================================
-- Row Level Security
-- Public (anon): read active catalog, submit orders (validated).
-- Admin (authenticated): full management of catalog + orders.
-- Run order: 0001 -> 0002 -> 0003
-- ============================================================

-- ---------- Enable RLS ----------
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_options enable row level security;
alter table public.option_values enable row level security;
alter table public.orders enable row level security;
alter table public.order_options enable row level security;

-- ---------- CATEGORIES ----------
create policy "Public read active categories"
  on public.categories
  for select
  to anon, authenticated
  using (is_active = true);

create policy "Admin full categories"
  on public.categories
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------- PRODUCTS ----------
create policy "Public read active products"
  on public.products
  for select
  to anon, authenticated
  using (is_active = true);

create policy "Admin full products"
  on public.products
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------- PRODUCT IMAGES ----------
create policy "Public read product images"
  on public.product_images
  for select
  to anon, authenticated
  using (true);

create policy "Admin full product images"
  on public.product_images
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------- PRODUCT OPTIONS ----------
create policy "Public read product options"
  on public.product_options
  for select
  to anon, authenticated
  using (true);

create policy "Admin full product options"
  on public.product_options
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------- OPTION VALUES ----------
create policy "Public read option values"
  on public.option_values
  for select
  to anon, authenticated
  using (true);

create policy "Admin full option values"
  on public.option_values
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------- ORDERS ----------
-- Insert: anon can create an order, but only with sane, server-like values
-- (status is forced to 'pending' regardless of what the client sends).
create policy "Public insert pending orders"
  on public.orders
  for insert
  to anon, authenticated
  with check (status = 'pending');

create policy "Admin read all orders"
  on public.orders
  for select
  to authenticated
  using (true);

create policy "Admin update orders"
  on public.orders
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Admin delete orders"
  on public.orders
  for delete
  to authenticated
  using (true);

-- ---------- ORDER OPTIONS ----------
-- Anyone can read; but rows must belong to an order the writer can see/insert.
create policy "Public read order options"
  on public.order_options
  for select
  to anon, authenticated
  using (true);

create policy "Public insert order options for own orders"
  on public.order_options
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and o.status = 'pending'
        and o.created_at > now() - interval '1 hour'
    )
  );

create policy "Admin full order options"
  on public.order_options
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------- STORAGE: product-images bucket ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Public read of images
create policy "Public read product images bucket"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'product-images');

-- Authenticated admin can manage files
create policy "Admin manage product images bucket"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');
