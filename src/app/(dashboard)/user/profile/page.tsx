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
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-gray-400 mt-1">Manage your account details.</p>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Email</label>
          <input
            type="email"
            disabled
            value={session?.user?.email || ""}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-tesla-red"
            placeholder="Your name"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-tesla-red hover:bg-red-700 disabled:opacity-50 font-semibold py-3 rounded-lg transition"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold mb-2">Referral Code</h3>
        <p className="text-sm text-gray-400 mb-3">Share this code to earn referral commissions.</p>
        <div className="bg-black/40 rounded-lg px-4 py-3 font-mono text-sm">
          {(session?.user as any)?.referralCode || "—"}
        </div>
      </div>
    </div>
  )
}
