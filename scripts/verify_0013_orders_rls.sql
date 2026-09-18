-- ============================================================
-- Verification for migration 0013 (scripts/, NOT a migration).
--
-- Exercises the anon path exactly as the app's server action does:
-- `set local role anon` runs the statements under the anon role, so
-- the real RLS policies are evaluated. Outcomes are stored in session
-- GUCs (app.t*) and printed at the end. Every test row is cleaned up.
-- Run: npx supabase db query --linked -f scripts/verify_0013_orders_rls.sql
-- ============================================================

-- Defensive pre-cleanup in case a previous run was interrupted.
delete from public.order_options where order_id = 'aaaaaaaa-0000-4000-8000-000000000001';
delete from public.orders where id = 'aaaaaaaa-0000-4000-8000-000000000001' or customer_name like 'RLS-TEST%';

-- ---------- T1: anon CAN insert a pending order (core flow) ----------
do $$
declare v_out text;
begin
  begin
    set local role anon;
    insert into public.orders (id, product_id, customer_name, customer_phone, customer_city, customer_note, status)
    values ('aaaaaaaa-0000-4000-8000-000000000001',
            'd0000000-0000-4000-8000-000000000001',  -- Meuble TV flottant en noyer (seed 0005)
            'RLS-TEST T1', '+212600000001', 'Casablanca', 'verification 0013', 'pending');
    v_out := 'PASS — anon pending insert succeeded';
  exception when others then
    v_out := 'FAIL — SQLSTATE ' || SQLSTATE || ': ' || SQLERRM;
  end;
  perform set_config('app.t1', v_out, false);
end $$;

-- ---------- T2: anon CANNOT insert a non-pending order ----------
do $$
declare v_out text;
begin
  begin
    set local role anon;
    insert into public.orders (product_id, customer_name, customer_phone, customer_city, status)
    values ('d0000000-0000-4000-8000-000000000001',
            'RLS-TEST T2', '+212600000002', 'Casablanca', 'contacted');
    v_out := 'FAIL — non-pending insert unexpectedly succeeded (RLS hole!)';
  exception when others then
    v_out := 'PASS — rejected with SQLSTATE ' || SQLSTATE || ': ' || SQLERRM;
  end;
  perform set_config('app.t2', v_out, false);
end $$;

-- ---------- T3: anon CAN insert order options for its pending order ----------
-- Validates the security definer helper (the anon-subquery bug fix).
do $$
declare v_out text;
begin
  begin
    set local role anon;
    insert into public.order_options (order_id, option_name, option_value)
    values ('aaaaaaaa-0000-4000-8000-000000000001', 'Largeur (cm)', '180');
    v_out := 'PASS — anon inserted an order option for its pending order';
  exception when others then
    v_out := 'FAIL — SQLSTATE ' || SQLSTATE || ': ' || SQLERRM;
  end;
  perform set_config('app.t3', v_out, false);
end $$;

-- ---------- T4: anon CANNOT attach options to a foreign/nonexistent order ----------
do $$
declare v_out text;
begin
  begin
    set local role anon;
    insert into public.order_options (order_id, option_name, option_value)
    values ('bbbbbbbb-0000-4000-8000-000000000099', 'Hack', 'x');
    v_out := 'FAIL — orphan option insert unexpectedly succeeded';
  exception when others then
    v_out := 'PASS — rejected with SQLSTATE ' || SQLSTATE || ': ' || SQLERRM;
  end;
  perform set_config('app.t4', v_out, false);
end $$;

-- ---------- T5: anon CANNOT read orders ----------
do $$
declare v_out text; v_count bigint;
begin
  begin
    set local role anon;
    select count(*) into v_count from public.orders;
    v_out := case when v_count = 0
              then 'PASS — anon sees 0 orders'
              else 'FAIL — anon sees ' || v_count || ' orders' end;
  exception when others then
    v_out := 'PASS (rejected outright) — SQLSTATE ' || SQLSTATE || ': ' || SQLERRM;
  end;
  perform set_config('app.t5', v_out, false);
end $$;

-- ---------- Cleanup: remove every test row ----------
delete from public.order_options where order_id = 'aaaaaaaa-0000-4000-8000-000000000001';
delete from public.orders
where id = 'aaaaaaaa-0000-4000-8000-000000000001'
   or customer_name like 'RLS-TEST%';

-- ---------- Single consolidated report ----------
select jsonb_pretty(jsonb_build_object(
  'behavioral', jsonb_build_object(
    't1_anon_pending_insert',     current_setting('app.t1', true),
    't2_nonpending_blocked',      current_setting('app.t2', true),
    't3_order_options_insert',    current_setting('app.t3', true),
    't4_orphan_options_blocked',  current_setting('app.t4', true),
    't5_anon_cannot_read_orders', current_setting('app.t5', true)
  ),
  'debug_artifacts', jsonb_build_object(
    'debug_table_gone',         to_regclass('public._debug_introspection')              is null,
    'debug_whoami_gone',        to_regprocedure('public.debug_whoami()')                is null,
    'debug_try_insert_gone',    to_regprocedure('public.debug_try_insert()')            is null,
    'helper_function_present',  to_regprocedure('public.is_recent_pending_order(uuid)') is not null
  ),
  'rls_enabled', (
    select jsonb_object_agg(relname, relrowsecurity)
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and relname in ('orders', 'order_options')
  ),
  'orders_policies', (
    select coalesce(jsonb_agg(jsonb_build_object(
      'policy', policyname, 'cmd', cmd, 'roles', roles::text, 'with_check', with_check)), '[]')
    from pg_policies
    where schemaname = 'public' and tablename = 'orders'
  ),
  'order_options_policies', (
    select coalesce(jsonb_agg(jsonb_build_object(
      'policy', policyname, 'cmd', cmd, 'roles', roles::text, 'with_check', with_check)), '[]')
    from pg_policies
    where schemaname = 'public' and tablename = 'order_options'
  ),
  'cleanup', jsonb_build_object(
    'leftover_test_orders_must_be_0', (select count(*) from public.orders where customer_name like 'RLS-TEST%'),
    'total_orders_in_table',          (select count(*) from public.orders)
  )
)) as report;
