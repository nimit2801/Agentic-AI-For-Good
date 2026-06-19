'use client'
import { useEffect, useRef } from 'react'
import { ArrowRight, Cpu, Users, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const pillars = [
  {
    icon: Cpu,
    text: 'Orchestration + memory + tool use',
  },
  {
    icon: Users,
    text: 'Human-in-the-loop at the right moments',
  },
  {
    icon: Shield,
    text: 'Evaluation rigs that catch regressions early',
  },
]

export default function Architecture() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<SVGSVGElement>(null)
  const router = useRouter()

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current

    if (!section || !content) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 50%',
            scrub: true,
          },
        }
      )

      // Continuous ring rotation
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          rotation: 360,
          duration: 30,
          repeat: -1,
          ease: 'none',
        })
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="architecture"
      className="relative w-full min-h-screen bg-[#1A1A1A] flex items-center z-40"
    >
      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Content */}
      <div ref={contentRef} className="relative w-full px-6 py-24 flex flex-col items-center justify-center">
        {/* Glowing Orb */}
        <div className="relative mb-8 lg:mb-12">
          {/* Orb glow */}
          <div
            className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[420px] lg:h-[420px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(212,117,78,0.25) 0%, rgba(212,117,78,0.08) 40%, transparent 70%)',
            }}
          />

          {/* Rotating ring */}
          <svg
            ref={ringRef}
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 400"
            fill="none"
            style={{ willChange: 'transform' }}
          >
            <circle
              cx="200"
              cy="200"
              r="160"
              stroke="rgba(212,117,78,0.2)"
              strokeWidth="1"
              strokeDasharray="8 8"
            />
            <circle
              cx="200"
              cy="200"
              r="180"
              stroke="rgba(212,117,78,0.1)"
              strokeWidth="0.5"
            />
          </svg>

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-[#D4754E]" />
        </div>

        {/* Headline */}
        <h2 className="display-heading text-[clamp(20px,2.6vw,44px)] text-[#F5F1EB] text-center mb-8 lg:mb-10">
          HOW REAL AGENT SYSTEMS ARE BUILT
        </h2>

        {/* Pillars */}
        <div className="flex flex-col gap-4 lg:gap-5 max-w-xl w-full mb-8 lg:mb-10">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="flex items-center gap-4 text-[#F5F1EB]/80"
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <pillar.icon size={16} className="text-[#D4754E] lg:w-5 lg:h-5" />
              </div>
              <span className="text-sm lg:text-base">{pillar.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push('/stories')}
          className="text-[#D4754E] text-sm font-medium flex items-center gap-1.5 hover:gap-2.5 transition-all duration-200"
        >
          Explore real agent deployments
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  )
}
