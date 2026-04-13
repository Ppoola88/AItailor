# AI Job Tailor

Production-ready SaaS web application to aggregate jobs, tailor resumes with AI, calculate job match score, and export ATS-friendly PDFs.

## Step Status

- Step 1 (project initialization and setup): complete
- Step 2 (Prisma + PostgreSQL schema): complete
- Step 3 (Authentication with NextAuth + JWT session): complete
- Step 4 (Profile CRUD API + UI): complete
- Step 5 (Mock job aggregation API + jobs listing UI): complete
- Step 6 (OpenAI resume tailoring engine + prompt templates): complete
- Step 7 (Match score engine + skill gap suggestions): complete
- Step 8 (PDF resume export): complete

Included in this step:
- Next.js (latest) with App Router
- TypeScript
- Tailwind CSS
- ESLint
- Base architecture folders for upcoming steps

## Tech Stack

- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: Next.js API routes
- Database: PostgreSQL + Prisma (Step 2)
- Auth: NextAuth/JWT (Step 3)
- AI: OpenAI API (Step 6)

## Getting Started

1. Install dependencies (already done if you generated locally):

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

3. Run the development server:

```bash
npm run dev
```

4. Open http://localhost:3000

## Folder Structure

Current structure prepared for MVP implementation:

- `src/app` - Next.js app routes and pages
- `src/app/api` - API route handlers
- `src/components` - UI components
- `src/lib` - shared utilities, AI helpers, config
- `src/services` - business logic
- `prisma` - Prisma schema and migrations (Step 2)

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Lint codebase
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Create and apply local migration
- `npm run prisma:push` - Push schema directly to DB (without migration files)
- `npm run prisma:studio` - Open Prisma Studio

## Database Setup (Step 2)

1. Ensure PostgreSQL is running locally.
2. Update `DATABASE_URL` in `.env`.
3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Create first migration:

```bash
npm run prisma:migrate -- --name init
```

Prisma schema location:
- `prisma/schema.prisma`

Prisma runtime config location:
- `prisma.config.ts`

## Hardening Notes

- API rate limiting is now persisted via the `ApiRateLimit` Prisma model.
- Run a migration before deploying changes:

```bash
npm run prisma:migrate -- --name hardening_rate_limit
```
# AItailor
