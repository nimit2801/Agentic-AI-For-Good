'use client'
import { useState } from 'react'
import { Mail, ArrowRight, Check, Loader2 } from 'lucide-react'

interface SubscribeWidgetProps {
  source?: string
  className?: string
  compact?: boolean
}

export default function SubscribeWidget({
  source = 'website',
  className = '',
  compact = false,
}: SubscribeWidgetProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus(data.message === 'Already subscribed' ? 'duplicate' : 'success')
        setEmail('')
      } else {
        setStatus('error')
        setErrorMsg(data.error ?? 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error — please try again')
    }
  }

  if (status === 'success') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <Check size={16} className="text-emerald-600" />
        </div>
        <p className="text-sm text-[#1A1A1A] font-medium">You&apos;re in. We&apos;ll send updates on new tools.</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {!compact && (
        <div className="flex items-center gap-2 mb-3">
          <Mail size={15} className="text-[#D4754E]" />
          <span className="micro-label text-[#D4754E]">STAY UPDATED</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 min-w-0 bg-white border border-[#1A1A1A]/10 rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#6B6560]/50 outline-none focus:border-[#D4754E] transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#D4754E] hover:bg-[#C0653E] disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors flex-shrink-0"
        >
          {status === 'loading' ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <ArrowRight size={15} />
          )}
          {!compact && <span>Subscribe</span>}
        </button>
      </form>

      {status === 'duplicate' && (
        <p className="text-xs text-[#6B6560] mt-2">Already subscribed — you&apos;re good.</p>
      )}
      {status === 'error' && (
        <p className="text-xs text-red-600 mt-2">{errorMsg}</p>
      )}
    </div>
  )
}
