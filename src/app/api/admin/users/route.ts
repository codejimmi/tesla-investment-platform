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

    const { userId, action, amount, reason } = await req.json()
    if (!userId || !action) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (action === "credit" || action === "debit") {
      if (!amount || amount <= 0) {
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
      }

      if (action === "debit" && Number(user.balance) < amount) {
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
      }

      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: {
            balance: action === "credit" ? { increment: amount } : { decrement: amount },
          },
        }),
        prisma.transaction.create({
          data: {
            userId,
            type: "ADJUSTMENT",
            status: "COMPLETED",
            amount,
            adminNote: reason || `Admin ${action}`,
            processedBy: session.user.id,
          },
        }),
        prisma.activityLog.create({
          data: {
            userId,
            action: action === "credit" ? "BALANCE_CREDITED" : "BALANCE_DEBITED",
            details: `Admin ${action}ed $${amount}${reason ? `: ${reason}` : ""}`,
          },
        }),
      ])

      return NextResponse.json({ success: true })
    }

    if (action === "activate" || action === "deactivate") {
      if (user.role === "ADMIN") {
        return NextResponse.json({ error: "Cannot change admin status" }, { status: 400 })
      }

      await prisma.user.update({
        where: { id: userId },
        data: { isActive: action === "activate" },
      })

      await prisma.activityLog.create({
        data: {
          userId,
          action: action === "activate" ? "USER_ACTIVATED" : "USER_DEACTIVATED",
          details: `Admin ${action}d account`,
        },
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
