# Contributing to the AI Tools Catalog

Thank you for helping build the best AI tool discovery platform! This guide explains how to submit new tools to our catalog.

## Quick Start

1. Fork the repository
2. Create a new YAML file in the appropriate category folder under `tools/`
3. Follow the schema (see `schema/tool-schema.json`)
4. Submit a pull request

## File Structure

```
tools/
  agent-frameworks/
    langchain.yaml
    llamaindex.yaml
  llm-apis/
    openai.yaml
    anthropic.yaml
  vector-databases/
    pinecone.yaml
    chromadb.yaml
  rag-tools/
  code-assistants/
  testing-eval/
```

## YAML Template

```yaml
name: Tool Name
slug: tool-name
tagline: One-line description (max 200 chars)
description: Short description (max 500 chars)
long_description: |
  Longer markdown description with details
  and multiple paragraphs.
category: Agents  # One of: LLM, Vector DB, RAG, Agents, Fine-tuning, Monitoring, Data, Dev Tools, Other
tags:
  - python
  - open-source
  - framework
website_url: https://example.com
github_url: https://github.com/org/repo  # Optional
docs_url: https://docs.example.com  # Optional
pricing: free  # One of: free, freemium, paid
license: MIT  # SPDX identifier or "Proprietary"
is_open_source: true
maintained: true
stack:
  languages:
    - Python
    - JavaScript
  frameworks:
    - OpenAI
    - LangChain
integration:
  install_command: pip install tool-name
  code_snippet: |
    import tool
    tool.do_something()
  guide: |
    ## Getting Started
    
    1. Install: `pip install tool-name`
    2. Configure your API key
    3. Run the quickstart example
meta:
  added_by: your-github-username
  added_date: "2026-04-07"
```

## Schema Validation

All submissions must pass schema validation. Before submitting:

```bash
# Install dependencies
npm install

# Validate your YAML file
npx ts-node scripts/validate.ts tools/agent-frameworks/my-tool.yaml

# Or validate all files
npx ts-node scripts/validate.ts
```

## Review Process

1. Automated validation runs on your PR
2. Maintainers review for quality and accuracy
3. Once approved, your tool is automatically synced to our database
4. Embeddings are generated for semantic search

## Criteria for Inclusion

We curate tools that:

- Are actively maintained (or historically significant)
- Solve real developer problems
- Have clear documentation
- Are production-ready (or clearly marked as experimental)
- Are relevant to AI/ML development workflows

## Questions?

Open an issue or reach out to the maintainers. We're here to help!
