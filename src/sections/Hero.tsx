'use client'
import { useState, useEffect, useRef } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import gsap from 'gsap'
import { GitHubStarsPill } from '@/components/GitHubStars'

export default function Hero() {
  const [query, setQuery] = useState('')
  const sectionRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadlineRef = useRef<HTMLParagraphElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([logoRef.current, headlineRef.current, subheadlineRef.current, searchRef.current, pillRef.current, linksRef.current], {
        opacity: 0,
        y: 20,
      })

      // Animation timeline
      const tl = gsap.timeline({ delay: 0.3 })

      tl.to(logoRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
        .to(
          headlineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.3'
        )
        .to(
          subheadlineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.4'
        )
        .to(
          searchRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.3'
        )
        .to(
          pillRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.3'
        )
        .to(
          linksRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.3'
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToJoin = () => scrollToSection('#join')

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#F5F1EB] flex items-center justify-center px-6 lg:px-[6vw] pt-20"
    >
      {/* Decorative accent dot */}
      <div className="absolute top-[18vh] left-[calc(50%+180px)] w-2 h-2 rounded-full bg-[#D4754E] hidden lg:block" />

      <div className="w-full max-w-[980px] text-center">
        {/* Logo */}
        <div ref={logoRef} className="mb-8">
          <Image
            src="/images/logos/Leaf%20Logo%20no%20bg.png"
            alt="Agentic AI For Good"
            width={120}
            height={120}
            className="mx-auto w-24 h-24 lg:w-32 lg:h-32"
            priority
          />
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="display-heading text-[clamp(36px,5.2vw,78px)] text-[#1A1A1A] mb-6"
        >
          AGENTIC AI.
          <br />
          REAL IMPACT.
        </h1>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="text-[#6B6560] text-base lg:text-lg max-w-xl mx-auto mb-8"
        >
          Cutting through the noise to showcase how autonomous AI systems are solving real problems.
        </p>

        {/* Search Bar */}
        <div ref={searchRef} className="mb-6">
          <div className="relative max-w-[720px] mx-auto">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6B6560]">
              <Search size={20} />
            </div>
            <label htmlFor="hero-search" className="sr-only">Search AI use cases</label>
            <input
              id="hero-search"
              type="text"
              placeholder="Try: &apos;build a RAG pipeline&apos;..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && query.trim()) router.push('/tools?q=' + encodeURIComponent(query.trim())) }}
              className="w-full h-14 lg:h-16 bg-white border border-[#1A1A1A]/8 rounded-[18px] pl-14 pr-16 text-sm lg:text-base text-[#1A1A1A] placeholder:text-[#6B6560]/60 focus:outline-none focus:ring-2 focus:ring-[#D4754E]/30 transition-all duration-200"
            />
            <button aria-label="Search" onClick={() => { if (query.trim()) router.push('/tools?q=' + encodeURIComponent(query.trim())) }} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1A1A1A] rounded-xl flex items-center justify-center text-white hover:bg-[#D4754E] transition-colors duration-200">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Social proof: GitHub stars */}
        <div ref={pillRef} className="mb-6 flex justify-center">
          <GitHubStarsPill />
        </div>

        {/* CTA Links */}
        <div ref={linksRef} className="flex items-center justify-center gap-6">
          <button
            onClick={() => router.push('/stories')}
            className="text-[#1A1A1A] text-sm font-medium hover:text-[#D4754E] transition-colors duration-200 flex items-center gap-1"
          >
            Explore Use Cases
            <ArrowRight size={14} />
          </button>
          <span className="text-[#1A1A1A]/20">|</span>
          <button
            onClick={scrollToJoin}
            className="text-[#1A1A1A] text-sm font-medium hover:text-[#D4754E] transition-colors duration-200"
          >
            Get Early Access
          </button>
        </div>
      </div>
    </section>
  )
}
