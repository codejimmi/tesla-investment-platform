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
    const settings = await prisma.smtpSetting.findUnique({ where: { id: "default" } })
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
    const { host, port, username, password, fromEmail, fromName, secure } = body

    if (!host || !port || !fromEmail) {
      return NextResponse.json({ error: "Host, port and fromEmail required" }, { status: 400 })
    }

    const settings = await prisma.smtpSetting.upsert({
      where: { id: "default" },
      update: { host, port, username, password, fromEmail, fromName, secure },
      create: {
        id: "default",
        host,
        port,
        username: username || "",
        password: password || "",
        fromEmail,
        fromName: fromName || "Tesla Investment",
        secure: secure ?? true,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}
