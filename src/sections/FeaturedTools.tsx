import Link from 'next/link'
import { ArrowRight, Star, GitBranch } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import type { Tool } from '@/lib/supabase'

function FeaturedToolCard({ tool }: { tool: Tool }) {
  const pricingColor: Record<string, string> = {
    free: 'text-emerald-700 bg-emerald-50',
    freemium: 'text-amber-700 bg-amber-50',
    paid: 'text-[#6B6560] bg-[#1A1A1A]/5',
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group bg-[#F5F1EB] border border-[#1A1A1A]/8 rounded-2xl p-6 hover:border-[#D4754E]/40 hover:bg-white transition-all duration-300 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {tool.logo_url ? (
            <img
              src={tool.logo_url}
              alt={tool.name}
              className="w-10 h-10 rounded-xl object-contain flex-shrink-0 bg-white"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#D4754E]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[#D4754E] font-bold text-lg font-mono">
                {tool.name[0].toUpperCase()}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[#1A1A1A] font-semibold text-sm leading-tight group-hover:text-[#D4754E] transition-colors truncate">
              {tool.name}
            </p>
            {tool.category && (
              <span className="micro-label text-[#6B6560] block mt-0.5">{tool.category}</span>
            )}
          </div>
        </div>
        {tool.pricing && (
          <span className={`micro-label px-2 py-0.5 rounded-full flex-shrink-0 ${pricingColor[tool.pricing] ?? 'text-[#6B6560] bg-[#1A1A1A]/5'}`}>
            {tool.pricing}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-[#6B6560] text-sm leading-relaxed line-clamp-2 flex-1">
        {tool.tagline ?? tool.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {tool.github_stars != null && (
            <span className="flex items-center gap-1 text-xs text-[#6B6560]">
              <Star size={11} className="fill-[#6B6560]/40" />
              {tool.github_stars >= 1000 ? `${(tool.github_stars / 1000).toFixed(1)}k` : tool.github_stars}
            </span>
          )}
          {tool.is_open_source && (
            <span className="flex items-center gap-1 text-xs text-[#6B6560]">
              <GitBranch size={11} />
              Open Source
            </span>
          )}
        </div>
        <ArrowRight
          size={14}
          className="text-[#6B6560]/30 group-hover:text-[#D4754E] group-hover:translate-x-0.5 transition-all duration-200"
        />
      </div>
    </Link>
  )
}

export default async function FeaturedTools() {
  const supabase = createServerSupabaseClient()
  const { data: tools } = await supabase
    .from('tools')
    .select('*')
    .eq('approved', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(6)

  // Fall back to most recent approved tools if none are featured
  const displayTools = (tools && tools.length > 0)
    ? tools
    : await supabase
        .from('tools')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(6)
        .then(({ data }) => data ?? [])

  if (!displayTools || displayTools.length === 0) return null

  return (
    <section className="bg-white py-20 px-6 lg:px-[6vw]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="micro-label text-[#D4754E] block mb-3">HANDPICKED</span>
            <h2 className="display-heading text-[clamp(24px,3vw,40px)] text-[#1A1A1A]">
              FEATURED TOOLS
            </h2>
            <p className="text-[#6B6560] text-base mt-2 max-w-lg">
              Curated picks for builders working with agentic AI — vetted, documented, and ready to use.
            </p>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-[#D4754E] hover:text-[#C0653E] text-sm font-medium transition-colors group"
          >
            Browse all tools
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayTools.map((tool) => (
            <FeaturedToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  )
}
