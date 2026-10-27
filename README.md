# Tesla Investment Platform

Sophisticated Tesla-themed crypto investment platform with full User & Admin dashboards.

**Repository:** https://github.com/codejimmi/tesla-investment-platform

## Features Implemented

### Public
- Tesla-inspired landing page (black/red design)
- Login & Register with referral support

### User Dashboard
- Overview (balance, invested, profit, active plans, recent activity)
- Deposit (BTC / ETH / USDT ERC-20 / TRC-20 + proof/txHash)
- Withdraw (manual request)
- Investment Plans + Invest flow (balance deduction)
- My Investments list
- Transaction History
- Profile + Referral code/link

### Admin Dashboard
- Overview (stats + pending actions)
- Deposit Management (Approve → credits user balance + email / Reject)
- Payment Wallets (set addresses for BTC, ETH, USDT ERC20/TRC20)
- SMTP Settings (host, port, credentials, from) + Test Email
- Role-protected routes (ADMIN only)

### Core
- Complete Prisma schema (Users, Plans, Investments, Transactions, Wallets, SMTP, Settings, ActivityLogs)
- NextAuth credentials + JWT
- Middleware protection
- Email helper (Nodemailer)
- Seed script (admin + 4 sample plans)

## Quick Start

```bash
git clone https://github.com/codejimmi/tesla-investment-platform.git
cd tesla-investment-platform
npm install
cp .env.example .env
# Set DATABASE_URL and NEXTAUTH_SECRET
npx prisma db push
npx prisma generate
npx tsx prisma/seed.ts   # creates admin@teslainvest.com / Admin123!
npm run dev
```

**Default admin:** `admin@teslainvest.com` / `Admin123!`

## Environment

```
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="long-random-string"
```

## Deploy on Vercel

1. Import this GitHub repo in Vercel
2. Add env vars (DATABASE_URL from Vercel Postgres or Neon/Supabase, NEXTAUTH_SECRET, NEXTAUTH_URL)
3. Deploy
4. Run `npx prisma db push` once (or use a migration workflow)

## Remaining (easy to finish)

- Admin Users page (search, credit/debit balance, activate/deactivate)
- Admin Withdrawals approval (mark paid + deduct balance)
- Admin Plans CRUD UI
- Admin Settings page
- Daily profit cron / distribution job
- File upload for deposit proofs (Vercel Blob)

The schema, patterns and most critical flows are already production-ready.

---
Built sequentially with full detail. Continue from the same repo.
