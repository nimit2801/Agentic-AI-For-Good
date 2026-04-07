#!/usr/bin/env node
/**
 * Sync YAML tool definitions to Supabase
 * Usage: npx ts-node scripts/sync-to-supabase.ts [--dry-run]
 */

import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// Initialize clients
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

interface ToolDefinition {
  name: string
  slug: string
  tagline?: string
  description: string
  long_description?: string
  category: string
  tags?: string[]
  website_url?: string
  github_url?: string
  docs_url?: string
  logo_url?: string
  pricing?: 'free' | 'freemium' | 'paid'
  license?: string
  is_open_source?: boolean
  maintained?: boolean
  stack?: {
    languages?: string[]
    frameworks?: string[]
  }
  integration?: {
    install_command?: string
    code_snippet?: string
    guide?: string
  }
}

function loadToolFromYaml(filePath: string): ToolDefinition | null {
  const content = fs.readFileSync(filePath, 'utf8')
  const data = yaml.load(content) as ToolDefinition
  return data
}

function loadAllTools(toolsDir: string): Map<string, ToolDefinition> {
  const tools = new Map<string, ToolDefinition>()

  function scanDirectory(dir: string) {
    const entries = fs.readdirSync(dir)
    for (const entry of entries) {
      const fullPath = path.join(dir, entry)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        scanDirectory(fullPath)
      } else if (entry.endsWith('.yaml') || entry.endsWith('.yml')) {
        const tool = loadToolFromYaml(fullPath)
        if (tool) {
          tools.set(tool.slug, tool)
        }
      }
    }
  }

  scanDirectory(toolsDir)
  return tools
}

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    dimensions: 1536,
  })
  return response.data[0].embedding
}

async function upsertTool(tool: ToolDefinition) {
  // Build text for embedding
  const embeddingText = [
    tool.name,
    tool.tagline,
    tool.description,
    tool.long_description,
    ...(tool.tags || []),
    tool.category,
    tool.license,
    ...(tool.stack?.languages || []),
    ...(tool.stack?.frameworks || []),
  ]
    .filter(Boolean)
    .join(' ')

  const embedding = await generateEmbedding(embeddingText)

  const dbTool = {
    name: tool.name,
    slug: tool.slug,
    description: tool.description,
    long_description: tool.long_description || null,
    tagline: tool.tagline || null,
    category: tool.category,
    tags: tool.tags || [],
    url: tool.website_url,
    website_url: tool.website_url || null,
    github_url: tool.github_url || null,
    docs_url: tool.docs_url || null,
    logo_url: tool.logo_url || null,
    pricing: tool.pricing || null,
    license: tool.license || null,
    is_open_source: tool.is_open_source ?? false,
    maintained: tool.maintained ?? true,
    stack_languages: tool.stack?.languages || [],
    stack_frameworks: tool.stack?.frameworks || [],
    install_command: tool.integration?.install_command || null,
    code_snippet: tool.integration?.code_snippet || null,
    integration_guide: tool.integration?.guide || null,
    approved: true,
    embedding,
  }

  const { error } = await supabase.from('tools').upsert(dbTool, {
    onConflict: 'slug',
  })

  if (error) {
    throw new Error(`Failed to upsert ${tool.slug}: ${error.message}`)
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const toolsDir = path.join(__dirname, '../tools')

  console.log(dryRun ? 'DRY RUN - No changes will be made' : 'Syncing tools to Supabase...')
  console.log(`Loading tools from: ${toolsDir}`)

  const tools = loadAllTools(toolsDir)
  console.log(`Found ${tools.size} tool(s)`)

  if (dryRun) {
    for (const [slug, tool] of tools) {
      console.log(`  - ${slug}: ${tool.name}`)
    }
    return
  }

  let success = 0
  let failed = 0

  for (const [slug, tool] of tools) {
    try {
      console.log(`  Syncing: ${slug}...`)
      await upsertTool(tool)
      success++
    } catch (e) {
      console.error(`  Error syncing ${slug}:`, e instanceof Error ? e.message : String(e))
      failed++
    }
  }

  console.log(`\nDone. ${success} succeeded, ${failed} failed.`)
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error('Fatal error:', e)
  process.exit(1)
})
