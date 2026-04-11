'use client'
import Link from 'next/link'
import { GitPullRequest, Cpu, Search, Code2, RefreshCw, ArrowRight, Terminal, Check } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: <GitPullRequest size={22} />,
    label: 'CONTRIBUTE',
    title: 'Your tool goes live via a single PR',
    description:
      'Open a GitHub pull request with a YAML file. No forms, no waiting for manual review cycles. The PR validator checks your file automatically, and on merge the tool is embedded and live within minutes.',
    detail: 'tools/agents/your-tool.yaml → /tools/your-tool',
    audience: 'For tool builders & companies',
    color: '#D4754E',
  },
  {
    number: '02',
    icon: <Cpu size={22} />,
    label: 'EMBED',
    title: 'Automatically embedded for semantic search',
    description:
      'The sync pipeline generates a 1536-dimension vector embedding from your tool\'s description, problem statement, and use cases using OpenAI\'s text-embedding-3-small model. This is what makes "find me a vector database for Python with a free tier" work.',
    detail: 'pgvector cosine similarity · threshold 0.2 · instant on merge',
    audience: 'Happens automatically',
    color: '#1A1A1A',
  },
  {
    number: '03',
    icon: <Search size={22} />,
    label: 'DISCOVER',
    title: 'Developers find it by describing what they want to build',
    description:
      'Semantic search means developers don\'t need to know your tool\'s name. They describe a problem — "add observability to my LangChain app" or "fine-tune a model on my own data" — and your tool surfaces based on relevance to the problem it actually solves.',
    detail: 'agenticaiforgood.com/tools',
    audience: 'For developers',
    color: '#D4754E',
  },
  {
    number: '04',
    icon: <Terminal size={22} />,
    label: 'MCP',
    title: 'Available inside Claude — no tab switching',
    description:
      'The MCP server gives Claude direct access to the full catalog. Developers ask their AI assistant to recommend tools for their stack without leaving their editor. Your tool is findable from inside every Claude Code, Claude Desktop, and any MCP-compatible AI coding setup.',
    detail: 'npx -y agentic-ai-for-good-mcp',
    audience: 'For AI-first developers',
    color: '#1A1A1A',
  },
  {
    number: '05',
    icon: <Code2 size={22} />,
    label: 'INTEGRATE',
    title: 'From discovery to working code in one step',
    description:
      'Each tool page shows copy-ready integration snippets for Claude Code, Codex, Cursor, and Windsurf — so developers go from finding your tool to using it inside their agentic setup immediately. Install command, CLAUDE.md entry, and use case prompts included.',
    detail: 'Claude Code · Codex · Cursor · Windsurf',
    audience: 'Closes the loop for developers',
    color: '#D4754E',
  },
  {
    number: '06',
    icon: <RefreshCw size={22} />,
    label: 'LOOP',
    title: 'More tools → better catalog → more developers',
    description:
      'Every new tool makes the semantic search smarter. Every developer who finds a tool and uses it becomes a potential contributor who adds the next one. The catalog compounds — the more tools there are, the more useful every query becomes.',
    detail: 'The flywheel',
    audience: 'The whole system',
    color: '#1A1A1A',
  },
]

const FOR_COMPANIES = [
  'Your tool is findable by use case, not just by name',
  'Zero maintenance — merge once, live forever',
  'Accessible inside Claude for every developer using MCP',
  'Integration snippets drive adoption directly from the detail page',
  'Weekly spotlight email reaches subscribed developers',
]

const FOR_DEVELOPERS = [
  'Describe what you want to build — not the tool name',
  'Ask Claude to recommend tools for your exact stack',
  'Every tool page has copy-ready install + integration snippets',
  'Weekly digest of new tools, zero noise',
  'All tools are vetted — no abandoned repos or outdated entries',
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#F5F1EB]">

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 lg:px-[6vw]">
        <div className="max-w-[900px] mx-auto">
          <span className="micro-label text-[#D4754E] block mb-4">THE FLYWHEEL</span>
          <h1 className="display-heading text-[clamp(32px,4.5vw,60px)] text-[#1A1A1A] mb-6 max-w-3xl leading-none">
            HOW IT WORKS
          </h1>
          <p className="text-[#6B6560] text-lg leading-relaxed max-w-2xl mb-8">
            A catalog that compounds. Companies add tools via GitHub PR. Developers find them via semantic search or directly inside Claude. Every tool added makes the whole system more useful.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="https://github.com/nimit2801/Agentic-AI-For-Good-Website/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#D4754E] hover:bg-[#C0653E] text-white rounded-full px-6 py-3 text-sm font-medium transition-all duration-200"
            >
              <GitPullRequest size={15} />
              Submit your tool
            </Link>
            <Link
              href="/mcp"
              className="inline-flex items-center gap-2 bg-white border border-[#1A1A1A]/10 hover:border-[#D4754E]/40 text-[#1A1A1A] rounded-full px-6 py-3 text-sm font-medium transition-all duration-200"
            >
              <Terminal size={15} />
              Install MCP server
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="pb-20 px-6 lg:px-[6vw]">
        <div className="max-w-[900px] mx-auto space-y-4">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl border border-[#1A1A1A]/5 p-8 lg:p-10 overflow-hidden relative"
            >
              {/* Step number — background watermark */}
              <span
                className="absolute right-8 top-6 text-[80px] font-black leading-none select-none pointer-events-none"
                style={{ color: i % 2 === 0 ? '#D4754E' : '#1A1A1A', opacity: 0.04 }}
              >
                {step.number}
              </span>

              <div className="flex items-start gap-5">
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${step.color}15`, color: step.color }}
                >
                  {step.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="micro-label" style={{ color: step.color }}>{step.label}</span>
                    <span className="micro-label text-[#6B6560]/50">·</span>
                    <span className="micro-label text-[#6B6560]">{step.audience}</span>
                  </div>
                  <h2 className="display-heading text-lg text-[#1A1A1A] mb-3">{step.title.toUpperCase()}</h2>
                  <p className="text-[#6B6560] text-sm leading-relaxed mb-4">{step.description}</p>
                  <code className="text-xs text-[#D4754E] bg-[#D4754E]/8 px-2.5 py-1 rounded font-mono">
                    {step.detail}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* For companies vs developers */}
      <section className="py-16 px-6 lg:px-[6vw] bg-white">
        <div className="max-w-[900px] mx-auto">
          <span className="micro-label text-[#D4754E] block mb-3">WHO IT'S FOR</span>
          <h2 className="display-heading text-[clamp(24px,3vw,40px)] text-[#1A1A1A] mb-10">TWO SIDES, ONE LOOP</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* For companies */}
            <div className="bg-[#F5F1EB] rounded-2xl p-8">
              <span className="micro-label text-[#D4754E] block mb-3">FOR TOOL BUILDERS</span>
              <h3 className="display-heading text-xl text-[#1A1A1A] mb-6">COMPANIES & OSS MAINTAINERS</h3>
              <ul className="space-y-3">
                {FOR_COMPANIES.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check size={14} className="text-[#D4754E] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#6B6560] leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="https://github.com/nimit2801/Agentic-AI-For-Good-Website/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 text-[#D4754E] text-sm font-medium hover:underline group"
              >
                Read the contribution guide
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* For developers */}
            <div className="bg-[#1A1A1A] rounded-2xl p-8">
              <span className="micro-label text-[#D4754E] block mb-3">FOR DEVELOPERS</span>
              <h3 className="display-heading text-xl text-[#F5F1EB] mb-6">BUILDERS & AI ENGINEERS</h3>
              <ul className="space-y-3">
                {FOR_DEVELOPERS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check size={14} className="text-[#D4754E] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#F5F1EB]/70 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 mt-8 text-[#D4754E] text-sm font-medium hover:underline group"
              >
                Browse the catalog
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* YAML preview block */}
      <section className="py-16 px-6 lg:px-[6vw]">
        <div className="max-w-[900px] mx-auto">
          <span className="micro-label text-[#D4754E] block mb-3">THE FORMAT</span>
          <h2 className="display-heading text-[clamp(24px,3vw,40px)] text-[#1A1A1A] mb-4">ONE YAML FILE</h2>
          <p className="text-[#6B6560] text-sm mb-8 max-w-xl">
            This is everything you need to add a tool. The more specific your <code className="font-mono text-[#D4754E]">problem_solved</code> and <code className="font-mono text-[#D4754E]">use_cases</code> fields, the better the semantic search quality.
          </p>

          <div className="bg-[#1A1A1A] rounded-2xl p-6 lg:p-8 overflow-x-auto">
            <pre className="text-sm text-[#E8E2D9] font-mono leading-relaxed">{`name: Your Tool Name
description: 2-3 sentences on what it does.

github_url: https://github.com/org/your-tool
website_url: https://yourtool.com
install_command: pip install your-tool

category: Agents   # LLM | Vector DB | RAG | Agents | Fine-tuning | Monitoring | Data | Dev Tools
tags: [python, llm, agents]
pricing: free      # free | freemium | paid
is_open_source: true

# This powers semantic search — be specific
problem_solved: |
  What was painful before this tool? What can developers
  stop doing manually? The more concrete, the better.

# At least 3. These improve search quality dramatically.
use_cases:
  - Build a RAG pipeline that answers questions from internal docs
  - Create an autonomous agent that browses and summarizes the web
  - Orchestrate multi-step LLM workflows without boilerplate`}</pre>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="https://github.com/nimit2801/Agentic-AI-For-Good-Website/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#D4754E] hover:bg-[#C0653E] text-white rounded-full px-6 py-3 text-sm font-medium transition-all duration-200"
            >
              <GitPullRequest size={15} />
              Open a PR now
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 bg-white border border-[#1A1A1A]/10 hover:border-[#1A1A1A]/20 text-[#1A1A1A] rounded-full px-6 py-3 text-sm font-medium transition-all duration-200"
            >
              See examples in the catalog
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
