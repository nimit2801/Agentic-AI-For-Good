-- Seed SQL for initial AI tools
-- Run this in Supabase Dashboard > SQL Editor

INSERT INTO tools (
  name, slug, description, long_description, url, logo_url, category, tags,
  pricing, is_open_source, featured, approved,
  tagline, github_url, website_url, docs_url, license,
  stack_languages, stack_frameworks, install_command, code_snippet, integration_guide,
  github_stars, maintained
) VALUES
(
  'Pinecone',
  'pinecone',
  'Managed vector database for AI applications',
  'Pinecone is a fully managed vector database that makes it easy to build high-performance vector search applications at any scale with sub-millisecond query latency.',
  'https://www.pinecone.io',
  NULL,
  'Vector DB',
  ARRAY['vector-database', 'embeddings', 'search', 'similarity-search', 'managed'],
  'freemium',
  false,
  true,
  true,
  'Managed vector database for AI applications with sub-millisecond latency',
  'https://github.com/pinecone-io',
  'https://www.pinecone.io',
  'https://docs.pinecone.io',
  'Proprietary',
  ARRAY['Python', 'JavaScript', 'Java', 'Go'],
  ARRAY['LangChain', 'LlamaIndex', 'OpenAI'],
  'pip install pinecone-client',
  'from pinecone import Pinecone
pc = Pinecone(api_key="your-api-key")
index = pc.Index("my-index")
index.upsert(vectors=[{"id": "vec1", "values": [0.1, 0.2, ...]}])
results = index.query(vector=[0.1, 0.2, ...], top_k=3)',
  '1. Sign up at pinecone.io and get your API key
2. Install: pip install pinecone-client
3. Create an index with your embedding dimensions
4. Upsert vectors with optional metadata
5. Query with filters for hybrid search',
  NULL,
  true
),
(
  'LangChain',
  'langchain',
  'Framework for building context-aware reasoning applications',
  'LangChain is a comprehensive framework for building applications with large language models. It provides a standard interface for chains, integrations with other tools, and end-to-end chains for common applications.',
  'https://www.langchain.com',
  NULL,
  'Agents',
  ARRAY['python', 'javascript', 'framework', 'llm', 'agents', 'rag'],
  'free',
  true,
  true,
  true,
  'Framework for building context-aware reasoning applications with LLMs',
  'https://github.com/langchain-ai/langchain',
  'https://www.langchain.com',
  'https://python.langchain.com',
  'MIT',
  ARRAY['Python', 'TypeScript'],
  ARRAY['OpenAI', 'Anthropic', 'Hugging Face'],
  'pip install langchain',
  'from langchain import OpenAI, LLMChain
llm = OpenAI(temperature=0)
chain = LLMChain(llm=llm, prompt=prompt)
response = chain.predict(input="Hello!")',
  '1. Installation: pip install langchain
2. Set up API keys
3. Build your first chain
4. Add memory for chat applications',
  NULL,
  true
),
(
  'OpenAI API',
  'openai',
  'Access GPT-4 and other state-of-the-art AI models',
  'The OpenAI API gives developers access to cutting-edge AI models including GPT-4, GPT-3.5, DALL-E, Whisper, and embeddings for search and clustering.',
  'https://openai.com',
  NULL,
  'LLM',
  ARRAY['api', 'gpt-4', 'chat', 'embeddings', 'images'],
  'freemium',
  false,
  true,
  true,
  'Access GPT-4, DALL-E, Whisper, and other state-of-the-art AI models',
  'https://github.com/openai/openai-python',
  'https://openai.com',
  'https://platform.openai.com/docs',
  'Proprietary',
  ARRAY['Python', 'JavaScript', 'Go'],
  ARRAY['Any'],
  'pip install openai',
  'from openai import OpenAI
client = OpenAI()
completion = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello!"}]
)',
  '1. Get API key at platform.openai.com
2. Install SDK: pip install openai
3. Set OPENAI_API_KEY env var
4. Make your first request',
  NULL,
  true
),
(
  'ChromaDB',
  'chromadb',
  'Open-source embedding database for AI applications',
  'Chroma is the open-source embedding database. It makes it easy to build LLM apps by making knowledge, facts, and skills pluggable for LLMs.',
  'https://www.trychroma.com',
  NULL,
  'Vector DB',
  ARRAY['vector-database', 'embeddings', 'open-source', 'local-first'],
  'free',
  true,
  false,
  true,
  'Open-source embedding database for AI applications',
  'https://github.com/chroma-core/chroma',
  'https://www.trychroma.com',
  'https://docs.trychroma.com',
  'Apache-2.0',
  ARRAY['Python', 'JavaScript'],
  ARRAY['LangChain', 'LlamaIndex'],
  'pip install chromadb',
  'import chromadb
chroma_client = chromadb.Client()
collection = chroma_client.create_collection(name="my_collection")
collection.add(documents=["text1", "text2"], ids=["id1", "id2"])',
  '1. Install: pip install chromadb
2. Create a client
3. Create a collection
4. Add documents with embeddings',
  NULL,
  true
),
(
  'Weaviate',
  'weaviate',
  'Vector search engine for scalable semantic search',
  'Weaviate is an open-source vector database that stores both objects and vectors, allowing for combining vector search with structured filtering.',
  'https://weaviate.io',
  NULL,
  'Vector DB',
  ARRAY['vector-database', 'semantic-search', 'graphql', 'open-source'],
  'freemium',
  true,
  true,
  true,
  'Vector search engine for scalable semantic search with GraphQL interface',
  'https://github.com/weaviate/weaviate',
  'https://weaviate.io',
  'https://weaviate.io/developers',
  'BSD-3-Clause',
  ARRAY['Go', 'Python'],
  ARRAY['LangChain'],
  'pip install weaviate-client',
  'import weaviate
client = weaviate.Client("http://localhost:8080")
client.data_object.create({"name": "Foo"}, "Class")',
  '1. Install client: pip install weaviate-client
2. Connect to Weaviate instance
3. Define your schema
4. Import and query data',
  NULL,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  tagline = EXCLUDED.tagline,
  updated_at = NOW();
