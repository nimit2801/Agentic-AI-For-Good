-- Add missing columns to tools table for tool catalog

-- Core missing columns
ALTER TABLE tools 
  ADD COLUMN IF NOT EXISTS tagline text,
  ADD COLUMN IF NOT EXISTS github_url text,
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS docs_url text,
  ADD COLUMN IF NOT EXISTS license text,
  ADD COLUMN IF NOT EXISTS stack_languages text[],
  ADD COLUMN IF NOT EXISTS stack_frameworks text[],
  ADD COLUMN IF NOT EXISTS install_command text,
  ADD COLUMN IF NOT EXISTS code_snippet text,
  ADD COLUMN IF NOT EXISTS integration_guide text,
  ADD COLUMN IF NOT EXISTS github_stars integer,
  ADD COLUMN IF NOT EXISTS maintained boolean DEFAULT true;

-- Note: embedding column is added by the pgvector migration
