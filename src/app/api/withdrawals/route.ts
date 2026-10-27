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

    const body = await req.json()
    const { amount, currency, walletAddress } = body

    if (!amount || amount <= 0 || !currency || !walletAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const balance = Number(user.balance)
    if (amount > balance) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    const settings = await prisma.siteSetting.findUnique({ where: { id: "default" } })
    const minWithdrawal = Number(settings?.minWithdrawal || 20)
    if (amount < minWithdrawal) {
      return NextResponse.json(
        { error: `Minimum withdrawal is $${minWithdrawal}` },
        { status: 400 }
      )
    }

    const tx = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: "WITHDRAWAL",
        status: "PENDING",
        amount,
        currency,
        walletAddress,
      },
    })

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "WITHDRAWAL_REQUESTED",
        details: `Requested withdrawal of ${amount} ${currency} to ${walletAddress}`,
      },
    })

    return NextResponse.json({ success: true, id: tx.id })
  } catch (error) {
    console.error("Withdrawal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
