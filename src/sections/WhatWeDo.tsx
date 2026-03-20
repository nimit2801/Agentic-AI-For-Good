'use client'
import { useEffect, useRef } from 'react'
import { Layers, GitBranch, BarChart3 } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: Layers,
    title: 'Curate',
    description: 'Real agentic AI use cases from healthcare to logistics.',
  },
  {
    icon: GitBranch,
    title: 'Break Down',
    description: 'Architectures, workflows, and decision logic.',
  },
  {
    icon: BarChart3,
    title: 'Measure',
    description: 'Impact metrics you can verify and compare.',
  },
]

export default function WhatWeDo() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

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
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#F5F1EB] flex items-center z-20"
    >
      <div ref={contentRef} className="w-full px-6 lg:px-[6vw] py-24">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-0">
          {/* Headline */}
          <div className="lg:w-[34vw] max-w-lg">
            <h2 className="display-heading text-[clamp(28px,3.2vw,52px)] text-[#1A1A1A] leading-[1.1]">
              WE CURATE.
              <br />
              BREAK DOWN.
              <br />
              MEASURE.
            </h2>
          </div>

          {/* Cards Stack + Coming Soon */}
          <div className="lg:w-[44vw] lg:min-w-[320px] w-full max-w-lg flex flex-col gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-[18px] card-shadow p-5 lg:p-6 flex items-start gap-4 lg:gap-5 relative overflow-hidden"
              >
                {/* Coming Soon Wavy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4754E]/10 via-[#D4754E]/5 to-transparent pointer-events-none">
                  <svg
                    className="absolute bottom-0 left-0 w-full h-8"
                    viewBox="0 0 400 32"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,16 Q50,0 100,16 T200,16 T300,16 T400,16 L400,32 L0,32 Z"
                      fill="rgba(212, 117, 78, 0.15)"
                    />
                    <path
                      d="M0,20 Q50,8 100,20 T200,20 T300,20 T400,20 L400,32 L0,32 Z"
                      fill="rgba(212, 117, 78, 0.1)"
                    />
                  </svg>
                </div>

                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-[#F5F1EB] flex items-center justify-center flex-shrink-0 relative z-10">
                  <feature.icon size={20} className="text-[#D4754E] lg:w-6 lg:h-6" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[#1A1A1A] font-semibold text-base lg:text-lg">
                      {feature.title}
                    </h3>
                    <span className="micro-label bg-[#D4754E]/10 text-[#D4754E] px-2 py-0.5 rounded-full">
                      Soon
                    </span>
                  </div>
                  <p className="text-[#6B6560] text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Coming Soon Banner */}
            <div className="mt-4 bg-[#1A1A1A] rounded-[18px] p-5 lg:p-6 text-center relative overflow-hidden">
              {/* Animated wave background */}
              <div className="absolute inset-0 opacity-20">
                <svg
                  className="absolute bottom-0 left-0 w-[200%] h-full"
                  viewBox="0 0 800 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,50 Q100,20 200,50 T400,50 T600,50 T800,50 L800,100 L0,100 Z"
                    fill="rgba(212, 117, 78, 0.3)"
                  >
                    <animate
                      attributeName="d"
                      dur="4s"
                      repeatCount="indefinite"
                      values="
                        M0,50 Q100,20 200,50 T400,50 T600,50 T800,50 L800,100 L0,100 Z;
                        M0,50 Q100,80 200,50 T400,50 T600,50 T800,50 L800,100 L0,100 Z;
                        M0,50 Q100,20 200,50 T400,50 T600,50 T800,50 L800,100 L0,100 Z
                      "
                    />
                  </path>
                </svg>
              </div>

              <div className="relative z-10">
                <span className="micro-label text-[#F5F1EB]/60 mb-2 block">
                  Full Services Launching
                </span>
                <p className="text-[#F5F1EB] font-semibold text-lg">
                  Coming Soon
                </p>
                <p className="text-[#F5F1EB]/60 text-sm mt-2">
                  We are building something special. Stay tuned.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
