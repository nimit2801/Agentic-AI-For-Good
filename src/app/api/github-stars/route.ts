import { NextResponse } from 'next/server'

// Server-side proxy for the Agentic AI For Good GitHub repo star count.
// Cached for 1 hour via Next.js fetch revalidation so all clients share
// a single API call (and we stay well under GitHub's 60 req/hr unauth limit).
//
// No auth required for the GitHub REST endpoint we use, but we forward
// GITHUB_TOKEN if it's set on Vercel to raise the rate limit.

const REPO = 'nimit2801/Agentic-AI-For-Good'
const REVALIDATE_SECONDS = 3600 // 1 hour

export const revalidate = 3600

export async function GET() {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: REVALIDATE_SECONDS },
    })

    if (!res.ok) {
      return NextResponse.json(
        { stars: null, error: `GitHub ${res.status}` },
        { status: 200 } // soft-fail: client renders nothing on error
      )
    }

    const data = await res.json()
    return NextResponse.json({
      stars: typeof data.stargazers_count === 'number' ? data.stargazers_count : null,
      url: data.html_url ?? `https://github.com/${REPO}`,
      fetchedAt: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json(
      { stars: null, error: String(err) },
      { status: 200 }
    )
  }
}
