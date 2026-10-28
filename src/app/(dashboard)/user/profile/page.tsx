"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name)
  }, [session])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to update" })
      } else {
        setMessage({ type: "success", text: "Profile updated" })
        await update()
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">Manage your account details.</p>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-xl text-sm ${
            message.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
              : "bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm text-zinc-500 mb-1.5">Email</label>
          <input
            type="email"
            disabled
            value={session?.user?.email || ""}
            className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-500"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-500 mb-1.5">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-tesla-red"
            placeholder="Your name"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-tesla-red hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
        <h3 className="font-semibold mb-2">Referral Code</h3>
        <p className="text-sm text-zinc-500 mb-3">Share this code to earn referral commissions.</p>
        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-3 font-mono text-sm">
          {(session?.user as any)?.referralCode || "—"}
        </div>
      </div>
    </div>
  )
}
