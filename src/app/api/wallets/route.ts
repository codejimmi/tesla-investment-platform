import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const wallets = await prisma.paymentWallet.findMany({
      where: { isActive: true },
      select: {
        id: true,
        currency: true,
        address: true,
        network: true,
        isActive: true,
      },
    })
    return NextResponse.json(wallets)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to load wallets" }, { status: 500 })
  }
}
