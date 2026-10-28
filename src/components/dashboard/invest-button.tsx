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
        className="w-full py-3 bg-tesla-red hover:bg-red-700 text-white rounded-xl font-medium transition"
      >
        Invest Now
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h3 className="text-lg font-semibold">Invest in {planName}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Available balance: ${balance.toFixed(2)}
            </p>

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-3 py-2 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-zinc-500 dark:text-zinc-400 mb-1.5">Amount (USD)</label>
              <input
                type="number"
                min={minAmount}
                max={maxAmount || balance}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-tesla-red"
              />
              <div className="text-xs text-zinc-500 mt-1.5">
                Min: ${minAmount}
                {maxAmount ? ` · Max: $${maxAmount}` : ""}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleInvest}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-tesla-red hover:bg-red-700 disabled:opacity-50 text-white transition font-medium"
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
