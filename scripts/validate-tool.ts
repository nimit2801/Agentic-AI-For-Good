/**
 * Validates tool YAML files against the schema.
 * Usage: tsx validate-tool.ts tools/agent-frameworks/langchain.yaml [...]
 *        Or pass CHANGED_FILES env var with newline-separated paths.
 */
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { z } from 'zod'

const ToolSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(20).max(500),
  problem_solved: z.string().min(50, 'problem_solved must be at least 50 characters — be concrete about what problem this solves'),
  use_cases: z.array(z.string().min(10)).min(3, 'At least 3 use cases required'),
  github_url: z.string().url().optional(),
  website_url: z.string().url().optional(),
  docs_url: z.string().url().optional(),
  install_command: z.string().optional(),
  category: z.enum(['LLM', 'Vector DB', 'RAG', 'Agents', 'Fine-tuning', 'Monitoring', 'Data', 'Dev Tools', 'Other']).optional(),
  tags: z.array(z.string()).optional(),
  pricing: z.enum(['free', 'freemium', 'paid']).default('free'),
  is_open_source: z.boolean().default(false),
  license: z.string().optional(),
  tagline: z.string().max(100).optional(),
}).refine(
  (data) => data.github_url || data.website_url,
  { message: 'Either github_url or website_url is required' }
)

function getSlugFromPath(filePath: string): string {
  return path.basename(filePath, '.yaml')
}

function validateFile(filePath: string): { ok: boolean; errors: string[] } {
  const errors: string[] = []

  // Must be in tools/ directory
  if (!filePath.includes('/tools/') && !filePath.startsWith('tools/')) {
    errors.push(`File must be inside tools/ directory, got: ${filePath}`)
    return { ok: false, errors }
  }

  // Must be .yaml
  if (!filePath.endsWith('.yaml')) {
    errors.push('File must have .yaml extension')
    return { ok: false, errors }
  }

  // Resolve path — script may run from scripts/ dir or repo root
  // Try as-is first, then relative to repo root (one level up from scripts/)
  let resolvedPath = path.resolve(filePath)
  if (!fs.existsSync(resolvedPath)) {
    // Running from scripts/ working directory — go up one level to repo root
    resolvedPath = path.resolve('..', filePath)
  }

  // Read and parse YAML
  let raw: unknown
  try {
    const content = fs.readFileSync(resolvedPath, 'utf-8')
    raw = yaml.load(content)
  } catch (e) {
    errors.push(`Failed to parse YAML: ${(e as Error).message}`)
    return { ok: false, errors }
  }

  // Validate with Zod
  const result = ToolSchema.safeParse(raw)
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path.join('.') || 'root'
      errors.push(`[${field}] ${issue.message}`)
    }
    return { ok: false, errors }
  }

  return { ok: true, errors: [] }
}

// Main
const filesToValidate: string[] = process.argv.slice(2).length > 0
  ? process.argv.slice(2)
  : (process.env.CHANGED_FILES ?? '').split('\n').filter(f => f.endsWith('.yaml') && f.includes('tools/'))

if (filesToValidate.length === 0) {
  console.log('No tool YAML files to validate.')
  process.exit(0)
}

let allPassed = true

for (const file of filesToValidate) {
  const { ok, errors } = validateFile(file)
  const slug = getSlugFromPath(file)

  if (ok) {
    console.log(`✅ ${slug} — valid`)
  } else {
    console.error(`❌ ${slug} — ${errors.length} error(s):`)
    for (const err of errors) {
      console.error(`   • ${err}`)
    }
    allPassed = false
  }
}

if (!allPassed) {
  console.error('\nValidation failed. Fix the errors above and try again.')
  process.exit(1)
}

console.log('\nAll tools valid ✓')
