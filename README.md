# Agentic AI For Good

[![Tests](https://github.com/nimit2801/Agentic-AI-For-Good-Website/actions/workflows/test.yml/badge.svg)](https://github.com/nimit2801/Agentic-AI-For-Good-Website/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm: agentic-ai-for-good-mcp](https://img.shields.io/npm/v/agentic-ai-for-good-mcp)](https://www.npmjs.com/package/agentic-ai-for-good-mcp)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)

🌐 **Live site:** [agenticaiforgood.com](https://agenticaiforgood.com)

## What Is This?

Two things in one repo:

1. **Web catalog** — Browse and search 100+ curated AI agent tools by use case, category, and stack
2. **MCP server** — Search the catalog directly from Claude Desktop or Claude Code

The catalog lives in `tools/*.yaml` — anyone can add a tool via pull request.

## Architecture

```
tools/*.yaml (open catalog)
      ↓
GitHub Actions CI (validate + embed)
      ↓
Supabase (PostgreSQL + pgvector)
      ↓
Next.js 16 on Vercel
      ↓
Claude via MCP (HTTP or npx)
```

## Project Structure

```
Agentic-AI-For-Good-Website/
├── tools/                      # Open catalog — YAML files for each tool
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/mcp/           # Hosted MCP server endpoint
│   │   └── api/tools/         # Tool search & fetch APIs
│   ├── components/            # React components (shadcn/ui)
│   ├── lib/                   # Supabase client, utils
│   └── views/                 # Page-level view components
├── scripts/                   # Supabase sync, validation, embedding
├── agentic-ai-for-good-mcp/  # npm package for MCP server
├── supabase/migrations/      # Database schema (tools table, RLS, pgvector)
└── .github/workflows/        # CI: validate-pr.yml, sync-on-merge.yml
```

## Local Development

### Prerequisites
- Node.js 20+
- Supabase free tier account
- OpenAI API key (optional — search falls back to keyword mode without it)

### Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/nimit2801/Agentic-AI-For-Good-Website.git
   cd Agentic-AI-For-Good-Website
   npm install
   ```

2. **Environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Then fill in `.env.local`:

   | Variable | Where to get it | Required? |
   |----------|----------------|-----------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Settings → API | ✅ Yes |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Settings → API | ✅ Yes |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Settings → API (keep secret) | ✅ Yes (for sync scripts) |
   | `OPENAI_API_KEY` | https://platform.openai.com/api-keys | ❌ No (search falls back to keyword) |
   | `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` (dev) or your production URL | ✅ Yes (for MCP server) |
   | `RESEND_API_KEY` | https://resend.com/api-keys | ❌ No (email features disabled without it) |
   | `CRON_SECRET` | Any random string (for Vercel cron protection) | ❌ No (only needed in production) |

   **💡 Minimum viable setup:** Just the 3 Supabase vars + `NEXT_PUBLIC_SITE_URL`. Without `OPENAI_API_KEY`, search uses PostgreSQL full-text search (verified in `src/app/api/tools/search/route.ts` — 3-tier fallback: semantic → `keyword_search_tools` RPC → `ilike`).

3. **Set up Supabase**

   Run the schema SQL in your Supabase SQL editor (or use `supabase db push` if you have the CLI):
   ```bash
   # Copy the contents of supabase/migrations/*.sql and run in Supabase SQL Editor
   ```

   This creates:
   - `tools` table with pgvector column for embeddings
   - `keyword_search_tools` RPC function for full-text search
   - Row Level Security policies

4. **Seed tools** (optional)
   ```bash
   npx tsx scripts/sync-to-supabase.ts
   ```

   This reads `tools/*.yaml`, generates embeddings (if `OPENAI_API_KEY` is set), and inserts into Supabase.

5. **Start dev server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Running Tests

```bash
npm test        # Run all 49 tests
npm run test:coverage  # With coverage report
```

Tests use Vitest + `@testing-library/react`.

## MCP Server

The catalog is accessible via the Model Context Protocol:

### Hosted HTTP (recommended)

Add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac):

```json
{
  "mcpServers": {
    "agentic-ai-for-good": {
      "url": "https://agenticaiforgood.com/api/mcp"
    }
  }
}
```

Or Claude Code config (`~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "agentic-ai-for-good": {
      "url": "https://agenticaiforgood.com/api/mcp"
    }
  }
}
```

### npx (local fallback)

```json
{
  "mcpServers": {
    "agentic-ai-for-good": {
      "command": "npx",
      "args": ["-y", "agentic-ai-for-good-mcp"]
    }
  }
}
```

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `search_tools` | Semantic or keyword search across the catalog |
| `get_tool_detail` | Fetch full details for a specific tool by slug |
| `suggest_for_stack` | Get tool recommendations based on your tech stack description |
| `whats_new` | List recently added tools (default: last 7 days) |

## Contributing

### Adding a Tool (5 min)

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide. Quick version:

1. Fork this repo
2. Create `tools/your-tool-name.yaml` (copy an existing file as a template)
3. Fill in: name, description, category, tags, URLs, pricing
4. Run `npm test` to validate
5. Create PR to `main` — use the "Add a tool" PR template

### Bug Reports / Feature Requests

Open an issue: https://github.com/nimit2801/Agentic-AI-For-Good-Website/issues

### Code Contributions

1. Fork → create branch from `main`
2. Make changes → `npm test` must pass
3. Create PR

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community guidelines.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | Supabase (PostgreSQL + pgvector) |
| Search | OpenAI embeddings + pgvector (falls back to PostgreSQL FTS) |
| MCP Transport | HTTP (stateless) via `@modelcontextprotocol/sdk` |
| Email | Resend + React Email |
| Tests | Vitest + @testing-library/react |
| Deployment | Vercel |

## Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nimit2801/Agentic-AI-For-Good-Website)

### Manual Setup Checklist

1. Create Vercel project linked to your fork
2. Add environment variables in Vercel dashboard (all 7 from `.env.example`)
3. Set GitHub Actions secrets (for CI):
   - `SUPABASE_URL` (⚠️ **no** `NEXT_PUBLIC_` prefix for Actions)
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `RESEND_API_KEY`
4. Deploy

### ⚠️ Gotchas for Forks

- **GitHub Actions secret name mismatch:** CI uses `secrets.SUPABASE_URL` (no prefix), but the browser/Next.js app uses `NEXT_PUBLIC_SUPABASE_URL`. Set both in their respective places (GitHub secrets vs Vercel env vars).
- **Supabase image hostname:** `next.config.ts` hardcodes `osgxxcxbmwoprjbjgifm.supabase.co` in `images.remotePatterns`. Update this to your own Supabase project ID if you're using your own Supabase instance.

## License

MIT — see [LICENSE](LICENSE)

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting.

---

Built with ❤️ to make AI agent development more accessible.
