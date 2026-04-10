# Hacker News — Show HN

## Title (pick one)

**Option A (product-focused):**
> Show HN: Agentic AI For Good – curated AI tool catalog with semantic search and MCP server

**Option B (problem-focused):**
> Show HN: I built a semantic search catalog for AI tools (also works inside Claude via MCP)

**Option C (concise):**
> Show HN: Semantic search over 200+ AI tools, installable in Claude via MCP

---

## Top Comment (paste as first comment immediately after posting)

Hey HN,

I kept losing track of AI tools I'd read about and couldn't find again when I needed them. Built this to solve that.

**What it is:** agenticaiforgood.com — a curated catalog of AI tools and frameworks (LLMs, vector DBs, RAG, agents, monitoring, fine-tuning).

**What makes it different from Awesome lists:**

1. **Semantic search** — describe what you want to build, not the tool name. Uses pgvector + text-embedding-3-small cosine similarity. "Add observability to my LangChain app" returns LangSmith, Helicone, etc. Threshold is 0.2 so results are generous.

2. **MCP server** — `npx -y agentic-ai-for-good-mcp` gives Claude direct access to the catalog. Four tools: `search_tools`, `get_tool_detail`, `suggest_for_stack` (paste your package.json), `whats_new`. Works in Claude Desktop and Claude Code.

3. **PR-based catalog** — no admin panel, no scraping. Contributors open a YAML PR, GitHub Actions validates it, sync script embeds it and upserts to Supabase on merge. Template is in CONTRIBUTING.md.

**Tech:** Next.js 16 App Router, Supabase pgvector, Vercel, TypeScript. MCP server is on npm.

Happy to answer questions about the semantic search implementation or the MCP setup.

Source: github.com/nimit2801/Agentic-AI-For-Good-Website

---

## Anti-patterns to avoid
- Don't say "game-changer", "revolutionize", or "AI-powered" (redundant)
- Don't lead with "I'm excited to share"
- Do answer technical questions quickly — HN rewards engagement
- If someone asks why not just use Perplexity/ChatGPT search: the catalog is curated + editorial, embedding quality matters, and the MCP integration is the differentiator

---

## Expected questions + responses

**Q: How is this different from futurepedia.io / theresanaiforthat.com?**
A: Those are crowdsourced, not curated. Every tool here has a `problem_solved` field and 5 concrete use cases — that's what powers good semantic search. Volume isn't the goal.

**Q: Why pgvector instead of a dedicated vector DB?**
A: Catalog is small enough (~hundreds of tools) that Supabase pgvector is the right tool. Keeps the stack simple — one DB, no separate infra.

**Q: Is the MCP server open source?**
A: Yes, Apache 2.0. github.com/nimit2801/Agentic-AI-For-Good-Website/tree/main/agentic-ai-for-good-mcp

**Q: What's the embed model?**
A: text-embedding-3-small (1536-dim), OpenAI. Cosine similarity, threshold 0.2.
