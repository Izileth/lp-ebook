-- supabase/migrations/0010_add_product_links_and_slug_trigger.sql

-- Add link columns to products table
ALTER TABLE products
ADD COLUMN checkout_url TEXT,
ADD COLUMN access_url TEXT,
ADD COLUMN share_url TEXT;

-- Create a function to slugify text
CREATE OR REPLACE FUNCTION slugify(t TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  -- Lowercase, replace special characters with hyphens, and trim
  slug := lower(unaccent(t));
  slug := regexp_replace(slug, '[^a-z0-9\-_]+', '-', 'gi');
  slug := regexp_replace(slug, '-+', '-', 'g');
  slug := trim(both '-' from slug);
  RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Note: unaccent requires the extension. Let's ensure it exists.
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Trigger function to auto-generate slug for products if not provided
CREATE OR REPLACE FUNCTION handle_product_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := slugify(NEW.name);
    
    -- Ensure uniqueness by appending a short hash if it already exists
    WHILE EXISTS (SELECT 1 FROM products WHERE slug = NEW.slug AND id != NEW.id) LOOP
      NEW.slug := NEW.slug || '-' || substring(md5(random()::text) from 1 for 4);
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for products
DROP TRIGGER IF EXISTS on_product_before_insert ON products;
CREATE TRIGGER on_product_before_insert
BEFORE INSERT OR UPDATE OF name, slug ON products
FOR EACH ROW
EXECUTE FUNCTION handle_product_slug();

-- Update the create_product_with_images function to handle the new links
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
  rating NUMERIC,
  checkout_url TEXT DEFAULT NULL,
  access_url TEXT DEFAULT NULL,
  share_url TEXT DEFAULT NULL
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
    rating,
    checkout_url,
    access_url,
    share_url
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
    rating,
    checkout_url,
    access_url,
    share_url
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
