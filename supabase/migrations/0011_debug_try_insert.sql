-- ============================================================
-- TEMPORARY debug: attempt the orders insert AS the calling role
-- (security invoker) and return the exact error + context.
-- ============================================================

create or replace function public.debug_try_insert()
returns table (errstate text, errmsg text, ctx text, jwt_role text, eff_status text)
language plpgsql
security invoker
as $$
declare
  v_id uuid;
  v_ctx text;
begin
  insert into public.orders (product_id, customer_name, customer_phone, customer_city, status)
  values ('d0000000-0000-4000-8000-000000000001', 'Debug Func', '+212600000000', 'Casablanca', 'pending')
  returning id into v_id;

  delete from public.orders where id = v_id;
  return query select 'OK'::text, 'inserted and cleaned id ' || v_id::text, ''::text,
    coalesce(current_setting('request.jwt.claim.role', true), 'none')::text, 'pending'::text;
exception
  when others then
    get stacked diagnostics v_ctx = PG_EXCEPTION_CONTEXT;
    return query select SQLSTATE::text, SQLERRM::text, v_ctx::text,
      coalesce(current_setting('request.jwt.claim.role', true), 'none')::text, 'pending'::text;
end;
$$;

grant execute on function public.debug_try_insert() to anon, authenticated;
