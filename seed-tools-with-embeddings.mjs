// Usage: SUPABASE_URL=... SUPABASE_SERVICE_KEY=... OPENAI_API_KEY=... node seed-tools-with-embeddings.mjs
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !openaiKey) {
  console.error('Set SUPABASE_URL, SUPABASE_SERVICE_KEY, and OPENAI_API_KEY env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateEmbedding(text) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-3-small',
      dimensions: 1536,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

async function seedEmbeddings() {
  // Fetch tools without embeddings
  const { data: tools, error } = await supabase
    .from('tools')
    .select('id, name, description, tagline, tags')
    .is('embedding', null);

  if (error) {
    console.error('Error fetching tools:', error.message);
    process.exit(1);
  }

  console.log(`Found ${tools.length} tools without embeddings`);

  for (const tool of tools) {
    // Create rich text for embedding
    const textToEmbed = [
      tool.name,
      tool.tagline || '',
      tool.description,
      (tool.tags || []).join(' '),
    ].filter(Boolean).join(' ');

    console.log(`Generating embedding for: ${tool.name}...`);

    try {
      const embedding = await generateEmbedding(textToEmbed);

      const { error: updateError } = await supabase
        .from('tools')
        .update({ embedding })
        .eq('id', tool.id);

      if (updateError) {
        console.error(`Failed to update ${tool.name}:`, updateError.message);
      } else {
        console.log(`✓ Updated: ${tool.name}`);
      }
    } catch (err) {
      console.error(`Error generating embedding for ${tool.name}:`, err.message);
    }

    // Rate limit: wait 100ms between requests
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('\nDone! All embeddings generated.');
}

seedEmbeddings();
