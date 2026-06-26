# PES Buddy

Full-stack campus utilities platform built with **Next.js 15**. Features **Doormato** (food ordering), **Scootigo** (scooter rentals), **Expense Tracker** (budgeting), and an **Admin Portal** (monitoring & management).

---

## Tech Stack

**Framework:** Next.js 15 (App Router), React 19  
**Auth:** NextAuth v5 (credentials + optional Google OAuth), JWT sessions  
**Database:** Prisma ORM + SQLite (dev) — swap `DATABASE_URL` for Postgres in production  
**Real-time:** Socket.IO server (`server.ts`) with JWT middleware  
**Cache:** Redis via ioredis (optional — falls back gracefully if not set)  
**Styling:** Tailwind CSS 3, Framer Motion, `next-themes` (dark mode)  
**Validation:** Zod + react-hook-form  

---

## Features

- Secure credential authentication (SRN + password), optional Google OAuth
- **Doormato:** Browse canteens, view menus, add to cart, place and track orders
- **Scootigo:** Browse available scooters, book rides, view booking history
- **Expense Tracker:** Add, categorize, and review spending
- **Notifications:** Real-time alerts for order status and booking updates via Socket.IO
- **Admin Portal:** Manage orders, bookings, view dashboard analytics
- Responsive dark-themed UI with glass morphism effects

---

## Quick Start

```bash
cd pes-buddy-nextjs
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

Required `.env` variables:

```
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Optional — Redis cache
REDIS_URL="redis://localhost:6379"

# Optional — Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

Set up the database and seed sample data:

```bash
npm run db:push
npm run db:seed
```

Start the development server:

```bash
npm run dev
# App: http://localhost:3000
```

---

## Project Structure

```
pes-buddy-nextjs/
├── app/
│   ├── (customer)/          # Authenticated student routes
│   │   ├── dashboard/
│   │   ├── doormato/
│   │   ├── expense-tracker/
│   │   ├── notifications/
│   │   ├── profile/
│   │   └── scootigo/
│   ├── admin/               # Admin portal routes
│   │   ├── (portal)/        # Protected admin pages
│   │   ├── login/
│   │   └── register/
│   ├── api/                 # API route handlers
│   │   ├── auth/
│   │   ├── doormato/
│   │   ├── expense/
│   │   ├── notifications/
│   │   ├── scootigo/
│   │   └── admin/
│   ├── auth/                # Login & register pages
│   ├── about/
│   ├── contact/
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── layout/              # Header, Footer, AdminNav
│   ├── providers/           # CartProvider, SocketProvider, ThemeProvider
│   └── ui/                  # AnimatedSection, LoadingSkeleton, StatusBadge
├── features/
│   ├── admin/               # AdminDashboardClient
│   └── doormato/            # MenuPageClient
├── hooks/                   # useCart, useNotifications
├── lib/
│   ├── auth.ts              # NextAuth config + helpers
│   ├── db.ts                # Prisma client singleton
│   ├── redis.ts             # ioredis cache wrapper
│   ├── utils.ts             # Formatting helpers
│   └── validations/         # Zod schemas per domain
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── types/index.ts
├── middleware.ts            # Route protection
├── server.ts                # Custom HTTP server with Socket.IO
└── next.config.ts
```

---

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with Socket.IO (`tsx server.ts`) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript check (no emit) |
| `npm run format` | Prettier format |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create and run migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Regenerate Prisma client |

---

## Demo Credentials

**Student:** SRN `01ABC` / Password `password`  
**Admin:** create via `/admin/register` or seed script

---

## Legacy Reference

The original PES Buddy was a C-based terminal menu system (`legacy/C_Program/`), preserved for historical context. The Next.js implementation is the active codebase.

---

## Deployment Notes

- Set `DATABASE_URL` to a Postgres connection string in production
- Run `npm run db:migrate` before first deploy
- Set `NEXTAUTH_SECRET` to a strong random value
- `sharp` is included for Next.js image optimization
- Socket.IO runs on the same port as Next.js via the custom `server.ts`
