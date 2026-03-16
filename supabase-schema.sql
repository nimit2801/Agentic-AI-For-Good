-- Run this in the Supabase SQL Editor to set up the stories table

-- Create stories table
create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  subtitle text,
  description text not null,
  content text,
  image_url text,
  category text,
  tags text[],
  company text,
  published boolean default false,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table stories enable row level security;

-- Public read access for published stories
create policy "Public can read published stories"
  on stories for select
  using (published = true);

-- Service role can do everything (for agent API access)
create policy "Service role full access"
  on stories for all
  using (auth.role() = 'service_role');

-- Create an index on slug for fast lookups
create index if not exists stories_slug_idx on stories (slug);

-- Create an index on published + created_at for listing
create index if not exists stories_published_idx on stories (published, created_at desc);

-- Auto-update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger stories_updated_at
  before update on stories
  for each row
  execute function update_updated_at();
