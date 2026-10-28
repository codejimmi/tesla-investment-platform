import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [users, pendingDeposits, pendingWithdrawals, activeInvestments, deposits] = await Promise.all([
    prisma.user.count(),
    prisma.transaction.count({ where: { type: "DEPOSIT", status: "PENDING" } }),
    prisma.transaction.count({ where: { type: "WITHDRAWAL", status: "PENDING" } }),
    prisma.investment.count({ where: { status: "ACTIVE" } }),
    prisma.transaction.aggregate({
      where: { type: "DEPOSIT", status: "APPROVED" },
      _sum: { amount: true },
    }),
  ])

  return NextResponse.json({
    users,
    pendingDeposits,
    pendingWithdrawals,
    activeInvestments,
    totalDeposited: Number(deposits._sum.amount ?? 0),
  })
}
