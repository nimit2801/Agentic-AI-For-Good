-- Add GitHub metadata fields to tools table
alter table tools
  add column if not exists github_url text,
  add column if not exists github_stars integer,
  add column if not exists github_stars_updated_at timestamptz;

-- Index for sorting by stars
create index if not exists tools_github_stars_idx on tools (github_stars desc nulls last);
