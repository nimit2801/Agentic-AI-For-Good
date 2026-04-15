# Contributing a Tool

Adding a tool to [Agentic AI For Good](https://agenticaiforgood.com) takes about 5 minutes.  
Once your PR is merged, the tool is automatically embedded and searchable.

---

## How to submit

1. **Fork** this repository
2. Create a new YAML file under `tools/<category>/your-tool-name.yaml`
3. Fill in the template below
4. Open a pull request

The filename becomes the tool's slug (e.g. `tools/agents/crewai.yaml` → `/tools/crewai`).

---

## YAML template

```yaml
name: Your Tool Name
description: 1-3 sentences describing what this tool does. Be specific about capabilities.

# At least one of these is required
github_url: https://github.com/org/repo
website_url: https://yourtool.com

docs_url: https://docs.yourtool.com         # optional
install_command: pip install your-tool      # optional but very helpful
tagline: One-liner shown on the card        # optional, auto-generated if omitted

category: Agents   # LLM | Vector DB | RAG | Agents | Fine-tuning | Monitoring | Data | Dev Tools | Other
tags: [python, llm, agents]
pricing: free      # free | freemium | paid
is_open_source: true
license: MIT       # optional

# The most important field — what specific problem does this tool solve?
# Be concrete. This powers semantic search.
problem_solved: |
  Explain why this tool exists and what it replaces or eliminates.
  What was painful before? What can developers stop doing manually?
  The more specific, the better the search quality.

# At least 3 use cases. More is better — all of them improve search.
use_cases:
  - Build a RAG pipeline that answers questions from internal documents
  - Create an autonomous agent that browses the web and summarizes findings
  - Orchestrate multi-step LLM workflows without writing boilerplate
```

---

## Categories

| Category | Examples |
|----------|---------|
| `LLM` | OpenAI, Anthropic, Groq, Together AI |
| `Vector DB` | Pinecone, Weaviate, ChromaDB, Qdrant |
| `RAG` | LlamaIndex, Unstructured, Langfuse |
| `Agents` | LangChain, AutoGen, CrewAI, DSPy |
| `Fine-tuning` | Hugging Face, OpenAI fine-tuning, Axolotl |
| `Monitoring` | Weights & Biases, Arize, Langfuse |
| `Data` | Airbyte, dbt, Fivetran |
| `Dev Tools` | Claude Code, Cursor, Aider, GitHub Copilot |
| `Other` | Anything that doesn't fit above |

---

## What makes a good submission?

**Required:**
- `problem_solved` — this is the most important field. Be specific about the before/after. Vague descriptions make for poor search results.
- At least 3 `use_cases` — concrete examples, not feature names.

**Not accepted:**
- Tools without a public URL or repository
- Duplicate tools already in the catalog
- Commercial tools with no free tier (unless truly exceptional)

---

## After you open a PR

- CI validates your YAML automatically (usually takes < 30s)
- A maintainer reviews and merges
- On merge, embeddings are generated and the tool appears on the site within minutes

Questions? Open an issue or ping us on the PR.

---

## License for contributions

By contributing to this project, you agree that:

- **Code contributions** are licensed under the MIT License ([LICENSE-CODE](LICENSE-CODE))
- **Catalog contributions** (`tools/*.yaml`) are licensed under Creative Commons BY-NC-SA 4.0 ([LICENSE-CATALOG](LICENSE-CATALOG))

See [LICENSE](LICENSE) for full details on the split licensing model.
