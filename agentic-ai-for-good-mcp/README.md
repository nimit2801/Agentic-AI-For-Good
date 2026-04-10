# Agentic AI For Good MCP Server

MCP (Model Context Protocol) server for discovering AI tools from [Agentic AI For Good](https://agenticaiforgood.com).

## Features

- **search_tools** — Find AI tools by keyword or semantic search
- **get_tool_detail** — Get full details including installation and code examples
- **suggest_for_stack** — Smart recommendations based on your package.json/requirements.txt
- **whats_new** — See recently added tools

## Installation

### With Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "agenticaiforgood": {
      "command": "npx",
      "args": ["-y", "agentic-ai-for-good-mcp"]
    }
  }
}
```

### Development

```bash
# Clone and setup
git clone https://github.com/agentic-ai-for-good/agentic-ai-for-good-mcp.git
cd agentic-ai-for-good-mcp
npm install

# Build
npm run build

# Run
node dist/index.js
```

## Usage in Claude

Once configured, you can ask Claude:

- "Find me a vector database for Python"
- "Show me tools for building RAG applications"
- "What tools work well with my package.json?" (paste the content)
- "What's new in the AI tools catalog?"
- "Tell me about LangChain" (uses get_tool_detail)

## API

The server queries the public API at `https://agenticaiforgood.com/api/tools`. No API key required.

## Tools Overview

### search_tools

Search the catalog with natural language queries.

```json
{
  "query": "vector database python",
  "limit": 5,
  "category": "Vector DB"
}
```

### get_tool_detail

Get comprehensive information about a specific tool.

```json
{
  "slug": "langchain"
}
```

### suggest_for_stack

Get tool recommendations based on your project's dependencies.

```json
{
  "stack_file_content": "{\"dependencies\":{\"react\":\"^18\",\"next\":\"^14\"}}",
  "stack_type": "package.json",
  "use_case": "building AI agents"
}
```

### whats_new

See recently added tools.

```json
{
  "days": 7,
  "limit": 5
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AGENTICAIFORGOOD_API_URL` | Custom API endpoint | `https://agenticaiforgood.com/api/tools` |

## License

MIT
