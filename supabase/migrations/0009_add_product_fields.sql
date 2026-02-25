-- supabase/migrations/0009_add_product_fields.sql

-- Alter the products table to add new columns
ALTER TABLE products
ADD COLUMN slug TEXT UNIQUE,
ADD COLUMN discount_price NUMERIC(10, 2),
ADD COLUMN language TEXT,
ADD COLUMN rating NUMERIC(3, 2) DEFAULT 0;

-- Update the create_product_with_images function to handle the new fields
CREATE OR REPLACE FUNCTION create_product_with_images(
  name TEXT,
  description TEXT,
  price NUMERIC,
  category TEXT,
  badge TEXT,
  pages TEXT,
  image_urls TEXT[],
  slug TEXT,
  discount_price NUMERIC,
  language TEXT,
  rating NUMERIC
)
RETURNS BIGINT AS $$
DECLARE
  new_product_id BIGINT;
BEGIN
  -- Insert the product
  INSERT INTO products (
    name, 
    description, 
    price, 
    category, 
    badge, 
    pages, 
    slug, 
    discount_price, 
    language, 
    rating
  )
  VALUES (
    name, 
    description, 
    price, 
    category, 
    badge, 
    pages, 
    slug, 
    discount_price, 
    language, 
    rating
  )
  RETURNING id INTO new_product_id;

  -- Insert the images
  IF array_length(image_urls, 1) > 0 THEN
    FOR i IN 1..array_length(image_urls, 1) LOOP
      INSERT INTO product_images (product_id, image_url)
      VALUES (new_product_id, image_urls[i]);
    END LOOP;
  END IF;

  RETURN new_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
