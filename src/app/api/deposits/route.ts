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
    const { amount, currency, txHash, proofUrl } = body

    if (!amount || amount <= 0 || !currency) {
      return NextResponse.json({ error: "Invalid amount or currency" }, { status: 400 })
    }

    const settings = await prisma.siteSetting.findUnique({ where: { id: "default" } })
    const minDeposit = Number(settings?.minDeposit || 50)
    if (amount < minDeposit) {
      return NextResponse.json(
        { error: `Minimum deposit is $${minDeposit}` },
        { status: 400 }
      )
    }

    const tx = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        type: "DEPOSIT",
        status: "PENDING",
        amount,
        currency,
        txHash: txHash || null,
        proofUrl: proofUrl || null,
      },
    })

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "DEPOSIT_REQUESTED",
        details: `Requested deposit of ${amount} ${currency}`,
      },
    })

    return NextResponse.json({ success: true, id: tx.id })
  } catch (error) {
    console.error("Deposit error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const deposits = await prisma.transaction.findMany({
      where: { userId: session.user.id, type: "DEPOSIT" },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(deposits)
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
