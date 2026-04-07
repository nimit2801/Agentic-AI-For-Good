#!/usr/bin/env node
/**
 * Fetch GitHub stats (stars, last commit) for tools with GitHub URLs
 * Usage: npx ts-node scripts/fetch-github-stats.ts [--update]
 */

import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'

interface ToolDefinition {
  slug: string
  name: string
  github_url?: string
}

interface GitHubStats {
  stars: number
  last_commit: string
  open_issues: number
  archived: boolean
}

async function fetchGitHubStats(owner: string, repo: string): Promise<GitHubStats | null> {
  const token = process.env.GITHUB_TOKEN
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  }
  if (token) {
    headers.Authorization = `token ${token}`
  }

  try {
    // Fetch repo info
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers })
    if (!repoRes.ok) {
      console.warn(`Failed to fetch ${owner}/${repo}: ${repoRes.status}`)
      return null
    }
    const repoData = await repoRes.json()

    // Fetch last commit
    const commitsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
      { headers }
    )
    const commitsData = commitsRes.ok ? await commitsRes.json() : []

    return {
      stars: repoData.stargazers_count,
      last_commit: commitsData[0]?.commit?.committer?.date || null,
      open_issues: repoData.open_issues_count,
      archived: repoData.archived,
    }
  } catch (e) {
    console.error(`Error fetching ${owner}/${repo}:`, e)
    return null
  }
}

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
  if (!match) return null
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') }
}

function loadToolsWithGitHub(toolsDir: string): ToolDefinition[] {
  const tools: ToolDefinition[] = []

  function scanDirectory(dir: string) {
    const entries = fs.readdirSync(dir)
    for (const entry of entries) {
      const fullPath = path.join(dir, entry)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        scanDirectory(fullPath)
      } else if (entry.endsWith('.yaml') || entry.endsWith('.yml')) {
        const content = fs.readFileSync(fullPath, 'utf8')
        const data = yaml.load(content) as ToolDefinition
        if (data?.github_url) {
          tools.push(data)
        }
      }
    }
  }

  scanDirectory(toolsDir)
  return tools
}

async function main() {
  const shouldUpdate = process.argv.includes('--update')
  const toolsDir = path.join(__dirname, '../tools')

  console.log('Fetching GitHub stats...')
  const tools = loadToolsWithGitHub(toolsDir)
  console.log(`Found ${tools.length} tools with GitHub URLs`)

  for (const tool of tools) {
    const parsed = parseGitHubUrl(tool.github_url!)
    if (!parsed) {
      console.warn(`  Invalid GitHub URL for ${tool.slug}: ${tool.github_url}`)
      continue
    }

    const stats = await fetchGitHubStats(parsed.owner, parsed.repo)
    if (stats) {
      console.log(`  ${tool.slug}: ${stats.stars.toLocaleString()} stars`)
      
      // In --update mode, you'd update the YAML file or Supabase here
      if (shouldUpdate) {
        // TODO: Update Supabase with stats
        // await supabase.from('tools').update({
        //   github_stars: stats.stars,
        //   maintained: !stats.archived && isRecentlyActive(stats.last_commit)
        // }).eq('slug', tool.slug)
      }
    }
  }

  console.log('Done.')
}

main().catch((e) => {
  console.error('Fatal error:', e)
  process.exit(1)
})
