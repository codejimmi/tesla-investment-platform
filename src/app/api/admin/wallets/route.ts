import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const wallets = await prisma.paymentWallet.findMany()
    return NextResponse.json(wallets)
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currency, address, network, isActive } = await req.json()
    if (!currency || !address) {
      return NextResponse.json({ error: "Currency and address required" }, { status: 400 })
    }

    const wallet = await prisma.paymentWallet.upsert({
      where: { currency },
      update: { address, network, isActive: isActive ?? true },
      create: { currency, address, network, isActive: isActive ?? true },
    })

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "WALLET_UPDATED",
        details: `Updated ${currency} wallet address`,
      },
    })

    return NextResponse.json(wallet)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to save wallet" }, { status: 500 })
  }
}
