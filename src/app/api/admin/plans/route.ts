import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || (session.user as any).role !== "ADMIN") return null
  return session
}

export async function POST(req: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const { name, description, minAmount, maxAmount, dailyRoiPercent, durationDays, capitalReturn } = body

    if (!name || !minAmount || !dailyRoiPercent || !durationDays) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const plan = await prisma.investmentPlan.create({
      data: {
        name,
        description,
        minAmount,
        maxAmount,
        dailyRoiPercent,
        durationDays,
        capitalReturn: capitalReturn ?? true,
      },
    })

    return NextResponse.json(plan)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    const plan = await prisma.investmentPlan.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        minAmount: data.minAmount,
        maxAmount: data.maxAmount,
        dailyRoiPercent: data.dailyRoiPercent,
        durationDays: data.durationDays,
        capitalReturn: data.capitalReturn,
      },
    })

    return NextResponse.json(plan)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id, isActive } = await req.json()
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    const plan = await prisma.investmentPlan.update({
      where: { id },
      data: { isActive },
    })

    return NextResponse.json(plan)
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
