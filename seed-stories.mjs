// Usage: SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node seed-stories.mjs
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_KEY env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const stories = JSON.parse(readFileSync('stories.json', 'utf-8'));

async function seed() {
  for (const story of stories) {
    const { data, error } = await supabase
      .from('stories')
      .upsert({ ...story, published: true }, { onConflict: 'slug' })
      .select();

    if (error) {
      console.error(`Failed to insert "${story.title}":`, error.message);
    } else {
      console.log(`Inserted: ${story.title}`);
    }
  }
  console.log('\nDone! All stories seeded.');
}

seed();
