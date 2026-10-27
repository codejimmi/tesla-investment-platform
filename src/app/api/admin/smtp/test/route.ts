import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sendEmail } from "@/lib/mail"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ok = await sendEmail({
      to: session.user.email!,
      subject: "Tesla Investment - SMTP Test",
      html: `<p>This is a test email from your Tesla Investment platform SMTP configuration.</p><p>If you received this, SMTP is working correctly.</p>`,
    })

    if (ok) return NextResponse.json({ success: true })
    return NextResponse.json({ error: "Failed to send. Check SMTP settings." }, { status: 500 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Test failed" }, { status: 500 })
  }
}
