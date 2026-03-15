-- supabase/migrations/0023_setup_articles_storage.sql

-- 1. Create a bucket for article images
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies for article-images

-- Allow public access to view images (SELECT)
CREATE POLICY "Public can view article images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'article-images' );

-- Allow admins to upload images (INSERT)
CREATE POLICY "Admins can upload article images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'article-images' 
  AND (SELECT is_admin())
);

-- Allow admins to update images (UPDATE)
CREATE POLICY "Admins can update article images"
ON storage.objects FOR UPDATE
WITH CHECK (
  bucket_id = 'article-images' 
  AND (SELECT is_admin())
);

-- Allow admins to delete images (DELETE)
CREATE POLICY "Admins can delete article images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'article-images' 
  AND (SELECT is_admin())
);

-- 3. Rich Text Preparation
-- The 'content' field in the 'articles' table (created in 0022) is already TEXT,
-- which is the standard for storing Markdown or HTML. 
-- To ensure full support for formatting (bold, italic, spacing, etc.),
-- we'll add a 'content_format' column to specify the type (e.g., 'markdown' or 'html').

ALTER TABLE articles
ADD COLUMN content_format TEXT DEFAULT 'markdown' CHECK (content_format IN ('markdown', 'html', 'json'));

-- If using a Block Editor (like Editor.js or TipTap), JSON might be preferred.
-- The TEXT type for 'content' handles large strings efficiently in PostgreSQL.
