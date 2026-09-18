-- ============================================================
-- TEMPORARY debug round 3 (removed after diagnosis).
-- Decisive test: does an ALWAYS-TRUE insert policy work?
-- ============================================================

delete from public._debug_introspection where section like 'exp%';

-- GUC + literal evaluation
insert into public._debug_introspection (section, info)
select 'exp_guc', 'row_security=' || coalesce(current_setting('row_security', true), 'unset')
  || ' | is_superuser=' || current_setting('is_superuser', true);

-- Add a permissive always-true INSERT policy
drop policy if exists "Debug insert always" on public.orders;
create policy "Debug insert always"
  on public.orders
  for insert
  to anon
  with check (true);

-- Retry the same insert
do $$
declare
  v_id uuid;
begin
  insert into public.orders (product_id, customer_name, customer_phone, customer_city, status)
  values ('d0000000-0000-4000-8000-000000000001', 'Debug AlwaysTrue', '+212600000000', 'Casablanca', 'pending')
  returning id into v_id;
  insert into public._debug_introspection (section, info)
    values ('exp_result', 'INSERT OK with always-true policy, id=' || v_id::text);
  delete from public.orders where id = v_id;
exception
  when others then
    insert into public._debug_introspection (section, info)
      values ('exp_result', 'INSERT FAILED even with always-true: SQLSTATE=' || SQLSTATE || ' msg=' || SQLERRM);
end;
$$;
