/**
 * Hosted MCP Server — agenticaiforgood.com/api/mcp
 *
 * Runs the Agentic AI For Good tool catalog as an MCP endpoint over
 * HTTP Streamable transport (Web Standard). Stateless — one transport per request.
 *
 * Claude Desktop (~/.config/claude/claude_desktop_config.json):
 *   {
 *     "mcpServers": {
 *       "agenticaiforgood": {
 *         "type": "http",
 *         "url": "https://agenticaiforgood.com/api/mcp"
 *       }
 *     }
 *   }
 *
 * Claude Code (.mcp.json):
 *   {
 *     "mcpServers": {
 *       "agenticaiforgood": {
 *         "type": "http",
 *         "url": "https://agenticaiforgood.com/api/mcp"
 *       }
 *     }
 *   }
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// ─── Tool definitions ──────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'search_tools',
    description:
      'Search for AI tools by use case, keyword, or technology. Finds tools matching your requirements from the Agentic AI For Good catalog.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'What you want to build or what problem you need to solve',
        },
        category: {
          type: 'string',
          description:
            'Filter by category: LLM, Vector DB, RAG, Agents, Fine-tuning, Monitoring, Data, Dev Tools',
        },
        limit: { type: 'number', description: 'Max results (default 10)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_tool_detail',
    description:
      'Get full details about a specific AI tool including description, install command, use cases, and links.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        slug: {
          type: 'string',
          description: 'Tool slug (e.g. "langchain", "qdrant")',
        },
      },
      required: ['slug'],
    },
  },
  {
    name: 'suggest_for_stack',
    description:
      'Get AI tool recommendations based on your current tech stack. Paste your package.json dependencies or requirements.txt.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        stack: {
          type: 'string',
          description: 'Your current dependencies or tech stack description',
        },
        goal: {
          type: 'string',
          description: 'What you want to achieve (optional)',
        },
      },
      required: ['stack'],
    },
  },
  {
    name: 'whats_new',
    description: 'See AI tools recently added to the catalog.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        days: {
          type: 'number',
          description: 'How many days back to look (default 7)',
        },
      },
    },
  },
]

// ─── Tool handlers ─────────────────────────────────────────────────────────

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agenticaiforgood.com'

async function handleSearchTools(args: {
  query: string
  category?: string
  limit?: number
}): Promise<string> {
  const res = await fetch(`${SITE}/api/tools/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: args.query,
      useSemantic: true,
      threshold: 0.2,
      limit: args.limit ?? 10,
      category: args.category,
    }),
  })
  const data = await res.json()
  const tools = data.results ?? []

  if (tools.length === 0) {
    return `No tools found for "${args.query}". Try broader terms or a different category.`
  }

  return tools
    .map(
      (t: any, i: number) =>
        `${i + 1}. **${t.name}** (${t.category} · ${t.pricing})\n   ${t.tagline ?? t.description}${t.install_command ? `\n   Install: \`${t.install_command}\`` : ''}\n   ${SITE}/tools/${t.slug}`
    )
    .join('\n\n')
}

async function handleGetToolDetail(args: { slug: string }): Promise<string> {
  const supabase = createServerSupabaseClient()
  const { data: tool } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', args.slug)
    .eq('approved', true)
    .single()

  if (!tool) {
    return `Tool "${args.slug}" not found. Use search_tools to find the correct slug.`
  }

  const lines = [
    `# ${tool.name}`,
    tool.tagline ? `\n${tool.tagline}` : '',
    `\n**Category:** ${tool.category}`,
    `**Pricing:** ${tool.pricing}`,
    tool.is_open_source ? '**License:** Open Source' : '',
    tool.github_stars != null
      ? `**GitHub Stars:** ${tool.github_stars >= 1000 ? `${(tool.github_stars / 1000).toFixed(1)}k` : tool.github_stars}`
      : '',
    `\n## Description\n${tool.description}`,
    tool.install_command
      ? `\n## Install\n\`\`\`\n${tool.install_command}\n\`\`\``
      : '',
    tool.github_url ? `\n**GitHub:** ${tool.github_url}` : '',
    tool.url || tool.website_url
      ? `**Website:** ${tool.url ?? tool.website_url}`
      : '',
    tool.docs_url ? `**Docs:** ${tool.docs_url}` : '',
    `\n**Catalog page:** ${SITE}/tools/${tool.slug}`,
  ]

  return lines.filter(Boolean).join('\n')
}

async function handleSuggestForStack(args: {
  stack: string
  goal?: string
}): Promise<string> {
  const query = args.goal
    ? `AI tools for a project using ${args.stack} with goal: ${args.goal}`
    : `AI tools that integrate well with ${args.stack}`
  return handleSearchTools({ query, limit: 8 })
}

async function handleWhatsNew(args: { days?: number }): Promise<string> {
  const days = args.days ?? 7
  const supabase = createServerSupabaseClient()
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  const { data: tools } = await supabase
    .from('tools')
    .select('name, slug, tagline, description, category, pricing, created_at')
    .eq('approved', true)
    .gte('created_at', since)
    .order('created_at', { ascending: false })

  if (!tools || tools.length === 0) {
    return `No new tools added in the last ${days} days. Check back soon!`
  }

  return [
    `**${tools.length} tool${tools.length > 1 ? 's' : ''} added in the last ${days} days:**\n`,
    ...tools.map(
      (t) =>
        `• **${t.name}** (${t.category} · ${t.pricing})\n  ${t.tagline ?? t.description}\n  ${SITE}/tools/${t.slug}`
    ),
  ].join('\n')
}

// ─── MCP Server factory ────────────────────────────────────────────────────

function createMcpServer() {
  const server = new Server(
    { name: 'agentic-ai-for-good', version: '1.0.0' },
    { capabilities: { tools: {} } }
  )

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }))

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params

    try {
      let result: string

      switch (name) {
        case 'search_tools':
          result = await handleSearchTools(args as any)
          break
        case 'get_tool_detail':
          result = await handleGetToolDetail(args as any)
          break
        case 'suggest_for_stack':
          result = await handleSuggestForStack(args as any)
          break
        case 'whats_new':
          result = await handleWhatsNew(args as any)
          break
        default:
          result = `Unknown tool: ${name}`
      }

      return { content: [{ type: 'text', text: result }] }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[mcp] Tool ${name} error:`, msg)
      return {
        content: [{ type: 'text', text: `Error running ${name}: ${msg}` }],
        isError: true,
      }
    }
  })

  return server
}

// ─── Route handlers ────────────────────────────────────────────────────────

async function handleMcpRequest(req: Request): Promise<Response> {
  const transport = new WebStandardStreamableHTTPServerTransport({
    // Stateless: no sessionIdGenerator — fresh transport per request
    enableJsonResponse: false,
  })

  const server = createMcpServer()
  await server.connect(transport)

  const response = await transport.handleRequest(req)
  return response
}

export async function GET(req: Request) {
  return handleMcpRequest(req)
}

export async function POST(req: Request) {
  return handleMcpRequest(req)
}

export async function DELETE(req: Request) {
  return handleMcpRequest(req)
}
