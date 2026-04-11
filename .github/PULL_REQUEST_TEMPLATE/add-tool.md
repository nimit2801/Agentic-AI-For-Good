## Adding a tool to Agentic AI For Good

Thanks for contributing! Fill in the checklist below before submitting.
The PR validator will check your YAML automatically — fix any errors it reports.

---

### YAML file location

`tools/<category>/<tool-name>.yaml`

> Filename becomes the URL slug: `tools/agents/crewai.yaml` → `/tools/crewai`

---

### YAML preview

Paste your completed YAML here so reviewers can read it without opening the file:

```yaml
# paste your tools/<category>/<tool-name>.yaml here
```

---

### Checklist

**Required fields**
- [ ] `name` — official product name
- [ ] `description` — 2-3 sentences, specific about capabilities
- [ ] `problem_solved` — concrete explanation of what was painful before this tool existed (this powers semantic search quality)
- [ ] `use_cases` — at least 3 real use cases starting with a verb ("Build a...", "Create a...", "Automate a...")
- [ ] `category` — one of: `LLM | Vector DB | RAG | Agents | Fine-tuning | Monitoring | Data | Dev Tools | Other`
- [ ] `pricing` — one of: `free | freemium | paid`
- [ ] `is_open_source` — `true` or `false`
- [ ] At least one of: `github_url` or `website_url`

**Recommended fields**
- [ ] `tagline` — one-liner shown on the card (auto-generated if omitted, but manual is better)
- [ ] `install_command` — copy-pasteable install command (`pip install x`, `npm install x`)
- [ ] `docs_url`
- [ ] `tags` — 3-7 lowercase tags, e.g. `[python, llm, agents]`

**Quality bar**
- [ ] `problem_solved` is specific — not just "it helps with AI" but what specific pain it removes
- [ ] Use cases describe real workflows, not feature lists
- [ ] Pricing is accurate as of today

---

### About your tool

**What does your tool do in one sentence?**


**Who is the target developer?**


**What makes it different from existing tools in its category?**


**Is this tool actively maintained?** (last commit within 6 months)
- [ ] Yes
- [ ] No — explain:

---

### For maintainers only

- [ ] Embedding quality looks good (run `npx ts-node scripts/sync-to-supabase.ts --dry-run`)
- [ ] Set `approved: true` before merging
- [ ] Category is correct
