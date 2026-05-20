import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import AnnouncementBar from '@/components/AnnouncementBar'
import Footer from '@/sections/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { PostHogProvider } from '@/components/PostHogProvider'

export const metadata: Metadata = {
  title: 'Agentic AI For Good | Discover AI Tools That Actually Work',
  description: 'The curated platform for discovering AI tools, open-source projects, and real-world deployments. Built for professionals and builders.',
  keywords: 'AI tools, agentic AI, AI discovery, open source AI, AI for good',
  metadataBase: new URL('https://agenticaiforgood.com'),
  openGraph: {
    type: 'website',
    url: 'https://agenticaiforgood.com',
    title: 'Agentic AI For Good',
    description: 'The curated platform for discovering AI tools, open-source projects, and real-world deployments.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agentic AI For Good',
    description: 'The curated platform for discovering AI tools, open-source projects, and real-world deployments.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Agentic AI For Good",
              url: "https://agenticaiforgood.com",
              logo: "https://agenticaiforgood.com/favicon.svg",
              sameAs: ["https://linkedin.com/company/agentic-ai-for-good"],
            }),
          }}
        />
      </head>
     <body>
        <PostHogProvider>
       <div className="grain-overlay" aria-hidden="true" />
       <AnnouncementBar />
       <ScrollToTop />
       <Navigation />
       <main>{children}</main>
       <Footer />
        </PostHogProvider>
     </body>
    </html>
  )
}
