'use client'

import Link from 'next/link'

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar w-full bg-[#1A1A1A] text-white text-xs sm:text-sm py-2.5 px-3 sm:px-4 text-center relative z-[60] leading-tight">
      <>
        <Link
          href="https://luma.com/51qkhk0q"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 sm:gap-2 hover:text-[#D4754E] transition-colors duration-200"
        >
          <span className="inline-flex items-center gap-1 sm:gap-1.5">
            <span className="bg-[#D4754E] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
              Jun 13
            </span>
            <span className="truncate max-w-[220px] xs:max-w-none">
              Vibe with Hermes Agent — Bengaluru ·{ ' ' }
              <span className="underline underline-offset-2 decoration-[#D4754E]/50 hover:decoration-[#D4754E]">
                RSVP
              </span>
            </span>
          </span>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 hidden sm:inline">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>
        <span className="mx-1.5 sm:mx-3 text-white/30 hidden sm:inline">|</span>
        <Link
          href="https://luma.com/5r86uitl"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 sm:gap-2 hover:text-[#D4754E] transition-colors duration-200 hidden sm:inline-flex"
        >
          <span className="inline-flex items-center gap-1 sm:gap-1.5">
            <span className="bg-[#D4754E] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full">
              Jun 17
            </span>
            <span>
              Mumbai Mixer ·{ ' ' }
              <span className="underline underline-offset-2 decoration-[#D4754E]/50 hover:decoration-[#D4754E]">
                RSVP
              </span>
            </span>
          </span>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>
      </>
    </div>
  )
}
