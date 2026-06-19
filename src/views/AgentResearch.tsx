'use client'
import { useEffect, useState } from 'react'
import researchData from '@/data/agent-research.json'

type ResearchItem = {
  title: string
  source?: string
  url: string
  meta?: string
  why?: string
  topics?: string[]
  date?: string
  score?: number
  points?: number
  topic?: string
  publishedAt?: string
}

type ResearchPayload = {
  generatedAt: string
  windowDays: number
  summary: string
  sourceStats: { items: number; sources: Record<string, number> }
  highlights: ResearchItem[]
  sourceSections: Record<string, ResearchItem[]>
  tangentRadar: Array<{ topic?: string; theme?: string; signalCount?: number; whyItMatters: string; signals?: string[] }>
  experimentQueue: Array<{ title?: string; name?: string; why?: string; description?: string; prompt?: string }>
  method: string | string[]
}

const sectionLabels: Record<string, string> = {
  majorLabs: 'Major Labs',
  hackerNews: 'Hacker News',
  reddit: 'Reddit',
  huggingFace: 'Hugging Face',
  github: 'GitHub',
}

const formatDate = (value?: string) => {
  if (!value) return 'Unknown'
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  const date = d.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
  const time = d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
  return `${date}, ${time} UTC`
}

const formatMeta = (item: ResearchItem) => {
  if (item.meta) return item.meta
  if (typeof item.points === 'number' && item.points > 0) return `${item.points} pts`
  return ''
}

export default function AgentResearch() {
  const data = researchData as unknown as ResearchPayload
  const sourcesTracked = data ? Object.keys(data.sourceStats.sources).length : 0

  return (
    <section className="relative w-full min-h-screen bg-[#F5F1EB] pt-24 lg:pt-32 pb-20">
      <div className="px-6 lg:px-[6vw]">

        <div className="max-w-3xl mb-12">
          <span className="micro-label text-[#6B6560] mb-4 block">Research</span>
          <h1 className="display-heading text-[clamp(28px,4vw,52px)] text-[#1A1A1A] mb-4">Agent Research</h1>
          <p className="text-[#6B6560] text-base lg:text-lg leading-relaxed">
            A living digest of what people are doing with Agentic AI right now, from model drops to practical workflows to strange but useful tangents.
          </p>
        </div>

        {data && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              <div className="bg-white rounded-2xl p-4 border border-[#1A1A1A]/8">
                <span className="micro-label text-[#6B6560] block mb-1">Last Updated</span>
                <strong className="text-[#1A1A1A] text-sm">{formatDate(data.generatedAt)}</strong>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#1A1A1A]/8">
                <span className="micro-label text-[#6B6560] block mb-1">Research Window</span>
                <strong className="text-[#1A1A1A] text-sm">{data.windowDays} days</strong>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#1A1A1A]/8">
                <span className="micro-label text-[#6B6560] block mb-1">Signals Tracked</span>
                <strong className="text-[#1A1A1A] text-sm">{data.sourceStats.items}</strong>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-[#1A1A1A]/8">
                <span className="micro-label text-[#6B6560] block mb-1">Sources Watched</span>
                <strong className="text-[#1A1A1A] text-sm">{sourcesTracked}</strong>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-[#1A1A1A]/8 mb-8">
              <span className="micro-label text-[#D4754E] block mb-2">Snapshot</span>
              <h2 className="text-[#1A1A1A] font-semibold text-xl mb-3">What the current cycle is saying</h2>
              <p className="text-[#6B6560] text-sm lg:text-base leading-relaxed">{data.summary}</p>
            </div>

            <div className="mb-8">
              <span className="micro-label text-[#D4754E] block mb-2">Highlights</span>
              <h2 className="text-[#1A1A1A] font-semibold text-xl mb-4">Best signals across the feed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.highlights.map((item) => (
                  <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer"
                    className="group bg-white rounded-2xl p-5 border border-[#1A1A1A]/8 hover:shadow-md transition-all duration-200 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[#1A1A1A] font-semibold text-sm leading-snug group-hover:text-[#D4754E] transition-colors">{item.title}</h3>
                      <span className="micro-label text-[#6B6560] bg-[#F5F1EB] px-2 py-0.5 rounded-full shrink-0">{item.source || 'Signal'}</span>
                    </div>
                    <div className="text-xs text-[#6B6560] flex gap-3">
                      <span>{formatMeta(item)}</span>
                      <span>{formatDate(item.date || item.publishedAt)}</span>
                    </div>
                    {item.why && <p className="text-[#6B6560] text-xs leading-relaxed">{item.why}</p>}
                    {item.topics && item.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                        {item.topics.map(t => <span key={t} className="text-[10px] text-[#6B6560] bg-[#F5F1EB] px-2 py-0.5 rounded-full">{t}</span>)}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <span className="micro-label text-[#D4754E] block mb-2">Source Watch</span>
              <h2 className="text-[#1A1A1A] font-semibold text-xl mb-4">Where the signal came from</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Object.entries(data.sourceSections).map(([key, items]) => (
                  <div key={key} className="bg-white rounded-2xl p-5 border border-[#1A1A1A]/8">
                    <h3 className="text-[#1A1A1A] font-semibold text-sm mb-1">{sectionLabels[key] || key}</h3>
                    <p className="text-xs text-[#6B6560] mb-3">{items.length} items in this cycle</p>
                    {items.length > 0 ? items.map((item) => (
                      <div key={item.url} className="mb-3 pb-3 border-b border-[#1A1A1A]/6 last:border-0 last:mb-0 last:pb-0">
                        <a href={item.url} target="_blank" rel="noopener noreferrer"
                          className="text-[#1A1A1A] font-medium text-sm hover:text-[#D4754E] transition-colors">{item.title}</a>
                        <p className="text-xs text-[#6B6560] mt-0.5">{formatMeta(item)} · {formatDate(item.date || item.publishedAt)}</p>
                        {item.why && <p className="text-xs text-[#6B6560] mt-1">{item.why}</p>}
                        {item.topics && item.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.topics.map(t => <span key={`${item.url}-${t}`} className="text-[10px] text-[#6B6560] bg-[#F5F1EB] px-2 py-0.5 rounded-full">{t}</span>)}
                          </div>
                        )}
                      </div>
                    )) : (
                      <p className="text-xs text-[#6B6560] italic">No strong items landed here in this cycle.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-[#1A1A1A]/8">
                <span className="micro-label text-[#D4754E] block mb-2">Tangent Radar</span>
                <h2 className="text-[#1A1A1A] font-semibold text-xl mb-4">What to keep an eye on next</h2>
                <div className="space-y-4">
                  {data.tangentRadar.map((entry) => (
                    <div key={entry.topic || entry.theme} className="pb-4 border-b border-[#1A1A1A]/6 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[#1A1A1A] font-medium text-sm">{entry.topic || entry.theme}</h3>
                        <span className="micro-label text-[#6B6560] bg-[#F5F1EB] px-2 py-0.5 rounded-full">{entry.signalCount || (entry.signals?.length || 0)} signals</span>
                      </div>
                      <p className="text-xs text-[#6B6560]">{entry.whyItMatters}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-[#1A1A1A]/8">
                <span className="micro-label text-[#D4754E] block mb-2">Experiment Queue</span>
                <h2 className="text-[#1A1A1A] font-semibold text-xl mb-4">Good next moves</h2>
                <div className="space-y-4">
                  {data.experimentQueue.map((item) => (
                    <div key={item.title || item.name} className="pb-4 border-b border-[#1A1A1A]/6 last:border-0 last:pb-0">
                      <h3 className="text-[#1A1A1A] font-medium text-sm mb-1">{item.title || item.name}</h3>
                      <p className="text-xs text-[#6B6560] mb-1">{item.why || item.description}</p>
                      {item.prompt && <p className="text-xs text-[#D4754E] font-mono">Try: {item.prompt}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#1A1A1A]/8">
              <span className="micro-label text-[#D4754E] block mb-2">Method</span>
              <h2 className="text-[#1A1A1A] font-semibold text-xl mb-3">How the feed is built</h2>
              <ul className="list-disc list-inside text-sm text-[#6B6560] space-y-1">
                {(Array.isArray(data.method) ? data.method : [data.method]).map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
