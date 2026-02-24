-- Create the products table
CREATE TABLE products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a table to store admin user IDs
CREATE TABLE admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id)
);

-- Create a function to check if the current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security for the products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the products table
-- 1. Admins can do anything
CREATE POLICY "Admins can manage products"
ON products
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- 2. Authenticated users can view products
CREATE POLICY "Authenticated users can view products"
ON products
FOR SELECT
TO authenticated
USING (true);

-- 3. Anonymous users can view products
CREATE POLICY "Anonymous users can view products"
ON products
FOR SELECT
TO anon
USING (true);
