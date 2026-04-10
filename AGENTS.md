# Agentic AI For Good — Agent Guide

This document gives AI agents (Codex, Claude Code, GPT Engineer, etc.) full context to work on this codebase autonomously. Read this before touching any file.

---

## What is this project?

**Agentic AI For Good** (`agenticaiforgood.com`) is a curated AI tool discovery platform for developers and builders. Think "Product Hunt for agentic AI" — but editorial, not crowdsourced. The catalog covers LLMs, vector databases, RAG frameworks, agents, monitoring, and more.

**Core value prop:** Find the right AI tool for a specific use case, fast — without wading through marketing or hype.

**Secondary product:** An MCP server (`agentic-ai-for-good-mcp`) that gives Claude direct access to the tool catalog. Developers install it once and can ask Claude to recommend tools from inside their IDE.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16, App Router, TypeScript |
| Styling | Tailwind CSS, custom brand tokens |
| Animations | GSAP |
| Database | Supabase (PostgreSQL + pgvector) |
| Search | pgvector cosine similarity, `text-embedding-3-small` (1536-dim) |
| Deployment | Vercel → `agenticaiforgood.com` |
| MCP Server | `agentic-ai-for-good-mcp` on npm |
| Tests | Vitest + @testing-library/react |

---

## Project Structure

```
src/
  app/                  # Next.js App Router pages + metadata
    layout.tsx          # Root layout: fonts, nav, footer, OG, JSON-LD
    page.tsx            # Homepage (hero + sections)
    tools/
      page.tsx          # /tools — browse catalog, semantic search
      [slug]/page.tsx   # /tools/:slug — tool detail + JSON-LD
    mcp/page.tsx        # /mcp — MCP server install guide + use case flow
    stories/
      page.tsx          # /stories — story listing
      [slug]/page.tsx   # /stories/:slug — story detail
    api/
      tools/
        search/route.ts # POST /api/tools/search — pgvector semantic search
  views/                # Heavy page components (client-side logic)
    Tools.tsx           # Tools browsing + filtering + URL-synced state
    MCPPage.tsx         # MCP install guide, use case flow, tool cards
    ToolDetail.tsx      # Individual tool detail view
    Home.tsx            # Homepage sections
  components/           # Reusable UI components
    ToolSearchBar.tsx   # Semantic search bar (controlled + uncontrolled modes)
    ToolCard.tsx        # Tool card in grid
    Navigation.tsx      # Top nav with MCP link
  hooks/
    use-tools.ts        # useTools(), useToolSearch() — Supabase + API hooks
    use-stories.ts      # useStories(), useStory(slug) — Supabase hooks
  lib/
    supabase.ts         # Supabase browser client + TypeScript types
    supabase-server.ts  # Supabase server client (for SSR/RSC)
  tests/                # Vitest unit tests
    hooks/              # Hook tests (fake timers for debounce)
    components/         # Component tests

tools/                  # YAML catalog source files (one file per tool)
  agent-frameworks/     # langchain.yaml, etc.
  vector-databases/     # pinecone.yaml, qdrant.yaml, etc.
  llm/                  # openai.yaml, anthropic.yaml, etc.
  rag/                  # llamaindex.yaml, etc.
  monitoring/           # langsmith.yaml, etc.
  fine-tuning/          # axolotl.yaml, etc.
  dev-tools/            # cursor.yaml, etc.

scripts/                # Automation scripts
  sync-tools.ts         # Reads tools/ YAML → upserts to Supabase + generates embeddings

agentic-ai-for-good-mcp/  # MCP server package
  src/index.ts          # 4 tools: search_tools, get_tool_detail, suggest_for_stack, whats_new
  package.json          # Published as agentic-ai-for-good-mcp on npm
```

---

## Key Workflows

### Adding a tool to the catalog
1. Create `tools/<category>/<tool-name>.yaml` following the template in `CONTRIBUTING.md`
2. Run `npx ts-node scripts/sync-tools.ts` to upsert to Supabase + generate embeddings
3. The tool appears on the site and in MCP search immediately

### Running tests
```bash
npm test              # run all Vitest tests
npm run test:watch    # watch mode
```

### Deploying
Vercel auto-deploys on push to `main`. For manual force-deploy:
```bash
vercel --prod
```

### Supabase schema changes
Migration files live in `supabase/migrations/`. Run in the Supabase dashboard SQL editor for production.

---

## Database Schema (Supabase)

### `tools` table (key columns)
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `slug` | text | URL slug, unique |
| `name` | text | Display name |
| `description` | text | 2-3 sentences |
| `tagline` | text | One-liner for card |
| `category` | text | LLM \| Vector DB \| RAG \| Agents \| Fine-tuning \| Monitoring \| Data \| Dev Tools |
| `tags` | text[] | e.g. ['python', 'llm', 'agents'] |
| `pricing` | text | free \| freemium \| paid |
| `is_open_source` | bool | |
| `approved` | bool | Only approved=true shows on site |
| `embedding` | vector(1536) | text-embedding-3-small on description+use_cases |

### `stories` table
| Column | Type | Notes |
|--------|------|-------|
| `slug` | text | URL slug |
| `title` | text | |
| `published` | bool | Only published=true shows |

---

## Search Architecture

Search uses a two-tier fallback:
1. **Semantic** — embed query with `text-embedding-3-small`, cosine similarity against `tools.embedding` (threshold: 0.2)
2. **Keyword fallback** — if semantic returns 0 results, falls back to PostgreSQL full-text search

Endpoint: `POST /api/tools/search` with `{ query, useSemantic, threshold, limit }`

`useToolSearch(query, options)` hook handles debouncing (150ms) and state management.

---

## Brand Guidelines

- **Background:** `#F5F1EB` (warm beige)
- **Accent:** `#D4754E` (terracotta)
- **Text:** `#1A1A1A` (near-black), `#6B6560` (secondary)
- **Headlines:** Inter 800, ALL CAPS (use `display-heading` class)
- **Labels:** IBM Plex Mono 500 (use `micro-label` class)
- **No stock photos.** Typography-first, editorial aesthetic.

---

## GitHub Workflows

`.github/workflows/`
- `validate-pr.yml` — validates tool YAML files on PRs to `tools/`
- `sync-on-merge.yml` — runs `sync-tools.ts` on merge to push new tools to Supabase

---

## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore the codebase.**

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes |
| `get_review_context` | Need source snippets for review |
| `get_impact_radius` | Understanding blast radius of a change |
| `query_graph` | Tracing callers, callees, imports, tests |
| `semantic_search_nodes` | Finding functions/classes by keyword |
| `get_architecture_overview` | High-level codebase structure |

---

## What agents should NOT do
- Do not modify `supabase-schema.sql` without creating a migration file
- Do not push directly to `main` without tests passing
- Do not remove the `approved=true` filter from any Supabase query (prevents unapproved tools from leaking)
- Do not hardcode API keys — use environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENAI_API_KEY`)
- Do not use `HashRouter` or `react-router-dom` — project uses Next.js App Router
