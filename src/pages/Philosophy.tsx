import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const philosophyCards = [
  {
    image: '/images/philosophy-agency.png',
    title: 'Agency',
    subtitle: 'The power to act',
    description:
      'True agency is not about replacing human judgment—it is about amplifying it. We believe AI should extend human capability, not diminish it. The best agents work alongside people, handling the repetitive while humans focus on the meaningful.',
    bgColor: '#D4A5A5',
  },
  {
    image: '/images/philosophy-awareness.png',
    title: 'Awareness',
    subtitle: 'Perception with purpose',
    description:
      'An agent must understand context, not just commands. It needs to know when to act, when to ask, and when to step back. This awareness—of situation, of stakes, of human need—is what separates useful tools from truly helpful partners.',
    bgColor: '#9CAF88',
  },
  {
    image: '/images/philosophy-collaboration.png',
    title: 'Collaboration',
    subtitle: 'Human-AI partnership',
    description:
      'The future is not human vs. machine. It is human with machine. We design for collaboration—systems that learn from feedback, adapt to preference, and grow more helpful over time. The goal is synergy, not substitution.',
    bgColor: '#D4C4B0',
  },
];

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const header = headerRef.current;
    const cards = cardRefs.current.filter(Boolean);

    if (!header) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        header,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.2,
        }
      );

      // Cards animation
      cards.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
    <Helmet>
      <title>Our Philosophy — How We Think About AI Agents | Agentic AI For Good</title>
      <meta name="description" content="Agency, awareness, and collaboration — the three principles guiding how we think about AI systems that act in the world." />
    </Helmet>
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#F5F1EB] pt-24 lg:pt-32 pb-20"
    >
      <div className="px-6 lg:px-[6vw]">
        {/* Header */}
        <div ref={headerRef} className="max-w-3xl mb-16 lg:mb-24">
          <span className="micro-label text-[#6B6560] mb-4 block">
            Our Philosophy
          </span>
          <h1 className="display-heading text-[clamp(32px,4vw,56px)] text-[#1A1A1A] mb-6">
            HOW WE THINK ABOUT AGENTS
          </h1>
          <p className="text-[#6B6560] text-lg lg:text-xl leading-relaxed">
            Three principles guide everything we do. They shape how we curate,
            what we feature, and why we believe agentic AI matters.
          </p>
        </div>

        {/* Philosophy Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {philosophyCards.map((card, index) => (
            <div
              key={card.title}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="group"
            >
              {/* Image Card */}
              <div
                className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6"
                style={{ backgroundColor: card.bgColor }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div>
                <span className="micro-label text-[#6B6560] mb-2 block">
                  {card.subtitle}
                </span>
                <h2 className="text-[#1A1A1A] font-semibold text-2xl lg:text-3xl mb-4">
                  {card.title}
                </h2>
                <p className="text-[#6B6560] text-base leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Quote */}
        <div className="mt-20 lg:mt-32 max-w-2xl mx-auto text-center">
          <blockquote className="text-[#1A1A1A] text-xl lg:text-2xl font-medium italic leading-relaxed mb-6">
            "The question is not whether AI will change the world. It is whether
            we will shape that change with intention."
          </blockquote>
          <cite className="text-[#6B6560] text-sm not-italic">
            — Our guiding principle
          </cite>
        </div>
      </div>
    </section>
    </>
  );
}
