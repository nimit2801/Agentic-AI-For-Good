'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Github,
  BookOpen,
  Star,
  GitBranch,
  Cpu,
} from 'lucide-react'
import type { Tool } from '@/lib/supabase'

interface ToolDetailProps {
  tool: Tool
}

export default function ToolDetail({ tool }: ToolDetailProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const pricingLabel = {
    free: { label: 'Free', class: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    freemium: { label: 'Freemium', class: 'text-amber-700 bg-amber-50 border-amber-200' },
    paid: { label: 'Paid', class: 'text-[#6B6560] bg-[#1A1A1A]/5 border-[#1A1A1A]/10' },
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB] pt-24 pb-20 px-6 lg:px-[6vw]">
      <div className="max-w-[900px] mx-auto">

        {/* Back nav */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-[#6B6560] hover:text-[#1A1A1A] text-sm font-medium transition-colors duration-200 mb-10 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          All Tools
        </Link>

        {/* Hero header */}
        <div className="bg-white rounded-3xl border border-[#1A1A1A]/5 p-8 lg:p-10 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {/* Logo */}
            {tool.logo_url ? (
              <img
                src={tool.logo_url}
                alt={tool.name}
                className="w-16 h-16 rounded-2xl object-contain bg-[#F5F1EB] flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#D4754E]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[#D4754E] font-bold text-2xl font-mono">
                  {tool.name[0].toUpperCase()}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {tool.category && (
                  <span className="micro-label text-[#D4754E] bg-[#D4754E]/10 px-2.5 py-1 rounded-full">
                    {tool.category}
                  </span>
                )}
                {tool.pricing && pricingLabel[tool.pricing] && (
                  <span
                    className={`micro-label px-2.5 py-1 rounded-full border ${pricingLabel[tool.pricing].class}`}
                  >
                    {pricingLabel[tool.pricing].label}
                  </span>
                )}
                {tool.is_open_source && (
                  <span className="micro-label text-[#6B6560] bg-[#1A1A1A]/5 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <GitBranch size={10} />
                    Open Source
                  </span>
                )}
              </div>

              <h1 className="display-heading text-[clamp(24px,3vw,40px)] text-[#1A1A1A] mb-2">
                {tool.name.toUpperCase()}
              </h1>

              {tool.tagline && (
                <p className="text-[#6B6560] text-base lg:text-lg leading-relaxed mb-4">
                  {tool.tagline}
                </p>
              )}

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                {tool.github_stars != null && (
                  <span className="flex items-center gap-1.5 text-sm text-[#6B6560]">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    {tool.github_stars >= 1000
                      ? `${(tool.github_stars / 1000).toFixed(1)}k stars`
                      : `${tool.github_stars} stars`}
                  </span>
                )}
                {tool.license && (
                  <span className="flex items-center gap-1.5 text-sm text-[#6B6560]">
                    <Cpu size={14} />
                    {tool.license}
                  </span>
                )}
                {tool.maintained === false && (
                  <span className="micro-label text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                    Unmaintained
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action links */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-[#1A1A1A]/5">
            {(tool.url || tool.website_url) && (
              <a
                href={tool.url ?? tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#D4754E] hover:bg-[#C0653E] text-white rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200"
              >
                <ExternalLink size={14} />
                Visit Website
              </a>
            )}
            {tool.github_url && (
              <a
                href={tool.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#333] text-white rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200"
              >
                <Github size={14} />
                GitHub
              </a>
            )}
            {tool.docs_url && (
              <a
                href={tool.docs_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#F5F1EB] text-[#1A1A1A] border border-[#1A1A1A]/10 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200"
              >
                <BookOpen size={14} />
                Docs
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-3xl border border-[#1A1A1A]/5 p-8 lg:p-10 mb-6">
          <h2 className="display-heading text-sm text-[#1A1A1A] mb-4">ABOUT</h2>
          <p className="text-[#1A1A1A]/80 text-base leading-relaxed">
            {tool.long_description ?? tool.description}
          </p>
        </div>

        {/* Install command */}
        {tool.install_command && (
          <div className="bg-[#1A1A1A] rounded-3xl p-6 lg:p-8 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="micro-label text-white/40">INSTALL</span>
              <button
                onClick={() => handleCopy(tool.install_command!)}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors duration-200"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <code className="font-mono text-sm text-[#D4754E] whitespace-pre-wrap break-all">
              {tool.install_command}
            </code>
          </div>
        )}

        {/* Code snippet */}
        {tool.code_snippet && (
          <div className="bg-[#1A1A1A] rounded-3xl p-6 lg:p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="micro-label text-white/40">EXAMPLE</span>
              <button
                onClick={() => handleCopy(tool.code_snippet!)}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors duration-200"
              >
                <Copy size={14} />
                Copy
              </button>
            </div>
            <pre className="font-mono text-sm text-[#F5F1EB]/90 overflow-x-auto whitespace-pre-wrap break-words">
              {tool.code_snippet}
            </pre>
          </div>
        )}

        {/* Integration guide */}
        {tool.integration_guide && (
          <div className="bg-white rounded-3xl border border-[#1A1A1A]/5 p-8 lg:p-10 mb-6">
            <h2 className="display-heading text-sm text-[#1A1A1A] mb-6">INTEGRATION GUIDE</h2>
            <div
              className="prose prose-sm max-w-none text-[#1A1A1A]/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: tool.integration_guide }}
            />
          </div>
        )}

        {/* Tags and Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {tool.tags && tool.tags.length > 0 && (
            <div className="bg-white rounded-3xl border border-[#1A1A1A]/5 p-6">
              <h3 className="micro-label text-[#6B6560] mb-4">TAGS</h3>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="micro-label text-[#1A1A1A] bg-[#F5F1EB] px-3 py-1.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(tool.stack_languages?.length || tool.stack_frameworks?.length) ? (
            <div className="bg-white rounded-3xl border border-[#1A1A1A]/5 p-6">
              <h3 className="micro-label text-[#6B6560] mb-4">STACK</h3>
              {tool.stack_languages && tool.stack_languages.length > 0 && (
                <div className="mb-3">
                  <span className="micro-label text-[#6B6560]/60 block mb-2">Languages</span>
                  <div className="flex flex-wrap gap-2">
                    {tool.stack_languages.map((lang) => (
                      <span
                        key={lang}
                        className="micro-label text-[#D4754E] bg-[#D4754E]/10 px-3 py-1.5 rounded-full"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {tool.stack_frameworks && tool.stack_frameworks.length > 0 && (
                <div>
                  <span className="micro-label text-[#6B6560]/60 block mb-2">Frameworks</span>
                  <div className="flex flex-wrap gap-2">
                    {tool.stack_frameworks.map((fw) => (
                      <span
                        key={fw}
                        className="micro-label text-[#6B6560] bg-[#1A1A1A]/5 px-3 py-1.5 rounded-full"
                      >
                        {fw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Back link */}
        <div className="text-center mt-10">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-[#6B6560] hover:text-[#1A1A1A] text-sm font-medium transition-colors duration-200 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            Browse all tools
          </Link>
        </div>
      </div>
    </div>
  )
}
