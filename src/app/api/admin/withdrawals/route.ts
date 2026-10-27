import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { withdrawalId, action } = await req.json()
    if (!withdrawalId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const withdrawal = await prisma.transaction.findUnique({
      where: { id: withdrawalId },
      include: { user: true },
    })

    if (!withdrawal || withdrawal.type !== "WITHDRAWAL" || withdrawal.status !== "PENDING") {
      return NextResponse.json({ error: "Withdrawal not found or already processed" }, { status: 400 })
    }

    if (action === "approve") {
      const balance = Number(withdrawal.user.balance)
      const amount = Number(withdrawal.amount)

      if (balance < amount) {
        return NextResponse.json({ error: "User has insufficient balance" }, { status: 400 })
      }

      await prisma.$transaction([
        prisma.transaction.update({
          where: { id: withdrawalId },
          data: { status: "APPROVED", processedBy: session.user.id },
        }),
        prisma.user.update({
          where: { id: withdrawal.userId },
          data: { balance: { decrement: amount } },
        }),
        prisma.activityLog.create({
          data: {
            userId: withdrawal.userId,
            action: "WITHDRAWAL_APPROVED",
            details: `Admin approved withdrawal of $${amount}`,
          },
        }),
      ])
    } else {
      await prisma.$transaction([
        prisma.transaction.update({
          where: { id: withdrawalId },
          data: { status: "REJECTED", processedBy: session.user.id },
        }),
        prisma.activityLog.create({
          data: {
            userId: withdrawal.userId,
            action: "WITHDRAWAL_REJECTED",
            details: `Admin rejected withdrawal of $${withdrawal.amount}`,
          },
        }),
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin withdrawal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
