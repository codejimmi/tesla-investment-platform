import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Vercel Cron: runs daily to credit profits to active investments.
 * Protect with CRON_SECRET header.
 */
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()

    const activeInvestments = await prisma.investment.findMany({
      where: {
        status: "ACTIVE",
        endDate: { gt: now },
      },
      include: {
        user: true,
        plan: true,
      },
    })

    let processed = 0
    let completed = 0
    let totalProfitCredited = 0

    for (const inv of activeInvestments) {
      if (inv.lastProfitAt) {
        const last = new Date(inv.lastProfitAt)
        const sameDay =
          last.getUTCFullYear() === now.getUTCFullYear() &&
          last.getUTCMonth() === now.getUTCMonth() &&
          last.getUTCDate() === now.getUTCDate()
        if (sameDay) continue
      }

      const dailyProfit = Number(inv.dailyProfit)

      await prisma.$transaction([
        prisma.user.update({
          where: { id: inv.userId },
          data: { balance: { increment: dailyProfit } },
        }),
        prisma.investment.update({
          where: { id: inv.id },
          data: {
            totalEarned: { increment: dailyProfit },
            lastProfitAt: now,
          },
        }),
        prisma.transaction.create({
          data: {
            userId: inv.userId,
            type: "PROFIT",
            status: "COMPLETED",
            amount: dailyProfit,
            adminNote: `Daily profit from ${inv.plan.name}`,
          },
        }),
        prisma.activityLog.create({
          data: {
            userId: inv.userId,
            action: "PROFIT_CREDITED",
            details: `Daily profit $${dailyProfit.toFixed(2)} from ${inv.plan.name}`,
          },
        }),
      ])

      processed++
      totalProfitCredited += dailyProfit
    }

    const matured = await prisma.investment.findMany({
      where: {
        status: "ACTIVE",
        endDate: { lte: now },
      },
      include: { plan: true },
    })

    for (const inv of matured) {
      const capital = Number(inv.amount)
      const ops: any[] = [
        prisma.investment.update({
          where: { id: inv.id },
          data: { status: "COMPLETED" },
        }),
        prisma.activityLog.create({
          data: {
            userId: inv.userId,
            action: "INVESTMENT_COMPLETED",
            details: `Plan ${inv.plan.name} matured`,
          },
        }),
      ]

      if (inv.plan.capitalReturn) {
        ops.push(
          prisma.user.update({
            where: { id: inv.userId },
            data: { balance: { increment: capital } },
          }),
          prisma.transaction.create({
            data: {
              userId: inv.userId,
              type: "ADJUSTMENT",
              status: "COMPLETED",
              amount: capital,
              adminNote: `Capital return from ${inv.plan.name}`,
            },
          })
        )
      }

      await prisma.$transaction(ops)
      completed++
    }

    return NextResponse.json({
      success: true,
      processed,
      completed,
      totalProfitCredited: Number(totalProfitCredited.toFixed(2)),
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error("Daily profits cron error:", error)
    return NextResponse.json({ error: "Cron failed" }, { status: 500 })
  }
}
