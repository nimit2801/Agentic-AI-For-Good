'use client'
import Link from 'next/link'
import { Star, GitBranch, ExternalLink } from 'lucide-react'
import type { Tool } from '@/lib/supabase'

interface ToolCardProps {
  tool: Tool
  style?: React.CSSProperties
}

export default function ToolCard({ tool, style }: ToolCardProps) {
  const pricingColor = {
    free: 'text-emerald-700 bg-emerald-50',
    freemium: 'text-amber-700 bg-amber-50',
    paid: 'text-[#6B6560] bg-[#1A1A1A]/5',
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-[#1A1A1A]/5 hover:border-[#D4754E]/30 transition-all duration-300 hover:shadow-lg flex flex-col"
      style={style}
    >
      {/* Card Header */}
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Logo or initial */}
          <div className="flex items-center gap-3 min-w-0">
            {tool.logo_url ? (
              <img
                src={tool.logo_url}
                alt={tool.name}
                className="w-10 h-10 rounded-xl object-contain flex-shrink-0 bg-[#F5F1EB]"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#D4754E]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[#D4754E] font-bold text-lg font-mono">
                  {tool.name[0].toUpperCase()}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-[#1A1A1A] font-semibold text-base leading-tight group-hover:text-[#D4754E] transition-colors duration-200 truncate">
                {tool.name}
              </h3>
              {tool.category && (
                <span className="micro-label text-[#6B6560] block mt-0.5">
                  {tool.category}
                </span>
              )}
            </div>
          </div>

          {/* Pricing badge */}
          {tool.pricing && (
            <span
              className={`micro-label px-2.5 py-1 rounded-full flex-shrink-0 ${pricingColor[tool.pricing] ?? 'text-[#6B6560] bg-[#1A1A1A]/5'}`}
            >
              {tool.pricing}
            </span>
          )}
        </div>

        {/* Tagline or description */}
        <p className="text-[#6B6560] text-sm leading-relaxed mb-4 line-clamp-2">
          {tool.tagline ?? tool.description}
        </p>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tool.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="micro-label text-[#6B6560] bg-[#F5F1EB] px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
            {tool.tags.length > 3 && (
              <span className="micro-label text-[#6B6560]/60 px-2 py-0.5">
                +{tool.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stack languages */}
        {tool.stack_languages && tool.stack_languages.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tool.stack_languages.slice(0, 3).map((lang) => (
              <span
                key={lang}
                className="micro-label text-[#D4754E] bg-[#D4754E]/8 px-2 py-0.5 rounded"
              >
                {lang}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-6 py-3 border-t border-[#1A1A1A]/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {tool.github_stars != null && (
            <span className="flex items-center gap-1 text-xs text-[#6B6560]">
              <Star size={12} className="fill-[#6B6560]/40" />
              {tool.github_stars >= 1000
                ? `${(tool.github_stars / 1000).toFixed(1)}k`
                : tool.github_stars}
            </span>
          )}
          {tool.is_open_source && (
            <span className="flex items-center gap-1 text-xs text-[#6B6560]">
              <GitBranch size={12} />
              Open Source
            </span>
          )}
        </div>
        <ExternalLink
          size={14}
          className="text-[#6B6560]/40 group-hover:text-[#D4754E] transition-colors duration-200"
        />
      </div>
    </Link>
  )
}
