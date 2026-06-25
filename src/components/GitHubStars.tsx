'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

const REPO_URL = 'https://github.com/nimit2801/Agentic-AI-For-Good'

type StarData = { stars: number | null; url?: string; error?: string }

// Shared fetcher: reads sessionStorage cache (5 min) then falls through to /api/github-stars
// which is itself cached server-side for 1 hour via Next.js revalidation.
async function fetchStars(): Promise<StarData> {
  try {
    const cacheKey = 'aaifg:gh-stars'
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      const parsed = JSON.parse(cached) as { ts: number; data: StarData }
      if (Date.now() - parsed.ts < 5 * 60 * 1000) return parsed.data
    }
    const res = await fetch('/api/github-stars', { cache: 'no-store' })
    const data: StarData = await res.json()
    sessionStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data }))
    return data
  } catch {
    return { stars: null }
  }
}

function formatStars(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k'
  return n.toString()
}

/**
 * Compact: "★ 21" — used inline in the navigation "Star" link.
 * Renders nothing until the count loads, then replaces the static label.
 */
export function GitHubStarsBadge() {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchStars().then((d) => {
      if (!cancelled && typeof d.stars === 'number') setStars(d.stars)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (stars === null) {
    // Skeleton keeps the layout stable while loading
    return (
      <span className="inline-block w-6 h-3 bg-[#1A1A1A]/10 rounded animate-pulse" aria-hidden />
    )
  }

  return <span>{formatStars(stars)}</span>
}

/**
 * Pill: rounded chip with star icon, count, and "Star on GitHub" label.
 * Used in the Hero as social proof.
 */
export function GitHubStarsPill() {
  const [data, setData] = useState<StarData | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchStars().then((d) => {
      if (!cancelled) setData(d)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!data || typeof data.stars !== 'number') {
    // Soft fallback: show the pill without the count so layout is still meaningful
    return (
      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-[#1A1A1A]/8 hover:border-[#D4754E]/40 hover:bg-white transition-all duration-200 text-xs font-medium text-[#1A1A1A]/80"
      >
        <Star size={12} className="fill-[#D4754E] text-[#D4754E]" />
        Star us on GitHub
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3 h-3 text-[#1A1A1A]/40"
        >
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </a>
    )
  }

  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-[#1A1A1A]/8 hover:border-[#D4754E]/40 hover:bg-white hover:shadow-sm transition-all duration-200 text-xs font-medium text-[#1A1A1A]/80"
    >
      <Star size={12} className="fill-[#D4754E] text-[#D4754E]" />
      <span>
        <span className="text-[#1A1A1A] font-semibold">{formatStars(data.stars)}</span>{' '}
        stars on GitHub
      </span>
      <span className="text-[#1A1A1A]/30 group-hover:text-[#D4754E] transition-colors duration-200">
        ·
      </span>
      <span className="text-[#1A1A1A]/60 group-hover:text-[#D4754E] transition-colors duration-200">
        Star us
      </span>
    </a>
  )
}
