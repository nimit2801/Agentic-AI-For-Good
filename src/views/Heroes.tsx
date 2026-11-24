'use client'
import { useEffect, useRef, useState } from 'react'

const CATEGORIES = ['Events', 'Blog/Content', 'Tech/Builder', 'Open Source', 'Advocacy/Community']
const MAX_DESC = 500

const WHO = [
  { tag: 'Events', text: 'Hosts of meetups, workshops and hackathons where people actually build agents.' },
  { tag: 'Blog/Content', text: 'Writers, video makers and teachers who explain agentic AI without the hype.' },
  { tag: 'Tech/Builder', text: 'People shipping agents, tools and demos that solve real problems.' },
  { tag: 'Open Source', text: 'Maintainers and contributors behind the repos the rest of us depend on.' },
  { tag: 'Advocacy/Community', text: 'Folks who answer questions, run communities and pull others in.' },
]

const inputCls =
  'w-full rounded-lg border border-[#1A1A1A]/15 bg-white px-4 py-3 text-[15px] text-[#1A1A1A] placeholder:text-[#1A1A1A]/35 focus:outline-none focus:ring-2 focus:ring-[#D4754E]/50 focus:border-[#D4754E]'
const labelCls = 'block font-mono text-xs uppercase tracking-wider text-[#1A1A1A]/60 mb-2'

export default function Heroes() {
  const startedAt = useRef<number>(0)
  const [relationship, setRelationship] = useState<'self' | 'other' | ''>('')
  const [categories, setCategories] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  const toggle = (c: string) =>
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    if (!relationship) return setError('Pick whether this is you or someone else.')
    if (categories.length === 0) return setError('Pick at least one category.')
    setStatus('sending')
    try {
      const res = await fetch('/api/heroes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nominatorName: fd.get('nominatorName'),
          nominatorEmail: fd.get('nominatorEmail'),
          nomineeName: fd.get('nomineeName'),
          relationship,
          categories,
          links: fd.get('links'),
          description,
          website: fd.get('website'),
          startedAt: startedAt.current,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB] text-[#1A1A1A] pt-28 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#D4754E] mb-4">Agentic AI Heroes</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
          The people doing real work in agentic AI.
        </h1>
        <p className="text-lg text-[#1A1A1A]/75 leading-relaxed mb-4">
          AI is noisy. Finding a project or a person worth your time can take hours. Agentic AI For Good
          cuts through that by surfacing open source tools and the people behind them, so you can build
          something for good.
        </p>
        <p className="text-lg text-[#1A1A1A]/75 leading-relaxed mb-12">
          Agentic AI Heroes is how we say thanks. We spotlight advocates, event hosts, bloggers, builders and
          open source contributors working specifically in agentic AI. Nominate yourself or someone you know.
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mb-16">
          {WHO.map((w) => (
            <div key={w.tag} className="rounded-xl border border-[#1A1A1A]/10 bg-white/60 p-5">
              <p className="font-mono text-xs uppercase tracking-wider text-[#D4754E] mb-2">{w.tag}</p>
              <p className="text-[15px] text-[#1A1A1A]/75 leading-relaxed">{w.text}</p>
            </div>
          ))}
        </div>

        <div id="nominate" className="rounded-2xl border border-[#1A1A1A]/10 bg-white/70 p-6 md:p-10 scroll-mt-28">
          {status === 'done' ? (
            <div className="text-center py-10" role="status">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#D4754E] mb-3">Nomination received</p>
              <h2 className="text-3xl font-bold mb-4">Thank you.</h2>
              <p className="text-[#1A1A1A]/70 max-w-md mx-auto mb-8">
                We read every nomination. If we spotlight this person, we will reach out first.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatus('idle')
                  setRelationship('')
                  setCategories([])
                  setDescription('')
                  startedAt.current = Date.now()
                }}
                className="font-mono text-sm uppercase tracking-wider text-[#D4754E] hover:underline"
              >
                Nominate someone else
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-7" noValidate>
              <h2 className="text-2xl font-bold">Nominate a hero</h2>

              {/* Honeypot: hidden from people, tempting for bots */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div>
                <span className={labelCls}>Who are you nominating?</span>
                <div className="flex gap-3">
                  {(['self', 'other'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRelationship(r)}
                      aria-pressed={relationship === r}
                      className={`flex-1 rounded-lg border px-4 py-3 text-[15px] font-medium transition ${
                        relationship === r
                          ? 'border-[#D4754E] bg-[#D4754E] text-white'
                          : 'border-[#1A1A1A]/15 bg-white hover:border-[#D4754E]'
                      }`}
                    >
                      {r === 'self' ? 'Myself' : 'Someone else'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="nomineeName" className={labelCls}>Nominee name *</label>
                <input id="nomineeName" name="nomineeName" required maxLength={200} className={inputCls} placeholder="Full name or handle" />
              </div>

              <div>
                <span className={labelCls}>What do they do in agentic AI? *</span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggle(c)}
                      aria-pressed={categories.includes(c)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        categories.includes(c)
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#F5F1EB]'
                          : 'border-[#1A1A1A]/20 bg-white hover:border-[#1A1A1A]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="links" className={labelCls}>Links</label>
                <textarea id="links" name="links" rows={2} maxLength={2000} className={inputCls} placeholder="GitHub, blog, event page, X, LinkedIn. One per line." />
              </div>

              <div>
                <label htmlFor="description" className={labelCls}>Why are they a hero? *</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  maxLength={MAX_DESC}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={inputCls}
                  placeholder="What have they built, written, hosted or shared? Keep it short and specific."
                />
                <p className="font-mono text-xs text-[#1A1A1A]/45 mt-1 text-right">{description.length}/{MAX_DESC}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nominatorName" className={labelCls}>Your name (optional)</label>
                  <input id="nominatorName" name="nominatorName" maxLength={200} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="nominatorEmail" className={labelCls}>Your email (optional)</label>
                  <input id="nominatorEmail" name="nominatorEmail" type="email" maxLength={320} autoComplete="email" aria-describedby="nominatorEmailHint" className={inputCls} />
                  <p id="nominatorEmailHint" className="mt-1 text-xs opacity-70">Add it and we'll send you a confirmation with a copy of your nomination.</p>
                </div>
              </div>

              {error && <p className="text-sm text-[#B4442A]" role="alert">{error}</p>}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-lg bg-[#D4754E] px-6 py-4 font-mono text-sm uppercase tracking-wider text-white transition hover:bg-[#c0643f] disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending...' : 'Submit nomination'}
              </button>
              <p className="text-xs text-[#1A1A1A]/50 text-center">
                Emails are only used to follow up about this nomination. Never shared.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
