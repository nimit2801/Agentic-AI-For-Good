import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unsubscribed — Agentic AI For Good',
  robots: { index: false },
}

export default function UnsubscribedPage() {
  return (
    <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl border border-[#1A1A1A]/5 p-12">
          <div className="w-12 h-12 rounded-full bg-[#1A1A1A]/5 flex items-center justify-center mx-auto mb-6">
            <span className="text-xl">👋</span>
          </div>
          <span className="micro-label text-[#6B6560] block mb-3">UNSUBSCRIBED</span>
          <h1 className="display-heading text-2xl text-[#1A1A1A] mb-4">
            YOU&apos;RE OFF THE LIST
          </h1>
          <p className="text-[#6B6560] text-sm leading-relaxed mb-8">
            You&apos;ve been removed from the weekly digest. No more emails from us.
          </p>
          <p className="text-[#6B6560] text-sm leading-relaxed mb-8">
            The catalog is still there whenever you need it.
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 bg-[#D4754E] hover:bg-[#C0653E] text-white rounded-full px-6 py-3 text-sm font-medium transition-all duration-200"
          >
            Browse tools
          </Link>
        </div>
      </div>
    </div>
  )
}
