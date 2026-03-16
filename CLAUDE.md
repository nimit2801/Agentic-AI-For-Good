# Project: Agentic AI For Good

## Quick Context
Read `AGENT.md` for what this project is. Read `SESSION.md` for what Nimit is currently working on. Read `BUSINESS_STRATEGY.md` for the growth/monetization plan.

## Rules
- Always use `frontend-design` skill when creating frontend UI components/pages
- Use the Canva image review workflow (see memory) for any image generation
- Never use stock photos. Brand is typography-focused, warm editorial aesthetic.
- When making SEO-related changes, remember the site currently uses HashRouter (needs migration to BrowserRouter)

## Tech Stack
- Vite + React 19 + TypeScript
- Tailwind CSS + shadcn/ui components
- GSAP for animations
- react-router-dom (HashRouter) — migration to BrowserRouter is planned
- Supabase (project ref: `osgxxcxbmwoprjbjgifm`) for CMS
- Deployed on Vercel → agenticaiforgood.com

## Brand
- Colors: `#F5F1EB` (beige bg), `#D4754E` (terracotta), `#1A1A1A` (text), `#6B6560` (secondary)
- Fonts: Inter 800 (headlines), IBM Plex Mono 500 (labels)
- Illustration style: See `public/images/ILLUSTRATION-STYLE-GUIDE.md`

## Key Directories
- `src/pages/` — All page components
- `src/sections/` — Homepage sections
- `src/hooks/` — Custom hooks (useStories, etc.)
- `src/lib/supabase.ts` — Supabase client
- `public/images/` — All images and illustrations
