import nodemailer from "nodemailer"
import { prisma } from "./prisma"

export async function getTransporter() {
  const settings = await prisma.smtpSetting.findUnique({
    where: { id: "default" },
  })

  if (!settings) {
    throw new Error("SMTP settings not configured")
  }

  return nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    auth: {
      user: settings.username,
      pass: settings.password,
    },
  })
}

export async function sendMail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html?: string
  text?: string
}) {
  try {
    const settings = await prisma.smtpSetting.findUnique({
      where: { id: "default" },
    })

    if (!settings) {
      console.warn("SMTP not configured, skipping email")
      return false
    }

    const transporter = await getTransporter()

    await transporter.sendMail({
      from: `"${settings.fromName}" <${settings.fromEmail}>`,
      to,
      subject,
      html,
      text,
    })

    return true
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}

// Alias used by admin routes
export const sendEmail = sendMail

export function depositApprovedHtml(amount: string, currency: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #cc0000;">Deposit Approved</h2>
      <p>Your deposit of <strong>${amount} ${currency}</strong> has been approved and credited to your Tesla Investment account.</p>
      <p>You can now use these funds to invest in available plans.</p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">Tesla Investment Platform</p>
    </div>
  `
}
