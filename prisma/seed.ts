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

  console.log("Admin ready:", admin.email)

  // Clear existing plans so we can seed the exact client plans
  await prisma.investment.deleteMany({})
  await prisma.investmentPlan.deleteMany({})

  const plans = [
    {
      name: "Starter Plan",
      description: "5.50% after 24 hours",
      minAmount: 100,
      maxAmount: 499,
      dailyRoiPercent: 5.5,
      durationDays: 1,
      capitalReturn: true,
      isActive: true,
    },
    {
      name: "Elite Plan",
      description: "8.90% after 24 hours",
      minAmount: 500,
      maxAmount: 999,
      dailyRoiPercent: 8.9,
      durationDays: 1,
      capitalReturn: true,
      isActive: true,
    },
    {
      name: "Deluxe Plan",
      description: "11.50% after 24 hours",
      minAmount: 1000,
      maxAmount: 1999,
      dailyRoiPercent: 11.5,
      durationDays: 1,
      capitalReturn: true,
      isActive: true,
    },
    {
      name: "Superior Plan",
      description: "15% after 48 hours",
      minAmount: 2000,
      maxAmount: 4999,
      dailyRoiPercent: 15,
      durationDays: 2,
      capitalReturn: true,
      isActive: true,
    },
    {
      name: "Ultimate Plan",
      description: "15.50% after 24 hours",
      minAmount: 5000,
      maxAmount: 8999,
      dailyRoiPercent: 15.5,
      durationDays: 1,
      capitalReturn: true,
      isActive: true,
    },
    {
      name: "Platinum VIP Plan",
      description: "15% after 24 hours · Unlimited",
      minAmount: 9000,
      maxAmount: null,
      dailyRoiPercent: 15,
      durationDays: 1,
      capitalReturn: true,
      isActive: true,
    },
  ]

  for (const p of plans) {
    await prisma.investmentPlan.create({ data: p as any })
    console.log("Plan created:", p.name)
  }

  await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {
      minDeposit: 100,
      minWithdrawal: 50,
    },
    create: {
      id: "default",
      siteName: "Tesla Investment",
      supportEmail: "support@teslainvest.com",
      minDeposit: 100,
      minWithdrawal: 50,
      referralPercent: 5,
    },
  })

  console.log("Seed completed successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
