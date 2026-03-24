-- Note: stories table already exists in Supabase
-- Creating only new tables: tools and tool_submissions

-- Create helper function for auto-updating timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Tools table (AI tool directory - core product)
create table tools (
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

create index tools_slug_idx on tools(slug);
create index tools_category_idx on tools(category);
create index tools_approved_idx on tools(approved, created_at desc);

-- Auto-update tools.updated_at on every update
create trigger tools_updated_at
  before update on tools
  for each row
  execute function update_updated_at_column();

-- RLS policies for tools
alter table tools enable row level security;

create policy "approved tools are public" on tools
  for select
  using (approved = true);

create policy "service role has full access to tools" on tools
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

---

-- Tool submissions table (Submit Your Tool form)
create table tool_submissions (
  id uuid primary key default gen_random_uuid(),
  tool_name text not null,
  tool_url text not null,
  description text,
  submitter_email text,
  submitter_name text,
  status text default 'pending', -- 'pending', 'approved', 'rejected'
  created_at timestamptz default now()
);

create index tool_submissions_status_idx on tool_submissions(status);
create index tool_submissions_created_at_idx on tool_submissions(created_at desc);

-- RLS policies for tool_submissions
alter table tool_submissions enable row level security;

create policy "anyone can submit a tool" on tool_submissions
  for insert
  with check (true);

create policy "service role can view and manage submissions" on tool_submissions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
