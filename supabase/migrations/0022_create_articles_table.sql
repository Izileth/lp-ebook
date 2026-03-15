-- supabase/migrations/0022_create_articles_table.sql

-- 1. Create the articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  category TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add updated_at trigger
CREATE TRIGGER articles_updated_at_trigger
BEFORE UPDATE ON articles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 3. Slug handling for articles
CREATE OR REPLACE FUNCTION handle_article_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := slugify(NEW.title);
    
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM articles WHERE slug = NEW.slug AND id != NEW.id) LOOP
      NEW.slug := NEW.slug || '-' || substring(md5(random()::text) from 1 for 4);
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_article_before_insert
BEFORE INSERT OR UPDATE OF title, slug ON articles
FOR EACH ROW
EXECUTE FUNCTION handle_article_slug();

-- 4. Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Public can view published articles
CREATE POLICY "Anyone can view published articles"
ON articles FOR SELECT
USING (is_published = TRUE);

-- Admins can do everything
CREATE POLICY "Admins can manage articles"
ON articles FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- 6. Auxiliary Functions

-- Function to create an article (useful for complex logic or bypassing some RLS if needed, though here we use is_admin check)
CREATE OR REPLACE FUNCTION create_article(
  p_title TEXT,
  p_content TEXT,
  p_excerpt TEXT DEFAULT NULL,
  p_image_url TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_tags TEXT[] DEFAULT NULL,
  p_is_published BOOLEAN DEFAULT FALSE,
  p_author_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_article_id UUID;
BEGIN
  -- Security check: only admins can call this
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin only.';
  END IF;

  INSERT INTO articles (
    title,
    content,
    excerpt,
    image_url,
    category,
    tags,
    is_published,
    published_at,
    author_id
  )
  VALUES (
    p_title,
    p_content,
    p_excerpt,
    p_image_url,
    p_category,
    p_tags,
    p_is_published,
    CASE WHEN p_is_published THEN NOW() ELSE NULL END,
    COALESCE(p_author_id, auth.uid())
  )
  RETURNING id INTO v_article_id;

  RETURN v_article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update article (handles published_at logic)
CREATE OR REPLACE FUNCTION update_article(
  p_id UUID,
  p_title TEXT,
  p_content TEXT,
  p_excerpt TEXT,
  p_image_url TEXT,
  p_category TEXT,
  p_tags TEXT[],
  p_is_published BOOLEAN
)
RETURNS VOID AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin only.';
  END IF;

  UPDATE articles
  SET
    title = p_title,
    content = p_content,
    excerpt = p_excerpt,
    image_url = p_image_url,
    category = p_category,
    tags = p_tags,
    published_at = CASE 
      WHEN p_is_published = TRUE AND (is_published = FALSE OR published_at IS NULL) THEN NOW() 
      WHEN p_is_published = FALSE THEN NULL
      ELSE published_at 
    END,
    is_published = p_is_published,
    updated_at = NOW()
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent articles for landing page
CREATE OR REPLACE FUNCTION get_recent_articles(p_limit INT DEFAULT 3)
RETURNS SETOF articles AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM articles
  WHERE is_published = TRUE
  ORDER BY published_at DESC, created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;
