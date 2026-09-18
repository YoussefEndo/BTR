-- Reload PostgREST schema cache so _debug_introspection is exposed.
notify pgrst, 'reload schema';
