-- Migration to fix the handle_new_user trigger
-- Uses $func$ to avoid conflict with the outer DO $$ block

DO $$
BEGIN
  -- Check if table exists to be safe
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN

      -- 1. Drop the old trigger to avoid conflicts
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

      -- 2. Create the robust function (Using $func$ delimiter)
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger
      LANGUAGE plpgsql
      SECURITY DEFINER SET search_path = public
      AS $func$
      BEGIN
        -- Insert the profile, but do NOT fail if it already exists or if data is missing
        INSERT INTO public.profiles (id, email)
        VALUES (new.id, new.email)
        ON CONFLICT (id) DO NOTHING;

        RETURN new;
      END;
      $func$;

      -- 3. Re-attach the trigger
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

  END IF;
END $$;