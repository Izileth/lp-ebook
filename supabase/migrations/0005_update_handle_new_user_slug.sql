-- supabase/migrations/0005_update_handle_new_user_slug.sql

-- Update the handle_new_user function to use NEW.id::text for unique slug generation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, slug)
  VALUES (NEW.id, NEW.email, NEW.email, NEW.id::text); -- Use NEW.id::text as initial slug
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
