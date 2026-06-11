'use client'

import Link from 'next/link'

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar w-full bg-[#1A1A1A] text-white text-sm py-2.5 px-4 text-center relative z-[60]">
      <>
        <Link
          href="https://luma.com/51qkhk0q"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 hover:text-[#D4754E] transition-colors duration-200"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="bg-[#D4754E] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              Jun 13
            </span>
            <span>
              Vibe with Hermes Agent — Bengaluru, 10AM-4PM ·{' '}
              <span className="underline underline-offset-2 decoration-[#D4754E]/50 hover:decoration-[#D4754E]">
                RSVP on Luma
              </span>
            </span>
          </span>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 shrink-0">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>
        <span className="mx-3 text-white/30 hidden sm:inline">|</span>
        <Link
          href="https://luma.com/5r86uitl"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 hover:text-[#D4754E] transition-colors duration-200 hidden sm:inline-flex"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="bg-[#D4754E] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              Jun 17
            </span>
            <span>
              Mumbai Mixer — After OSS India ·{' '}
              <span className="underline underline-offset-2 decoration-[#D4754E]/50 hover:decoration-[#D4754E]">
                RSVP
              </span>
            </span>
          </span>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 shrink-0">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>
      </>
    </div>
  )
}
