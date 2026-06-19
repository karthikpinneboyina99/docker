PROJECT: Football Transfer Intelligence Platform

This is a portfolio MVP, not a production system. Prioritize clean, readable,
correctly-working code over abstraction, premature optimization, or extra
configurability. Do not add features that weren't asked for.

STACK (do not deviate):
- backend/: Node.js + Express + Prisma ORM + PostgreSQL (Neon)
- frontend/: Next.js (App Router) + TypeScript + Tailwind CSS
- scripts/: standalone Node.js scripts for DB seeding and data refresh, using
  the same Prisma client as backend/ (import from backend/prisma)

GLOBAL RULES:
- TypeScript everywhere (backend, frontend, scripts).
- No emoji in code, comments, commit messages, or UI copy.
- No mock data fallbacks hidden inside production code paths — seed data lives
  only in scripts/seed, never silently generated at runtime.
- Every API endpoint must have explicit request/response types.
- Keep environment variables in .env, never hardcode secrets, always read
  via process.env with a small config loader that fails loudly if a required
  var is missing.
- Write a short README.md in each folder explaining what it does and how to
  run it, once that folder's phase is complete.
- Do not start work on a phase until I explicitly say "start phase N".

Confirm you've understood this file by summarizing the stack and rules back
to me in 5 bullet points. Do not write any code yet.