'use client'
import { useState } from 'react'
import posthog from 'posthog-js'
import { Terminal, Search, Package, Zap, Clock, Copy, Check, GitBranch, Rss } from 'lucide-react'
import SubscribeWidget from '@/components/SubscribeWidget'

const HTTP_CONFIG = `{
  "mcpServers": {
    "agenticaiforgood": {
      "type": "http",
      "url": "https://agenticaiforgood.com/api/mcp"
    }
  }
}`

const CLAUDE_DESKTOP_CONFIG = `{
  "mcpServers": {
    "agenticaiforgood": {
      "command": "npx",
      "args": ["-y", "agentic-ai-for-good-mcp"]
    }
  }
}`

const MCP_JSON_CONFIG = `{
  "mcpServers": {
    "agenticaiforgood": {
      "command": "npx",
      "args": ["-y", "agentic-ai-for-good-mcp"]
    }
  }
}`

const CLAUDE_CLI_COMMAND = 'claude mcp add --scope user --transport http agenticaiforgood https://agenticaiforgood.com/api/mcp'

const EXAMPLE_PROMPTS = [
  'Find me a vector database for Python with free tier',
  'Show me tools for building RAG applications',
  'What AI tools were added this week?',
  'What tools work well with Next.js and Supabase?',
]

const TOOLS = [
  {
    icon: <Search size={20} />,
    name: 'search_tools',
    description: 'Find AI tools by natural language query across our entire catalog.',
    prompt: '"Find me a vector database for Python with a free tier"',
  },
  {
    icon: <Package size={20} />,
    name: 'get_tool_detail',
    description: 'Get full detail on any tool: install command, use cases, and links.',
    prompt: '"Tell me everything about LangChain"',
  },
  {
    icon: <Zap size={20} />,
    name: 'suggest_for_stack',
    description: 'Get recommendations based on your package.json or requirements.txt.',
    prompt: '"What tools am I missing? Here\'s my package.json: ..."',
  },
  {
    icon: <Clock size={20} />,
    name: 'whats_new',
    description: 'See recently added tools in the last N days.',
    prompt: '"What AI tools were added this week?"',
  },
]

function CopyButton({ text, label, className = '' }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    posthog.capture('mcp_config_copied', { config_label: label ?? 'unknown' })
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
        copied
          ? 'bg-[#D4754E]/15 text-[#D4754E]'
          : 'bg-[#1A1A1A]/8 text-[#6B6560] hover:bg-[#1A1A1A]/12 hover:text-[#1A1A1A]'
      } ${className}`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export default function MCPPage() {
  const [activeTab, setActiveTab] = useState<'http' | 'cli' | 'desktop' | 'code'>('http')

  return (
    <section className="min-h-screen bg-[#F5F1EB] pt-28 pb-20 px-6 lg:px-[6vw]">
      <div className="max-w-[860px] mx-auto">

        {/* Section 1 — Hero */}
        <div className="mb-16">
          <span className="micro-label text-[#D4754E] block mb-3">FOR DEVELOPERS</span>
          <h1 className="display-heading text-[clamp(28px,3.5vw,52px)] text-[#1A1A1A] mb-6 max-w-2xl">
            USE OUR TOOL CATALOG INSIDE CLAUDE
          </h1>
          <p className="text-[#6B6560] text-base lg:text-lg max-w-2xl leading-relaxed">
            The agentic-ai-for-good-mcp server gives Claude access to our full AI tool database — search by use case, get install commands, and get recommendations based on your stack.
          </p>
        </div>

        {/* Section 2 — Install Card */}
        <div className="bg-white rounded-2xl border border-[#1A1A1A]/8 mb-12 overflow-hidden">
          <div className="p-6 border-b border-[#1A1A1A]/8">
            <div className="flex items-center gap-2 mb-1">
              <Terminal size={16} className="text-[#D4754E]" />
              <span className="micro-label text-[#D4754E]">INSTALL</span>
            </div>
            <h2 className="display-heading text-xl text-[#1A1A1A]">ADD TO CLAUDE IN 2 STEPS</h2>
          </div>

          {/* Tab switcher */}
          <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0">
            <div className="flex border-b border-[#1A1A1A]/8 min-w-max sm:min-w-0 w-full">
              <button
                onClick={() => { setActiveTab('http'); posthog.capture('mcp_tab_changed', { tab: 'http' }) }}
                className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === 'http'
                    ? 'text-[#1A1A1A] border-b-2 border-[#D4754E] bg-[#F5F1EB]/50'
                    : 'text-[#6B6560] hover:text-[#1A1A1A] hover:bg-[#F5F1EB]/30'
                }`}
              >
                HTTP <span className="hidden sm:inline">✦ Recommended</span>
              </button>
              <button
                onClick={() => { setActiveTab('cli'); posthog.capture('mcp_tab_changed', { tab: 'cli' }) }}
                className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === 'cli'
                    ? 'text-[#1A1A1A] border-b-2 border-[#D4754E] bg-[#F5F1EB]/50'
                    : 'text-[#6B6560] hover:text-[#1A1A1A] hover:bg-[#F5F1EB]/30'
                }`}
              >
                Claude CLI
              </button>
              <button
                onClick={() => { setActiveTab('desktop'); posthog.capture('mcp_tab_changed', { tab: 'desktop' }) }}
                className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === 'desktop'
                    ? 'text-[#1A1A1A] border-b-2 border-[#D4754E] bg-[#F5F1EB]/50'
                    : 'text-[#6B6560] hover:text-[#1A1A1A] hover:bg-[#F5F1EB]/30'
                }`}
              >
                Claude Desktop
              </button>
              <button
                onClick={() => { setActiveTab('code'); posthog.capture('mcp_tab_changed', { tab: 'code' }) }}
                className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === 'code'
                    ? 'text-[#1A1A1A] border-b-2 border-[#D4754E] bg-[#F5F1EB]/50'
                    : 'text-[#6B6560] hover:text-[#1A1A1A] hover:bg-[#F5F1EB]/30'
                }`}
              >
                Claude Code
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'http' ? (
              <div className="space-y-8">
                {/* Step 1 */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-6 h-6 rounded-full bg-[#D4754E] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      1
                    </span>
                    <p className="text-sm font-medium text-[#1A1A1A]">Add the hosted server — no install required</p>
                  </div>
                  <p className="text-xs text-[#6B6560] mb-3 pl-9">
                    Works in Claude Desktop, Claude Code, and any MCP client that supports HTTP transport.
                  </p>
                  <div className="relative rounded-xl overflow-hidden">
                    <div className="bg-[#1A1A1A] p-4 pr-16">
                      <pre className="text-sm text-[#E8E2D9] font-mono leading-relaxed overflow-x-auto whitespace-pre">
                        {HTTP_CONFIG}
                      </pre>
                    </div>
                    <div className="absolute top-3 right-3">
                      <CopyButton text={HTTP_CONFIG} label="http_config" />
                    </div>
                  </div>
                  <p className="text-xs text-[#6B6560] mt-3 pl-0">
                    For Claude Desktop: <span className="font-mono">~/Library/Application Support/Claude/claude_desktop_config.json</span><br />
                    For Claude Code: add to your project&apos;s <span className="font-mono">.mcp.json</span>
                  </p>
                </div>

                {/* Step 2 */}
                <div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#D4754E] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      2
                    </span>
                    <p className="text-sm font-medium text-[#1A1A1A]">Restart your client</p>
                  </div>
                  <p className="text-xs text-[#6B6560] pl-9 mt-1">
                    The server runs on our infrastructure — always up-to-date with the latest catalog, zero maintenance on your end.
                  </p>
                </div>
              </div>
            ) : activeTab === 'cli' ? (
              <div className="space-y-8">
                {/* Step 1 */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-6 h-6 rounded-full bg-[#D4754E] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      1
                    </span>
                    <p className="text-sm font-medium text-[#1A1A1A]">Run the Claude CLI command</p>
                  </div>
                  <p className="text-xs text-[#6B6560] mb-3 pl-9">
                    Adds the MCP server at the user level (global across all projects). Requires Claude CLI installed.
                  </p>
                  <div className="relative rounded-xl overflow-hidden">
                    <div className="bg-[#1A1A1A] p-4 pr-16">
                      <pre className="text-sm text-[#E8E2D9] font-mono leading-relaxed overflow-x-auto whitespace-pre">
                        {CLAUDE_CLI_COMMAND}
                      </pre>
                    </div>
                    <div className="absolute top-3 right-3">
                      <CopyButton text={CLAUDE_CLI_COMMAND} label="cli_command" />
                    </div>
                  </div>
                  <p className="text-xs text-[#6B6560] mt-3 pl-9">
                    The <span className="font-mono">--scope user</span> flag makes it available across all projects. Use <span className="font-mono">--scope project</span> for project-only.
                  </p>
                </div>

                {/* Step 2 */}
                <div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#D4754E] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      2
                    </span>
                    <p className="text-sm font-medium text-[#1A1A1A]">Start using it</p>
                  </div>
                  <p className="text-xs text-[#6B6560] pl-9 mt-1">
                    The server is immediately available in Claude Desktop, Claude Code, or any Claude CLI session.
                  </p>
                </div>
              </div>
            ) : activeTab === 'desktop' ? (
              <div className="space-y-8">
                {/* Step 1 */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-6 h-6 rounded-full bg-[#D4754E] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      1
                    </span>
                    <p className="text-sm font-medium text-[#1A1A1A]">Edit your Claude Desktop config</p>
                  </div>
                  <p className="text-xs text-[#6B6560] font-mono mb-3 pl-9">
                    ~/Library/Application Support/Claude/claude_desktop_config.json
                  </p>
                  <div className="relative rounded-xl overflow-hidden">
                    <div className="bg-[#1A1A1A] p-4 pr-16">
                      <pre className="text-sm text-[#E8E2D9] font-mono leading-relaxed overflow-x-auto whitespace-pre">
                        {CLAUDE_DESKTOP_CONFIG}
                      </pre>
                    </div>
                    <div className="absolute top-3 right-3">
                      <CopyButton text={CLAUDE_DESKTOP_CONFIG} label="desktop_config" />
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#D4754E] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      2
                    </span>
                    <p className="text-sm font-medium text-[#1A1A1A]">Restart Claude Desktop</p>
                  </div>
                  <p className="text-xs text-[#6B6560] pl-9 mt-1">
                    Quit and reopen Claude Desktop. The Agentic AI For Good tools will appear in the MCP panel.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-[#6B6560] mb-3">
                  Add to your project&apos;s <span className="font-mono text-[#1A1A1A]">.mcp.json</span>:
                </p>
                <div className="relative rounded-xl overflow-hidden">
                  <div className="bg-[#1A1A1A] p-4 pr-16">
                    <pre className="text-sm text-[#E8E2D9] font-mono leading-relaxed overflow-x-auto whitespace-pre">
                      {MCP_JSON_CONFIG}
                    </pre>
                  </div>
                  <div className="absolute top-3 right-3">
                    <CopyButton text={MCP_JSON_CONFIG} label="mcp_json_config" />
                  </div>
                </div>
                <p className="text-xs text-[#6B6560] mt-3">
                  Claude Code will pick up the server automatically on next launch.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Section 2.5 — Use Case Flow */}
        <div className="mb-12">
          <span className="micro-label text-[#D4754E] block mb-3">REAL-WORLD SCENARIOS</span>
          <h2 className="display-heading text-2xl text-[#1A1A1A] mb-8">HOW DEVELOPERS USE IT</h2>

          <div className="space-y-4">
            {/* Scenario 1 */}
            <div className="bg-white rounded-2xl border border-[#1A1A1A]/8 p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4754E]/10 flex items-center justify-center text-[#D4754E] flex-shrink-0 mt-0.5">
                  <Search size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="display-heading text-base text-[#1A1A1A] mb-1">Discover by use case, not by name</h3>
                  <p className="text-sm text-[#6B6560] leading-relaxed mb-4">
                    You&apos;re building a RAG pipeline and need a vector database. Instead of Googling and reading 10 comparison posts, ask Claude — with MCP, it queries our catalog directly and returns ranked, vetted options with install commands.
                  </p>
                  <div className="bg-[#F5F1EB] rounded-xl p-4 font-mono text-xs text-[#1A1A1A] leading-relaxed">
                    <span className="text-[#D4754E]">You:</span> &ldquo;Find me a vector database that supports Python, has a hosted option, and a free tier&rdquo;<br />
                    <span className="text-[#6B6560] mt-2 block"><span className="text-[#1A1A1A]">Claude:</span> Found 4 matching tools — Qdrant, Weaviate, Chroma, Pinecone... [via search_tools]</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scenario 2 */}
            <div className="bg-white rounded-2xl border border-[#1A1A1A]/8 p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4754E]/10 flex items-center justify-center text-[#D4754E] flex-shrink-0 mt-0.5">
                  <GitBranch size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="display-heading text-base text-[#1A1A1A] mb-1">Stack-aware recommendations</h3>
                  <p className="text-sm text-[#6B6560] leading-relaxed mb-4">
                    Paste your <span className="font-mono text-[#1A1A1A]">package.json</span> and ask what&apos;s missing. Claude reads your dependencies, calls <span className="font-mono text-[#1A1A1A]">suggest_for_stack</span>, and returns tools that integrate with your exact setup — no generic suggestions.
                  </p>
                  <div className="bg-[#F5F1EB] rounded-xl p-4 font-mono text-xs text-[#1A1A1A] leading-relaxed">
                    <span className="text-[#D4754E]">You:</span> &ldquo;Here&apos;s my package.json. What AI tooling am I missing for production?&rdquo;<br />
                    <span className="text-[#6B6560] mt-2 block"><span className="text-[#1A1A1A]">Claude:</span> You&apos;re using LangChain but missing an observability layer — here&apos;s what integrates... [via suggest_for_stack]</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scenario 3 */}
            <div className="bg-white rounded-2xl border border-[#1A1A1A]/8 p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4754E]/10 flex items-center justify-center text-[#D4754E] flex-shrink-0 mt-0.5">
                  <Rss size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="display-heading text-base text-[#1A1A1A] mb-1">Stay current without the noise</h3>
                  <p className="text-sm text-[#6B6560] leading-relaxed mb-4">
                    The AI tooling space moves fast. Ask Claude what was added this week and get a curated digest of new tools — filtered to categories you care about, with no marketing fluff.
                  </p>
                  <div className="bg-[#F5F1EB] rounded-xl p-4 font-mono text-xs text-[#1A1A1A] leading-relaxed">
                    <span className="text-[#D4754E]">You:</span> &ldquo;What AI tools were added in the last 7 days?&rdquo;<br />
                    <span className="text-[#6B6560] mt-2 block"><span className="text-[#1A1A1A]">Claude:</span> 3 new tools this week — 1 in Agents, 2 in Monitoring... [via whats_new]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 — 4 Tool Cards */}
        <div className="mb-12">
          <span className="micro-label text-[#D4754E] block mb-3">TOOLS AVAILABLE</span>
          <h2 className="display-heading text-2xl text-[#1A1A1A] mb-8">WHAT CLAUDE CAN DO</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOOLS.map((tool) => (
              <div
                key={tool.name}
                className="bg-white rounded-2xl border border-[#1A1A1A]/8 p-6 hover:border-[#D4754E]/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#D4754E]/10 flex items-center justify-center text-[#D4754E] flex-shrink-0">
                    {tool.icon}
                  </div>
                  <span className="micro-label text-[#1A1A1A] font-mono">{tool.name}</span>
                </div>
                <p className="text-sm text-[#6B6560] leading-relaxed mb-3">{tool.description}</p>
                <p className="text-xs text-[#6B6560]/80 italic">{tool.prompt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4 — Example Prompts */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl border border-[#1A1A1A]/8 p-6 lg:p-8">
            <span className="micro-label text-[#D4754E] block mb-3">TRY ASKING CLAUDE</span>
            <h2 className="display-heading text-xl text-[#1A1A1A] mb-6">EXAMPLE PROMPTS</h2>

            <div className="space-y-3">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <div
                  key={prompt}
                  className="flex items-center justify-between gap-4 p-4 bg-[#F5F1EB] rounded-xl"
                >
                  <p className="text-sm text-[#1A1A1A] font-mono leading-snug flex-1">{prompt}</p>
                  <CopyButton text={prompt} className="flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5 — Subscribe */}
        <div className="mb-6 p-8 bg-white rounded-2xl border border-[#1A1A1A]/5">
          <span className="micro-label text-[#D4754E] block mb-3">STAY IN THE LOOP</span>
          <h3 className="display-heading text-xl text-[#1A1A1A] mb-2">NEW TOOLS, WEEKLY</h3>
          <p className="text-[#6B6560] text-sm mb-5 max-w-sm">
            Get notified when new AI tools land in the catalog. One email per week, no noise.
          </p>
          <SubscribeWidget source="mcp_page" className="max-w-sm" />
        </div>

        {/* Section 6 — Contribute CTA */}
        <div className="p-8 bg-white rounded-2xl border border-[#1A1A1A]/5 text-center">
          <span className="micro-label text-[#D4754E] block mb-3">Missing a tool?</span>
          <h3 className="display-heading text-xl text-[#1A1A1A] mb-3">ADD IT VIA GITHUB PR</h3>
          <p className="text-[#6B6560] text-sm mb-6 max-w-md mx-auto">
            The MCP server reads from the same catalog. Add a tool via pull request and it&apos;s available to everyone&apos;s Claude instantly.
          </p>
          <a
            href="https://github.com/nimit2801/Agentic-AI-For-Good-Website/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#D4754E] hover:bg-[#C0653E] text-white rounded-full px-6 py-3 text-sm font-medium transition-all duration-200"
            onClick={() => posthog.capture('mcp_contribute_clicked', { source: 'mcp_page' })}
          >
            Open Contribution Guide
          </a>
        </div>

      </div>
    </section>
  )
}
