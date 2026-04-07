-- Main seed file - runs when using `supabase db reset`
-- For hosted database, run this SQL in Supabase Dashboard > SQL Editor

-- Seed tools data
-- Note: For hosted Supabase, manually run supabase/seeds/seed_tools.sql
-- via Dashboard SQL Editor since CLI seeding requires local dev setup

-- Verify empty tools table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM tools LIMIT 1) THEN
    RAISE NOTICE 'Tools already seeded. Skipping...';
  ELSE
    RAISE NOTICE 'No tools found. Please run supabase/seeds/seed_tools.sql in SQL Editor';
  END IF;
END $$;
