/**
 * Reads changed tool YAML files, generates OpenAI embeddings, and upserts to Supabase.
 *
 * Env vars required:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   OPENAI_API_KEY
 *
 * Usage:
 *   CHANGED_FILES="tools/agent-frameworks/langchain.yaml\ntools/vector-databases/pinecone.yaml" tsx sync-to-supabase.ts
 *   Or pass file paths as CLI args: tsx sync-to-supabase.ts tools/agent-frameworks/langchain.yaml
 */
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// Env validation
const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
  console.error('Missing required env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

interface ToolYaml {
  name: string
  description: string
  problem_solved: string
  use_cases: string[]
  github_url?: string
  website_url?: string
  docs_url?: string
  install_command?: string
  category?: string
  tags?: string[]
  pricing?: 'free' | 'freemium' | 'paid'
  is_open_source?: boolean
  license?: string
  tagline?: string
  stack_languages?: string[]
  stack_frameworks?: string[]
  code_snippet?: string
}

/**
 * Builds the rich text used for embedding generation.
 * The more context here, the better semantic search works.
 */
function buildEmbeddingText(tool: ToolYaml, slug: string): string {
  return [
    `${tool.name}: ${tool.description}`,
    '',
    'Use cases:',
    ...tool.use_cases.map(uc => `- ${uc}`),
    '',
    'What makes it unique and the problem it solves:',
    tool.problem_solved,
    '',
    tool.tags?.length ? `Tags: ${tool.tags.join(', ')}` : '',
    tool.category ? `Category: ${tool.category}` : '',
  ]
    .join('\n')
    .trim()
}

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    dimensions: 1536,
  })
  return response.data[0].embedding
}

function getSlugFromPath(filePath: string): string {
  return path.basename(filePath, '.yaml')
}

async function syncTool(filePath: string): Promise<void> {
  const slug = getSlugFromPath(filePath)
  console.log(`\n→ Syncing: ${slug}`)

  // Resolve path — script may run from scripts/ dir or repo root
  let resolvedPath = path.resolve(filePath)
  if (!fs.existsSync(resolvedPath)) {
    // Running from scripts/ working directory — go up one level to repo root
    resolvedPath = path.resolve('..', filePath)
  }

  // Parse YAML
  const content = fs.readFileSync(resolvedPath, 'utf-8')
  const tool = yaml.load(content) as ToolYaml

  // Build embedding text and generate embedding
  const embeddingText = buildEmbeddingText(tool, slug)
  console.log(`  Generating embedding (${embeddingText.length} chars)...`)
  const embedding = await generateEmbedding(embeddingText)

  // Build Supabase row
  const row = {
    slug,
    name: tool.name,
    description: tool.description,
    long_description: tool.problem_solved, // problem_solved maps to long_description
    tagline: tool.tagline ?? tool.description.split('.')[0].trim(),
    url: tool.website_url ?? tool.github_url ?? '',
    github_url: tool.github_url ?? null,
    website_url: tool.website_url ?? null,
    docs_url: tool.docs_url ?? null,
    install_command: tool.install_command ?? null,
    category: tool.category ?? null,
    tags: tool.tags ?? [],
    pricing: tool.pricing ?? 'free',
    is_open_source: tool.is_open_source ?? false,
    license: tool.license ?? null,
    stack_languages: tool.stack_languages ?? null,
    stack_frameworks: tool.stack_frameworks ?? null,
    code_snippet: tool.code_snippet ?? null,
    // Store use_cases as part of integration_guide so they're searchable
    integration_guide: tool.use_cases.map((uc, i) => `${i + 1}. ${uc}`).join('\n'),
    embedding,
    approved: true,
    featured: false,
    maintained: true,
  }

  // Upsert by slug
  const { error } = await supabase
    .from('tools')
    .upsert(row, { onConflict: 'slug', ignoreDuplicates: false })

  if (error) {
    console.error(`  ❌ Supabase error: ${error.message}`)
    throw error
  }

  console.log(`  ✅ Upserted ${slug}`)
}

// Main
async function main() {
  const filesToSync: string[] = process.argv.slice(2).length > 0
    ? process.argv.slice(2)
    : (process.env.CHANGED_FILES ?? '').split('\n').filter(f => f.endsWith('.yaml') && f.includes('tools/'))

  if (filesToSync.length === 0) {
    console.log('No tool YAML files to sync.')
    process.exit(0)
  }

  console.log(`Syncing ${filesToSync.length} tool(s) to Supabase...`)

  let failed = 0
  for (const file of filesToSync) {
    try {
      await syncTool(file)
    } catch {
      console.error(`Failed to sync ${file}`)
      failed++
    }
  }

  if (failed > 0) {
    console.error(`\n${failed} file(s) failed to sync.`)
    process.exit(1)
  }

  console.log(`\nDone. ${filesToSync.length} tool(s) synced.`)
}

main()
