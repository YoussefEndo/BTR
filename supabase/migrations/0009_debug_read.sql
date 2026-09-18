-- Expose the debug introspection rows (RLS is auto-enabled by Supabase).
drop policy if exists "public read debug" on public._debug_introspection;
create policy "public read debug"
  on public._debug_introspection
  for select
  to anon, authenticated
  using (true);

notify pgrst, 'reload schema';
