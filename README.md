# JARVIS AI

JARVIS is a browser-based personal AI assistant built around **GitHub + Supabase**.

## Architecture

- GitHub: source code and version control
- GitHub Pages: static website hosting
- Supabase Auth: user identity
- Supabase Postgres + RLS: long-term memory
- Supabase Edge Functions: secure AI backend
- OpenAI Responses API: AI responses

## Supabase setup

1. Create a Supabase project.
2. Enable Anonymous Sign-Ins in Auth for this MVP.
3. Run `supabase/schema.sql` in the SQL Editor.
4. Deploy `supabase/functions/chat/index.ts` as the `chat` Edge Function.
5. Add `OPENAI_API_KEY` to the Edge Function secrets.
6. Optionally set `OPENAI_MODEL`; the default is `gpt-5.6-luna`.

## GitHub Pages

Enable **Settings → Pages → Source: GitHub Actions**.

The workflow in `.github/workflows/pages.yml` deploys the website whenever `main` changes.

## Browser configuration

After the Supabase project exists, put its URL and publishable key in `config.js`. A publishable key is intended for browser code; never put your Supabase secret key or OpenAI API key there.

## Current MVP

- JARVIS command-center UI
- Chat
- Browser voice input
- Local fallback mode
- Supabase-backed memory
- Supabase Edge Function AI adapter

Next: web search, browser automation, then permissioned PC control.
