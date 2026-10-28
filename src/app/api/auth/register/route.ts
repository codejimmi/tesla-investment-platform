import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Email and password (min 6 chars) are required" },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const hashed = await hash(password, 12)

    await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: name || null,
        password: hashed,
        role: "USER",
        referralCode: `USER${Date.now().toString(36).toUpperCase()}`,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
