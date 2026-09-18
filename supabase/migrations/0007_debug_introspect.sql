-- ============================================================
-- TEMPORARY debug introspection (removed after diagnosis).
-- Writes live RLS state into a public table readable via REST.
-- ============================================================

create table if not exists public._debug_introspection (
  id bigint generated always as identity primary key,
  section text not null,
  info text
);

delete from public._debug_introspection;

-- RLS flags
insert into public._debug_introspection (section, info)
select 'rls_flags', c.relname || ' rowsecurity=' || c.relrowsecurity || ' force=' || c.relforcerowsecurity
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname in ('orders', 'order_options');

-- Policies with full expressions
insert into public._debug_introspection (section, info)
select 'policy_' || tablename,
  policyname || ' | cmd=' || cmd || ' | roles=' || roles::text ||
  ' | using=' || coalesce(qual, 'NULL') || ' | with_check=' || coalesce(with_check, 'NULL')
from pg_policies
where schemaname = 'public' and tablename in ('orders', 'order_options');

-- Columns of orders
insert into public._debug_introspection (section, info)
select 'column_orders', column_name || ' ' || data_type || ' | default=' || coalesce(column_default, '-') || ' | nullable=' || is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'orders'
order by ordinal_position;

-- Grants on orders
insert into public._debug_introspection (section, info)
select 'grant_orders', grantee || ' ' || privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'orders';
