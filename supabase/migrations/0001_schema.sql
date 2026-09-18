-- ============================================================
-- Schema: tables, indexes, triggers
-- Project: BTR Immobilier Deco — custom furniture quote app
-- Run order: 0001 -> 0002 -> 0003
-- ============================================================

-- ---------- CATEGORIES ----------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- PRODUCTS ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text not null default '',
  main_image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- PRODUCT IMAGES (gallery) ----------
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- PRODUCT OPTIONS (dynamic customization form) ----------
-- type: 'text' | 'number' | 'select' | 'textarea'
create table if not exists public.product_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  name text not null,
  type text not null default 'text'
    check (type in ('text', 'number', 'select', 'textarea')),
  is_required boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- OPTION VALUES (choices for select options) ----------
create table if not exists public.option_values (
  id uuid primary key default gen_random_uuid(),
  option_id uuid not null references public.product_options (id) on delete cascade,
  value text not null,
  sort_order integer not null default 0
);

-- ---------- ORDERS (quote requests) ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete restrict,
  customer_name text not null,
  customer_phone text not null,
  customer_city text not null,
  customer_note text,
  status text not null default 'pending'
    check (status in ('pending', 'contacted', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- ---------- ORDER OPTIONS (snapshot of chosen customization) ----------
create table if not exists public.order_options (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  option_name text not null,
  option_value text not null
);

-- ---------- INDEXES ----------
create index if not exists idx_products_category_id on public.products (category_id);
create index if not exists idx_products_is_active on public.products (is_active);
create index if not exists idx_product_images_product_id on public.product_images (product_id);
create index if not exists idx_product_options_product_id on public.product_options (product_id);
create index if not exists idx_option_values_option_id on public.option_values (option_id);
create index if not exists idx_orders_product_id on public.orders (product_id);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_order_options_order_id on public.order_options (order_id);

-- ---------- updated_at trigger for products ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
  before update on public.products
  for each row
  execute function public.set_updated_at();
