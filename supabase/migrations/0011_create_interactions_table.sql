-- supabase/migrations/0011_create_interactions_table.sql

-- Create the interactions table
CREATE TABLE IF NOT EXISTS interactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  type TEXT NOT NULL, -- e.g., 'page_view', 'product_view', 'cta_click'
  target_id TEXT, -- e.g., product slug or id
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can insert interactions (even anonymous users)
CREATE POLICY "Anyone can insert interactions"
ON interactions FOR INSERT
WITH CHECK (true);

-- RLS Policy: Only admins can view interactions
CREATE POLICY "Admins can view interactions"
ON interactions FOR SELECT
USING (is_admin());

-- Function to get admin dashboard statistics
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Security check
Her

  SELECT jsonb_build_object(
    'users_count', (SELECT count(*) FROM profiles),
    'products_count', (SELECT count(*) FROM products),
    'admins_count', (SELECT count(*) FROM admin_users),
    'interactions_count', (SELECT count(*) FROM interactions)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
