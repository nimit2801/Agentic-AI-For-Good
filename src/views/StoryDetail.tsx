'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import gsap from 'gsap'
import type { Story } from '@/lib/supabase'

function renderMarkdown(text: string) {
  // Simple markdown renderer for paragraphs, bold, headings, and lists
  return text.split('\n\n').map((block, i) => {
    const trimmed = block.trim()
    if (!trimmed) return null

    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={i} className="text-xl font-semibold text-[#1A1A1A] mt-8 mb-3">
          {trimmed.slice(4)}
        </h3>
      )
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={i} className="text-2xl font-bold text-[#1A1A1A] mt-10 mb-4">
          {trimmed.slice(3)}
        </h2>
      )
    }

    // Handle bullet lists
    if (trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').filter((l) => l.startsWith('- '))
      return (
        <ul key={i} className="list-disc list-inside space-y-1 text-[#3A3530] leading-relaxed mb-4">
          {items.map((item, j) => (
            <li key={j}>{formatInline(item.slice(2))}</li>
          ))}
        </ul>
      )
    }

    return (
      <p key={i} className="text-[#3A3530] leading-relaxed mb-4">
        {formatInline(trimmed)}
      </p>
    )
  })
}

function formatInline(text: string) {
  // Bold text
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-[#1A1A1A]">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

interface Props {
  story: Story
}

export default function StoryDetail({ story }: Props) {
  const articleRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!articleRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.story-header', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
      })
      gsap.from('.story-body', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.3,
        ease: 'power2.out',
      })
    }, articleRef)

    return () => ctx.revert()
  }, [])

  const formattedDate = new Date(story.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article ref={articleRef} className="min-h-screen bg-[#F5F1EB] pt-28 pb-20 px-6 lg:px-[6vw]">
      <div className="max-w-[720px] mx-auto">
        {/* Back link */}
        <Link
          href="/stories"
          className="inline-flex items-center gap-1 text-[#6B6560] text-sm font-medium hover:text-[#D4754E] transition-colors duration-200 mb-8"
        >
          <ArrowLeft size={14} />
          All stories
        </Link>

        {/* Header */}
        <div className="story-header mb-10">
          <div className="flex items-center gap-3 mb-4">
            {story.category && (
              <span className="text-xs font-medium text-[#D4754E] bg-[#D4754E]/10 px-2.5 py-1 rounded-full">
                {story.category}
              </span>
            )}
            {story.company && (
              <span className="text-xs font-medium text-[#6B6560] bg-[#1A1A1A]/5 px-2.5 py-1 rounded-full">
                {story.company}
              </span>
            )}
          </div>

          <h1 className="display-heading text-[clamp(28px,3.5vw,44px)] text-[#1A1A1A] mb-4">
            {story.title}
          </h1>

          {story.subtitle && (
            <p className="text-[#6B6560] text-lg mb-4">{story.subtitle}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-[#6B6560]">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Banner image */}
        {story.image_url && (
          <div className="rounded-2xl overflow-hidden mb-10 bg-[#E8E2D9]">
            <img
              src={story.image_url}
              alt={story.title}
              loading="lazy"
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="story-body text-base lg:text-[17px]">
          {story.content ? renderMarkdown(story.content) : (
            <p className="text-[#3A3530] leading-relaxed">{story.description}</p>
          )}
        </div>

        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#1A1A1A]/8">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={14} className="text-[#6B6560]" />
              {story.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-[#6B6560] bg-[#1A1A1A]/5 px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
