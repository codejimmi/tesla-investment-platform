"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

const METHODS = [
  { value: "BTC", label: "Bitcoin (BTC)" },
  { value: "ETH", label: "Ethereum (ETH)" },
  { value: "USDT_ERC20", label: "USDT (ERC-20)" },
  { value: "USDT_TRC20", label: "USDT (TRC-20)" },
]

export default function WithdrawPage() {
  const { data: session } = useSession()
  const [currency, setCurrency] = useState("USDT_ERC20")
  const [amount, setAmount] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session) return
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
          walletAddress,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Withdrawal failed" })
      } else {
        setMessage({
          type: "success",
          text: "Withdrawal request submitted. It will be processed after admin review.",
        })
        setAmount("")
        setWalletAddress("")
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Withdraw Funds</h1>
        <p className="text-gray-400 mt-1">
          Request a withdrawal to your personal wallet. Processing is manual and usually completed within 24 hours.
        </p>
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
          <label className="block text-sm text-gray-400 mb-1.5">Withdrawal Method</label>
          <div className="flex flex-wrap gap-2">
            {METHODS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setCurrency(m.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  currency === m.value
                    ? "bg-tesla-red text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/15"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Amount (USD)</label>
          <input
            type="number"
            step="0.01"
            min="1"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-tesla-red"
            placeholder="50.00"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Your Wallet Address</label>
          <input
            type="text"
            required
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-tesla-red font-mono text-sm"
            placeholder="Enter your receiving address"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            Make sure the address matches the selected network. Incorrect addresses can result in permanent loss of funds.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-tesla-red hover:bg-red-700 disabled:opacity-50 font-semibold py-3 rounded-lg transition"
        >
          {loading ? "Submitting..." : "Request Withdrawal"}
        </button>
      </form>
    </div>
  )
}
