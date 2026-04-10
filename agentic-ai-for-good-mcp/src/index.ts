#!/usr/bin/env node
/**
 * Agentic AI For Good MCP Server
 * 
 * Provides AI tool discovery via Model Context Protocol.
 * Usage with Claude Desktop: Add to claude_desktop_config.json
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js'

// API base URL - can be overridden with env var
const API_BASE_URL = process.env.AGENTICAIFORGOOD_API_URL || 'https://agenticaiforgood.com/api/tools'

// Tool definitions
const SEARCH_TOOLS: Tool = {
  name: 'search_tools',
  description: 'Search for AI tools by keyword or semantic query. Finds tools that match your use case, technology, or requirements.',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query describing what you need (e.g., "vector database for python", "agent framework")',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results (default: 5)',
        minimum: 1,
        maximum: 20,
      },
      category: {
        type: 'string',
        description: 'Filter by category: LLM, Vector DB, RAG, Agents, Fine-tuning, Monitoring, Data, Dev Tools',
      },
    },
    required: ['query'],
  },
}

const GET_TOOL_DETAIL: Tool = {
  name: 'get_tool_detail',
  description: 'Get detailed information about a specific tool including installation, code examples, and integration guide.',
  inputSchema: {
    type: 'object',
    properties: {
      slug: {
        type: 'string',
        description: 'The tool slug (kebab-case identifier)',
      },
    },
    required: ['slug'],
  },
}

const SUGGEST_FOR_STACK: Tool = {
  name: 'suggest_for_stack',
  description: 'AI-powered tool recommendations based on your current tech stack. Reads package.json, requirements.txt, or similar files to suggest relevant tools.',
  inputSchema: {
    type: 'object',
    properties: {
      stack_file_content: {
        type: 'string',
        description: 'Content of package.json, requirements.txt, Cargo.toml, etc.',
      },
      stack_type: {
        type: 'string',
        description: 'Type of stack file: package.json, requirements.txt, Cargo.toml, go.mod, etc.',
      },
      use_case: {
        type: 'string',
        description: 'What are you building? (e.g., RAG application, AI agents, data pipeline)',
      },
    },
    required: ['stack_file_content', 'stack_type'],
  },
}

const WHATS_NEW: Tool = {
  name: 'whats_new',
  description: 'Get recently added tools in the last N days.',
  inputSchema: {
    type: 'object',
    properties: {
      days: {
        type: 'number',
        description: 'Number of days to look back (default: 7)',
        minimum: 1,
        maximum: 90,
      },
      limit: {
        type: 'number',
        description: 'Maximum results (default: 5)',
      },
    },
  },
}

// API helper
async function fetchTools(query?: string, limit = 10, category?: string): Promise<any[]> {
  const url = new URL(API_BASE_URL)
  
  if (query) {
    // Use search endpoint
    const searchUrl = `${API_BASE_URL}/search`
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit, category }),
    })
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`)
    }
    
    const data: any = await response.json()
    return data.results || []
  } else {
    // Use list endpoint
    url.searchParams.set('limit', String(limit))
    if (category) url.searchParams.set('category', category)
    
    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status}`)
    }
    
    const data: any = await response.json()
    return data.tools || []
  }
}

async function getToolDetail(slug: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/${slug}`)
  
  if (!response.ok) {
    throw new Error(`Tool not found: ${slug}`)
  }
  
  const data: any = await response.json()
  return data.tool
}

// Extract dependencies from stack files
function extractDependencies(content: string, type: string): string[] {
  const deps: string[] = []
  
  try {
    switch (type.toLowerCase()) {
      case 'package.json':
        const pkg = JSON.parse(content)
        deps.push(...Object.keys(pkg.dependencies || {}))
        deps.push(...Object.keys(pkg.devDependencies || {}))
        break
        
      case 'requirements.txt':
        content.split('\n').forEach(line => {
          const match = line.match(/^([a-zA-Z0-9_-]+)/)
          if (match) deps.push(match[1])
        })
        break
        
      case 'cargo.toml':
        // Simple regex for Rust dependencies
        const cargoMatches = content.matchAll(/^([a-zA-Z0-9_-]+)\s*=/gm)
        for (const m of cargoMatches) deps.push(m[1])
        break
        
      case 'go.mod':
        // Extract module paths, take last segment
        content.split('\n').forEach(line => {
          const match = line.match(/\\s+([a-zA-Z0-9./-]+)\\s+v\\d/)
          if (match) {
            const parts = match[1].split('/')
            deps.push(parts[parts.length - 1])
          }
        })
        break
    }
  } catch (e) {
    // Parse errors are handled gracefully
  }
  
  return deps
}

// Format tool for display
function formatTool(tool: any): string {
  const parts = [
    `## ${tool.name}`,
    '',
    tool.tagline || tool.description,
    '',
    `**Category:** ${tool.category || 'N/A'}`,
    `**Pricing:** ${tool.pricing || 'N/A'}`,
  ]
  
  if (tool.is_open_source) {
    parts.push(`**Open Source:** Yes${tool.license ? ` (${tool.license})` : ''}`)
  }
  
  if (tool.github_stars) {
    parts.push(`**Stars:** ${tool.github_stars.toLocaleString()}`)
  }
  
  if (tool.stack_languages?.length) {
    parts.push(`**Languages:** ${tool.stack_languages.join(', ')}`)
  }
  
  if (tool.website_url || tool.url) {
    parts.push(`**Website:** ${tool.website_url || tool.url}`)
  }
  
  if (tool.github_url) {
    parts.push(`**GitHub:** ${tool.github_url}`)
  }
  
  parts.push('')
  
  if (tool.description && tool.description !== tool.tagline) {
    parts.push(tool.description)
    parts.push('')
  }
  
  if (tool.tags?.length) {
    parts.push(`**Tags:** ${tool.tags.join(', ')}`)
  }
  
  parts.push(`**Slug:** \`${tool.slug}\``)
  
  return parts.join('\\n')
}

function formatToolDetail(tool: any): string {
  const parts = [
    `# ${tool.name}`,
    '',
    tool.tagline || tool.description,
    '',
  ]
  
  // Metadata
  parts.push('## Overview')
  parts.push('')
  parts.push(`- **Category:** ${tool.category || 'N/A'}`)
  parts.push(`- **Pricing:** ${tool.pricing || 'N/A'}`)
  parts.push(`- **License:** ${tool.license || 'N/A'}`)
  parts.push(`- **Open Source:** ${tool.is_open_source ? 'Yes' : 'No'}`)
  
  if (tool.maintained === false) {
    parts.push('- **Status:** ⚠️ Unmaintained')
  }
  
  if (tool.github_stars) {
    parts.push(`- **GitHub Stars:** ${tool.github_stars.toLocaleString()}`)
  }
  
  parts.push('')
  
  // Links
  parts.push('## Links')
  parts.push('')
  if (tool.website_url || tool.url) {
    parts.push(`- Website: ${tool.website_url || tool.url}`)
  }
  if (tool.github_url) {
    parts.push(`- GitHub: ${tool.github_url}`)
  }
  if (tool.docs_url) {
    parts.push(`- Documentation: ${tool.docs_url}`)
  }
  parts.push('')
  
  // Description
  if (tool.long_description) {
    parts.push('## Description')
    parts.push('')
    parts.push(tool.long_description)
    parts.push('')
  }
  
  // Stack
  if (tool.stack_languages?.length || tool.stack_frameworks?.length) {
    parts.push('## Technology Stack')
    parts.push('')
    if (tool.stack_languages?.length) {
      parts.push(`**Languages:** ${tool.stack_languages.join(', ')}`)
    }
    if (tool.stack_frameworks?.length) {
      parts.push(`**Frameworks:** ${tool.stack_frameworks.join(', ')}`)
    }
    parts.push('')
  }
  
  // Installation
  if (tool.install_command) {
    parts.push('## Installation')
    parts.push('')
    parts.push('```bash')
    parts.push(tool.install_command)
    parts.push('```')
    parts.push('')
  }
  
  // Code snippet
  if (tool.code_snippet) {
    parts.push('## Quick Start')
    parts.push('')
    parts.push('```')
    parts.push(tool.code_snippet)
    parts.push('```')
    parts.push('')
  }
  
  // Integration guide
  if (tool.integration_guide) {
    parts.push('## Integration Guide')
    parts.push('')
    parts.push(tool.integration_guide)
    parts.push('')
  }
  
  // Tags
  if (tool.tags?.length) {
    parts.push('## Tags')
    parts.push('')
    parts.push(tool.tags.join(', '))
    parts.push('')
  }
  
  return parts.join('\\n')
}

// Server setup
const server = new Server(
  {
    name: 'agentic-ai-for-good-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [SEARCH_TOOLS, GET_TOOL_DETAIL, SUGGEST_FOR_STACK, WHATS_NEW],
  }
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params
  
  try {
    switch (name) {
      case 'search_tools': {
        const query = String(args?.query || '')
        const limit = Number(args?.limit) || 5
        const category = args?.category as string | undefined
        
        if (!query.trim()) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Query is required',
            }],
            isError: true,
          }
        }
        
        const tools = await fetchTools(query, limit, category)
        
        if (tools.length === 0) {
          return {
            content: [{
              type: 'text',
              text: `No tools found for "${query}". Try a different search term.`,
            }],
          }
        }
        
        const formatted = tools.map(formatTool).join('\\n\\n---\\n\\n')
        
        return {
          content: [{
            type: 'text',
            text: `Found ${tools.length} tool(s) for "${query}":\\n\\n${formatted}`,
          }],
        }
      }
      
      case 'get_tool_detail': {
        const slug = String(args?.slug || '')
        
        if (!slug) {
          return {
            content: [{
              type: 'text',
              text: 'Error: Tool slug is required',
            }],
            isError: true,
          }
        }
        
        const tool = await getToolDetail(slug)
        
        return {
          content: [{
            type: 'text',
            text: formatToolDetail(tool),
          }],
        }
      }
      
      case 'suggest_for_stack': {
        const content = String(args?.stack_file_content || '')
        const type = String(args?.stack_type || '')
        const useCase = String(args?.use_case || '')
        
        if (!content || !type) {
          return {
            content: [{
              type: 'text',
              text: 'Error: stack_file_content and stack_type are required',
            }],
            isError: true,
          }
        }
        
        const deps = extractDependencies(content, type)
        
        // Build search query from dependencies and use case
        const searchTerms = [...deps.slice(0, 5)]
        if (useCase) searchTerms.push(useCase)
        
        const query = searchTerms.length > 0
          ? `tools for ${searchTerms.join(', ')}`
          : 'AI development tools'
        
        const tools = await fetchTools(query, 5)
        
        // Filter out tools that are already in dependencies
        const existingDeps = new Set(deps.map(d => d.toLowerCase()))
        const newTools = tools.filter(t => 
          !existingDeps.has(t.name.toLowerCase()) &&
          !existingDeps.has(t.slug.toLowerCase())
        )
        
        if (newTools.length === 0) {
          return {
            content: [{
              type: 'text',
              text: deps.length > 0
                ? `Found ${deps.length} dependencies but no new tool suggestions. Your stack looks well-equipped!`
                : 'Could not parse dependencies from the file provided.',
            }],
          }
        }
        
        const formatted = newTools.map(formatTool).join('\\n\\n---\\n\\n')
        
        return {
          content: [{
            type: 'text',
            text: `Based on your ${type} with ${deps.length} detected dependencies, here are ${newTools.length} suggested tools:\\n\\n${formatted}`,
          }],
        }
      }
      
      case 'whats_new': {
        const days = Number(args?.days) || 7
        const limit = Number(args?.limit) || 5
        
        // Fetch recent tools (sorted by created_at desc)
        const tools = await fetchTools(undefined, limit)
        
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - days)
        
        const recent = tools.filter(t => {
          const created = new Date(t.created_at)
          return created >= cutoff
        })
        
        if (recent.length === 0) {
          return {
            content: [{
              type: 'text',
              text: `No new tools in the last ${days} days. Check out the full catalog at https://agenticaiforgood.com/tools`,
            }],
          }
        }
        
        const formatted = recent.map(formatTool).join('\\n\\n---\\n\\n')
        
        return {
          content: [{
            type: 'text',
            text: `${recent.length} tool(s) added in the last ${days} days:\\n\\n${formatted}`,
          }],
        }
      }
      
      default:
        return {
          content: [{
            type: 'text',
            text: `Unknown tool: ${name}`,
          }],
          isError: true,
        }
    }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error: ${error instanceof Error ? error.message : String(error)}`,
      }],
      isError: true,
    }
  }
})

// Start server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Agentic AI For Good MCP Server running on stdio')
}

main().catch((error) => {
  console.error('Server error:', error)
  process.exit(1)
})
