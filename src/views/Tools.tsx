'use client'
import { useEffect, useRef, useState } from 'react'
import { Loader2, SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import gsap from 'gsap'
import { useTools, useToolSearch } from '@/hooks/use-tools'
import ToolCard from '@/components/ToolCard'
import ToolSearchBar from '@/components/ToolSearchBar'

const categories = [
  'All',
  'LLM',
  'Vector DB',
  'RAG',
  'Agents',
  'Fine-tuning',
  'Monitoring',
  'Data',
  'Dev Tools',
]

const pricingFilters = ['All', 'free', 'freemium', 'paid']

export default function Tools() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''

  const [activeCategory, setActiveCategory] = useState('All')
  const [activePricing, setActivePricing] = useState('All')
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [showFilters, setShowFilters] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const { tools, loading: toolsLoading, error: toolsError } = useTools({
    category: activeCategory !== 'All' ? activeCategory : undefined,
  })

  const { results: searchResults, loading: searchLoading } = useToolSearch(searchQuery, { limit: 50 })

  const isSearching = searchQuery.trim().length > 1
  const loading = isSearching ? searchLoading : toolsLoading
  const error = toolsError

  const filtered = isSearching
    ? searchResults.filter(
        (t) =>
          (activeCategory === 'All' || t.category === activeCategory) &&
          (activePricing === 'All' || t.pricing === activePricing)
      )
    : tools.filter(
        (t) => activePricing === 'All' || t.pricing === activePricing
      )

  useEffect(() => {
    if (loading || !headerRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [loading])

  return (
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

      <div ref={headerRef} className="max-w-[1200px] mx-auto mb-10">
        {/* Header */}
        <div className="mb-8">
          <span className="micro-label text-[#D4754E] block mb-3">AI Tool Discovery</span>
          <h1 className="display-heading text-[clamp(32px,4vw,56px)] text-[#1A1A1A] mb-4">
            BROWSE TOOLS
          </h1>
          <p className="text-[#6B6560] text-base lg:text-lg max-w-2xl">
            Curated AI tools, frameworks, and infrastructure for builders. From LLMs to vector databases — find what you need, when you need it.
          </p>
        </div>

        {/* Search bar */}
        <ToolSearchBar
          placeholder="Search by tool name, use case, or technology..."
          className="max-w-2xl mb-6"
        />

        {/* Filters row */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 flex-1">
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

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
              showFilters || activePricing !== 'All'
                ? 'bg-[#D4754E] text-white border-[#D4754E]'
                : 'bg-white text-[#6B6560] border-[#1A1A1A]/8 hover:bg-[#1A1A1A]/5'
            }`}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-2xl border border-[#1A1A1A]/8">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="micro-label text-[#6B6560]">Pricing:</span>
              {pricingFilters.map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePricing(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    activePricing === p
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-[#F5F1EB] text-[#6B6560] hover:bg-[#1A1A1A]/8'
                  }`}
                >
                  {p === 'All' ? 'All pricing' : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      {!loading && !error && (
        <div className="max-w-[1200px] mx-auto mb-6">
          <span className="micro-label text-[#6B6560]">
            {filtered.length} tool{filtered.length !== 1 ? 's' : ''}
            {isSearching ? ` for "${searchQuery}"` : ''}
          </span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[#D4754E]" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="max-w-[1200px] mx-auto text-center py-20">
          <p className="text-[#6B6560]">Unable to load tools right now.</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="max-w-[1200px] mx-auto text-center py-20">
          <p className="text-[#1A1A1A] font-semibold mb-2">No tools found</p>
          <p className="text-[#6B6560] text-sm">
            {isSearching
              ? `No results for "${searchQuery}". Try different keywords.`
              : 'No tools in this category yet.'}
          </p>
        </div>
      )}

      {/* Tools grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tool, i) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              style={{
                opacity: 0,
                animation: `fadeInUp 0.5s ease forwards`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Submit CTA */}
      {!loading && (
        <div className="max-w-[1200px] mx-auto mt-16 p-8 bg-white rounded-2xl border border-[#1A1A1A]/5 text-center">
          <span className="micro-label text-[#D4754E] block mb-3">Missing a tool?</span>
          <h3 className="display-heading text-xl text-[#1A1A1A] mb-3">SUBMIT A TOOL</h3>
          <p className="text-[#6B6560] text-sm mb-6 max-w-md mx-auto">
            Know a great AI tool that belongs here? Help the community by submitting it for review.
          </p>
          <a
            href="/tools/submit"
            className="inline-flex items-center gap-2 bg-[#D4754E] hover:bg-[#C0653E] text-white rounded-full px-6 py-3 text-sm font-medium transition-all duration-200"
          >
            Submit a Tool
          </a>
        </div>
      )}
    </section>
  )
}
