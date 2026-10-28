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
      return { skipped: true }
    }

    const transporter = await getTransporter()

    const info = await transporter.sendMail({
      from: `"${settings.fromName}" <${settings.fromEmail}>`,
      to,
      subject,
      html,
      text,
    })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Failed to send email:", error)
    return { success: false, error }
  }
}
