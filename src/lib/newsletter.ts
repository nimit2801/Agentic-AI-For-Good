import { createServerSupabaseClient } from '@/lib/supabase-server'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agenticaiforgood.com'

const DAY_MS = 24 * 60 * 60 * 1000
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

export type IssueKind = 'digest' | 'spotlight'

export interface IssueRef {
  date: string // YYYY-MM-DD in IST
  kind: IssueKind
}

export interface NewsletterTool {
  name: string
  slug: string
  tagline?: string | null
  description: string
  category: string
  pricing: string
  is_open_source: boolean
  github_stars?: number | null
  use_cases?: string[] | null
  install_command?: string | null
  url?: string | null
}

// Digests that went out on the old Monday 08:00 UTC schedule (from Resend send history).
const LEGACY_DIGEST_DATES = ['2026-10-12', '2026-10-19', '2026-10-26', '2026-11-02', '2026-11-09']
// From this date the digest goes out Tuesdays 04:30 UTC (10:00 IST), spotlight Thursdays.
const TUESDAY_SCHEDULE_START = '2026-11-17'

/** Calendar date in IST for a given instant. */
export function istDateKey(d: Date = new Date()): string {
  return new Date(d.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10)
}

export function issueUrl(date: string): string {
  return `${SITE_URL}/newsletter/${date}`
}

export function isValidDateKey(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(`${date}T00:00:00Z`))
}

/** Instant the digest for an issue date was (or will be) sent. */
function digestSendTime(date: string): Date {
  return LEGACY_DIGEST_DATES.includes(date)
    ? new Date(`${date}T08:00:00Z`)
    : new Date(`${date}T04:30:00Z`)
}

/** All digest issue dates that have gone out by `now`, newest first. */
export function digestDates(now: Date = new Date()): string[] {
  const dates = [...LEGACY_DIGEST_DATES]
  let cursor = new Date(`${TUESDAY_SCHEDULE_START}T04:00:00Z`)
  while (cursor.getTime() <= now.getTime()) {
    dates.push(cursor.toISOString().slice(0, 10))
    cursor = new Date(cursor.getTime() + 7 * DAY_MS)
  }
  return dates.filter((d) => digestSendTime(d).getTime() - 30 * 60 * 1000 <= now.getTime()).sort().reverse()
}

export function isDigestDate(date: string, now: Date = new Date()): boolean {
  return digestDates(now).includes(date)
}

/** Tools approved in the 7 days before `end`. Same window the digest email uses. */
export async function getDigestTools(end: Date): Promise<NewsletterTool[]> {
  const supabase = createServerSupabaseClient()
  const start = new Date(end.getTime() - 7 * DAY_MS)
  const { data, error } = await supabase
    .from('tools')
    .select('name, slug, tagline, description, category, pricing, is_open_source')
    .eq('approved', true)
    .gte('created_at', start.toISOString())
    .lt('created_at', end.toISOString())
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as NewsletterTool[]
}

export async function getDigestIssueTools(date: string): Promise<NewsletterTool[]> {
  return getDigestTools(digestSendTime(date))
}

/** Tool spotlighted on a given IST date, if any. */
export async function getSpotlightTool(date: string): Promise<NewsletterTool | null> {
  const supabase = createServerSupabaseClient()
  const start = new Date(new Date(`${date}T00:00:00Z`).getTime() - IST_OFFSET_MS)
  const end = new Date(start.getTime() + DAY_MS)
  const { data } = await supabase
    .from('tools')
    // select('*'): optional columns like use_cases/install_command don't exist on every deploy of the tools table
    .select('*')
    .gte('spotlight_sent_at', start.toISOString())
    .lt('spotlight_sent_at', end.toISOString())
    .limit(1)
  return ((data ?? [])[0] as NewsletterTool | undefined) ?? null
}

/** Every issue (digests + spotlights) that has gone out, newest first. */
export async function listIssues(now: Date = new Date()): Promise<IssueRef[]> {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('tools')
    .select('spotlight_sent_at')
    .not('spotlight_sent_at', 'is', null)
  const spotlightDates = new Set(
    (data ?? []).map((t: { spotlight_sent_at: string }) => istDateKey(new Date(t.spotlight_sent_at)))
  )
  const issues: IssueRef[] = [
    ...digestDates(now).map((date) => ({ date, kind: 'digest' as const })),
    ...[...spotlightDates].filter((d) => !isDigestDate(d, now)).map((date) => ({ date, kind: 'spotlight' as const })),
  ]
  return issues.sort((a, b) => b.date.localeCompare(a.date))
}

export function formatIssueDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
