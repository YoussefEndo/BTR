-- ============================================================
-- 0014 — Fix anon order submission (42501 despite a valid INSERT
-- policy).
--
-- Root cause: the app inserts orders via PostgREST with a RETURNING
-- clause (.insert(...).select("id")). Postgres filters RETURNING rows
-- through the SELECT policy; anon has no SELECT policy on orders (by
-- design — customer PII), so every order submission failed with:
--   "new row violates row-level security policy for table \"orders\""
--
-- Fix: a SECURITY DEFINER function that:
--   * validates the customer fields server-side (defense in depth),
--   * inserts the order (status defaults to 'pending'),
--   * inserts the chosen options in the SAME transaction,
--   * returns the new order id — no orders row is exposed to anon.
--
-- This mirrors the existing replace_option_values() pattern (0004).
-- Idempotent: safe to run multiple times.
-- Run order: ... -> 0013 -> 0014
-- ============================================================

create or replace function public.create_order(
  p_product_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_customer_city text,
  p_customer_note text,
  p_options jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order_id uuid;
begin
  -- ---------- Defensive validation (server action validates too) ----------
  if p_customer_name is null or length(trim(p_customer_name)) < 2
     or length(trim(p_customer_name)) > 100 then
    raise exception 'invalid_customer_name';
  end if;

  if p_customer_phone is null or p_customer_phone !~ '^\+?[0-9\s.-]{8,20}$' then
    raise exception 'invalid_customer_phone';
  end if;

  if p_customer_city is null or length(trim(p_customer_city)) < 2
     or length(trim(p_customer_city)) > 100 then
    raise exception 'invalid_customer_city';
  end if;

  if p_customer_note is not null and length(p_customer_note) > 1000 then
    raise exception 'invalid_customer_note';
  end if;

  -- ---------- Product must exist and be active ----------
  if not exists (
    select 1 from public.products p
    where p.id = p_product_id and p.is_active
  ) then
    raise exception 'product_not_found';
  end if;

  -- ---------- Insert the order (status defaults to 'pending') ----------
  insert into public.orders
    (product_id, customer_name, customer_phone, customer_city, customer_note)
  values (
    p_product_id,
    trim(p_customer_name),
    trim(p_customer_phone),
    trim(p_customer_city),
    nullif(trim(coalesce(p_customer_note, '')), '')
  )
  returning id into v_order_id;

  -- ---------- Snapshot the chosen options (same transaction) ----------
  -- p_options: [{"option_name": "...", "option_value": "..."}]
  if p_options is not null and jsonb_typeof(p_options) = 'array' then
    insert into public.order_options (order_id, option_name, option_value)
    select
      v_order_id,
      left(trim(o ->> 'option_name'), 200),
      left(trim(o ->> 'option_value'), 500)
    from jsonb_array_elements(p_options) as o
    where coalesce(o ->> 'option_name', '') <> ''
      and coalesce(o ->> 'option_value', '') <> '';
  end if;

  return v_order_id;
end;
$$;

revoke all on function public.create_order(uuid, text, text, text, text, jsonb) from public;
grant execute on function public.create_order(uuid, text, text, text, text, jsonb)
  to anon, authenticated;
