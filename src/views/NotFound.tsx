'use client'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <section className="min-h-screen bg-[#F5F1EB] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <span className="font-mono text-sm text-[#D4754E] tracking-widest uppercase block mb-6">404</span>
        <h1 className="display-heading text-[clamp(32px,5vw,64px)] text-[#1A1A1A] mb-4">
          PAGE NOT FOUND
        </h1>
        <p className="text-[#6B6560] text-base mb-8">
          The page you&apos;re looking for doesn&apos;t exist. It may have moved or been removed.
        </p>
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-[#1A1A1A] text-sm font-medium hover:text-[#D4754E] transition-colors duration-200"
        >
          Back to home
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  )
}
