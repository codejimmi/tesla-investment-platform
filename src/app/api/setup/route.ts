import { NextResponse } from "next/server"
import { execSync } from "child_process"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get("key")

  // Simple protection - change this secret after first use
  if (key !== "setup-tesla-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Push schema
    execSync("npx prisma db push --accept-data-loss", {
      stdio: "pipe",
      env: { ...process.env },
    })

    // Check if already seeded
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@teslainvest.com" },
    })

    if (!existingAdmin) {
      // Run seed
      execSync("npx tsx prisma/seed.ts", {
        stdio: "pipe",
        env: { ...process.env },
      })
    }

    const plans = await prisma.investmentPlan.count()
    const users = await prisma.user.count()

    return NextResponse.json({
      success: true,
      message: "Database schema pushed and seeded successfully",
      stats: {
        users,
        plans,
        adminEmail: "admin@teslainvest.com",
        adminPassword: "Admin123!",
      },
    })
  } catch (error: any) {
    console.error("Setup error:", error)
    return NextResponse.json(
      {
        error: "Setup failed",
        details: error.message || String(error),
        stderr: error.stderr?.toString?.() || null,
      },
      { status: 500 }
    )
  }
}
