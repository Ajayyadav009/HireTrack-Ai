# HireTrack AI

> **Intelligent, AI-powered Applicant Tracking System**

HireTrack AI transforms how companies attract, evaluate, and hire talent — replacing fragmented, manual hiring workflows with a unified platform combining automation, predictive analytics, and collaboration at enterprise scale.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Web App | Next.js 15 (App Router) |
| Language | TypeScript 5.x (strict) |
| Styling | Tailwind CSS + CSS Variables |
| Database | PostgreSQL 16 via Prisma |
| Cache / Queue | Redis 7 + BullMQ |
| Auth | Auth.js v5 + Google OAuth |
| AI | OpenAI GPT-4o via Vercel AI SDK |
| Email | Resend + React Email |
| Storage | AWS S3 + CloudFront |
| Monorepo | Turborepo + pnpm workspaces |

## Repository Structure

```
hiretrack-ai/
├── apps/
│   ├── web/          # Next.js 15 web application
│   └── api/          # NestJS API server (future milestone)
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── ui/           # Shared UI component library
│   ├── utils/        # Shared utilities
│   └── config/       # Shared ESLint, TS, Prettier configs
├── docs/             # Architecture decisions, API docs, runbooks
├── scripts/          # Dev tooling scripts
├── .env.example      # Environment variable reference (no secrets)
└── prisma/           # Database schema (shared reference)
```

## Getting Started

### Prerequisites

- Node.js >= 22.0.0
- pnpm >= 11.0.0
- PostgreSQL 16
- Redis 7

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp .env.example apps/web/.env.local
# Edit apps/web/.env.local with your values

# 3. Start the development server
pnpm dev
```

The web app runs at **http://localhost:3000**.

### Available Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm format` | Format code with Prettier |

## Documentation

- [Architecture Plan](./plan.md)
- [Database Design](./database_design.md)
- [Authentication System Design](./auth_design.md)
- [UI/UX Design](./ui_ux_design.md)

## Development Status

| Milestone | Status |
|---|---|
| Project Foundation (this) | ✅ Complete |
| Authentication | 🔲 Pending |
| Database + Prisma | 🔲 Pending |
| Dashboard | 🔲 Pending |
| Jobs Module | 🔲 Pending |
| Candidates Module | 🔲 Pending |
| Pipeline / Kanban | 🔲 Pending |
| Interviews + Scorecards | 🔲 Pending |
| AI Integration | 🔲 Pending |
| Analytics | 🔲 Pending |
| Billing | 🔲 Pending |

---

**Classification:** Engineering Reference · Version 0.1.0
