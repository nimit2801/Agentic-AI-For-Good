import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabase';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const storySections = [
  {
    image: '/images/story-origin.png',
    title: 'The Seed',
    subtitle: 'Where it began',
    description:
      'We started with a simple observation: for every real agentic AI deployment, there were a hundred demos. The signal was drowning in noise. Builders were shipping incredible work—systems that saved lives, cut costs, and transformed industries—but no one was documenting it. We decided to change that.',
    bgColor: '#C9A689',
  },
  {
    image: '/images/story-mission.png',
    title: 'The Direction',
    subtitle: 'Why we do this',
    description:
      'Our mission is to surface the real work. We curate verified use cases, break down architectures, and highlight impact metrics. We believe that by showcasing what is actually working, we can help the entire field move faster—builders learning from builders, founders inspired by proof, researchers guided by evidence.',
    bgColor: '#7A9E9F',
  },
  {
    image: '/images/story-vision.png',
    title: 'The Horizon',
    subtitle: 'Where we are going',
    description:
      'We envision a world where agentic AI is understood not through hype, but through results. Where every builder has access to the patterns, pitfalls, and proven approaches of those who came before. Where the conversation shifts from what AI might do, to what AI is already doing—responsibly, effectively, and for good.',
    bgColor: '#9B8AA5',
  },
];

export default function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const header = headerRef.current;
    const sections = sectionRefs.current.filter(Boolean);

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

      // Story sections animation
      sections.forEach((section) => {
        if (!section) return;
        const image = section.querySelector('.story-image');
        const content = section.querySelector('.story-content');

        gsap.fromTo(
          image,
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          content,
          { x: 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.15,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const [storyEmail, setStoryEmail] = useState('');
  const [storySubmitted, setStorySubmitted] = useState(false);
  const [storyLoading, setStoryLoading] = useState(false);

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyEmail) return;
    setStoryLoading(true);
    const { error } = await supabase
      .from('subscribers')
      .insert({ email: storyEmail, source: 'story-page' });
    setStoryLoading(false);
    if (!error || error.code === '23505') {
      setStorySubmitted(true);
      setStoryEmail('');
    }
  };

  return (
    <>
    <Helmet>
      <title>Our Story — The Mission Behind Agentic AI For Good</title>
      <meta name="description" content="We started with a simple observation: real AI deployments were drowning in noise. Discover why we built Agentic AI For Good and what drives us." />
    </Helmet>
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#F5F1EB] pt-24 lg:pt-32 pb-20"
    >
      <div className="px-6 lg:px-[6vw]">
        {/* Header */}
        <div ref={headerRef} className="max-w-3xl mb-16 lg:mb-24">
          <span className="micro-label text-[#6B6560] mb-4 block">Our Story</span>
          <h1 className="display-heading text-[clamp(32px,4vw,56px)] text-[#1A1A1A] mb-6">
            THE SOUL OF WHAT WE DO
          </h1>
          <p className="text-[#6B6560] text-lg lg:text-xl leading-relaxed">
            Every project has an origin. Ours began with a question: where is
            the real work?
          </p>
        </div>

        {/* Story Sections */}
        <div className="space-y-20 lg:space-y-32">
          {storySections.map((story, index) => (
            <div
              key={story.title}
              ref={(el) => { sectionRefs.current[index] = el; }}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 lg:gap-16 items-center`}
            >
              {/* Image */}
              <div
                className="story-image w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden"
                style={{ backgroundColor: story.bgColor }}
              >
                <img
                  src={story.image}
                  alt={story.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="story-content w-full lg:w-1/2">
                <span className="micro-label text-[#6B6560] mb-3 block">
                  {story.subtitle}
                </span>
                <h2 className="text-[#1A1A1A] font-semibold text-2xl lg:text-4xl mb-6">
                  {story.title}
                </h2>
                <p className="text-[#6B6560] text-base lg:text-lg leading-relaxed">
                  {story.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Submit CTA */}
        <div className="mt-20 lg:mt-32 max-w-xl mx-auto text-center">
          <div className="bg-white rounded-2xl card-shadow p-8 lg:p-10">
            <h3 className="text-[#1A1A1A] font-semibold text-xl lg:text-2xl mb-4">
              Be Part of the Story
            </h3>
            <p className="text-[#6B6560] text-base mb-6">
              Are you building something with agentic AI? We would love to hear
              about it.
            </p>
            <form onSubmit={handleStorySubmit} className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="story-email" className="sr-only">Email address</label>
              <input
                id="story-email"
                type="email"
                value={storyEmail}
                onChange={(e) => setStoryEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="flex-1 h-12 bg-[#F5F1EB] border border-[#1A1A1A]/8 rounded-xl px-4 text-sm text-[#1A1A1A] placeholder:text-[#6B6560]/60 focus:outline-none focus:ring-2 focus:ring-[#D4754E]/30 transition-all duration-200"
              />
              <button
                type="submit"
                disabled={storyLoading}
                className="h-12 bg-[#D4754E] hover:bg-[#C0653E] text-white rounded-xl px-6 text-sm font-medium transition-all duration-200 disabled:opacity-60"
              >
                {storySubmitted ? "We'll be in touch!" : storyLoading ? 'Sending...' : 'Submit Your Story'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
