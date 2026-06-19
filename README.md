# Football Transfer Intelligence Platform (MVP)

A full-stack web application that tracks, aggregates, and scores football transfer rumors. It features an automated scoring engine that quantifies the reliability of journalism sources and computes real-time transfer probabilities, alongside AI-generated narrative summaries.

## Architecture

```mermaid
graph TD
    Client[Next.js Frontend] -->|REST API| API[Express.js Backend]
    API --> Scoring[Scoring Engine]
    API --> AI[AI Summarizer]
    API --> Prisma[Prisma ORM]
    Prisma --> DB[(PostgreSQL)]
    Scripts[Seeding Scripts] --> Prisma
```

- **Frontend (`/frontend`)**: Next.js App Router (React Server Components), TypeScript, Tailwind CSS.
- **Backend (`/backend`)**: Node.js, Express, Prisma ORM, Zod.
- **Database**: PostgreSQL (designed for Neon serverless).
- **Scripts (`/scripts`)**: Standalone database seeding and orchestration tools.

## Setup Instructions

### 1. Database & Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file in `/backend` containing:
   ```env
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
   OPENROUTER_API_KEY="your_api_key"
   ```
4. `npx prisma db push` to sync the schema to your database.
5. `npm run dev` to start the API server on `http://localhost:3001`.

### 2. Seeding Data
1. `cd scripts`
2. `npm install`
3. Create a `.env` file in `/scripts` identical to the backend's `.env`.
4. `npm run seed` to populate the database with realistic clubs, players, journalists, and rumors.

### 3. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create a `.env.local` file in `/frontend` containing:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3001/api"
   ```
4. `npm run dev` to start the Next.js server on `http://localhost:3000`.

---

## How the AI Prediction Works

Our platform goes beyond standard rumor aggregation by applying deterministic scoring heuristics and generative AI to provide real-time insights.

### 1. The Scoring Engine (Deterministic)
The scoring engine consists of two pure, unit-testable functions:

*   **Source Reliability Score (0-100):** Each journalist or outlet is assigned a baseline weight. The engine calculates a weighted average of the reporters covering a specific rumor. It applies a **recency decay** (reports from yesterday carry more weight than reports from two months ago) and a **corroboration bonus** (+5% confidence for every independent, agreeing source up to a cap).
*   **Transfer Probability:** This is a weighted algorithm combining four vectors:
    *   **Status (50%):** E.g., "ADVANCED_TALKS" guarantees a much higher baseline probability than "RUMOR". "DENIED" aggressively slashes it.
    *   **Source Reliability (30%):** Feeds directly from the score above.
    *   **Contract Urgency (10%):** Players with < 12 months left on their contract are statistically far more likely to transfer.
    *   **Club Spending Fit (10%):** A heuristic tracking whether the destination club historically spends in this price bracket.

### 2. AI Summarization (Generative)
Instead of forcing users to read a wall of data, we employ an LLM (via OpenRouter) to generate a concise, Fabrizio-Romano-style summary. 
**Crucially, we restrict hallucination:** The prompt strictly injects the *exact* computed `reliabilityScore` and `transferProbability` from step 1, explicitly instructing the AI to only narrate the math we've provided, rather than inventing its own predictions.

---

## Deployment Strategy

If deploying to production, follow this stack-specific strategy:

1. **Database (Neon PostgreSQL):**
   - Provision a Neon serverless Postgres instance.
   - Run `npx prisma db push` (or `migrate deploy` in production) from your CI/CD pipeline using the provisioned connection string.
2. **Backend (Render or Railway):**
   - Create a new Web Service pointing to the `/backend` directory.
   - Set the Build Command to `npm install && npx prisma generate && npm run build`.
   - Set the Start Command to `npm start`.
   - Add `DATABASE_URL` and `OPENROUTER_API_KEY` to the environment variables.
3. **Frontend (Vercel):**
   - Import the repository into Vercel, setting the Root Directory to `/frontend`.
   - Vercel will automatically detect the Next.js framework.
   - Add `NEXT_PUBLIC_API_URL` to the environment variables, pointing to the deployed URL of your Render/Railway backend.