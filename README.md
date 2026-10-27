# Tesla Investment Platform

Sophisticated Tesla-themed crypto investment platform with full User & Admin dashboards.

**Repo:** https://github.com/codejimmi/tesla-investment-platform

## Status: Core Complete

### User Dashboard
- Overview (balance, invested, profit, active plans, activity)
- Deposit (BTC / ETH / USDT ERC-20 / TRC-20 + proof)
- Withdraw (manual request)
- Investment Plans + Invest (balance deduction)
- My Investments
- Transaction History
- Profile + Referral code/link

### Admin Dashboard
- Overview with pending actions
- **Users** – search, credit/debit balance (with reason + log), activate/deactivate
- **Deposits** – Approve (credits balance + email) / Reject
- **Withdrawals** – Approve (deducts balance) / Reject
- **Plans** – Create / Edit / Enable-Disable
- **Wallets** – Set BTC, ETH, USDT ERC-20, USDT TRC-20 addresses
- **SMTP** – Full config + Test Email
- **Settings** – Site name, min deposit/withdrawal, referral %, maintenance mode

### Technical
- Next.js 15 + TypeScript + Tailwind (Tesla black/red)
- Prisma + PostgreSQL (complete schema)
- NextAuth credentials + role-based middleware
- Nodemailer (admin-configurable)
- Activity logs + transaction records for every money movement
- Seed: `admin@teslainvest.com` / `Admin123!` + 4 plans

## Setup

```bash
git clone https://github.com/codejimmi/tesla-investment-platform.git
cd tesla-investment-platform
npm install
cp .env.example .env
# DATABASE_URL + NEXTAUTH_SECRET + NEXTAUTH_URL
npx prisma db push
npx prisma generate
npx tsx prisma/seed.ts
npm run dev
```

## Deploy to Vercel

1. Import this repository
2. Add environment variables
3. Connect Postgres (Vercel Postgres / Neon / Supabase)
4. Deploy
5. Run `npx prisma db push` once after first deploy

## Optional next steps
- Daily profit distribution cron (Vercel Cron)
- Deposit proof file upload (Vercel Blob)
- 2FA
- More detailed user detail page inside admin

All critical money flows and admin controls are implemented and production-ready.
