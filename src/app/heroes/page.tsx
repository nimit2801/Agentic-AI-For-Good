import type { Metadata } from 'next'
import Heroes from '@/views/Heroes'

export const metadata: Metadata = {
  title: 'Agentic AI Heroes: nominate someone | Agentic AI For Good',
  description:
    'Agentic AI Heroes celebrates the advocates, event hosts, bloggers, builders and open source contributors doing real work in agentic AI. Nominate yourself or someone you know.',
  alternates: { canonical: 'https://agenticaiforgood.com/heroes' },
  openGraph: {
    title: 'Agentic AI Heroes | Agentic AI For Good',
    description:
      'Celebrating people doing real work in agentic AI. Nominate yourself or someone you know.',
    url: 'https://agenticaiforgood.com/heroes',
    siteName: 'Agentic AI For Good',
    type: 'website',
  },
}

export default function HeroesPage() {
  return <Heroes />
}
