import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// Vercel cron: runs weekly (every Monday at 00:00 UTC)
// Requires CRON_SECRET env var to authenticate requests
export const maxDuration = 300

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerSupabaseClient()

  // Fetch all approved tools that have a github_url
  const { data: tools, error } = await supabase
    .from('tools')
    .select('id, slug, github_url')
    .eq('approved', true)
    .not('github_url', 'is', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const results: { slug: string; stars: number | null; error?: string }[] = []
  const startedAt = Date.now()
  console.log(`[sync-github-stars] Starting sync for ${tools?.length ?? 0} tools`)

  for (const tool of tools ?? []) {
    try {
      // Extract owner/repo from github_url
      const match = tool.github_url?.match(/github\.com\/([^/]+\/[^/]+)/)
      if (!match) {
        console.warn(`[sync-github-stars] Skipping ${tool.slug} — no parseable github_url`)
        continue
      }

      const repo = match[1].replace(/\/$/, '')
      const res = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
      })

      if (!res.ok) {
        const msg = `GitHub ${res.status}`
        console.error(`[sync-github-stars] ${tool.slug}: ${msg}`)
        results.push({ slug: tool.slug, stars: null, error: msg })
        continue
      }

      const data = await res.json()
      const stars: number = data.stargazers_count

      const { error: updateError } = await supabase
        .from('tools')
        .update({ github_stars: stars, github_stars_updated_at: new Date().toISOString() })
        .eq('id', tool.id)

      if (updateError) {
        console.error(`[sync-github-stars] DB update failed for ${tool.slug}:`, updateError.message)
        results.push({ slug: tool.slug, stars: null, error: updateError.message })
        continue
      }

      console.log(`[sync-github-stars] ${tool.slug}: ${stars} stars`)
      results.push({ slug: tool.slug, stars })
    } catch (err) {
      console.error(`[sync-github-stars] Unexpected error for ${tool.slug}:`, err)
      results.push({ slug: tool.slug, stars: null, error: String(err) })
    }
  }

  const updated = results.filter((r) => r.stars !== null).length
  const failed = results.filter((r) => r.stars === null).length
  console.log(`[sync-github-stars] Done in ${Date.now() - startedAt}ms — ${updated} updated, ${failed} failed`)

  return NextResponse.json({ updated, failed, results })
}
