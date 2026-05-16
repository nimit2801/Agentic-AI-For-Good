'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const links = [
  {
    label: 'Discord Community',
    description: 'Join the conversation — share builds, ask questions, connect with builders.',
    href: 'https://discord.gg/cgffxH9KQx',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
      </svg>
    ),
    accent: '#5865F2',
    tag: 'Community Hub',
  },
  {
    label: 'LinkedIn',
    description: 'Follow us for updates, research highlights, and community news.',
    href: 'https://www.linkedin.com/company/agentic-ai-for-good/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    accent: '#0A66C2',
    tag: 'Stay Updated',
  },
  {
    label: 'GitHub',
    description: 'Contribute tools, fix bugs, and help build the catalog with the community.',
    href: 'https://github.com/nimit2801/Agentic-AI-For-Good',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
    accent: '#1A1A1A',
    tag: 'Open Source',
  },
  {
    label: 'Offline Meetup',
    description: 'Come build in person — join our next community event.',
    href: 'https://luma.com/4xc1g1hc',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    accent: '#D4754E',
    tag: 'IRL Event',
  },
  {
    label: 'Episode 1 — OpenClaw',
    description: 'Watch our first live session on personal AI and open agent architectures.',
    href: 'https://www.linkedin.com/events/7460580585044881409?viewAsMember=true',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    accent: '#0A66C2',
    tag: 'Episode 1',
  },
  {
    label: 'Episode 2 — Personal AI Agents',
    description: 'Our second episode diving deep into personal AI and agentic workflows.',
    href: 'https://www.linkedin.com/posts/nimitsavant_openclaw-personalai-aiagents-activity-7426241106318635008-K8-z',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    accent: '#0A66C2',
    tag: 'Episode 2',
  },
]

export default function Community() {
  const headerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    const header = headerRef.current
    const cards = cardRefs.current.filter(Boolean)

    gsap.fromTo(
      header,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.1 }
    )

    cards.forEach((card, i) => {
      if (!card) return
      gsap.fromTo(
        card,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.2 + i * 0.08,
        }
      )
    })
  }, [])

  return (
    <section className="relative w-full min-h-screen bg-[#F5F1EB] pt-24 lg:pt-32 pb-20">
      <div className="px-6 lg:px-[6vw]">
        {/* Header */}
        <div ref={headerRef} className="max-w-2xl mb-16 lg:mb-20">
          <span className="micro-label text-[#6B6560] mb-4 block">Community</span>
          <h1 className="display-heading text-[clamp(32px,4vw,56px)] text-[#1A1A1A] mb-6">
            JOIN THE MOVEMENT
          </h1>
          <p className="text-[#6B6560] text-lg lg:text-xl leading-relaxed">
            Connect with builders, researchers, and thinkers working at the frontier of agentic AI.
            Find us wherever you are.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl">
          {links.map((link, i) => (
            <a
              key={link.label}
              ref={(el) => { cardRefs.current[i] = el }}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-4 bg-white rounded-2xl p-6 border border-[#1A1A1A]/8 hover:border-[#1A1A1A]/20 hover:shadow-lg transition-all duration-300"
            >
              {/* Icon + Tag row */}
              <div className="flex items-center justify-between">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: link.accent }}
                >
                  {link.icon}
                </div>
                <span className="text-xs font-medium text-[#6B6560] bg-[#F5F1EB] px-3 py-1 rounded-full">
                  {link.tag}
                </span>
              </div>

              {/* Text */}
              <div>
                <h2 className="text-[#1A1A1A] font-semibold text-lg mb-1 group-hover:text-[#D4754E] transition-colors duration-200">
                  {link.label}
                </h2>
                <p className="text-[#6B6560] text-sm leading-relaxed">{link.description}</p>
              </div>

              {/* Arrow */}
              <div className="mt-auto pt-2 flex items-center gap-1 text-[#D4754E] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span>Visit</span>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* Linktree CTA */}
        <div className="mt-16 max-w-5xl">
          <a
            href="https://linktr.ee/agenticaiforgood"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#1A1A1A] text-white px-8 py-4 rounded-full font-medium text-base hover:bg-[#D4754E] transition-colors duration-300"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M7.953 15.066c-.08.163-.08.324 0 .487l2.56 4.43c.08.163.243.243.406.243h2.163c.163 0 .325-.08.406-.243l2.56-4.43c.08-.163.08-.324 0-.487l-2.56-4.43c-.08-.163-.243-.243-.406-.243h-2.163c-.163 0-.325.08-.406.243l-2.56 4.43zm3.374-8.893L9.22 9.58H6.416c-.163 0-.325.08-.406.244L3.45 13.937c-.081.163-.081.325 0 .487l2.56 4.113c.08.163.243.244.406.244h2.804l2.107 3.63c.08.163.243.244.406.244h2.56c.163 0 .325-.081.406-.244l2.107-3.63h2.804c.163 0 .325-.081.406-.244l2.56-4.113c.081-.162.081-.324 0-.487L20.016 9.824c-.08-.163-.243-.244-.406-.244h-2.804L14.7 6.173c-.081-.163-.244-.244-.406-.244h-2.56c-.163 0-.325.081-.406.244z" />
            </svg>
            All links on Linktree
          </a>
        </div>
      </div>
    </section>
  )
}
