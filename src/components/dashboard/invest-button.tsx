"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function InvestButton({
  planId,
  planName,
  minAmount,
  maxAmount,
  balance,
}: {
  planId: string
  planName: string
  minAmount: number
  maxAmount?: number
  balance: number
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(String(minAmount))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleInvest() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, amount: parseFloat(amount) }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Investment failed")
      } else {
        setOpen(false)
        router.refresh()
        router.push("/user/investments")
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 bg-tesla-red hover:bg-red-700 rounded-lg font-medium transition"
      >
        Invest Now
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Invest in {planName}</h3>
            <p className="text-sm text-gray-400">
              Available balance: ${balance.toFixed(2)}
            </p>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-1">Amount (USD)</label>
              <input
                type="number"
                min={minAmount}
                max={maxAmount || balance}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-tesla-red"
              />
              <div className="text-xs text-gray-500 mt-1">
                Min: ${minAmount}
                {maxAmount ? ` · Max: $${maxAmount}` : ""}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleInvest}
                disabled={loading}
                className="flex-1 py-2.5 rounded-lg bg-tesla-red hover:bg-red-700 disabled:opacity-50 transition font-medium"
              >
                {loading ? "Processing..." : "Confirm Invest"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
