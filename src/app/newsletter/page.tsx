import Link from 'next/link'
import type { Metadata } from 'next'
import { formatIssueDate, listIssues } from '@/lib/newsletter'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Newsletter | Agentic AI For Good',
  description: 'Every Agentic AI For Good newsletter issue: weekly digests of new AI tools in the catalog and tool spotlights.',
  alternates: { canonical: 'https://agenticaiforgood.com/newsletter' },
  openGraph: {
    title: 'Agentic AI For Good Newsletter',
    description: 'Weekly digests of new AI tools and tool spotlights.',
    url: 'https://agenticaiforgood.com/newsletter',
    siteName: 'Agentic AI For Good',
    type: 'website',
  },
}

export default async function NewsletterIndexPage() {
  const issues = await listIssues()

  return (
    <div className="min-h-screen bg-[#F5F1EB] px-6 pt-32 pb-24">
      <div className="max-w-3xl mx-auto">
        <span className="micro-label text-[#D4754E] block mb-3">NEWSLETTER</span>
        <h1 className="display-heading text-4xl md:text-5xl text-[#1A1A1A] mb-4">EVERY ISSUE</h1>
        <p className="text-[#6B6560] leading-relaxed mb-10 max-w-xl">
          The Agentic AI For Good digest lands Tuesdays at 10:00 IST with what&apos;s new in the catalog.
          Thursdays bring a tool spotlight. Here&apos;s the full archive.
        </p>

        <ul className="space-y-3">
          {issues.map((issue) => (
            <li key={`${issue.kind}-${issue.date}`}>
              <Link
                href={`/newsletter/${issue.date}`}
                className="flex items-center justify-between gap-4 bg-white rounded-2xl border border-[#1A1A1A]/5 px-6 py-5 hover:border-[#D4754E]/40 transition-colors"
              >
                <div>
                  <span className="micro-label text-[#6B6560] block mb-1">
                    {issue.kind === 'digest' ? 'WEEKLY DIGEST' : 'TOOL SPOTLIGHT'}
                  </span>
                  <span className="text-[#1A1A1A] font-semibold">{formatIssueDate(issue.date)}</span>
                </div>
                <span className="text-[#D4754E] text-sm font-medium">Read →</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 bg-[#1A1A1A] rounded-3xl p-8 text-center">
          <p className="text-[#F5F1EB] font-semibold mb-2">Want it in your inbox?</p>
          <p className="text-[#F5F1EB]/70 text-sm mb-6">Subscribe on the homepage. No spam, unsubscribe anytime.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#D4754E] hover:bg-[#C0653E] text-white rounded-full px-6 py-3 text-sm font-medium transition-all duration-200"
          >
            Subscribe
          </Link>
        </div>
      </div>
    </div>
  )
}
