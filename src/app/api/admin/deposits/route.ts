import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail, depositApprovedHtml } from "@/lib/mail"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { depositId, action } = await req.json()
    if (!depositId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const deposit = await prisma.transaction.findUnique({
      where: { id: depositId },
      include: { user: true },
    })

    if (!deposit || deposit.type !== "DEPOSIT" || deposit.status !== "PENDING") {
      return NextResponse.json({ error: "Deposit not found or already processed" }, { status: 400 })
    }

    if (action === "approve") {
      await prisma.$transaction([
        prisma.transaction.update({
          where: { id: depositId },
          data: { status: "APPROVED", processedBy: session.user.id },
        }),
        prisma.user.update({
          where: { id: deposit.userId },
          data: { balance: { increment: deposit.amount } },
        }),
        prisma.activityLog.create({
          data: {
            userId: deposit.userId,
            action: "DEPOSIT_APPROVED",
            details: `Admin approved deposit of $${deposit.amount}`,
          },
        }),
      ])

      sendEmail({
        to: deposit.user.email,
        subject: "Deposit Approved - Tesla Investment",
        html: depositApprovedHtml(String(deposit.amount), deposit.currency || "USD"),
      }).catch(console.error)
    } else {
      await prisma.$transaction([
        prisma.transaction.update({
          where: { id: depositId },
          data: { status: "REJECTED", processedBy: session.user.id },
        }),
        prisma.activityLog.create({
          data: {
            userId: deposit.userId,
            action: "DEPOSIT_REJECTED",
            details: `Admin rejected deposit of $${deposit.amount}`,
          },
        }),
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin deposit action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
