'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import posthog from 'posthog-js'
import { useAuth } from '@/hooks/use-auth'
import { Loader2, ArrowRight, Lock } from 'lucide-react'

export default function AdminLogin() {
  const { user, loading: authLoading, signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/admin/stories')
    }
  }, [user, authLoading, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn(email, password)
      posthog.identify(email, { email })
      posthog.capture('admin_signed_in', { email })
      router.replace('/admin/stories')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
      posthog.captureException(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="w-5 h-5 animate-spin text-[#D4754E]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4754E]/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-[400px]">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#D4754E]/10 border border-[#D4754E]/20 flex items-center justify-center">
              <Lock size={14} className="text-[#D4754E]" />
            </div>
            <span
              className="text-[11px] tracking-[0.2em] uppercase text-[#555] font-medium"
              style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace" }}
            >
              Admin
            </span>
          </div>
          <h1 className="text-white text-2xl font-semibold tracking-tight">
            Sign in
          </h1>
          <p className="text-[#666] text-sm mt-1.5">
            Manage stories and site content.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-[11px] tracking-[0.15em] uppercase text-[#777] mb-2 font-medium"
              style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace" }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-white text-sm placeholder-[#444] outline-none transition-all duration-200 focus:border-[#D4754E]/50 focus:ring-1 focus:ring-[#D4754E]/20"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[11px] tracking-[0.15em] uppercase text-[#777] mb-2 font-medium"
              style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-white text-sm placeholder-[#444] outline-none transition-all duration-200 focus:border-[#D4754E]/50 focus:ring-1 focus:ring-[#D4754E]/20"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#D4754E] hover:bg-[#c0673f] text-white rounded-lg px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6 group"
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                Sign in
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform duration-200"
                />
              </>
            )}
          </button>
        </form>

        {/* Footer hint */}
        <p className="text-[#333] text-xs text-center mt-8">
          Not a public page. Access restricted to site administrators.
        </p>
      </div>
    </div>
  )
}
