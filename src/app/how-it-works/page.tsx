import { Suspense } from 'react'
import HowItWorksPage from '@/views/HowItWorksPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works — Agentic AI For Good',
  description:
    'How the Agentic AI For Good flywheel works: companies contribute tools via GitHub PR, tools get embedded and searchable, developers discover them via semantic search or MCP server inside Claude.',
  openGraph: {
    title: 'How It Works — Agentic AI For Good',
    description:
      'Add your tool via GitHub PR. It becomes instantly searchable and available inside Claude via MCP. No forms, no waiting, no friction.',
    url: 'https://agenticaiforgood.com/how-it-works',
    type: 'website',
  },
  alternates: { canonical: 'https://agenticaiforgood.com/how-it-works' },
}

export default function Page() {
  return (
    <Suspense>
      <HowItWorksPage />
    </Suspense>
  )
}
