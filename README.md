# Explore Page

## What it does

- Browse London listings and filter them by area and price range
- Open a listing detail page with a placeholder booking button
- Out of scope, as agreed: auth, uploads, user management and booking logic

## Stack and why

- **Next.js and TypeScript:** one repo for the UI and API
- **Postgres with Drizzle:** typed queries and migrations
- **shadcn/ui and Base UI:** accessible components that are quick to put together

## How I worked

1. Ran a short Q&A with an AI agent to pin down the data shape, then committed a spec as the source of truth.
2. Split the work into four tasks I could trace back to the spec: database setup, filtering, the property page and the Explore UI.
3. Built with AI agents and reviewed every diff myself.

For a throwaway prototype I'd have one-shotted it. Here I wanted to show how I'd build in a team: a clear spec, small reviewable changes, and decisions written down.

## Done during and after the session

- During: database, migrations, seed data (hosts and London properties) and filtering
- After: merged the listing detail page and fixed the font, added more styling and cleaned up code w/ React Doctor

## What I'd do next

- **Search as you type:** filter automatically, debounced, so there's no manual search button
- **Pagination:** cursor-based paging instead of loading every listing
- **Indexes:** on area, price and availability dates
- **Images:** object storage behind a CDN, with resized versions
- **Read scaling:** caching, then read replicas once traffic needs it
- **The trust layer:** show guests and hosts how they're connected, which is where Kiki stands apart

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Postgres** — either use Docker Compose from the repo root:

   ```bash
   docker compose up -d
   ```

   Or run Postgres yourself with the same settings as `docker-compose.yml`:

   | Setting  | Value          |
   | -------- | -------------- |
   | User     | `kiki`         |
   | Password | `kiki`         |
   | Database | `kiki_explore` |
   | Port     | `5432`         |

3. **Environment** — copy `.env.example` to `.env.local` (or `.env`) so `DATABASE_URL` points at your database:

   ```bash
   cp .env.example .env.local
   ```

   Default URL: `postgresql://kiki:kiki@localhost:5432/kiki_explore`

4. **Migrate and seed**

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
