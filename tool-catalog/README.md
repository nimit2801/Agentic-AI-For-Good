# AI Tools Catalog

The source of truth for [Agentic AI For Good](https://agenticaiforgood.com)'s curated AI tool directory.

## Overview

This repository contains structured data about AI tools, frameworks, and infrastructure. Changes here are automatically synced to our Supabase database and published on the website.

## Structure

```
.
├── tools/              # Tool definitions (YAML)
│   ├── agent-frameworks/
│   ├── llm-apis/
│   ├── vector-databases/
│   ├── rag-tools/
│   ├── code-assistants/
│   └── testing-eval/
├── schema/             # JSON Schema validation
├── scripts/            # Sync and validation scripts
└── .github/workflows/  # CI/CD automation
```

## Tools Directory

Browse our live directory: [agenticaiforgood.com/tools](https://agenticaiforgood.com/tools)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on submitting new tools.

Quick example:

```yaml
name: LangChain
slug: langchain
tagline: Framework for building context-aware reasoning applications
description: LangChain makes it easy to connect LLMs to external data sources and build complex workflows.
category: Agents
tags:
  - python
  - javascript
  - framework
website_url: https://www.langchain.com
github_url: https://github.com/langchain-ai/langchain
pricing: free
license: MIT
is_open_source: true
```

## How It Works

1. **Submit**: Contributors open PRs with new tools
2. **Validate**: GitHub Actions validates against schema
3. **Review**: Maintainers review for quality
4. **Sync**: On merge, tools are synced to Supabase with embeddings
5. **Search**: Tools are searchable via semantic search on the website and MCP server

## Local Development

```bash
# Install dependencies
npm install

# Validate all tools
npx ts-node scripts/validate.ts

# Sync to Supabase (requires env vars)
export SUPABASE_URL=...
export SUPABASE_SERVICE_KEY=...
export OPENAI_API_KEY=...
npx ts-node scripts/sync-to-supabase.ts
```

## Integrations

- **Website**: [agenticaiforgood.com](https://agenticaiforgood.com)
- **MCP Server**: `aiforgood-mcp` npm package
- **API**: REST endpoints at `/api/tools`

## License

MIT - See [LICENSE](./LICENSE) for details.
