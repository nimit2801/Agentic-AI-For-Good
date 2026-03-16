import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useStories } from '@/hooks/use-stories';

const categories = [
  'All',
  'Developer Tools',
  'Open Source AI',
  'Document Intelligence',
  'Robotics & Physical AI',
  'Enterprise AI',
  'AI Safety & Evaluation',
  'Open Data',
];

export default function Stories() {
  const { stories, loading, error } = useStories();
  const [activeCategory, setActiveCategory] = useState('All');
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCategory === 'All'
      ? stories
      : stories.filter((s) => s.category === activeCategory);

  useEffect(() => {
    if (loading || !headerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Card animations handled via CSS to avoid GSAP/React conflicts
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, activeCategory]);

  return (
    <>
    <Helmet>
      <title>AI Use Cases & Stories — Real Impact from Autonomous AI | Agentic AI For Good</title>
      <meta name="description" content="Explore real-world AI deployments across healthcare, logistics, developer tools, and open source. Curated stories of autonomous AI systems making measurable impact." />
    </Helmet>
    <section
      ref={sectionRef}
      className="min-h-screen bg-[#F5F1EB] pt-28 pb-20 px-6 lg:px-[6vw]"
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div ref={headerRef} className="max-w-[1200px] mx-auto mb-12">
        <h1 className="display-heading text-[clamp(32px,4vw,56px)] text-[#1A1A1A] mb-4">
          STORIES
        </h1>
        <p className="text-[#6B6560] text-base lg:text-lg max-w-2xl mb-8">
          Real stories of autonomous AI systems making measurable impact across
          industries.
        </p>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-white text-[#6B6560] hover:bg-[#1A1A1A]/5 border border-[#1A1A1A]/8'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[#D4754E]" />
        </div>
      )}

      {error && (
        <div className="max-w-[1200px] mx-auto text-center py-20">
          <p className="text-[#6B6560]">Unable to load stories right now.</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="max-w-[1200px] mx-auto text-center py-20">
          <p className="text-[#6B6560]">No stories in this category yet.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="stories-grid max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((story, i) => (
            <Link
              key={story.id}
              to={`/stories/${story.slug}`}
              className="story-card group bg-white rounded-2xl overflow-hidden border border-[#1A1A1A]/5 hover:border-[#D4754E]/30 transition-all duration-300 hover:shadow-lg"
              style={{
                opacity: 0,
                animation: `fadeInUp 0.5s ease forwards`,
                animationDelay: `${i * 0.06}s`,
              }}
            >
              {story.image_url && (
                <div className="aspect-[16/9] overflow-hidden bg-[#E8E2D9]">
                  <img
                    src={story.image_url}
                    alt={story.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {story.category && (
                    <span className="text-xs font-medium text-[#D4754E] bg-[#D4754E]/10 px-2.5 py-1 rounded-full">
                      {story.category}
                    </span>
                  )}
                  {story.company && (
                    <span className="text-xs font-medium text-[#6B6560]">
                      {story.company}
                    </span>
                  )}
                </div>
                <h3 className="text-[#1A1A1A] font-semibold text-lg mb-2 group-hover:text-[#D4754E] transition-colors duration-200">
                  {story.title}
                </h3>
                <p className="text-[#6B6560] text-sm leading-relaxed mb-4">
                  {story.description}
                </p>
                <div className="flex items-center gap-1 text-[#1A1A1A] text-sm font-medium group-hover:text-[#D4754E] transition-colors duration-200">
                  Read story
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
    </>
  );
}
