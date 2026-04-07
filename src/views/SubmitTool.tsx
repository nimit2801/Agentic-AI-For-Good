'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import { useSubmitTool } from '@/hooks/use-tools'

const categories = [
  'LLM',
  'Vector DB',
  'RAG',
  'Agents',
  'Fine-tuning',
  'Monitoring',
  'Data',
  'Dev Tools',
  'Other',
]

export default function SubmitTool() {
  const [formData, setFormData] = useState({
    tool_name: '',
    tool_url: '',
    description: '',
    category: '',
    submitter_name: '',
    submitter_email: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const { submitTool, submitting } = useSubmitTool()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await submitTool({
      tool_name: formData.tool_name,
      tool_url: formData.tool_url,
      description: formData.description,
      category: formData.category || undefined,
      submitter_name: formData.submitter_name || undefined,
      submitter_email: formData.submitter_email || undefined,
    })

    if (result.success) {
      setSubmitted(true)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB] pt-24 pb-20 px-6 lg:px-[6vw]">
      <div className="max-w-[700px] mx-auto">
        {/* Back nav */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-[#6B6560] hover:text-[#1A1A1A] text-sm font-medium transition-colors duration-200 mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          Browse Tools
        </Link>

        {/* Success state */}
        {submitted ? (
          <div className="bg-white rounded-3xl border border-[#1A1A1A]/5 p-10 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-emerald-500" />
            </div>
            <h1 className="display-heading text-2xl text-[#1A1A1A] mb-4">
              SUBMISSION RECEIVED
            </h1>
            <p className="text-[#6B6560] mb-8 max-w-md mx-auto">
              Thanks for contributing! Your tool submission has been received and is pending review.
              We&apos;ll reach out if we need more information.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 bg-[#D4754E] hover:bg-[#C0653E] text-white rounded-full px-6 py-3 text-sm font-medium transition-all duration-200"
              >
                Back to Tools
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false)
                  setFormData({
                    tool_name: '',
                    tool_url: '',
                    description: '',
                    category: '',
                    submitter_name: '',
                    submitter_email: '',
                  })
                }}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F5F1EB] text-[#1A1A1A] border border-[#1A1A1A]/10 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200"
              >
                Submit Another Tool
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <span className="micro-label text-[#D4754E] block mb-3">Contribute</span>
              <h1 className="display-heading text-[clamp(28px,4vw,40px)] text-[#1A1A1A] mb-4">
                SUBMIT A TOOL
              </h1>
              <p className="text-[#6B6560] text-base lg:text-lg max-w-xl">
                Know a great AI tool that belongs here? Help the community by submitting it for review.
                We curate tools that are genuinely useful for developers building with AI.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-3xl border border-[#1A1A1A]/5 p-8">
                {/* Tool Name */}
                <div className="mb-6">
                  <label htmlFor="tool_name" className="block micro-label text-[#6B6560] mb-2">
                    Tool Name <span className="text-[#D4754E]">*</span>
                  </label>
                  <input
                    type="text"
                    id="tool_name"
                    name="tool_name"
                    value={formData.tool_name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    placeholder="e.g., LangChain"
                    className="w-full px-4 py-3 bg-[#F5F1EB] border border-[#1A1A1A]/10 rounded-xl text-[#1A1A1A] placeholder:text-[#6B6560]/50 focus:outline-none focus:border-[#D4754E]/50 transition-colors"
                  />
                </div>

                {/* Tool URL */}
                <div className="mb-6">
                  <label htmlFor="tool_url" className="block micro-label text-[#6B6560] mb-2">
                    Website URL <span className="text-[#D4754E]">*</span>
                  </label>
                  <input
                    type="url"
                    id="tool_url"
                    name="tool_url"
                    value={formData.tool_url}
                    onChange={handleChange}
                    required
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-[#F5F1EB] border border-[#1A1A1A]/10 rounded-xl text-[#1A1A1A] placeholder:text-[#6B6560]/50 focus:outline-none focus:border-[#D4754E]/50 transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label htmlFor="description" className="block micro-label text-[#6B6560] mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    maxLength={1000}
                    placeholder="What does this tool do? What problem does it solve?"
                    className="w-full px-4 py-3 bg-[#F5F1EB] border border-[#1A1A1A]/10 rounded-xl text-[#1A1A1A] placeholder:text-[#6B6560]/50 focus:outline-none focus:border-[#D4754E]/50 transition-colors resize-none"
                  />
                  <p className="text-xs text-[#6B6560]/60 mt-1.5">
                    {formData.description.length}/1000 characters
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block micro-label text-[#6B6560] mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#F5F1EB] border border-[#1A1A1A]/10 rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#D4754E]/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select a category...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submitter Info */}
              <div className="bg-white rounded-3xl border border-[#1A1A1A]/5 p-8">
                <h2 className="display-heading text-sm text-[#1A1A1A] mb-6">YOUR INFO (OPTIONAL)</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="submitter_name" className="block micro-label text-[#6B6560] mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="submitter_name"
                      name="submitter_name"
                      value={formData.submitter_name}
                      onChange={handleChange}
                      maxLength={100}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-[#F5F1EB] border border-[#1A1A1A]/10 rounded-xl text-[#1A1A1A] placeholder:text-[#6B6560]/50 focus:outline-none focus:border-[#D4754E]/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="submitter_email" className="block micro-label text-[#6B6560] mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="submitter_email"
                      name="submitter_email"
                      value={formData.submitter_email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-[#F5F1EB] border border-[#1A1A1A]/10 rounded-xl text-[#1A1A1A] placeholder:text-[#6B6560]/50 focus:outline-none focus:border-[#D4754E]/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <p className="text-sm text-[#6B6560]/80 order-2 sm:order-1">
                  Submissions are reviewed within 48 hours.
                </p>
                <button
                  type="submit"
                  disabled={submitting || !formData.tool_name.trim() || !formData.tool_url.trim()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D4754E] hover:bg-[#C0653E] disabled:bg-[#D4754E]/50 disabled:cursor-not-allowed text-white rounded-full px-8 py-3.5 text-sm font-medium transition-all duration-200 order-1 sm:order-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Tool'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
