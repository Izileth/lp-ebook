-- supabase/migrations/0014_add_update_product_function.sql

-- Function to update a product and its images in a single transaction
CREATE OR REPLACE FUNCTION update_product_with_images(
  id BIGINT,
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
RETURNS VOID AS $$
BEGIN
  -- Update the product
  UPDATE products
  SET 
    name = update_product_with_images.name,
    description = update_product_with_images.description,
    price = update_product_with_images.price,
    category = update_product_with_images.category,
    badge = update_product_with_images.badge,
    pages = update_product_with_images.pages,
    slug = update_product_with_images.slug,
    discount_price = update_product_with_images.discount_price,
    language = update_product_with_images.language,
    rating = update_product_with_images.rating,
    checkout_url = update_product_with_images.checkout_url,
    access_url = update_product_with_images.access_url,
    share_url = update_product_with_images.share_url
  WHERE products.id = update_product_with_images.id;

  -- Delete old images
  DELETE FROM product_images WHERE product_id = update_product_with_images.id;

  -- Insert new images
  IF array_length(image_urls, 1) > 0 THEN
    FOR i IN 1..array_length(image_urls, 1) LOOP
      INSERT INTO product_images (product_id, image_url)
      VALUES (update_product_with_images.id, image_urls[i]);
    END LOOP;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
