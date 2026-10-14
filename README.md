This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
