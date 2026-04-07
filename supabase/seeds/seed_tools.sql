-- Complete seed SQL for 25 AI tools across all categories
-- Run this in Supabase Dashboard > SQL Editor
-- Categories: LLM, Vector DB, RAG Tools, Agent Frameworks, Code Assistants, Testing/Eval

INSERT INTO tools (
  name, slug, description, long_description, url, category, tags,
  pricing, is_open_source, approved,
  tagline, github_url, website_url, docs_url, license,
  stack_languages, stack_frameworks, install_command, maintained
) VALUES
-- ========== LLM APIs (LLM) ==========
(
  'OpenAI API', 'openai',
  'Access GPT-4 and other state-of-the-art AI models',
  'The OpenAI API gives developers access to cutting-edge AI models including GPT-4, GPT-3.5, DALL-E, Whisper, and embeddings.',
  'https://openai.com', 'LLM', ARRAY['api', 'gpt-4', 'chat', 'embeddings', 'images'],
  'freemium', false, true,
  'Access GPT-4, DALL-E, Whisper, and other state-of-the-art AI models',
  'https://github.com/openai/openai-python', 'https://openai.com', 'https://platform.openai.com/docs', 'Proprietary',
  ARRAY['Python', 'JavaScript', 'Go'], ARRAY['Any'], 'pip install openai', true
),
(
  'Anthropic Claude API', 'anthropic',
  'Claude API for safe and helpful AI assistants',
  'Claude is an AI assistant by Anthropic designed to be helpful, harmless, and honest.',
  'https://anthropic.com', 'LLM', ARRAY['api', 'claude', 'chat', 'safety'],
  'freemium', false, true,
  'Claude API for safe, helpful AI assistants with long context',
  'https://github.com/anthropics', 'https://anthropic.com', 'https://docs.anthropic.com', 'Proprietary',
  ARRAY['Python', 'JavaScript'], ARRAY['Any'], 'pip install anthropic', true
),
(
  'Google Gemini API', 'gemini',
  'Google AI API with multimodal capabilities',
  'Google Gemini models offer multimodal understanding across text, images, and code.',
  'https://ai.google.dev', 'LLM', ARRAY['api', 'gemini', 'multimodal', 'google'],
  'freemium', false, true,
  'Google AI with multimodal text, image, and code understanding',
  'https://github.com/google-gemini', 'https://ai.google.dev', 'https://ai.google.dev/docs', 'Proprietary',
  ARRAY['Python', 'JavaScript'], ARRAY['Any'], 'pip install google-generativeai', true
),
(
  'Groq API', 'groq',
  'Ultra-fast LLM inference API',
  'Groq provides incredibly fast LLM inference using their LPU (Language Processing Unit) hardware.',
  'https://groq.com', 'LLM', ARRAY['api', 'fast', 'inference', 'llama', 'mixtral'],
  'freemium', false, true,
  'Ultra-fast LLM inference with sub-100ms response times',
  'https://github.com/groq', 'https://groq.com', 'https://console.groq.com/docs', 'Proprietary',
  ARRAY['Python', 'JavaScript'], ARRAY['Any'], 'pip install groq', true
),
(
  'Together AI', 'together',
  'API for open-source LLMs with fast inference',
  'Together AI provides inference for open-source models like Llama, Mixtral, and more.',
  'https://together.ai', 'LLM', ARRAY['api', 'open-source', 'inference', 'fine-tuning'],
  'freemium', false, true,
  'Fast inference API for open-source LLMs like Llama and Mixtral',
  'https://github.com/togethercomputer', 'https://together.ai', 'https://docs.together.ai', 'Proprietary',
  ARRAY['Python'], ARRAY['Any'], 'pip install together', true
),

-- ========== VECTOR DATABASES ==========
(
  'Pinecone', 'pinecone',
  'Managed vector database for AI applications',
  'Pinecone is a fully managed vector database with sub-millisecond query latency.',
  'https://www.pinecone.io', 'Vector DB', ARRAY['vector-database', 'embeddings', 'search', 'managed'],
  'freemium', false, true,
  'Managed vector database for AI applications with sub-millisecond latency',
  'https://github.com/pinecone-io', 'https://www.pinecone.io', 'https://docs.pinecone.io', 'Proprietary',
  ARRAY['Python', 'JavaScript', 'Java', 'Go'], ARRAY['LangChain', 'LlamaIndex'], 'pip install pinecone-client', true
),
(
  'ChromaDB', 'chromadb',
  'Open-source embedding database',
  'Chroma is the open-source embedding database that makes it easy to build LLM apps.',
  'https://www.trychroma.com', 'Vector DB', ARRAY['vector-database', 'embeddings', 'open-source', 'local-first'],
  'free', true, true,
  'Open-source embedding database for AI applications',
  'https://github.com/chroma-core/chroma', 'https://www.trychroma.com', 'https://docs.trychroma.com', 'Apache-2.0',
  ARRAY['Python', 'JavaScript'], ARRAY['LangChain'], 'pip install chromadb', true
),
(
  'Weaviate', 'weaviate',
  'Vector search engine for semantic search',
  'Weaviate is an open-source vector database combining vector search with structured filtering.',
  'https://weaviate.io', 'Vector DB', ARRAY['vector-database', 'semantic-search', 'graphql', 'open-source'],
  'freemium', true, true,
  'Vector search engine with GraphQL interface',
  'https://github.com/weaviate/weaviate', 'https://weaviate.io', 'https://weaviate.io/developers', 'BSD-3-Clause',
  ARRAY['Python', 'Go'], ARRAY['LangChain'], 'pip install weaviate-client', true
),
(
  'Qdrant', 'qdrant',
  'Vector similarity search engine',
  'Qdrant is a vector similarity search engine with extended filtering support.',
  'https://qdrant.tech', 'Vector DB', ARRAY['vector-database', 'rust', 'high-performance', 'open-source'],
  'free', true, true,
  'High-performance vector similarity search engine',
  'https://github.com/qdrant/qdrant', 'https://qdrant.tech', 'https://qdrant.tech/documentation', 'Apache-2.0',
  ARRAY['Python', 'Rust'], ARRAY['LangChain'], 'pip install qdrant-client', true
),
(
  'LanceDB', 'lancedb',
  'Serverless vector database for AI',
  'LanceDB is a serverless vector database optimized for multimodal AI.',
  'https://lancedb.com', 'Vector DB', ARRAY['vector-database', 'serverless', 'multimodal', 'open-source'],
  'free', true, true,
  'Serverless vector database for multimodal AI',
  'https://github.com/lancedb/lancedb', 'https://lancedb.com', 'https://lancedb.github.io/lancedb', 'Apache-2.0',
  ARRAY['Python', 'JavaScript'], ARRAY['LangChain'], 'pip install lancedb', true
),

-- ========== AGENT FRAMEWORKS ==========
(
  'LangChain', 'langchain',
  'Framework for building context-aware reasoning apps',
  'LangChain is a framework for developing applications powered by language models.',
  'https://www.langchain.com', 'Agents', ARRAY['python', 'javascript', 'framework', 'llm', 'agents', 'rag'],
  'free', true, true,
  'Framework for building context-aware reasoning with LLMs',
  'https://github.com/langchain-ai/langchain', 'https://www.langchain.com', 'https://python.langchain.com', 'MIT',
  ARRAY['Python', 'TypeScript'], ARRAY['OpenAI', 'Anthropic', 'Hugging Face'], 'pip install langchain', true
),
(
  'AutoGen', 'autogen',
  'Multi-agent conversation framework from Microsoft',
  'AutoGen enables building LLM applications using multiple agents that can converse.',
  'https://microsoft.github.io/autogen', 'Agents', ARRAY['microsoft', 'multi-agent', 'coding', 'python'],
  'free', true, true,
  'Microsoft multi-agent conversation framework for complex workflows',
  'https://github.com/microsoft/autogen', 'https://microsoft.github.io/autogen', 'https://microsoft.github.io/autogen/docs', 'MIT',
  ARRAY['Python'], ARRAY['OpenAI'], 'pip install pyautogen', true
),
(
  'CrewAI', 'crewai',
  'Framework for orchestrating role-playing AI agents',
  'CrewAI enables building multi-agent teams with role-playing and delegation.',
  'https://crewai.io', 'Agents', ARRAY['python', 'multi-agent', 'role-playing', 'orchestration'],
  'free', true, true,
  'Framework for orchestrating role-playing AI agent teams',
  'https://github.com/joaomdmoura/crewAI', 'https://crewai.io', 'https://docs.crewai.com', 'MIT',
  ARRAY['Python'], ARRAY['LangChain'], 'pip install crewai', true
),
(
  'LlamaIndex', 'llamaindex',
  'Data framework for LLM applications',
  'LlamaIndex connects LLMs with external data sources for RAG applications.',
  'https://www.llamaindex.ai', 'Agents', ARRAY['python', 'rag', 'data', 'framework'],
  'free', true, true,
  'Data framework for connecting LLMs to external data',
  'https://github.com/run-llama/llama_index', 'https://www.llamaindex.ai', 'https://docs.llamaindex.ai', 'MIT',
  ARRAY['Python', 'TypeScript'], ARRAY['OpenAI', 'Anthropic'], 'pip install llama-index', true
),
(
  'DSPy', 'dspy',
  'Framework for programming language models',
  'DSPy provides a framework for solving advanced tasks with language models.',
  'https://dspy.ai', 'Agents', ARRAY['python', 'prompt-optimization', 'framework'],
  'free', true, true,
  'Framework for programming language models systematically',
  'https://github.com/stanfordnlp/dspy', 'https://dspy.ai', 'https://dspy-docs.vercel.app', 'MIT',
  ARRAY['Python'], ARRAY['OpenAI'], 'pip install dspy', true
),

-- ========== RAG TOOLS ==========
(
  'Unstructured', 'unstructured',
  'Open-source library for document processing',
  'Unstructured extracts and transforms data from documents for LLM use.',
  'https://unstructured.io', 'RAG Tools', ARRAY['document-processing', 'pdf', 'extraction', 'open-source'],
  'free', true, true,
  'Document processing library for LLM data extraction',
  'https://github.com/Unstructured-IO/unstructured', 'https://unstructured.io', 'https://docs.unstructured.io', 'Apache-2.0',
  ARRAY['Python'], ARRAY['LangChain'], 'pip install unstructured', true
),
(
  'OpenParse', 'openparse',
  'Open-source document parsing with visual detection',
  'OpenParse is an open-source document parser for RAG applications.',
  'https://github.com/Filimoa/open-parse', 'RAG Tools', ARRAY['document-parsing', 'pdf', 'visual-detection'],
  'free', true, true,
  'Document parsing with visual element detection for RAG',
  'https://github.com/Filimoa/open-parse', NULL, NULL, 'MIT',
  ARRAY['Python'], ARRAY['LangChain'], 'pip install openparse', true
),
(
  'Vercel AI SDK', 'vercel-ai-sdk',
  'TypeScript toolkit for AI apps',
  'Vercel AI SDK helps build streaming AI applications with React and Vue.',
  'https://sdk.vercel.ai', 'RAG Tools', ARRAY['typescript', 'react', 'streaming', 'vercel'],
  'free', true, true,
  'TypeScript toolkit for building streaming AI interfaces',
  'https://github.com/vercel/ai', 'https://sdk.vercel.ai', 'https://sdk.vercel.ai/docs', 'Apache-2.0',
  ARRAY['TypeScript'], ARRAY['React', 'Vue', 'Svelte'], 'npm install ai', true
),
(
  'Langfuse', 'langfuse',
  'Open-source LLM engineering platform',
  'Langfuse provides observability, metrics, and experimentation for LLM apps.',
  'https://langfuse.com', 'RAG Tools', ARRAY['observability', 'tracing', 'metrics', 'open-source'],
  'freemium', true, true,
  'Open-source LLM engineering platform for observability',
  'https://github.com/langfuse/langfuse', 'https://langfuse.com', 'https://langfuse.com/docs', 'MIT',
  ARRAY['TypeScript', 'Python'], ARRAY['LangChain', 'OpenAI'], 'npm install langfuse', true
),

-- ========== CODE ASSISTANTS ==========
(
  'Claude Code', 'claude-code',
  'Agentic coding tool from Anthropic',
  'Claude Code is an agentic coding tool that lets you code with natural language.',
  'https://docs.anthropic.com/claude-code', 'Code Assistants', ARRAY['coding', 'cli', 'agentic', 'anthropic'],
  'free', false, true,
  'Agentic coding tool for natural language software development',
  NULL, 'https://docs.anthropic.com/claude-code', 'https://docs.anthropic.com/claude-code', 'Proprietary',
  ARRAY['Any'], ARRAY['Any'], 'npm install -g @anthropic-ai/claude-code', true
),
(
  'GitHub Copilot', 'github-copilot',
  'AI pair programmer from GitHub',
  'GitHub Copilot suggests code completions as you type.',
  'https://github.com/features/copilot', 'Code Assistants', ARRAY['coding', 'autocomplete', 'vs-code', 'github'],
  'paid', false, true,
  'AI pair programmer for code suggestions and completions',
  NULL, 'https://github.com/features/copilot', 'https://docs.github.com/copilot', 'Proprietary',
  ARRAY['Any'], ARRAY['Any'], 'Install VS Code extension', true
),
(
  'Cursor', 'cursor',
  'AI-first code editor',
  'Cursor is a code editor built for AI pair programming.',
  'https://cursor.sh', 'Code Assistants', ARRAY['editor', 'coding', 'ai-first'],
  'freemium', false, true,
  'AI-first code editor built for pair programming',
  NULL, 'https://cursor.sh', 'https://cursor.sh/docs', 'Proprietary',
  ARRAY['Any'], ARRAY['Any'], 'Download cursor.sh', true
),
(
  'Aider', 'aider',
  'AI pair programming in your terminal',
  'Aider lets you pair program with AI in your terminal using multiple files.',
  'https://aider.chat', 'Code Assistants', ARRAY['cli', 'coding', 'git', 'open-source'],
  'free', true, true,
  'Terminal-based AI pair programming for multiple files',
  'https://github.com/paul-gauthier/aider', 'https://aider.chat', 'https://aider.chat/docs', 'Apache-2.0',
  ARRAY['Python'], ARRAY['Any'], 'pip install aider-chat', true
),

-- ========== TESTING & EVAL ==========
(
  'Promptfoo', 'promptfoo',
  'Open-source LLM testing framework',
  'Promptfoo is a CLI and library for testing and evaluating LLM outputs.',
  'https://promptfoo.dev', 'Testing & Eval', ARRAY['testing', 'evaluation', 'prompts', 'cli'],
  'free', true, true,
  'Open-source testing and evaluation framework for LLMs',
  'https://github.com/promptfoo/promptfoo', 'https://promptfoo.dev', 'https://promptfoo.dev/docs', 'MIT',
  ARRAY['JavaScript'], ARRAY['OpenAI', 'Anthropic'], 'npm install -g promptfoo', true
),
(
  'DeepEval', 'deepeval',
  'Unit testing framework for LLMs',
  'DeepEval is a Python framework for unit testing LLM applications.',
  'https://deepeval.com', 'Testing & Eval', ARRAY['testing', 'evaluation', 'python', 'unit-testing'],
  'free', true, true,
  'Python unit testing framework for LLM applications',
  'https://github.com/confident-ai/deepeval', 'https://deepeval.com', 'https://docs.deepeval.com', 'Apache-2.0',
  ARRAY['Python'], ARRAY['Any'], 'pip install deepeval', true
),
(
  'Ragas', 'ragas',
  'Evaluation framework for RAG',
  'Ragas provides evaluation metrics for Retrieval-Augmented Generation.',
  'https://docs.ragas.io', 'Testing & Eval', ARRAY['rag', 'evaluation', 'metrics', 'open-source'],
  'free', true, true,
  'Evaluation framework for RAG applications',
  'https://github.com/explodinggradients/ragas', 'https://docs.ragas.io', 'https://docs.ragas.io', 'Apache-2.0',
  ARRAY['Python'], ARRAY['LangChain', 'LlamaIndex'], 'pip install ragas', true
),
(
  'Braintrust', 'braintrust',
  'Enterprise-grade eval platform',
  'Braintrust is an enterprise platform for evaluating and improving AI apps.',
  'https://www.braintrust.dev', 'Testing & Eval', ARRAY['enterprise', 'evaluation', 'testing', 'observability'],
  'freemium', false, true,
  'Enterprise-grade platform for AI evaluation and improvement',
  'https://github.com/braintrustdata', 'https://www.braintrust.dev', 'https://www.braintrust.dev/docs', 'Proprietary',
  ARRAY['Python', 'TypeScript'], ARRAY['Any'], 'pip install braintrust', true
)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  tagline = EXCLUDED.tagline,
  updated_at = NOW();
