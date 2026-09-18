-- ============================================================
-- 0013 — Remove temporary debug artifacts (0007-0012) and
-- restore the production RLS on public.orders / public.order_options.
--
-- Removes:
--   * policy "Debug insert always" on orders (anon, always true — 0012)
--   * functions debug_whoami() / debug_try_insert() granted to anon
--   * table public._debug_introspection + its public read policy
--
-- Repairs:
--   * Re-creates the orders policies idempotently (drop + create) so the
--     production set is deterministic regardless of manual edits made
--     while debugging.
--   * Fixes a latent anon bug in the order_options insert policy: its
--     EXISTS subquery reads public.orders, but anon has no SELECT on
--     orders, so the subquery always returned zero rows and every anon
--     order-options insert failed. The check now runs inside a
--     SECURITY DEFINER helper that verifies the order is pending and
--     recent without exposing orders rows to anon.
--
-- Idempotent: safe to run multiple times.
-- Run order: 0001 -> ... -> 0012 -> 0013
-- ============================================================

-- ---------- 1. Remove debug artifacts ----------

-- Always-true anon INSERT policy added while diagnosing 42501.
drop policy if exists "Debug insert always" on public.orders;

-- Debug helpers (0010, 0011) and their anon grants.
drop function if exists public.debug_whoami();
drop function if exists public.debug_try_insert();

-- Debug table + policy (0007, 0009) and any stale REST cache entry.
drop table if exists public._debug_introspection;
notify pgrst, 'reload schema';

-- ---------- 2. Security definer helper for order options ----------

-- Returns true only when the order exists, is still pending and was
-- created less than an hour ago (same rule as migration 0002). Runs as
-- the owner with search_path pinned so the subquery can see orders
-- rows regardless of the caller's role — anon keeps zero read access
-- to public.orders itself.
create or replace function public.is_recent_pending_order(p_order_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.orders o
    where o.id = p_order_id
      and o.status = 'pending'
      and o.created_at > now() - interval '1 hour'
  );
$$;

revoke all on function public.is_recent_pending_order(uuid) from public;
grant execute on function public.is_recent_pending_order(uuid) to anon, authenticated;

-- ---------- 3. Orders policies (deterministic production set) ----------

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

-- ---------- 4. Order options policies ----------

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
  with check (public.is_recent_pending_order(order_id));

drop policy if exists "Admin full order options" on public.order_options;
create policy "Admin full order options"
  on public.order_options
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------- 5. Reassert the anon default status (defensive) ----------
alter table public.orders alter column status set default 'pending';
