-- ============================================================
-- Repair of RLS on public.orders / public.order_options.
-- Fixes: anon order submission failing with 42501 (RLS violation)
-- when the insert policy or the status default is missing on the
-- live database (e.g. partial manual application of 0002).
-- Idempotent: safe to run multiple times.
-- Run order: 0001 -> 0002 -> 0003 -> 0004 -> 0005 -> 0006
-- ============================================================

-- Make sure the anonymous default status exists (with check needs it).
alter table public.orders alter column status set default 'pending';

-- ---------- ORDERS ----------
drop policy if exists "Public insert pending orders" on public.orders;
create policy "Public insert pending orders"
  on public.orders
  for insert
  to anon, authenticated
  with check (status = 'pending');

drop policy if exists "Admin read all orders" on public.orders;
create policy "Admin read all orders"
  on public.orders
  for select
  to authenticated
  using (true);

drop policy if exists "Admin update orders" on public.orders;
create policy "Admin update orders"
  on public.orders
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admin delete orders" on public.orders;
create policy "Admin delete orders"
  on public.orders
  for delete
  to authenticated
  using (true);

-- ---------- ORDER OPTIONS ----------
drop policy if exists "Public read order options" on public.order_options;
create policy "Public read order options"
  on public.order_options
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public insert order options for own orders" on public.order_options;
create policy "Public insert order options for own orders"
  on public.order_options
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and o.status = 'pending'
    )
  );
