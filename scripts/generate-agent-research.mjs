import { mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const outputPath = path.join(repoRoot, 'public', 'data', 'agent-research.json');

const WINDOW_DAYS = 7;
const NOW = new Date();
const SINCE = new Date(NOW.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000);
const SINCE_DATE = SINCE.toISOString().slice(0, 10);
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36';
const REDDIT_AGENT = 'NimitAgentResearch/2.0 (by nimit2801)';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || githubTokenFromCli();

const HN_QUERY_SPECS = [
  { query: 'gemini 3.5 flash', boost: 150 },
  { query: 'qwen 3.7', boost: 150 },
  { query: 'forge guardrails', boost: 140 },
  { query: 'gemini spark', boost: 130 },
  { query: 'antigravity', boost: 120 },
  { query: 'needle', boost: 120 },
  { query: 'statewright', boost: 100 },
  { query: 'claude for small business', boost: 100 },
  { query: 'agent view in claude code', boost: 95 },
  { query: 'openai codex sandbox', boost: 90 },
  { query: 'claude for the legal industry', boost: 85 },
  { query: 'teaching claude why', boost: 90 },
  { query: 'interaction models', boost: 85 },
  { query: 'reimagining the mouse pointer for the ai era', boost: 85 },
  { query: 'gemini api webhooks', boost: 80 },
  { query: 'alphaevolve', boost: 80 },
  { query: 'formal verification ai coding', boost: 75 },
  { query: 'codex', boost: 70 },
  { query: 'qwen 3.6', boost: 70 },
  { query: 'deep research', boost: 60 },
  { query: 'testing distributed systems with ai agents', boost: 55 },
  { query: 'agent harness', boost: 55 },
  { query: 'semble', boost: 120 },
  { query: 'gemini omni', boost: 100 },
  { query: 'managed agents', boost: 90 },
  { query: 'sap claude', boost: 80 },
  { query: 'agentic desktop', boost: 70 },
  { query: 'codex enterprise', boost: 90 },
  { query: 'codex dell', boost: 85 },
  { query: 'harness engineering', boost: 75 },
  { query: 'tencent marvis', boost: 130 },
  { query: 'antigravity cli', boost: 120 },
  { query: 'claude dreaming', boost: 110 },
  { query: 'stainless anthropic', boost: 140 },
  { query: 'cursor windsurf', boost: 100 },
  { query: 'openai geometry conjecture', boost: 90 },
  { query: 'mistral emmi', boost: 80 },
  { query: 'karpathy anthropic', boost: 130 },
  { query: 'mcp tunnels', boost: 100 },
  { query: 'self-hosted sandboxes', boost: 95 },
  { query: 'local deep research', boost: 90 },
  { query: 'command a+ cohere', boost: 130 },
  { query: 'gemini system prompt', boost: 100 },
  { query: 'anthropic consulting', boost: 100 },
  { query: 'cloudflare agents stripe', boost: 130 },
  { query: 'moltbook openclaw', boost: 120 },
  { query: 'rampart agent security', boost: 110 },
  { query: 'notion agent platform', boost: 100 },
  { query: 'agentic commerce', boost: 95 },
  { query: 'agents buying domains', boost: 90 },
  { query: 'jobbench agent', boost: 85 },
  { query: 'cohere command a+', boost: 130 },
  { query: 'torvalds ai linux kernel', boost: 120 },
  { query: 'ai kernel coding agents', boost: 75 },
  { query: 'opus 4.8', boost: 200 },
  { query: 'dynamic workflows', boost: 190 },
  { query: 'cls agentic coding', boost: 140 },
  { query: 'cls opus 4.8', boost: 190 },
  { query: 'enterprise coding agents gartner', boost: 130 },
  { query: 'self-improving agents', boost: 120 },
  { query: 'cisco codex', boost: 170 },
  { query: 'virgin atlantic codex', boost: 100 },
];

const REDDIT_SPECS = [
  {
    subreddit: 'LocalLLaMA',
    queries: ['textgen', 'qwen 3.6', 'claude code', 'deep research', 'vector database for ai agents', 'web-search', 'game boy transformer', 'local deep research', 'karpathy anthropic', 'command a+', 'cohere', 'agent security', 'moltbook', 'rampart', 'torvalds linux ai', 'linux kernel ai coding'],
  },
  {
    subreddit: 'ClaudeAI',
    queries: ['qwen 3.6', 'persistent memory', 'claude code mcp', 'built with claude code', 'remote client for claude code', 'agent view', 'usage limits', 'karpathy', 'self-hosted sandbox', 'mcp tunnel', 'command a+', 'cohere', 'anthropic consulting', 'claude dreaming', 'torvalds linux ai', 'linux kernel ai'],
  },
  {
    subreddit: 'OpenAI',
    queries: ['codex', 'openai codex sandbox', 'coding agent safety', 'agent security', 'stripe agents'],
  },
];

const HF_QUERIES = ['qwen3.6', 'deepresearch', 'browser-use', 'agent', 'command-a-plus', 'cohere', 'rampart-clarity', 'agent-security', 'agentic-coding-trajectories'];
const GITHUB_QUERY_SPECS = [
  { query: '"claude code" in:name,description,readme created:>=' + SINCE_DATE, boost: 140 },
  { query: '"deep research" in:name,description,readme created:>=' + SINCE_DATE, boost: 135 },
  { query: 'mcp browser agent in:name,description,readme created:>=' + SINCE_DATE, boost: 130 },
  { query: 'agent dashboard workspace in:name,description,readme created:>=' + SINCE_DATE, boost: 125 },
  { query: 'qwen agent in:name,description,readme created:>=' + SINCE_DATE, boost: 120 },
  { query: 'linux kernel ai agent in:name,description,readme created:>=' + SINCE_DATE, boost: 100 },
];
const GITHUB_REPO_WATCH = [
  { repo: 'antoinezambelli/forge', boost: 250 },
  { repo: 'HermannBjorgvin/Clawdmeter', boost: 180 },
  { repo: 'chrisrobison/textweb', boost: 170 },
  { repo: 'Unagi-cq/cdp-bridge-mcp', boost: 160 },
  { repo: 'rahilp/second-brain-cloudflare', boost: 160 },
  { repo: 'ab-613/OpenGravity', boost: 150 },
  { repo: 'CohleM/nanoclaude', boost: 145 },
  { repo: 'smithersai/claude-p', boost: 140 },
  { repo: 'tRidha/pokegents', boost: 135 },
  { repo: 'stormzhang/token-tracker', boost: 130 },
  { repo: 'MinishLab/semble', boost: 120 },
  { repo: 'TencentARC/Marvis', boost: 180 },
  { repo: 'google-gemini/gemini-cli', boost: 140 },
  { repo: 'LearningCircuit/local-deep-research', boost: 110 },
  { repo: 'CohereLabs/command-a-plus-05-2026', boost: 180 },
  { repo: 'microsoft/rampart', boost: 160 },
  { repo: 'microsoft/agent-clarity', boost: 150 },
  { repo: 'cloudflare/agents-stripe', boost: 140 },
];
const GITHUB_RELEASE_WATCH = [
  { repo: 'QwenLM/qwen-code', label: 'Qwen', boost: 140 },
];
const LAB_FEEDS = [
  ['OpenAI', 'https://openai.com/news/rss.xml'],
  ['Google AI', 'https://blog.google/technology/ai/rss/'],
  ['Google AI', 'https://developers.googleblog.com/feeds/posts/default'],
  ['Anthropic', 'https://www.anthropic.com/feed.xml'],
  ['Qwen', 'https://qwen.ai/rss.xml'],
];

const OFFICIAL_SOURCES = [
  ['openai.com', 'OpenAI'],
  ['anthropic.com', 'Anthropic'],
  ['claude.com', 'Anthropic'],
  ['deepmind.google', 'Google DeepMind'],
  ['blog.google', 'Google AI'],
  ['qwen.ai', 'Qwen'],
  ['qwenlm.github.io', 'Qwen'],
  ['mistral.ai', 'Mistral'],
  ['ai.meta.com', 'Meta AI'],
  ['meta.com/ai', 'Meta AI'],
  ['nousresearch.com', 'Nous Research'],
];

const TOPIC_RULES = [
  ['Tool use', ['tool', 'tool calling', 'function call', 'function calling', 'codex', 'workflow', 'connector', 'mcp']],
  ['Multi-agent workflows', ['multi-agent', 'orchestr', 'workflow', 'agent team', 'deep research']],
  ['Memory and state', ['memory', 'state', 'state machine', 'checkpoint', 'trace', 'second brain']],
  ['Evaluation', ['eval', 'benchmark', 'judge', 'leaderboard', 'misalignment', 'reliability']],
  ['Voice and multimodal', ['audio', 'voice', 'video', 'multimodal', 'pointer']],
  ['Open weights', ['qwen', 'gguf', 'local', 'open-source', 'open source', 'open weight', 'deepresearch']],
  ['Major labs', ['openai', 'anthropic', 'google', 'deepmind', 'meta', 'mistral', 'qwen']],
  ['Coding agents', ['coding', 'code', 'codex', 'claude code', 'developer', 'terminal']],
  ['Interfaces', ['pointer', 'interaction', 'desktop', 'ui', 'browser', 'agent view', 'dashboard', 'workspace']],
  ['Infra and retrieval', ['webhook', 'webhooks', 'long-running', 'web-search', 'search index', 'cloudflare', 'verification']],
];

const DROP_TITLE_PATTERNS = [
  /warning:/i,
  /trending down/i,
  /stock/i,
  /layoff/i,
  /valuation/i,
  /campus network/i,
  /interest form/i,
  /this can only end badly/i,
  /cooked/i,
  /self-replication/i,
  /malware/i,
  /if the eu had built claude/i,
];

const HAND_CURATED_WHY = [
  {
    match: /forge.*guardrail|guardrail.*forge/i,
    why: 'This is arguably the most important agent-engineering signal this cycle: reliability engineering via guardrails can close the gap between small local models and frontier APIs on structured agentic tasks.',
  },
  {
    match: /gemini 3\.5 flash/i,
    why: 'A frontier-level model at 4x speed parity reshapes the practical design space for agent builders overnight — faster inference directly enables more complex, multi-step agent loops.',
  },
  {
    match: /gemini spark/i,
    why: 'Always-on personal agents that integrate with your actual data (Gmail, calendar) are a fundamentally different product from chat interfaces — this is Google\'s bet on persistent, delegated AI.',
  },
  {
    match: /antigravity 2\.0|antigravity agentic/i,
    why: 'A full agentic IDE-on-the-go is a strong signal that agent development is being treated as a first-class workflow, not just a side feature of chat UIs.',
  },
  {
    match: /needle/i,
    why: 'A 26M-parameter function-calling model is a real compression milestone: useful tool use is getting small enough to run on tiny devices, not just cloud GPUs.',
  },
  {
    match: /statewright/i,
    why: 'The state-machine framing is notable because it tackles one of the biggest agent pain points directly: keeping long workflows legible and less fragile.',
  },
  {
    match: /claude for small business/i,
    why: 'This is one of the clearest signs that agentic workflows are being packaged for normal businesses, not just developers — connectors and ready-to-run automations are becoming the product.',
  },
  {
    match: /codex.*sandbox|sandbox.*codex/i,
    why: 'OpenAI is turning coding agents into a more deployable systems product. The sandbox angle matters because agent adoption increasingly depends on guardrails, not raw model quality alone.',
  },
  {
    match: /nvidia.*codex|codex.*nvidia/i,
    why: 'The interesting part here is not just enterprise adoption, but the normalization of Codex-style agent workflows inside demanding engineering teams.',
  },
  {
    match: /teaching claude why/i,
    why: 'Interpretability work is inching closer to agent reliability. If a model can explain why it chose an action, auditing and debugging agent runs gets much easier.',
  },
  {
    match: /interaction models/i,
    why: 'This is a strong tangent for agent builders: the interface layer is shifting from turn-by-turn chat toward continuous, multimodal collaboration loops.',
  },
  {
    match: /mouse pointer/i,
    why: 'A surprisingly important UI signal: once systems can anticipate intent, even primitive interface elements like the cursor become redesign territory.',
  },
  {
    match: /alphaevolve/i,
    why: 'The bigger idea is that coding agents are escaping demo-land and starting to compound across real scientific and engineering workflows.',
  },
  {
    match: /textgen is now a native desktop app/i,
    why: 'Local AI tooling is consolidating into more usable products. That matters because many agent workflows only become trustworthy when people can run and inspect them on their own machines.',
  },
  {
    match: /qwen[\s.-]*3\.7/i,
    why: 'Qwen3.7-Max is the clearest signal yet that Alibaba is competing seriously on agentic coding benchmarks, and the "AI factory" positioning shows they\'re building a vertically integrated agent platform, not just a model.',
  },
  {
    match: /qwen 3\.6/i,
    why: 'Qwen 3.6 keeps showing up as the local-first coding and agent workhorse. The momentum here is less about hype and more about the open ecosystem hardening around one strong base model family.',
  },
  {
    match: /marco-deepresearch/i,
    why: 'Compact "deep research" style models are getting easier to run and remix, which widens the range of people who can experiment with retrieval-heavy agent workflows.',
  },
  {
    match: /persistent memory/i,
    why: 'Persistent memory remains one of the clearest upgrade paths from flashy one-shot demos to genuinely useful repeat-use agents.',
  },
  {
    match: /agent view/i,
    why: 'This is a small but important supervision signal: as agents get longer-running, people want inspectable timelines and branch-level visibility, not just a terminal blur.',
  },
  {
    match: /webhooks in gemini api|gemini api.*webhooks/i,
    why: 'This is quietly foundational. Long-running agents need event-driven plumbing more than prettier demos, and webhooks are part of that maturity curve.',
  },
  {
    match: /windows sandbox|codex.*sandbox/i,
    why: 'A lot of the real progress in coding agents is shifting into containment and permissioning: safe execution environments are becoming product features, not side notes.',
  },
  {
    match: /usage limits/i,
    why: 'This is a practical frontier: useful agents increasingly need self-awareness about budgets, rate limits, and when to stop before they burn user trust.',
  },
  {
    match: /web-search is coming to a screeching performance halt/i,
    why: 'Agent builders are running into infrastructure reality: the public web is getting harder to crawl cheaply, which makes search and retrieval strategy part of the product design.',
  },
  {
    match: /mcp/i,
    why: 'MCP keeps surfacing as the connective tissue for more grounded agent workflows — standard tool surfaces are still one of the cleanest leverage points in the stack.',
  },
  {
    match: /qwenlm\/qwen-code|qwen code/i,
    why: 'Qwen\'s coding stack is turning into a more automation-friendly surface, which matters because structured outputs and review-oriented workflows are what make coding agents easier to trust.',
  },
  {
    match: /clawdmeter/i,
    why: 'This is playful but telling: once people start building physical dashboards for an agent, it usually means the tool has become part of their everyday workflow rather than a one-off demo.',
  },
  {
    match: /textweb/i,
    why: 'Text-first browsing is a strong agent tangent because it can make web automation cheaper, faster, and more inspectable than screenshot-heavy loops.',
  },
  {
    match: /second-brain/i,
    why: 'Portable memory layers are one of the clearest ways to make agents feel cumulative instead of stateless and disposable.',
  },
  {
    match: /formal verification.*ai coding|formal verification.*agent/i,
    why: 'Applying formal verification to AI coding loops signals a maturing view of agent reliability — moving beyond empirical testing toward provable correctness guarantees.',
  },
  {
    match: /testing distributed systems with ai agents/i,
    why: 'Using agents to test distributed systems is a productive tangent: the same failure modes that plague agent workflows (state drift, async races, resource leaks) are well-studied in distributed systems.',
  },
  {
    match: /token-tracker/i,
    why: 'The practical frontier for coding agents is not just capability but meterability: people want live visibility into cost, rate limits, and whether an agent is quietly burning budget.',
  },
  {
    match: /opengravity/i,
    why: 'This points toward a more inspectable, BYOK-style agent workspace model where people can try serious tooling without fully handing control to a hosted black box.',
  },
  {
    match: /semble/i,
    why: 'This is a strong agent-engineering efficiency signal: giving coding agents semantic code search instead of grep-based token waste directly reduces cost and improves latency on every agent loop.',
  },
  {
    match: /gemini spark|spark.*agent/i,
    why: 'Always-on personal agents that integrate with your actual data (Gmail, calendar) are a fundamentally different product from chat interfaces — this is Google\'s bet on persistent, delegated AI.',
  },
  {
    match: /antigravity 2\.0|standalone desktop.*agent|agent orchestration/i,
    why: 'A full agentic IDE-on-the-go is a strong signal that agent development is being treated as a first-class workflow, not just a side feature of chat UIs.',
  },
  {
    match: /managed agent.*gemini/i,
    why: 'A managed agent that spins up from one API call is the clearest sign yet that agent infrastructure is being productized as a deployable platform, not a DIY framework.',
  },
  {
    match: /sap.*claude|claude.*sap/i,
    why: 'One of the largest enterprise agent deployments yet — SAP embedding Claude as a primary reasoning engine across S/4HANA, SuccessFactors, and Ariba via MCP signals that enterprise agent workflows are moving into production at scale.',
  },
  {
    match: /codex.*dell|dell.*codex|coding agents.*enterprise|enterprise.*coding agents/i,
    why: 'Codex entering on-prem enterprise through Dell\'s channel is a strong signal that coding agents are graduating from dev-tool novelty to governed enterprise infrastructure.',
  },
  {
    match: /harness engineering|unrolling the codex agent/i,
    why: 'Deep engineering posts about how agent loops actually work internally — tool sequencing, context windows, error recovery — are more valuable than most product announcements.',
  },
  {
    match: /ramp.*codex|code review.*codex/i,
    why: 'Real enterprise case studies showing Codex-in-production are more actionable than benchmark scores — they reveal the practical friction points in agent adoption.',
  },
  {
    match: /tencent.*marvis|marvis.*agent/i,
    why: 'Tencent launching an OS-level AI assistant with 6 coordinated agents is a strong signal that major Chinese tech companies are treating multi-agent systems as a consumer product category, not just an enterprise tool.',
  },
  {
    match: /antigravity cli|gemini cli.*antigravity/i,
    why: 'Google transitioning its open-source Gemini CLI into the Antigravity CLI platform signals a strategic shift from model-access tool to full agent platform — the CLI is the wedge, the agent harness is the product.',
  },
  {
    match: /claude.*dreaming|dreaming.*agent/i,
    why: "Anthropic's \"dreaming\" capability for Claude Managed Agents — async session review, memory consolidation, and self-improvement — is one of the most interesting agent-infrastructure novelties this cycle: agents that learn from their own history without human retraining.",
  },
  {
    match: /stainless.*anthropic|anthropic.*stainless/i,
    why: "This is one of the most consequential agent-infrastructure moves this year: Anthropic didn't just buy a tooling company — it bought the connectivity layer that all agent frameworks depend on, and then walled it off from competitors.",
  },
  {
    match: /cursor.*windsurf|windsurf.*cursor/i,
    why: 'The convergence of Cursor and Windsurf on persistent, async sub-agents signals that IDE makers see agent-workflow management as the next competitive frontier — not just code completion quality.',
  },
  {
    match: /gemini spark|spark.*agent/i,
    why: "Always-on personal agents that integrate with your actual data (Gmail, calendar) are a fundamentally different product from chat interfaces — this is Google's bet on persistent, delegated AI.",
  },
  {
    match: /karpathy.*anthropic|anthropic.*karpathy/i,
    why: "Karpathy joining Anthropic's pre-training team is one of the highest-signal talent moves in AI this year — his practical research bent (llm.c, nanoGPT, minbpe) directly aligns with making model training more agent-buildable and less black-box.",
  },
  {
    match: /mcp tunnel|self-hosted sandbox/i,
    why: "Self-hosted sandboxes and MCP tunnels solve the enterprise 'my data in your sandbox' blocker that has been the single biggest friction point for production agent deployments.",
  },
  {
    match: /local deep research/i,
    why: 'A fully local deep research agent that runs on consumer hardware and scores ~95% on SimpleQA is a strong signal that autonomous research workflows are becoming deployable outside the cloud.',
  },
  {
    match: /command a\+|command a-plus|cohere.*command/i,
    why: 'Cohere\'s Command A+ is a major open-weight release — a 25B active / 218B total MoE model under Apache 2.0, designed for agentic, multimodal, and multilingual tasks, deployable on as little as two H100 GPUs. This directly expands the open-source agentic model ecosystem.',
  },
  {
    match: /cloudflare.*stripe|stripe.*agent|agent.*stripe|agents.*buying.*domain|agent.*commerce/i,
    why: 'Agents becoming first-class economic actors — creating accounts, buying domains, deploying code — is one of the most consequential infrastructure shifts this cycle. The agent-as-customer model changes the design space for every SaaS platform.',
  },
  {
    match: /moltbook|openclaw|agent.*credential.*leak|agent.*security.*incident/i,
    why: 'The Moltbook/OpenClaw incident — 1.5M agent tokens exposed, CVSS 8.8 RCE, credential harvesting — is the Meltdown/Spectre moment for agent security. Every production agent deployer needs to understand what happened and why.',
  },
  {
    match: /rampart.*agent|agent.*clarity|microsoft.*agent.*security/i,
    why: 'Microsoft open-sourcing RAMPART (pytest-native agent security testing) and Clarity (agent behavior monitoring) signals that agent security tooling is transitioning from ad-hoc to standardized infrastructure.',
  },
  {
    match: /notion agent|notion.*agent.*platform/i,
    why: 'Notion becoming a programmable agent hub with hosted code execution is a strong signal that workspace SaaS platforms see agents as the next integration surface — not just LLM chat, but full agentic automation inside documents.',
  },
  {
    match: /jobbench|job-bench/i,
    why: 'Stanford JobBench shifts the agent evaluation conversation from "can it solve arbitrary benchmarks" to "would professionals actually delegate this work" — a more practical and human-centered framing for agent usefulness.',
  },
  {
    match: /torvalds.*ai.*linux|linus.*torvalds.*kernel.*ai|ai.*kernel.*coding|ai.*linux.*patch|pointless.*pull.*request.*ai/i,
    why: 'Linus Torvalds threatening to crack down on AI-generated kernel patches is a real-world signal that AI coding agents are now producing code at a scale that overwhelms human review — not a theoretical future, but today\'s bottleneck.',
  },
  {
    match: /opus 4\.8|claude opus 4\.8/i,
    why: 'Opus 4.8 with Dynamic Workflows orchestrating hundreds of sub-agents is the biggest agent-infrastructure release this cycle. Combined with 69.2% SWE-Bench Pro, Fast Mode (3x cheaper), and 41-day release cadence, Anthropic is sprinting on both capability and trustworthiness.',
  },
  {
    match: /dynamic workflow|dynamic workflo/i,
    why: 'Dynamic Workflows is a genuinely new paradigm for agent orchestration — hundreds of parallel sub-agents coordinated by the frontier model itself. This signals that orchestration, not raw model quality, is becoming the competitive moat.',
  },
  {
    match: /self-improving.*agent|self.*improving.*tax|self.*improving.*codex/i,
    why: 'Self-improving agents that learn from their own production outputs without human retraining are the next frontier beyond RAG and fine-tuning. This pattern generalizes to any structured, repetitive workflow domain.',
  },
  {
    match: /cisco.*codex|codex.*cisco|c.*deploys.*codex/i,
    why: 'A Fortune 50 company saying 100% of new features are AI-written by Codex is the strongest enterprise agent adoption signal to date. Not a pilot — production at multi-repo, C/C++ scale with full compliance and governance.',
  },
  {
    match: /virgin atlantic.*codex/i,
    why: 'Industry-specific agent case studies are multiplying — airlines, retail, tax, and defense are all going production with agents beyond just tech companies.',
  },
  {
    match: /gartner.*enterprise.*coding.*agent|enterprise.*coding.*agent.*gartner/i,
    why: 'Gartner Magic Quadrant recognition for coding agents means formal analyst validation — enterprise procurement decisions will follow.',
  },
  {
    match: /codex.*windows.*sandbox|windows.*sandbox.*codex/i,
    why: 'Technical deep-dives on sandbox architecture are the infrastructure bottleneck content the agent-building community needs most. OpenAI treating containment as a first-class product feature is a strong signal.',
  },
  {
    match: /coding.*agent.*social.*science|social.*science.*coding.*agent/i,
    why: 'One of the first rigorous academic-adoption studies for coding agents. The 81% chatbot vs 20% agent gap reveals the trust and workflow barrier between AI-assisted and AI-autonomous work.',
  },
];

function githubTokenFromCli() {
  try {
    return execFileSync('gh', ['auth', 'token'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT, ...headers } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function fetchText(url, headers = {}) {
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT, ...headers } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

const cleanText = (value) => String(value ?? '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/\s+/g, ' ')
  .trim();

const clamp = (text, limit = 180) => {
  const value = cleanText(text);
  return value.length <= limit ? value : `${value.slice(0, limit - 1).trimEnd()}…`;
};

const utcIso = (value) => new Date(value).toISOString().replace(/\.\d{3}Z$/, 'Z');

function officialSourceForUrl(url) {
  const value = cleanText(url).toLowerCase();
  for (const [needle, label] of OFFICIAL_SOURCES) {
    if (value.includes(needle)) return label;
  }
  return null;
}

function topicsFor(...parts) {
  const haystack = parts.map((part) => cleanText(part).toLowerCase()).join(' ');
  const topics = [];
  for (const [label, needles] of TOPIC_RULES) {
    if (needles.some((needle) => haystack.includes(needle))) topics.push(label);
  }
  return [...new Set(topics)].slice(0, 4);
}

function defaultWhy(topics, source) {
  const topicSet = new Set(topics);
  if (topicSet.has('Open weights')) return 'The local/open-weight ecosystem keeps making serious agent workflows cheaper to run, inspect, and iterate.';
  if (topicSet.has('Memory and state')) return 'A lot of the quality gap in agents still comes down to state handling, durability, and clearer control flow.';
  if (topicSet.has('Interfaces')) return 'Agent UX is moving beyond chat boxes — interface design is becoming part of the research frontier.';
  if (topicSet.has('Infra and retrieval')) return 'A lot of real-world agent performance now depends on infrastructure details like eventing, search access, and reliability under external constraints.';
  if (topicSet.has('Tool use')) return 'The strongest practical signal right now is still better tooling around how models call, sequence, and recover from actions.';
  if (topicSet.has('Major labs')) return 'Major lab launches still reshape the practical design space for agent builders almost overnight.';
  if (source === 'Reddit') return 'This is useful because it reflects what builders are actually trying in the wild, not just what the labs are announcing.';
  if (source === 'Hacker News') return 'The comment volume makes this a good proxy for what technically engaged builders think is worth paying attention to.';
  return 'This is a live signal for where agent building is getting more real, usable, or weirdly interesting.';
}

function whyFor(item) {
  const haystack = `${item.title} ${item.url} ${item.summary ?? ''}`;
  for (const rule of HAND_CURATED_WHY) {
    if (rule.match.test(haystack)) return rule.why;
  }
  return defaultWhy(item.topics ?? [], item.source);
}

function isRecent(dateLike) {
  const date = new Date(dateLike);
  return !Number.isNaN(date.getTime()) && date >= SINCE;
}

function shouldDrop(title) {
  return DROP_TITLE_PATTERNS.some((pattern) => pattern.test(title));
}

function shouldDropGithubItem(title, summary = '') {
  const haystack = `${title} ${summary}`.toLowerCase();
  return [
    /huashu/i,
    /hermes-desktop/i,
    /\bskills\b/i,
  ].some((pattern) => pattern.test(haystack));
}

function matchesQuery(query, ...parts) {
  const haystack = parts.map((part) => cleanText(part).toLowerCase()).join(' ');
  const normalizedQuery = cleanText(query).toLowerCase();
  if (!normalizedQuery) return true;
  if (haystack.includes(normalizedQuery)) return true;

  const stopwords = new Set(['the', 'and', 'for', 'with', 'into', 'from', 'this', 'that', 'your', 'you', 'are']);
  const tokens = normalizedQuery.split(/[^a-z0-9.#+-]+/).filter((token) => token.length >= 3 && !stopwords.has(token));
  if (!tokens.length) return true;

  const matches = tokens.filter((token) => haystack.includes(token)).length;
  const required = tokens.length <= 2 ? tokens.length : Math.min(tokens.length, 3);
  return matches >= required;
}

function isAgenticTitle(title, summary = '') {
  const haystack = `${title} ${summary}`.toLowerCase();
  return [
    'agent',
    'agent view',
    'codex',
    'claude',
    'qwen',
    'tool',
    'workflow',
    'state',
    'memory',
    'mcp',
    'deep research',
    'pointer',
    'interaction',
    'sandbox',
    'desktop',
    'webhook',
    'web-search',
    'long-running',
    'command',
  ].some((needle) => haystack.includes(needle));
}

function normalizeSource(source, url = '') {
  if (source.startsWith('r/')) return 'Reddit';
  return officialSourceForUrl(url) ?? source;
}

function scoreHn(hit, boost = 0) {
  const points = Number(hit.points ?? 0);
  const comments = Number(hit.num_comments ?? 0);
  return points * 2 + comments * 3 + boost;
}

function scoreReddit(item) {
  const score = Number(item.score ?? 0);
  const comments = Number(item.num_comments ?? 0);
  const selfBonus = item.is_self ? 60 : 0;
  return score * 1.6 + comments * 2 + selfBonus;
}

function scoreHf(item) {
  const likes = Number(item.likes ?? 0);
  const downloads = Number(item.downloads ?? 0);
  return likes * 4 + downloads / 1000;
}

function scoreGithubRepo(item, boost = 0) {
  const stars = Number(item.stargazers_count ?? 0);
  const forks = Number(item.forks_count ?? 0);
  const watchers = Number(item.watchers_count ?? 0);
  const createdBonus = isRecent(item.created_at) ? 40 : 0;
  return stars * 5 + forks * 2 + watchers + createdBonus + boost;
}

function scoreGithubRelease(item, boost = 0) {
  const reactions = Number(item.reactions?.total_count ?? 0);
  return reactions * 6 + 1800 + boost;
}

function sectionItems(items, limit = 5) {
  return [...items].sort((a, b) => b.score - a.score).slice(0, limit);
}

function highlightScore(item) {
  const haystack = `${item.title} ${item.url} ${item.summary ?? ''}`.toLowerCase();
  let bonus = 0;
  if (haystack.includes('forge')) bonus += 600;
  if (haystack.includes('gemini 3.5') || haystack.includes('gemini 3.5 flash')) bonus += 550;
  if (haystack.includes('gemini spark')) bonus += 500;
  if (haystack.includes('antigravity 2.0') || haystack.includes('antigravity agentic')) bonus += 450;
  if (haystack.includes('needle')) bonus += 500;
  if (haystack.includes('statewright')) bonus += 320;
  if (haystack.includes('claude for small business')) bonus += 450;
  if (haystack.includes('codex')) bonus += 280;
  if (haystack.includes('mouse pointer')) bonus += 220;
  if (haystack.includes('interaction models')) bonus += 210;
  if (haystack.includes('teaching claude why')) bonus += 190;
  if (haystack.includes('alphaevolve')) bonus += 150;
  if (haystack.includes('agent view')) bonus += 170;
  if (haystack.includes('webhooks')) bonus += 130;
  if (haystack.includes('windows sandbox')) bonus += 150;
  if (haystack.includes('usage limits')) bonus += 120;
  if (haystack.includes('web-search is coming to a screeching performance halt')) bonus += 140;
  if (haystack.includes('textgen is now a native desktop app')) bonus += 420;
  if (haystack.includes('persistent memory')) bonus += 340;
  if (haystack.includes('claude code mcp') || haystack.includes('5 mcp')) bonus += 320;
  if (haystack.includes('qwen 3.6')) bonus += 220;
  if (haystack.includes('qwen 3.7') || haystack.includes('qwen3.7')) bonus += 900;
  if (haystack.includes('semble') && haystack.includes('code search')) bonus += 800;
  if (haystack.includes('gemini spark')) bonus += 700;
  if (haystack.includes('antigravity 2.0') || (haystack.includes('antigravity') && haystack.includes('desktop'))) bonus += 650;
  if (haystack.includes('antigravity cli') || (haystack.includes('antigravity') && haystack.includes('cli'))) bonus += 400;
  if (haystack.includes('marco-deepresearch')) bonus += 180;
  if (haystack.includes('remote client for claude code')) bonus += 160;
  if (haystack.includes('qwenlm/qwen-code') || haystack.includes('qwen code')) bonus += 260;
  if (haystack.includes('clawdmeter')) bonus += 240;
  if (haystack.includes('textweb')) bonus += 210;
  if (haystack.includes('second-brain')) bonus += 200;
  if (haystack.includes('workspace')) bonus += 140;
  if (haystack.includes('co-founder says')) bonus -= 200;
  if (haystack.includes('managed agent') && haystack.includes('gemini')) bonus += 350;
  if (haystack.includes('gemini omni')) bonus += 300;
  if (haystack.includes('sap') && haystack.includes('claude')) bonus += 250;
  if (haystack.includes('dell') && haystack.includes('codex')) bonus += 300;
  if (haystack.includes('harness engineering') || haystack.includes('unrolling the codex')) bonus += 200;
  if (haystack.includes('ramp') && haystack.includes('codex')) bonus += 150;
  if (haystack.includes('tencent marvis') || haystack.includes('marvis agent')) bonus += 350;
  if (haystack.includes('claude dreaming') || (haystack.includes('dreaming') && haystack.includes('agent'))) bonus += 300;
  if (haystack.includes('stainless') && haystack.includes('anthropic')) bonus += 400;
  if (haystack.includes('cursor') && (haystack.includes('windsurf') || haystack.includes('3.1'))) bonus += 280;
  if (haystack.includes('geometry') && haystack.includes('conjecture')) bonus += 200;
  if (haystack.includes('mistral') && haystack.includes('emmi')) bonus += 180;
  if (haystack.includes('karpathy') && haystack.includes('anthropic')) bonus += 250;
  if (haystack.includes('mcp tunnel') || haystack.includes('self-hosted sandbox')) bonus += 200;
  if (haystack.includes('local deep research')) bonus += 180;
  if (haystack.includes('gemini system prompt') || haystack.includes('gemini dumped')) bonus += 180;
  if (haystack.includes('command a+') || haystack.includes('command a-plus') || (haystack.includes('cohere') && haystack.includes('command'))) bonus += 350;
  if (haystack.includes('cloudflare') && (haystack.includes('stripe') || haystack.includes('agent'))) bonus += 300;
  if (haystack.includes('moltbook') || haystack.includes('openclaw')) bonus += 280;
  if (haystack.includes('rampart') && haystack.includes('agent')) bonus += 250;
  if (haystack.includes('clarity') && haystack.includes('agent')) bonus += 230;
  if (haystack.includes('notion') && haystack.includes('agent')) bonus += 220;
  if (haystack.includes('jobbench') || haystack.includes('job-bench')) bonus += 180;
  if (haystack.includes('torvalds') && haystack.includes('linux')) bonus += 250;
  if (haystack.includes('opus 4.8') || (haystack.includes('opus') && haystack.includes('4.8'))) bonus += 700;
  if (haystack.includes('dynamic workflow') && (haystack.includes('opus') || haystack.includes('sub-agent') || haystack.includes('anthropic'))) bonus += 600;
  if (haystack.includes('cisco') && (haystack.includes('codex') || haystack.includes('ai-written') || haystack.includes('enterprise engineering'))) bonus += 500;
  if (haystack.includes('self-improving') && (haystack.includes('agent') || haystack.includes('tax') || haystack.includes('codex'))) bonus += 400;
  if (haystack.includes('virgin atlantic') && haystack.includes('codex')) bonus += 300;
  if (haystack.includes('gartner') && (haystack.includes('enterprise coding') || haystack.includes('coding agent') || haystack.includes('magic quadrant'))) bonus += 300;
  if (haystack.includes('coding agent') && haystack.includes('social science')) bonus += 350;
  if (haystack.includes('codex') && haystack.includes('windows sandbox')) bonus += 280;
  return (item.score ?? 0) + bonus;
}

function dedupe(items) {
  const seen = new Set();
  const output = [];
  for (const item of items) {
    const urlKey = cleanText(item.url || '').toLowerCase();
    const titleKey = `${normalizeSource(item.source ?? '', item.url)}:${cleanText(item.title || '').toLowerCase()}`;
    const key = urlKey || titleKey;
    if (!key || seen.has(key) || seen.has(titleKey)) continue;
    seen.add(key);
    seen.add(titleKey);
    output.push(item);
  }
  return output;
}

async function fetchHnSignals() {
  const jobs = HN_QUERY_SPECS.map(async ({ query, boost }) => {
    const params = new URLSearchParams({ query, tags: 'story', hitsPerPage: '12' });
    const payload = await fetchJson(`https://hn.algolia.com/api/v1/search?${params}`);
    return (payload.hits ?? [])
      .filter((hit) => isRecent((hit.created_at_i ?? 0) * 1000))
      .filter((hit) => officialSourceForUrl(cleanText(hit.url)) || Number(hit.points ?? 0) >= 12 || Number(hit.num_comments ?? 0) >= 8)
      .map((hit) => {
        const title = cleanText(hit.title);
        const url = cleanText(hit.url) || `https://news.ycombinator.com/item?id=${hit.objectID}`;
        const topics = topicsFor(title, url, hit.story_text ?? '', officialSourceForUrl(url) ?? '');
        return {
          title,
          source: 'Hacker News',
          url,
          meta: `${Number(hit.points ?? 0)} pts · ${Number(hit.num_comments ?? 0)} comments`,
          topics,
          publishedAt: hit.created_at,
          score: scoreHn(hit, boost),
          summary: cleanText(hit.story_text),
        };
      })
      .filter((item) => matchesQuery(query, item.title, item.url, item.summary))
      .filter((item) => item.title && !shouldDrop(item.title))
      .filter((item) => isAgenticTitle(item.title, item.summary) || officialSourceForUrl(item.url));
  });

  return dedupe((await Promise.allSettled(jobs))
    .flatMap((entry) => (entry.status === 'fulfilled' ? entry.value : [])));
}

async function fetchRedditSignals() {
  const jobs = REDDIT_SPECS.flatMap(({ subreddit, queries }) => queries.map(async (query) => {
    const params = new URLSearchParams({
      q: query,
      restrict_sr: 'on',
      sort: 'relevance',
      t: 'week',
      limit: '10',
      raw_json: '1',
    });
    const payload = await fetchJson(`https://www.reddit.com/r/${subreddit}/search.json?${params}`, { 'User-Agent': REDDIT_AGENT });
    const children = payload?.data?.children ?? [];
    return children
      .map((child) => child.data)
      .filter((item) => isRecent((item.created_utc ?? 0) * 1000))
      .filter((item) => Number(item.score ?? 0) >= 20 || Number(item.num_comments ?? 0) >= 15)
      .map((item) => {
        const title = cleanText(item.title);
        const selftext = cleanText(item.selftext ?? '');
        return {
          title,
          source: `r/${subreddit}`,
          url: `https://www.reddit.com${item.permalink ?? ''}`,
          meta: `${Number(item.score ?? 0)} upvotes · ${Number(item.num_comments ?? 0)} comments`,
          topics: topicsFor(title, selftext, subreddit),
          publishedAt: utcIso(new Date((item.created_utc ?? 0) * 1000)),
          score: scoreReddit(item),
          summary: clamp(selftext, 220),
        };
      })
      .filter((item) => item.title && matchesQuery(query, item.title, item.summary))
      .filter((item) => !shouldDrop(item.title));
  }));

  return dedupe((await Promise.allSettled(jobs))
    .flatMap((entry) => (entry.status === 'fulfilled' ? entry.value : [])));
}

async function fetchHfSignals() {
  const jobs = HF_QUERIES.map(async (query) => {
    const params = new URLSearchParams({ search: query, sort: 'likes', direction: '-1', limit: '20' });
    const payload = await fetchJson(`https://huggingface.co/api/models?${params}`);
    return payload
      .filter((item) => !item.private)
      .filter((item) => isRecent(item.createdAt ?? item.lastModified ?? NOW))
      .map((item) => {
        const title = cleanText(item.modelId || item.id);
        const summary = cleanText((item.tags ?? []).join(' '));
        return {
          title,
          source: 'Hugging Face',
          url: `https://huggingface.co/${title}`,
          meta: `${Number(item.likes ?? 0)} likes · ${Number(item.downloads ?? 0).toLocaleString()} downloads`,
          topics: topicsFor(title, summary, item.pipeline_tag ?? ''),
          publishedAt: item.createdAt ?? item.lastModified ?? utcIso(NOW),
          score: scoreHf(item),
          summary,
        };
      })
      .filter((item) => item.title)
      .filter((item) => Number(item.score ?? 0) >= 10)
      .filter((item) => isAgenticTitle(item.title, item.summary));
  });

  return dedupe((await Promise.allSettled(jobs))
    .flatMap((entry) => (entry.status === 'fulfilled' ? entry.value : [])));
}

function extractTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  if (!match) return '';
  return cleanText(match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1'));
}

async function fetchLabFeedSignals() {
  const jobs = LAB_FEEDS.map(async ([source, url]) => {
    const text = await fetchText(url);
    const blocks = text.match(/<item>[\s\S]*?<\/item>/gi) ?? [];
    return blocks.slice(0, 12)
      .map((block) => ({
        title: extractTag(block, 'title'),
        url: extractTag(block, 'link'),
        publishedAt: extractTag(block, 'pubDate'),
      }))
      .filter((item) => item.title && item.url && isRecent(item.publishedAt))
      .filter((item) => isAgenticTitle(item.title))
      .map((item) => {
        const topics = topicsFor(item.title, item.url, source);
        return {
          ...item,
          source,
          meta: new Date(item.publishedAt).toUTCString(),
          topics,
          score: 180,
          summary: item.title,
        };
      });
  });

  return dedupe((await Promise.allSettled(jobs))
    .flatMap((entry) => (entry.status === 'fulfilled' ? entry.value : [])));
}

async function fetchGithubSignals() {
  const headers = GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {};

  const searchJobs = GITHUB_QUERY_SPECS.map(async ({ query, boost }) => {
    const params = new URLSearchParams({
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: '10',
    });
    const payload = await fetchJson(`https://api.github.com/search/repositories?${params}`, headers);
    return (payload.items ?? [])
      .filter((item) => isRecent(item.created_at) || isRecent(item.pushed_at) || isRecent(item.updated_at))
      .map((item) => {
        const title = cleanText(item.full_name || item.name);
        const summary = cleanText(item.description ?? '');
        const tags = cleanText((item.topics ?? []).join(' '));
        const repoItem = {
          title,
          source: 'GitHub',
          url: cleanText(item.html_url),
          meta: `${Number(item.stargazers_count ?? 0)} stars · updated ${new Date(item.pushed_at ?? item.updated_at ?? NOW).toUTCString().replace(' GMT', ' UTC')}`,
          topics: topicsFor(title, summary, tags, query),
          publishedAt: item.pushed_at ?? item.updated_at ?? item.created_at ?? utcIso(NOW),
          score: scoreGithubRepo(item, boost),
          summary,
        };
        return {
          ...repoItem,
          why: whyFor(repoItem),
        };
      })
      .filter((entry) => entry.title && entry.url)
      .filter((entry) => !shouldDrop(entry.title) && !shouldDropGithubItem(entry.title, entry.summary))
      .filter((entry) => isAgenticTitle(entry.title, entry.summary));
  });

  const repoJobs = GITHUB_REPO_WATCH.map(async ({ repo, boost }) => {
    const item = await fetchJson(`https://api.github.com/repos/${repo}`, headers);
    if (!isRecent(item.created_at) && !isRecent(item.pushed_at) && !isRecent(item.updated_at)) {
      return [];
    }

    const title = cleanText(item.full_name || item.name);
    const summary = cleanText(item.description ?? '');
    const tags = cleanText((item.topics ?? []).join(' '));
    const repoItem = {
      title,
      source: 'GitHub',
      url: cleanText(item.html_url),
      meta: `${Number(item.stargazers_count ?? 0)} stars · updated ${new Date(item.pushed_at ?? item.updated_at ?? NOW).toUTCString().replace(' GMT', ' UTC')}`,
      topics: topicsFor(title, summary, tags),
      publishedAt: item.created_at ?? item.updated_at ?? utcIso(NOW),
      score: scoreGithubRepo(item, boost),
      summary,
    };
    return [{
      ...repoItem,
      why: whyFor(repoItem),
    }]
      .filter((entry) => entry.title && entry.url)
      .filter((entry) => !shouldDrop(entry.title) && !shouldDropGithubItem(entry.title, entry.summary))
      .filter((entry) => isAgenticTitle(entry.title, entry.summary));
  });

  const releaseJobs = GITHUB_RELEASE_WATCH.map(async ({ repo, label, boost }) => {
    const payload = await fetchJson(`https://api.github.com/repos/${repo}/releases?per_page=5`, headers);
    return (payload ?? [])
      .filter((item) => !item.draft && !item.prerelease)
      .filter((item) => isRecent(item.published_at ?? item.created_at))
      .slice(0, 1)
      .map((item) => {
        const repoName = cleanText(repo.split('/')[1] || repo);
        const title = cleanText(`${repoName} ${item.name || item.tag_name}`);
        const summary = clamp(item.body ?? '', 220);
        const releaseItem = {
          title,
          source: 'GitHub',
          url: cleanText(item.html_url),
          meta: `${label} release · ${cleanText(item.tag_name)}`,
          topics: topicsFor(title, repo, summary, label, 'github release'),
          publishedAt: item.published_at ?? item.created_at ?? utcIso(NOW),
          score: scoreGithubRelease(item, boost),
          summary,
        };
        return {
          ...releaseItem,
          why: whyFor(releaseItem),
        };
      })
      .filter((item) => item.title && item.url)
      .filter((item) => isAgenticTitle(item.title, item.summary));
  });

  return dedupe((await Promise.allSettled([...searchJobs, ...repoJobs, ...releaseJobs]))
    .flatMap((entry) => (entry.status === 'fulfilled' ? entry.value : [])));
}

function groupCounts(items) {
  const counts = new Map();
  for (const item of items) {
    const source = normalizeSource(item.source, item.url);
    counts.set(source, (counts.get(source) ?? 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}

function buildHighlights({ hn, reddit, hf, labs, github }) {
  const sortForHighlights = (items, limit) => [...items].sort((a, b) => highlightScore(b) - highlightScore(a)).slice(0, limit);
  const picks = [
    ...sortForHighlights(labs, 3),
    ...sortForHighlights(hn, 2),
    ...sortForHighlights(reddit, 1),
    ...sortForHighlights(hf, 1),
    ...sortForHighlights(github, 2),
  ];

  return dedupe(picks)
    .slice(0, 8)
    .map((item) => ({
      ...item,
      source: normalizeSource(item.source, item.url),
      why: whyFor(item),
      topics: item.topics ?? [],
    }));
}

function buildSummary(highlights) {
  const titles = highlights.map((item) => item.title.toLowerCase());
  const hasTinyTools = titles.some((title) => title.includes('needle'));
  const hasForge = titles.some((title) => title.includes('forge'));
  const hasCodex = titles.some((title) => title.includes('codex'));
  const hasLocal = titles.some((title) => title.includes('qwen') || title.includes('textgen') || title.includes('deepresearch'));
  const hasInterface = titles.some((title) => title.includes('pointer') || title.includes('interaction models'));
  const hasPackaging = titles.some((title) => title.includes('small business') || title.includes('gemini spark') || title.includes('codex'));
  const hasInfra = titles.some((title) => title.includes('webhooks') || title.includes('web-search') || title.includes('mcp') || title.includes('browser'));
  const hasSupervision = titles.some((title) => title.includes('agent view') || title.includes('usage limits') || title.includes('dashboard'));
  const hasEnterprise = titles.some((title) => title.includes('dell') || title.includes('sap') || title.includes('enterprise'));
  const hasSemble = titles.some((title) => title.includes('semble') && title.includes('code search'));
  const hasTencent = titles.some((title) => title.includes('tencent') || title.includes('marvis'));
  const hasClaudeDreaming = titles.some((title) => title.includes('dreaming'));
  const hasStainless = titles.some((title) => title.includes('stainless'));
  const hasAntigravityCli = titles.some((title) => title.includes('antigravity cli'));
  const hasMathBreakthrough = titles.some((title) => title.includes('geometry') || (title.includes('conjecture')));
  const hasKarpathy = titles.some((title) => title.includes('karpathy') && title.includes('anthropic'));
  const hasMcpTunnels = titles.some((title) => title.includes('mcp tunnel') || title.includes('self-hosted sandbox'));
  const hasLocalDeepResearch = titles.some((title) => title.includes('local deep research'));
  const hasCommandAPlus = titles.some((title) => title.includes('command a+') || title.includes('command a-plus') || (title.includes('cohere') && title.includes('command')));
  const hasTorvaldsAi = titles.some((title) => (title.includes('torvalds') || title.includes('linus')) && (title.includes('kernel') || title.includes('linux')) && (title.includes('ai') || title.includes('patch') || title.includes('coding')));
  const hasOpus48 = titles.some((title) => title.includes('opus 4.8') || (title.includes('opus') && title.includes('4.8')));
  const hasDynamicWorkflows = titles.some((title) => title.includes('dynamic workflow') && (title.includes('opus') || title.includes('sub-agent') || title.includes('anthropic')));
  const hasCiscoCodex = titles.some((title) => title.includes('cisco') && title.includes('codex'));
  const hasSelfImproving = titles.some((title) => title.includes('self-improving') && (title.includes('agent') || title.includes('tax')));
  const hasSocialScience = titles.some((title) => title.includes('social science') && (title.includes('coding') || title.includes('agent')));
  const hasCodexSandbox = titles.some((title) => title.includes('codex') && title.includes('windows'));

  const bits = [];
  if (hasForge) bits.push('guardrails on local models close the reliability gap with frontier APIs (Forge: 53%→99%)');
  if (hasSemble) bits.push('semantic code search for agents cuts token use by 98% — a massive efficiency unlock');
  if (hasTencent) bits.push('Tencent launches OS-level multi-agent assistant (Marvis: 6 coordinated agents)');
  if (hasClaudeDreaming) bits.push('Anthropic "dreaming" lets Claude agents self-improve via async session review');
  if (hasStainless) bits.push('Anthropic acquires Stainless — the SDK connectivity layer every agent depends on');
  if (hasAntigravityCli) bits.push('Google transitions Gemini CLI into Antigravity CLI — CLI-to-agent-platform play');
  if (hasMathBreakthrough) bits.push('OpenAI model disproves 80-year-old discrete geometry conjecture');
  if (hasEnterprise) bits.push('enterprise agents are going production-scale (SAP/Claude, Dell/Codex)');
  if (hasPackaging) bits.push('major labs are packaging agent workflows for broader adoption (Gemini Spark, Codex mobile)');
  if (hasCodex) bits.push('Codex keeps expanding — mobile, enterprise, and deeper agent-loop engineering');
  if (hasLocal) bits.push('the local/open-weight stack keeps getting stronger around Qwen-style setups');
  if (hasInterface) bits.push('the interface layer is starting to shift beyond plain chat');
  if (hasInfra) bits.push('event-driven and browser/MCP plumbing is becoming part of the agent conversation');
  if (hasSupervision) bits.push('people are asking for better visibility into long-running agent runs');
  if (hasTinyTools) bits.push('tiny tool-calling models are becoming real');
  if (hasKarpathy) bits.push('Karpathy joins Anthropic — talent signal for the agentic AI research race');
  if (hasMcpTunnels) bits.push('MCP tunnels and self-hosted sandboxes unlock enterprise agent deployments');
  if (hasLocalDeepResearch) bits.push('local deep research agents hit production quality on consumer hardware');
  if (hasCommandAPlus) bits.push('Cohere releases Command A+ — a 25B/218B open-weight MoE agentic model under Apache 2.0');
  if (hasTorvaldsAi) bits.push('Torvalds threatens crackdown on AI-generated kernel patches — coding agents producing code faster than human review can handle');
  if (hasOpus48) bits.push('Anthropic Opus 4.8 drops with 69.2% SWE-Bench Pro and Dynamic Workflows for orchestrating hundreds of sub-agents');
  if (hasDynamicWorkflows) bits.push('Dynamic Workflows enables hundreds of parallel sub-agents — agent orchestration becomes the competitive moat');
  if (hasCiscoCodex) bits.push('Cisco deploys Codex across engineering — 100% of new features are now AI-written');
  if (hasSelfImproving) bits.push('self-improving agents learn from their own production outputs without human retraining');
  if (hasSocialScience) bits.push('Anthropic research finds only 20% of researchers use coding agents — huge adoption gap vs chatbots (81%)');
  if (hasCodexSandbox) bits.push('OpenAI publishes Codex Windows sandbox technical deep-dive — containment as product feature');

  if (!bits.length) {
    return 'The strongest current signal is that agentic AI keeps moving away from vague demos and toward workflows people can actually run, inspect, and compare.';
  }

  return `This cycle says ${bits.slice(0, 5).join(', ')}. The deeper pattern is that agentic AI is being compressed, packaged, and made more inspectable at the same time.`;
}

function buildTangentRadar(items) {
  const topicCounts = new Map();
  const signals = new Map();
  for (const item of items) {
    for (const topic of item.topics ?? []) {
      topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
      if ((signals.get(topic) ?? []).length < 3) {
        const bucket = signals.get(topic) ?? [];
        bucket.push(`${normalizeSource(item.source, item.url)}: ${item.title}`);
        signals.set(topic, bucket);
      }
    }
  }

  return [...topicCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([topic, signalCount]) => ({
      topic,
      signalCount,
      whyItMatters: defaultWhy([topic], 'Hacker News'),
      signals: signals.get(topic) ?? [],
    }));
}

function buildExperimentQueue(highlights) {
  const titles = highlights.map((item) => item.title.toLowerCase());
  const localTilt = titles.some((title) => title.includes('qwen') || title.includes('textgen') || title.includes('deepresearch'));
  const stateTilt = titles.some((title) => title.includes('statewright') || title.includes('memory'));
  const packagingTilt = titles.some((title) => title.includes('small business') || title.includes('codex'));
  const infraTilt = titles.some((title) => title.includes('webhooks') || title.includes('web-search'));
  const enterpriseTilt = titles.some((title) => title.includes('dell') || title.includes('sap') || title.includes('enterprise'));

  const experiments = [
    {
      title: 'Benchmark one local-first agent stack',
      why: 'The local/open-weight ecosystem looks materially better this week, especially around Qwen and Forge guardrails.',
      prompt: 'Pick one real workflow and compare a local Qwen+Forge stack against a frontier hosted model on tool accuracy, latency, and cost.',
    },
    {
      title: 'Add explicit state to one messy workflow',
      why: 'Statewright-style thinking keeps surfacing because hidden state is still where agent reliability quietly falls apart.',
      prompt: 'Take a brittle multi-step agent task and force it through explicit states, retries, and checkpoints. Measure whether failure recovery gets simpler.',
    },
    {
      title: 'Prototype an interface beyond chat',
      why: 'The AI-pointer and Interaction Models threads both suggest the interface layer is becoming a genuine research lever.',
      prompt: 'Build a tiny agent UI that is not just a chat box — for example a timeline, pointer assistant, or live shared workspace — and log what it changes.',
    },
  ];

  if (enterpriseTilt || packagingTilt) {
    experiments[0] = {
      title: 'Audit one deployed enterprise agent workflow',
      why: 'Codex-on-Dell and SAP-with-Claude are production-scale agent deployments — worth understanding the real friction points.',
      prompt: 'Take one enterprise agent deployment case study, map the hidden assumptions, and note where trust, permissions, and failure recovery still feel weak.',
    };
  }

  if (!stateTilt) {
    experiments[1] = {
      title: 'Instrument one agent with better traces',
      why: 'Even when state machines are not explicit, better traces are still the easiest way to understand why an agent drifted or stalled.',
      prompt: 'Log tool calls, retries, and summaries for one real task, then inspect which step actually predicts success or failure.',
    };
  }

  if (!localTilt) {
    experiments[2] = {
      title: 'Stress-test one agent across model families',
      why: 'The model layer is changing quickly enough that the same harness can behave very differently across providers and sizes.',
      prompt: 'Replay the same agent task on one hosted frontier model and one smaller open model, then compare tool-selection behavior, not just answer quality.',
    };
  }

  if (infraTilt) {
    experiments[2] = {
      title: 'Replace one polling loop with an event-driven agent step',
      why: 'The infrastructure side of agents is getting more visible — long-running workflows increasingly need webhooks, retries, and explicit external-state handling.',
      prompt: 'Take one agent workflow that polls or blocks awkwardly, swap in an event-driven handoff, and note what changes in latency, cost, and failure recovery.',
    };
  }

  return experiments;
}

async function main() {
  const [hn, reddit, hf, labFeeds, github] = await Promise.all([
    fetchHnSignals(),
    fetchRedditSignals(),
    fetchHfSignals(),
    fetchLabFeedSignals(),
    fetchGithubSignals(),
  ]);

  const allItems = dedupe([...hn, ...reddit, ...hf, ...labFeeds, ...github])
    .map((item) => ({
      ...item,
      topics: item.topics?.length ? item.topics : topicsFor(item.title, item.url, item.summary ?? '', item.source),
    }))
    .map((item) => ({
      ...item,
      why: whyFor(item),
    }));

  const majorLabs = dedupe([
    ...labFeeds,
    ...hn.filter((item) => officialSourceForUrl(item.url)),
  ]).sort((a, b) => b.score - a.score);

  const highlights = buildHighlights({ hn, reddit, hf, labs: majorLabs, github });
  const sourceSections = [
    { key: 'major-labs', label: 'Major labs', items: sectionItems(majorLabs, 6) },
    { key: 'hacker-news', label: 'Hacker News', items: sectionItems(hn.filter((item) => !officialSourceForUrl(item.url)), 5) },
    { key: 'reddit', label: 'Reddit', items: sectionItems(reddit, 4) },
    { key: 'hugging-face', label: 'Hugging Face', items: sectionItems(hf, 4) },
    { key: 'github', label: 'GitHub', items: sectionItems(github, 4) },
  ].map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      source: normalizeSource(item.source, item.url),
      why: item.why ?? whyFor(item),
      topics: item.topics ?? [],
    })),
  }));

  const payload = {
    generatedAt: utcIso(NOW),
    windowDays: WINDOW_DAYS,
    summary: buildSummary(highlights),
    sourceStats: {
      items: allItems.length,
      sources: groupCounts(allItems),
    },
    highlights,
    sourceSections,
    tangentRadar: buildTangentRadar(allItems),
    experimentQueue: buildExperimentQueue(highlights),
    method: [
      'Targeted Hacker News searches for high-signal agentic AI posts from the last 7 days',
      'Reddit weekly top-post scan in LocalLLaMA and ClaudeAI filtered for practical agent-building signals',
      'Hugging Face model search filtered toward fresh open-weight agent, deep-research, and Qwen-related releases',
      'Major-lab RSS checks plus official-domain matches surfaced through Hacker News',
      'GitHub repo and release scans for fresh agent tooling, dashboards, browsers, workspaces, and coding-agent updates',
    ],
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`wrote ${path.relative(repoRoot, outputPath)} with ${allItems.length} items`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
