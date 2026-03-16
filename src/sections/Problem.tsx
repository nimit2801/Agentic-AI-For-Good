import { useEffect, useRef } from 'react';
import { TrendingUp } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

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
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#F5F1EB] flex items-center z-10"
    >
      <div ref={contentRef} className="w-full px-6 lg:px-[6vw] py-24">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-0">
          {/* Headline */}
          <div className="lg:w-[58vw] max-w-4xl">
            <h2 className="display-heading text-[clamp(28px,4.6vw,72px)] text-[#1A1A1A] leading-[1.05]">
              <span className="block">AI IS LOUD.</span>
              <span className="block">HYPE DOMINATES.</span>
              <span className="block">REAL VALUE IS BURIED.</span>
            </h2>
          </div>

          {/* Insight Card */}
          <div className="lg:w-[26vw] lg:min-w-[280px] w-full max-w-md bg-white rounded-[18px] card-shadow p-6 lg:p-7">
            <h3 className="text-[#1A1A1A] font-semibold text-lg mb-3">
              The Signal Problem
            </h3>
            <p className="text-[#6B6560] text-sm leading-relaxed mb-5">
              For every real deployment, there are a hundred demos. We index the work that ships.
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-[#1A1A1A]/8">
              <div className="w-8 h-8 rounded-lg bg-[#D4754E]/10 flex items-center justify-center">
                <TrendingUp size={16} className="text-[#D4754E]" />
              </div>
              <div>
                <p className="micro-label text-[#6B6560]">Coverage</p>
                <p className="text-[#1A1A1A] font-semibold text-sm">200+ verified systems</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
