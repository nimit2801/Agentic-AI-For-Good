import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  formatIssueDate,
  getDigestIssueTools,
  getSpotlightTool,
  isDigestDate,
  isValidDateKey,
  issueUrl,
  type NewsletterTool,
} from '@/lib/newsletter'

export const revalidate = 300

interface Props {
  params: Promise<{ date: string }>
}

type Issue =
  | { kind: 'digest'; tools: NewsletterTool[] }
  | { kind: 'spotlight'; tool: NewsletterTool }

async function loadIssue(date: string): Promise<Issue | null> {
  if (!isValidDateKey(date)) return null
  if (isDigestDate(date)) return { kind: 'digest', tools: await getDigestIssueTools(date) }
  const tool = await getSpotlightTool(date)
  return tool ? { kind: 'spotlight', tool } : null
}

function issueTitle(issue: Issue): string {
  if (issue.kind === 'spotlight') return `Tool spotlight: ${issue.tool.name}`
  const n = issue.tools.length
  return n === 0 ? 'Quiet week in the catalog' : `${n} new tool${n > 1 ? 's' : ''} this week`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params
  const issue = await loadIssue(date)
  if (!issue) return { title: 'Issue not found | Agentic AI For Good' }
  const title = `${issueTitle(issue)} | Agentic AI For Good, ${formatIssueDate(date)}`
  const description =
    issue.kind === 'spotlight'
      ? issue.tool.tagline ?? issue.tool.description
      : `The Agentic AI For Good weekly digest for ${formatIssueDate(date)}.`
  return {
    title,
    description,
    alternates: { canonical: issueUrl(date) },
    openGraph: {
      title,
      description,
      url: issueUrl(date),
      siteName: 'Agentic AI For Good',
      images: [{ url: 'https://agenticaiforgood.com/og-image.png', width: 1200, height: 630 }],
      type: 'article',
    },
    twitter: { card: 'summary_large_image', title, description, images: ['https://agenticaiforgood.com/og-image.png'] },
  }
}

function ToolCard({ tool }: { tool: NewsletterTool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block bg-white rounded-2xl border border-[#1A1A1A]/5 px-6 py-5 hover:border-[#D4754E]/40 transition-colors"
    >
      <div className="flex items-start justify-between gap-4 mb-1">
        <span className="text-[#1A1A1A] font-bold">{tool.name}</span>
        <span className="micro-label text-[#6B6560] whitespace-nowrap">
          {tool.category} · {tool.pricing}
          {tool.is_open_source ? ' · open source' : ''}
        </span>
      </div>
      <p className="text-[#6B6560] text-sm leading-relaxed">{tool.tagline ?? tool.description}</p>
    </Link>
  )
}

export default async function NewsletterIssuePage({ params }: Props) {
  const { date } = await params
  const issue = await loadIssue(date)
  if (!issue) notFound()

  return (
    <div className="min-h-screen bg-[#F5F1EB] px-6 pt-32 pb-24">
      <article className="max-w-3xl mx-auto">
        <Link href="/newsletter" className="micro-label text-[#6B6560] hover:text-[#D4754E] block mb-8">
          ← ALL ISSUES
        </Link>
        <span className="micro-label text-[#D4754E] block mb-3">
          {issue.kind === 'digest' ? 'WEEKLY DIGEST' : 'TOOL SPOTLIGHT'} · {formatIssueDate(date).toUpperCase()}
        </span>
        <h1 className="display-heading text-4xl md:text-5xl text-[#1A1A1A] mb-6">{issueTitle(issue).toUpperCase()}</h1>

        {issue.kind === 'digest' && issue.tools.length === 0 && (
          <p className="text-[#6B6560] leading-relaxed mb-10">
            No new tools were added this week. The full catalog is still live at{' '}
            <Link href="/tools" className="text-[#D4754E] underline">agenticaiforgood.com/tools</Link>.
          </p>
        )}

        {issue.kind === 'digest' && issue.tools.length > 0 && (
          <>
            <p className="text-[#6B6560] leading-relaxed mb-8">
              Here&apos;s what landed in the catalog this week. Each one is reviewed and documented with real use cases.
            </p>
            <div className="space-y-3 mb-10">
              {issue.tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </>
        )}

        {issue.kind === 'spotlight' && (
          <div className="mb-10">
            <p className="text-[#6B6560] leading-relaxed mb-6">{issue.tool.description}</p>
            {issue.tool.use_cases && issue.tool.use_cases.length > 0 && (
              <ul className="list-disc pl-5 text-[#6B6560] space-y-1 mb-6">
                {issue.tool.use_cases.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            )}
            {issue.tool.install_command && (
              <pre className="bg-[#1A1A1A] text-[#F5F1EB] rounded-xl px-5 py-4 text-sm overflow-x-auto mb-6" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                {issue.tool.install_command}
              </pre>
            )}
            <ToolCard tool={issue.tool} />
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-12">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 bg-[#D4754E] hover:bg-[#C0653E] text-white rounded-full px-6 py-3 text-sm font-medium transition-all duration-200"
          >
            Browse full catalog
          </Link>
          <Link
            href="/mcp"
            className="inline-flex items-center gap-2 border border-[#1A1A1A]/15 text-[#1A1A1A] rounded-full px-6 py-3 text-sm font-medium hover:border-[#D4754E]/50"
          >
            Search it from Claude via MCP
          </Link>
        </div>

        <div className="bg-[#1A1A1A] rounded-3xl p-8 text-center">
          <p className="text-[#F5F1EB] font-semibold mb-2">Get the next one in your inbox</p>
          <p className="text-[#F5F1EB]/70 text-sm mb-6">Digest on Tuesdays, spotlight on Thursdays, 10:00 IST.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#D4754E] hover:bg-[#C0653E] text-white rounded-full px-6 py-3 text-sm font-medium transition-all duration-200"
          >
            Subscribe
          </Link>
        </div>
      </article>
    </div>
  )
}
