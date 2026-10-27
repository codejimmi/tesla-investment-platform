import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { planId, amount } = await req.json()
    if (!planId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    const [user, plan] = await Promise.all([
      prisma.user.findUnique({ where: { id: session.user.id } }),
      prisma.investmentPlan.findUnique({ where: { id: planId } }),
    ])

    if (!user || !plan || !plan.isActive) {
      return NextResponse.json({ error: "Invalid plan or user" }, { status: 400 })
    }

    const bal = Number(user.balance)
    if (amount > bal) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }
    if (amount < Number(plan.minAmount)) {
      return NextResponse.json(
        { error: `Minimum investment is $${plan.minAmount}` },
        { status: 400 }
      )
    }
    if (plan.maxAmount && amount > Number(plan.maxAmount)) {
      return NextResponse.json(
        { error: `Maximum investment is $${plan.maxAmount}` },
        { status: 400 }
      )
    }

    const dailyProfit = (amount * Number(plan.dailyRoiPercent)) / 100
    const totalExpected = dailyProfit * plan.durationDays
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + plan.durationDays)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { balance: { decrement: amount } },
      }),
      prisma.investment.create({
        data: {
          userId: user.id,
          planId: plan.id,
          amount,
          dailyProfit,
          totalExpected,
          endDate,
          status: "ACTIVE",
        },
      }),
      prisma.transaction.create({
        data: {
          userId: user.id,
          type: "INVESTMENT",
          status: "COMPLETED",
          amount,
        },
      }),
      prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "INVESTMENT_CREATED",
          details: `Invested $${amount} in ${plan.name}`,
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Invest error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const investments = await prisma.investment.findMany({
      where: { userId: session.user.id },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(investments)
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
