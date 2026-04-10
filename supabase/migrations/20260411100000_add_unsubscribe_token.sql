-- Add unsubscribe token and status fields to subscribers
alter table subscribers
  add column if not exists unsubscribe_token uuid default gen_random_uuid() not null,
  add column if not exists unsubscribed_at timestamptz;

-- Index for fast unsubscribe lookups
create unique index if not exists subscribers_unsubscribe_token_idx on subscribers (unsubscribe_token);
