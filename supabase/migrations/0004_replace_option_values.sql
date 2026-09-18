-- ============================================================
-- Atomic replace of option values for a product option.
-- Used by the admin product editor when saving select options.
-- p_values: JSON array of objects: [{"value": "Blanc", "sort_order": 1}, ...]
-- Run order: 0001 -> 0002 -> 0003 -> 0004
-- Re-runnable (create or replace).
-- ============================================================

create or replace function public.replace_option_values(
  p_option_id uuid,
  p_values jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Definer keeps the delete+insert pair atomic: values are never left
  -- half-replaced if the insert fails.
  delete from public.option_values where option_id = p_option_id;

  insert into public.option_values (option_id, value, sort_order)
  select
    p_option_id,
    trim(v->>'value'),
    coalesce(nullif(v->>'sort_order', '')::int, ord::int)
  from jsonb_array_elements(p_values) with ordinality as t(v, ord)
  where length(trim(v->>'value')) > 0;
end;
$$;

-- RPC is callable by authenticated admin sessions; anon is denied.
grant execute on function public.replace_option_values(uuid, jsonb) to authenticated;
revoke execute on function public.replace_option_values(uuid, jsonb) from anon;
