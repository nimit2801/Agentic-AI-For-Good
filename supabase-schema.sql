-- Agentic AI For Good Supabase Schema
-- Updated: March 20, 2026
-- Contains: stories (editorial), tools (AI directory), tool_submissions (form submissions)

-- ===== STORIES TABLE (Editorial Content) =====
-- Already exists in production — kept here for reference
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

alter table stories enable row level security;

create policy "Published stories are public" on stories for select using (published = true);
create policy "Service role full access on stories" on stories for all using (auth.role() = 'service_role');

create index if not exists stories_slug_idx on stories (slug);
create index if not exists stories_published_idx on stories (published, created_at desc);

-- ===== TOOLS TABLE (AI Tool Directory — Core Product) =====
create table if not exists tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text not null,
  long_description text,
  url text not null,
  logo_url text,
  category text,
  tags text[],
  pricing text, -- 'free', 'freemium', 'paid'
  is_open_source boolean default false,
  featured boolean default false,
  approved boolean default false,
  submitted_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table tools enable row level security;

create policy "Approved tools are public" on tools for select using (approved = true);
create policy "Service role full access on tools" on tools for all using (auth.role() = 'service_role');

create index if not exists tools_slug_idx on tools (slug);
create index if not exists tools_category_idx on tools (category);
create index if not exists tools_approved_idx on tools (approved, created_at desc);

-- ===== TOOL_SUBMISSIONS TABLE (Submit Your Tool Form) =====
create table if not exists tool_submissions (
  id uuid primary key default gen_random_uuid(),
  tool_name text not null,
  tool_url text not null,
  description text,
  submitter_email text,
  submitter_name text,
  status text default 'pending', -- 'pending', 'approved', 'rejected'
  created_at timestamptz default now()
);

alter table tool_submissions enable row level security;

create policy "Anyone can submit a tool" on tool_submissions for insert with check (true);
create policy "Service role manages submissions" on tool_submissions for all using (auth.role() = 'service_role');

create index if not exists tool_submissions_status_idx on tool_submissions (status);
create index if not exists tool_submissions_created_at_idx on tool_submissions (created_at desc);

-- ===== HELPER FUNCTION =====
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for stories
create trigger if not exists stories_updated_at before update on stories for each row execute function update_updated_at_column();

-- Trigger for tools
create trigger if not exists tools_updated_at before update on tools for each row execute function update_updated_at_column();
