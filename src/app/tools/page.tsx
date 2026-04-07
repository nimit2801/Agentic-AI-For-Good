import { Suspense } from 'react'
import Tools from '@/views/Tools'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse AI Tools | Agentic AI For Good',
  description: 'Discover curated AI tools, frameworks, and infrastructure for builders. From LLMs to vector databases.',
}

export default function ToolsPage() {
  return (
    <Suspense>
      <Tools />
    </Suspense>
  )
}
