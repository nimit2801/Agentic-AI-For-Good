import type { Metadata } from 'next'
import SubmitTool from '@/views/SubmitTool'

export const metadata: Metadata = {
  title: 'Submit a Tool | Agentic AI For Good',
  description: 'Submit an AI tool, framework, or infrastructure project to be featured in our curated directory.',
}

export default function SubmitToolPage() {
  return <SubmitTool />
}
