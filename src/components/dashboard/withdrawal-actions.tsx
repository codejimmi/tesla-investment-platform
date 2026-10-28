"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function WithdrawalActions({
  withdrawalId,
  userId,
  amount,
}: {
  withdrawalId: string
  userId: string
  amount: number
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handle(action: "approve" | "reject") {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ withdrawalId, action }),
      })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || "Action failed")
      }
    } catch {
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handle("approve")}
        disabled={loading}
        className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 rounded-lg disabled:opacity-50"
        title="Mark as paid and deduct balance"
      >
        Approve
      </button>
      <button
        onClick={() => handle("reject")}
        disabled={loading}
        className="px-3 py-1.5 text-xs bg-red-600/80 hover:bg-red-500 rounded-lg disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  )
}
