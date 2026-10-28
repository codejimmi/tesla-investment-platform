import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

export const dynamic = "force-dynamic"
export const maxDuration = 60

const CREATE_TABLES_SQL = `
-- Enums
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'INVESTMENT', 'PROFIT', 'REFERRAL', 'ADJUSTMENT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "InvestmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "CryptoCurrency" AS ENUM ('BTC', 'ETH', 'USDT_ERC20', 'USDT_TRC20');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- User
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "name" TEXT,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "balance" DECIMAL(18,8) NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "referralCode" TEXT UNIQUE NOT NULL,
  "referredById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastLoginAt" TIMESTAMP(3),
  "lastLoginIp" TEXT
);

-- InvestmentPlan
CREATE TABLE IF NOT EXISTS "InvestmentPlan" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "minAmount" DECIMAL(18,8) NOT NULL,
  "maxAmount" DECIMAL(18,8),
  "dailyRoiPercent" DECIMAL(8,4) NOT NULL,
  "durationDays" INTEGER NOT NULL,
  "capitalReturn" BOOLEAN NOT NULL DEFAULT true,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Investment
CREATE TABLE IF NOT EXISTS "Investment" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "planId" TEXT NOT NULL,
  "amount" DECIMAL(18,8) NOT NULL,
  "dailyProfit" DECIMAL(18,8) NOT NULL,
  "totalExpected" DECIMAL(18,8) NOT NULL,
  "totalEarned" DECIMAL(18,8) NOT NULL DEFAULT 0,
  "status" "InvestmentStatus" NOT NULL DEFAULT 'ACTIVE',
  "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endDate" TIMESTAMP(3) NOT NULL,
  "lastProfitAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Transaction
CREATE TABLE IF NOT EXISTS "Transaction" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "type" "TransactionType" NOT NULL,
  "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
  "amount" DECIMAL(18,8) NOT NULL,
  "currency" "CryptoCurrency",
  "txHash" TEXT,
  "proofUrl" TEXT,
  "walletAddress" TEXT,
  "adminNote" TEXT,
  "processedBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- PaymentWallet
CREATE TABLE IF NOT EXISTS "PaymentWallet" (
  "id" TEXT PRIMARY KEY,
  "currency" "CryptoCurrency" UNIQUE NOT NULL,
  "address" TEXT NOT NULL,
  "network" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "qrCodeUrl" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- SmtpSetting
CREATE TABLE IF NOT EXISTS "SmtpSetting" (
  "id" TEXT PRIMARY KEY DEFAULT 'default',
  "host" TEXT NOT NULL,
  "port" INTEGER NOT NULL,
  "username" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "fromEmail" TEXT NOT NULL,
  "fromName" TEXT NOT NULL DEFAULT 'Tesla Investment',
  "secure" BOOLEAN NOT NULL DEFAULT true,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- SiteSetting
CREATE TABLE IF NOT EXISTS "SiteSetting" (
  "id" TEXT PRIMARY KEY DEFAULT 'default',
  "siteName" TEXT NOT NULL DEFAULT 'Tesla Investment',
  "supportEmail" TEXT NOT NULL DEFAULT 'support@teslainvest.com',
  "minDeposit" DECIMAL(18,8) NOT NULL DEFAULT 50,
  "minWithdrawal" DECIMAL(18,8) NOT NULL DEFAULT 20,
  "referralPercent" DECIMAL(5,2) NOT NULL DEFAULT 5,
  "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ActivityLog
CREATE TABLE IF NOT EXISTS "ActivityLog" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "action" TEXT NOT NULL,
  "details" TEXT,
  "ipAddress" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_referralCode_idx" ON "User"("referralCode");
CREATE INDEX IF NOT EXISTS "Investment_userId_idx" ON "Investment"("userId");
CREATE INDEX IF NOT EXISTS "Investment_status_idx" ON "Investment"("status");
CREATE INDEX IF NOT EXISTS "Transaction_userId_idx" ON "Transaction"("userId");
CREATE INDEX IF NOT EXISTS "Transaction_type_status_idx" ON "Transaction"("type", "status");
CREATE INDEX IF NOT EXISTS "ActivityLog_userId_idx" ON "ActivityLog"("userId");
CREATE INDEX IF NOT EXISTS "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");
`;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get("key")

  if (key !== "setup-tesla-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Create tables
    await prisma.$executeRawUnsafe(CREATE_TABLES_SQL)

    // Seed admin if not exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@teslainvest.com" },
    })

    if (!existingAdmin) {
      const password = await hash("Admin123!", 12)
      await prisma.user.create({
        data: {
          email: "admin@teslainvest.com",
          name: "Admin",
          password,
          role: "ADMIN",
          balance: 0,
          referralCode: "ADMIN001",
        },
      })
    }

    // Seed plans if none exist
    const planCount = await prisma.investmentPlan.count()
    if (planCount === 0) {
      await prisma.investmentPlan.createMany({
        data: [
          { name: "Starter Plan", description: "5.50% after 24 hours", minAmount: 100, maxAmount: 499, dailyRoiPercent: 5.5, durationDays: 1, capitalReturn: true, isActive: true },
          { name: "Elite Plan", description: "8.90% after 24 hours", minAmount: 500, maxAmount: 999, dailyRoiPercent: 8.9, durationDays: 1, capitalReturn: true, isActive: true },
          { name: "Deluxe Plan", description: "11.50% after 24 hours", minAmount: 1000, maxAmount: 1999, dailyRoiPercent: 11.5, durationDays: 1, capitalReturn: true, isActive: true },
          { name: "Superior Plan", description: "15% after 48 hours", minAmount: 2000, maxAmount: 4999, dailyRoiPercent: 15, durationDays: 2, capitalReturn: true, isActive: true },
          { name: "Ultimate Plan", description: "15.50% after 24 hours", minAmount: 5000, maxAmount: 8999, dailyRoiPercent: 15.5, durationDays: 1, capitalReturn: true, isActive: true },
          { name: "Platinum VIP Plan", description: "15% after 24 hours · Unlimited", minAmount: 9000, maxAmount: null, dailyRoiPercent: 15, durationDays: 1, capitalReturn: true, isActive: true },
        ],
      })
    }

    // Seed site settings
    await prisma.siteSetting.upsert({
      where: { id: "default" },
      update: {},
      create: {
        id: "default",
        siteName: "Tesla Investment",
        supportEmail: "support@teslainvest.com",
        minDeposit: 100,
        minWithdrawal: 50,
        referralPercent: 5,
      },
    })

    const users = await prisma.user.count()
    const plans = await prisma.investmentPlan.count()

    return NextResponse.json({
      success: true,
      message: "Database tables created and seeded successfully",
      stats: {
        users,
        plans,
        adminEmail: "admin@teslainvest.com",
        adminPassword: "Admin123!",
      },
    })
  } catch (error: any) {
    console.error("Setup error:", error)
    return NextResponse.json(
      { error: "Setup failed", details: error.message || String(error) },
      { status: 500 }
    )
  }
}
