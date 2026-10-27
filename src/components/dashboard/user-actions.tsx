"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function UserActions({
  userId,
  currentBalance,
  isActive,
  isAdmin,
}: {
  userId: string
  currentBalance: number
  isActive: boolean
  isAdmin: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  async function adjust(type: "credit" | "debit") {
    if (!amount || parseFloat(amount) <= 0) return
    setLoading(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: type,
          amount: parseFloat(amount),
          reason: reason || undefined,
        }),
      })
      if (res.ok) {
        setOpen(false)
        setAmount("")
        setReason("")
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || "Failed")
      }
    } catch {
      alert("Error")
    } finally {
      setLoading(false)
    }
  }

  async function toggleActive() {
    if (isAdmin) {
      alert("Cannot disable an admin account")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: isActive ? "deactivate" : "activate",
        }),
      })
      if (res.ok) router.refresh()
      else {
        const data = await res.json()
        alert(data.error || "Failed")
      }
    } catch {
      alert("Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setOpen(true)}
        className="px-2.5 py-1 text-xs bg-white/10 hover:bg-white/15 rounded-lg"
      >
        Adjust
      </button>
      <button
        onClick={toggleActive}
        disabled={loading || isAdmin}
        className={`px-2.5 py-1 text-xs rounded-lg disabled:opacity-40 ${
          isActive ? "bg-red-600/70 hover:bg-red-500" : "bg-emerald-600/70 hover:bg-emerald-500"
        }`}
      >
        {isActive ? "Disable" : "Enable"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-semibold">Adjust Balance</h3>
            <p className="text-sm text-gray-400">Current: ${currentBalance.toFixed(2)}</p>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-tesla-red"
            />
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason (optional)"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-tesla-red"
            />
            <div className="flex gap-2">
              <button
                onClick={() => adjust("credit")}
                disabled={loading}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm disabled:opacity-50"
              >
                Credit
              </button>
              <button
                onClick={() => adjust("debit")}
                disabled={loading}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm disabled:opacity-50"
              >
                Debit
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-white/10 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
