-- supabase/migrations/0019_fix_create_product_function.sql

-- Update the create_product_with_images function to include missing link fields and bonuses
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
  share_url TEXT DEFAULT NULL,
  bonuses JSONB DEFAULT '[]'::JSONB
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
    share_url,
    bonuses
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
    share_url,
    bonuses
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
