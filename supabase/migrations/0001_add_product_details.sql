-- Alter the products table to add new columns from the Book type
ALTER TABLE products
ADD COLUMN category TEXT,
ADD COLUMN badge TEXT,
ADD COLUMN pages TEXT;

-- Remove the old single image_url column
ALTER TABLE products
DROP COLUMN image_url;

-- Create a table to store multiple images per product
CREATE TABLE product_images (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security for the product_images table
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the product_images table
-- 1. Admins can manage product images
CREATE POLICY "Admins can manage product images"
ON product_images
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- 2. All users can view product images
CREATE POLICY "All users can view product images"
ON product_images
FOR SELECT
USING (true);
