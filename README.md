# Tesla Investment Platform

**Repo:** https://github.com/codejimmi/tesla-investment-platform

Full-stack Tesla-themed crypto investment platform (User + Admin dashboards).

## Features

- User: deposit / withdraw / invest / history / profile / referrals
- Admin: users (credit/debit), deposits, withdrawals, plans CRUD, wallets (BTC/ETH/USDT), SMTP, settings
- **Vercel Cron** – daily profit distribution + capital return on maturity (`/api/cron/daily-profits` at 00:00 UTC)
- Manual payments only (admin verifies)

## Environment Variables (required on Vercel)

```
DATABASE_URL=postgresql://neondb_owner:npg_Qkn4Oja2hMqS@ep-aged-firefly-b5ljh6lo-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXTAUTH_URL=https://YOUR-PROJECT.vercel.app
NEXTAUTH_SECRET=whhov78CLVxDt5s3pSdRp8ggd03++RU7F4JmtXerKw0=

CRON_SECRET=change-me-to-a-long-random-string
```

(You can regenerate secrets with `openssl rand -base64 32`.)

## Deploy on Vercel (recommended)

1. Go to https://vercel.com/new and **Import** `codejimmi/tesla-investment-platform`
2. Add the three environment variables above (Production + Preview)
3. Deploy
4. After first deploy, open the deployment logs. If Prisma client is missing, the `postinstall` script runs `prisma generate`.
5. Push the schema once:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```
   (Run locally with the same `DATABASE_URL`, or use Neon SQL editor / a one-off Vercel job.)

6. Cron is already defined in `vercel.json` (daily at midnight UTC). On Hobby plan crons run once per day.

## Local development

```bash
git clone https://github.com/codejimmi/tesla-investment-platform.git
cd tesla-investment-platform
npm install
cp .env.example .env
# paste DATABASE_URL + NEXTAUTH_SECRET
npx prisma db push
npx prisma generate
npx tsx prisma/seed.ts   # admin@teslainvest.com / Admin123!
npm run dev
```

## Admin login after seed

- Email: `admin@teslainvest.com`
- Password: `Admin123!`

## Cron endpoint

`GET /api/cron/daily-profits`  
Header: `Authorization: Bearer $CRON_SECRET`  
Credits daily ROI to active investments and returns capital when plans mature.

---
Platform is production-ready. Connect the GitHub repo in Vercel, set the env vars, deploy, run `prisma db push` + seed once, and you are live.
