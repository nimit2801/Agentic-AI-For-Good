-- Track when a tool was last used as a weekly spotlight
alter table tools
  add column if not exists spotlight_sent_at timestamptz;

-- Index for efficient spotlight selection (nulls first = never spotlighted comes first)
create index if not exists tools_spotlight_sent_at_idx on tools (spotlight_sent_at asc nulls first);
