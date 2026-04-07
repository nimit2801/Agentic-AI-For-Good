-- Enable pgvector extension for semantic search (create in public schema for easier access)
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

-- Add vector embedding column to tools table if not exists
ALTER TABLE tools
  ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Create IVFFlat index for fast similarity search
-- Using 100 lists for ~1000-10,000 rows (adjust based on actual data size)
CREATE INDEX IF NOT EXISTS tools_embedding_idx
  ON tools USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Create GIN index on tags for keyword filtering
CREATE INDEX IF NOT EXISTS tools_tags_idx ON tools USING gin (tags);

-- Create search_tools RPC function for semantic similarity search
-- This uses pgvector's cosine similarity for semantic matching
CREATE OR REPLACE FUNCTION search_tools(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 10,
  filter_category text DEFAULT NULL,
  filter_tags text[] DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  description text,
  long_description text,
  tagline text,
  url text,
  website_url text,
  github_url text,
  docs_url text,
  logo_url text,
  category text,
  tags text[],
  pricing text,
  is_open_source boolean,
  license text,
  github_stars integer,
  maintained boolean,
  stack_languages text[],
  stack_frameworks text[],
  install_command text,
  code_snippet text,
  integration_guide text,
  similarity float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.name,
    t.slug,
    t.description,
    t.long_description,
    t.tagline,
    t.url,
    t.website_url,
    t.github_url,
    t.docs_url,
    t.logo_url,
    t.category,
    t.tags,
    t.pricing,
    t.is_open_source,
    t.license,
    t.github_stars,
    t.maintained,
    t.stack_languages,
    t.stack_frameworks,
    t.install_command,
    t.code_snippet,
    t.integration_guide,
    1 - (t.embedding <=> query_embedding) AS similarity
  FROM tools t
  WHERE
    t.approved = true
    AND (filter_category IS NULL OR t.category = filter_category)
    AND (filter_tags IS NULL OR t.tags && filter_tags)
    AND t.embedding IS NOT NULL
    AND 1 - (t.embedding <=> query_embedding) > match_threshold
  ORDER BY t.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create keyword_search_tools function for text-based fallback search
CREATE OR REPLACE FUNCTION keyword_search_tools(
  search_query text,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  description text,
  long_description text,
  tagline text,
  url text,
  website_url text,
  github_url text,
  docs_url text,
  logo_url text,
  category text,
  tags text[],
  pricing text,
  is_open_source boolean,
  license text,
  github_stars integer,
  maintained boolean,
  stack_languages text[],
  stack_frameworks text[],
  install_command text,
  code_snippet text,
  integration_guide text,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.name,
    t.slug,
    t.description,
    t.long_description,
    t.tagline,
    t.url,
    t.website_url,
    t.github_url,
    t.docs_url,
    t.logo_url,
    t.category,
    t.tags,
    t.pricing,
    t.is_open_source,
    t.license,
    t.github_stars,
    t.maintained,
    t.stack_languages,
    t.stack_frameworks,
    t.install_command,
    t.code_snippet,
    t.integration_guide,
    ts_rank(
      to_tsvector('english', COALESCE(t.name, '') || ' ' || COALESCE(t.description, '') || ' ' || COALESCE(t.tagline, '') || ' ' || COALESCE(array_to_string(t.tags, ' '), '')),
      plainto_tsquery('english', search_query)
    ) AS rank
  FROM tools t
  WHERE
    t.approved = true
    AND (
      to_tsvector('english', COALESCE(t.name, '') || ' ' || COALESCE(t.description, '') || ' ' || COALESCE(t.tagline, '') || ' ' || COALESCE(array_to_string(t.tags, ' '), ''))
      @@ plainto_tsquery('english', search_query)
    )
  ORDER BY rank DESC
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant execute permissions to anon and authenticated roles
GRANT EXECUTE ON FUNCTION search_tools(vector(1536), float, int, text, text[]) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION keyword_search_tools(text, int) TO anon, authenticated;
