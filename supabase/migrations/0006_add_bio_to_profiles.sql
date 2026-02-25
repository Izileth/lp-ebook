-- supabase/migrations/0006_add_bio_to_profiles.sql

-- Add bio field to profiles table
ALTER TABLE public.profiles
ADD COLUMN bio TEXT;
