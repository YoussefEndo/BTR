-- ============================================================
-- TEMPORARY debug introspection round 2 (removed after diagnosis).
-- ============================================================

-- Permissive flag + full policy rows
delete from public._debug_introspection where section like 'perm%' or section like 'trigger%' or section like 'constraint%' or section = 'whoami_marker';
insert into public._debug_introspection (section, info)
select 'permissive_' || tablename,
  policyname || ' permissive=' || permissive || ' roles=' || roles::text
from pg_policies
where schemaname = 'public' and tablename = 'orders';

-- Triggers on orders
insert into public._debug_introspection (section, info)
select 'trigger_orders', t.tgname || ' | enabled=' || case when t.tgenabled in ('O','o') then 'yes' else t.tgenabled::text end ||
  ' | func=' || p.proname
from pg_trigger t
join pg_class c on c.oid = t.tgrelid
join pg_namespace n on n.oid = c.relnamespace
join pg_proc p on p.oid = t.tgfoid
where n.nspname = 'public' and c.relname = 'orders' and not t.tgisinternal;

-- Constraints on orders
insert into public._debug_introspection (section, info)
select 'constraint_orders', con.conname || ' | type=' || con.contype::text || ' | ' || coalesce(pg_get_constraintdef(con.oid), '')
from pg_constraint con
join pg_class c on c.oid = con.conrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname = 'orders';

-- Who does the anon REST request run as?
create or replace function public.debug_whoami()
returns table (usr text, ses text, is_authed boolean)
language sql stable
as $$
  select current_user::text, session_user::text, (current_user = 'authenticated');
$$;
grant execute on function public.debug_whoami() to anon, authenticated;
