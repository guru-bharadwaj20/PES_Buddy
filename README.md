# PES Buddy

Full-stack campus utilities platform built with **Next.js 15**. Features **Doormato** (food ordering), **Scootigo** (scooter rentals), **Expense Tracker** (budgeting), and an **Admin Portal** (monitoring & management).

---

## Tech Stack

**Framework:** Next.js 15 (App Router), React 19  
**Auth:** NextAuth v5 (credentials + optional Google OAuth), JWT sessions  
**Database:** Prisma ORM + **MongoDB Atlas**  
**Real-time:** Socket.IO server (`server.ts`) with JWT middleware  
**Cache:** Redis via ioredis — **optional**, app runs fully without it  
**Styling:** Tailwind CSS 3, Framer Motion, `next-themes` (dark mode)  
**Validation:** Zod + react-hook-form  
**Deployment:** Vercel (API routes + SSR), GitHub Actions CI  

---

## Features

- Secure credential authentication (SRN + password), optional Google OAuth
- **Doormato:** Browse canteens, view menus, add to cart, place and track orders
- **Scootigo:** Browse available scooters, book rides, view booking history
- **Expense Tracker:** Add, categorize, and review spending
- **Notifications:** Real-time alerts for order and booking updates via Socket.IO
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

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-strong-random-secret

# MongoDB Atlas connection string
# Atlas → Connect → Drivers → Node.js
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority&appName=PESBuddy"
```

Push the schema to MongoDB Atlas and seed sample data:

```bash
npm run db:push
npm run db:seed
```

Start the development server (includes Socket.IO):

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
│   ├── layout.tsx
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
│   ├── redis.ts             # Optional Redis cache wrapper
│   ├── utils.ts             # Formatting helpers
│   └── validations/         # Zod schemas per domain
├── prisma/
│   ├── schema.prisma        # MongoDB schema
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
| `npm run build` | Generate Prisma client + build for production |
| `npm run start` | Start production server with Socket.IO |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript check (no emit) |
| `npm run format` | Prettier format |
| `npm run db:push` | Push schema to MongoDB Atlas |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Regenerate Prisma client |

---

## Demo Credentials

**Student:** SRN `PES1UG22CS001` / Password `Student@123`  
**Admin:** email `admin@pesbuddy.com` / Password `Admin@123`

---

## Vercel Deployment

1. Push to GitHub and import the repository in Vercel
2. Set the **Root Directory** to `pes-buddy-nextjs`
3. Add environment variables in the Vercel dashboard:
   - `DATABASE_URL` — MongoDB Atlas connection string
   - `NEXTAUTH_SECRET` — strong random secret
   - `NEXTAUTH_URL` — your Vercel deployment URL (e.g. `https://your-app.vercel.app`)
   - `NEXT_PUBLIC_SOCKET_URL` — your Vercel URL (or separate Socket.IO host)
4. Deploy — Vercel runs `npm install` (which auto-generates the Prisma client) and `npm run build`

> **Socket.IO note:** Vercel's serverless infrastructure does not support persistent WebSocket connections.
> The REST API, authentication, and all data features work fully on Vercel.
> For real-time Socket.IO features in production, run the custom server separately
> (Railway, Render, or any Node.js host) and set `NEXT_PUBLIC_SOCKET_URL` accordingly.
> In local development, `npm run dev` starts the full Socket.IO server automatically.

---

## MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user with read/write access
3. Whitelist your IP (or `0.0.0.0/0` for Vercel)
4. Get the connection string: **Connect → Drivers → Node.js**
5. Set it as `DATABASE_URL` in `.env` and Vercel environment variables
6. Run `npm run db:push` to create collections and indexes
7. Run `npm run db:seed` to populate sample data

---

## Legacy Reference

The original PES Buddy was a C-based terminal menu system (`legacy/C_Program/`), preserved for historical context. The Next.js implementation is the active codebase.
