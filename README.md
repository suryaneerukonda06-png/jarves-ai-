# JARVIS Assistant

A browser-based JARVIS-style personal AI assistant MVP.

## Included

- JARVIS command-center UI
- Chat interface
- Browser voice input
- Local browser memory for the website demo
- Server-side OpenAI Responses API adapter at /api/chat
- Supabase + pgvector schema for the persistent-memory upgrade
- Vercel configuration

## Run locally

1. Copy `.env.example` to `.env`.
2. Put your OpenAI API key in `OPENAI_API_KEY`.
3. Run:

```bash
npm run dev
```

4. Open http://localhost:3000

The site also works in demo mode without an API key.

## Deploy

The root `index.html` is the browser website. `api/chat.js` is a Vercel serverless route for the live AI API. Add `OPENAI_API_KEY` as a Vercel environment variable before enabling live AI.

Do not put service-role keys or OpenAI secrets in browser code.

## Next layers

1. Supabase Auth + persistent, user-scoped memory
2. pgvector semantic memory
3. web search
4. browser automation
5. permissioned Windows PC control
