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
    const settings = await prisma.siteSetting.findUnique({ where: { id: "default" } })
    return NextResponse.json(settings || {})
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

    const body = await req.json()

    const settings = await prisma.siteSetting.upsert({
      where: { id: "default" },
      update: {
        siteName: body.siteName,
        supportEmail: body.supportEmail,
        minDeposit: body.minDeposit,
        minWithdrawal: body.minWithdrawal,
        referralPercent: body.referralPercent,
        maintenanceMode: body.maintenanceMode,
      },
      create: {
        id: "default",
        siteName: body.siteName || "Tesla Investment",
        supportEmail: body.supportEmail || "",
        minDeposit: body.minDeposit || 50,
        minWithdrawal: body.minWithdrawal || 20,
        referralPercent: body.referralPercent || 5,
        maintenanceMode: body.maintenanceMode || false,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}
