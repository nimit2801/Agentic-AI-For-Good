'use client'
import { useState } from 'react'
import { Search, LogOut, ExternalLink, Loader2, Eye, EyeOff, BookOpen } from 'lucide-react'
import { useAllStories } from '@/hooks/use-stories'
import { useAuth } from '@/hooks/use-auth'

export default function AdminStories() {
  const { stories, loading, error, refetch } = useAllStories()
  const { signOut } = useAuth()
  const [search, setSearch] = useState('')
  const [toggling, setToggling] = useState<string | null>(null)

  const filtered = stories.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  )

  const publishedCount = stories.filter((s) => s.published).length

  async function togglePublished(id: string, current: boolean) {
    setToggling(id)
    await fetch('/api/admin/stories', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, published: !current }),
    })
    await refetch()
    setToggling(null)
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Subtle grid */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-md bg-[#D4754E]/10 border border-[#D4754E]/20 flex items-center justify-center">
                <BookOpen size={13} className="text-[#D4754E]" />
              </div>
              <span
                className="text-[11px] tracking-[0.2em] uppercase text-[#555] font-medium"
                style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace" }}
              >
                Content Manager
              </span>
            </div>
            <h1 className="text-white text-2xl font-semibold tracking-tight">
              Stories
            </h1>
            <p className="text-[#666] text-sm mt-1">
              <span className="text-[#D4754E]">{publishedCount}</span> published
              <span className="text-[#333] mx-1.5">/</span>
              {stories.length} total
            </p>
          </div>

          <button
            onClick={signOut}
            className="flex items-center gap-2 text-[#555] hover:text-white text-sm transition-colors duration-200 group"
          >
            <LogOut size={14} className="group-hover:text-[#D4754E] transition-colors duration-200" />
            Sign out
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]" />
          <input
            type="text"
            placeholder="Search stories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111] border border-[#1A1A1A] rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-[#444] outline-none transition-all duration-200 focus:border-[#D4754E]/30 focus:ring-1 focus:ring-[#D4754E]/10"
          />
          {search && (
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-[#555]"
              style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace" }}
            >
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-5 h-5 animate-spin text-[#D4754E]" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-5 py-4 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="bg-[#111] border border-[#1A1A1A] rounded-xl overflow-hidden">
            {/* Column headers */}
            <div
              className="grid grid-cols-[1fr_140px_120px_80px_110px_40px] gap-4 px-5 py-3 border-b border-[#1A1A1A] text-[10px] tracking-[0.2em] uppercase text-[#555]"
              style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace" }}
            >
              <span>Title</span>
              <span>Category</span>
              <span>Company</span>
              <span>Status</span>
              <span>Created</span>
              <span />
            </div>

            {/* Rows */}
            {filtered.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="text-[#444] text-sm">No stories found.</p>
              </div>
            ) : (
              filtered.map((story) => (
                <div
                  key={story.id}
                  className="grid grid-cols-[1fr_140px_120px_80px_110px_40px] gap-4 px-5 py-4 border-b border-[#1A1A1A]/60 last:border-b-0 items-center hover:bg-[#151515] transition-colors duration-150 group"
                >
                  {/* Title */}
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate group-hover:text-[#D4754E] transition-colors duration-200">
                      {story.title}
                    </p>
                    {story.subtitle && (
                      <p className="text-[#444] text-xs truncate mt-0.5">
                        {story.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    {story.category ? (
                      <span className="text-xs text-[#888] bg-[#1A1A1A] px-2.5 py-1 rounded-full truncate inline-block max-w-full">
                        {story.category}
                      </span>
                    ) : (
                      <span className="text-[#333] text-xs">—</span>
                    )}
                  </div>

                  {/* Company */}
                  <span className="text-[#777] text-xs truncate">
                    {story.company || '—'}
                  </span>

                  {/* Published toggle */}
                  <button
                    onClick={() => togglePublished(story.id, story.published)}
                    disabled={toggling === story.id}
                    className="flex items-center gap-1.5 group/toggle"
                    title={story.published ? 'Click to unpublish' : 'Click to publish'}
                  >
                    {toggling === story.id ? (
                      <Loader2 size={14} className="animate-spin text-[#555]" />
                    ) : story.published ? (
                      <>
                        <Eye size={13} className="text-emerald-500" />
                        <span className="text-emerald-500 text-xs font-medium">Live</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={13} className="text-[#444]" />
                        <span className="text-[#444] text-xs group-hover/toggle:text-[#777] transition-colors">Draft</span>
                      </>
                    )}
                  </button>

                  {/* Created date */}
                  <span
                    className="text-[#555] text-[11px]"
                    style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace" }}
                  >
                    {formatDate(story.created_at)}
                  </span>

                  {/* External link */}
                  <a
                    href={`/stories/${story.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#333] hover:text-[#D4754E] transition-colors duration-200"
                    title="View on site"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <p
          className="text-[#222] text-[11px] text-center mt-6"
          style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace" }}
        >
          Agentic AI for Good — Admin
        </p>
      </div>
    </div>
  )
}
