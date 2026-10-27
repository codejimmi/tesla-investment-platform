import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const password = await hash("Admin123!", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@teslainvest.com" },
    update: {},
    create: {
      email: "admin@teslainvest.com",
      name: "Admin",
      password,
      role: "ADMIN",
      balance: 0,
    },
  })

  console.log("Admin created:", admin.email)

  const plans = [
    {
      name: "Starter",
      description: "Perfect for beginners",
      minAmount: 50,
      maxAmount: 499,
      dailyRoiPercent: 5,
      durationDays: 7,
      capitalReturn: true,
    },
    {
      name: "Growth",
      description: "Most popular plan",
      minAmount: 500,
      maxAmount: 1999,
      dailyRoiPercent: 7,
      durationDays: 14,
      capitalReturn: true,
    },
    {
      name: "Premium",
      description: "Higher returns for serious investors",
      minAmount: 2000,
      maxAmount: 9999,
      dailyRoiPercent: 10,
      durationDays: 30,
      capitalReturn: true,
    },
    {
      name: "Tesla VIP",
      description: "Exclusive high-capital plan",
      minAmount: 10000,
      maxAmount: null,
      dailyRoiPercent: 12,
      durationDays: 45,
      capitalReturn: true,
    },
  ]

  for (const p of plans) {
    await prisma.investmentPlan.create({ data: p as any })
  }

  await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteName: "Tesla Investment",
      supportEmail: "support@teslainvest.com",
      minDeposit: 50,
      minWithdrawal: 20,
      referralPercent: 5,
    },
  })

  console.log("Seed completed")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
