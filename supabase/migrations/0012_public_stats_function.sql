-- supabase/migrations/0012_public_stats_function.sql

-- Function to get public statistics for Hero section
CREATE OR REPLACE FUNCTION get_public_stats()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'titles_count', (SELECT count(*) FROM products),
    'avg_rating', COALESCE((SELECT AVG(rating) FROM products WHERE rating > 0), 4.9),
    'readers_count', (SELECT count(*) FROM profiles) + 3000 -- Starting from 3k as in original stats
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
