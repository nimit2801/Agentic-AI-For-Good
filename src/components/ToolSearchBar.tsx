'use client'
import { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useToolSearch } from '@/hooks/use-tools'
import type { Tool } from '@/lib/supabase'

interface ToolSearchBarProps {
  placeholder?: string
  className?: string
}

export default function ToolSearchBar({
  placeholder = 'Search tools, frameworks, use cases...',
  className = '',
}: ToolSearchBarProps) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  const { results, loading } = useToolSearch(debouncedQuery, { limit: 5 })
  const showDropdown = isFocused && debouncedQuery.length > 1

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex items-center gap-3 bg-white border-2 rounded-2xl px-4 py-3 transition-all duration-200 ${
          isFocused
            ? 'border-[#D4754E] shadow-lg shadow-[#D4754E]/10'
            : 'border-[#1A1A1A]/10 hover:border-[#1A1A1A]/20'
        }`}
      >
        {loading ? (
          <Loader2 size={18} className="text-[#D4754E] animate-spin flex-shrink-0" />
        ) : (
          <Search size={18} className="text-[#6B6560] flex-shrink-0" />
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[#1A1A1A] placeholder:text-[#6B6560]/50 text-sm outline-none"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus() }}
            className="text-[#6B6560]/50 hover:text-[#1A1A1A] transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#1A1A1A]/8 rounded-2xl shadow-xl overflow-hidden z-50">
          {results.length === 0 && !loading && (
            <div className="px-4 py-6 text-center text-sm text-[#6B6560]">
              No tools found for &ldquo;{debouncedQuery}&rdquo;
            </div>
          )}
          {results.map((tool: Tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#F5F1EB] transition-colors border-b border-[#1A1A1A]/5 last:border-0"
            >
              {tool.logo_url ? (
                <img
                  src={tool.logo_url}
                  alt={tool.name}
                  className="w-8 h-8 rounded-lg object-contain bg-[#F5F1EB]"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-[#D4754E]/10 flex items-center justify-center">
                  <span className="text-[#D4754E] font-bold text-sm font-mono">
                    {tool.name[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-[#1A1A1A] truncate">{tool.name}</div>
                <div className="micro-label text-[#6B6560] truncate">{tool.category}</div>
              </div>
              {tool.pricing && (
                <span className="micro-label text-[#6B6560] flex-shrink-0">{tool.pricing}</span>
              )}
            </Link>
          ))}
          {results.length > 0 && (
            <Link
              href={`/tools?q=${encodeURIComponent(debouncedQuery)}`}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#F5F1EB] text-sm text-[#D4754E] font-medium hover:bg-[#EDE9E1] transition-colors"
            >
              View all results for &ldquo;{debouncedQuery}&rdquo;
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
