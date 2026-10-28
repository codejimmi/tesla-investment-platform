"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

type Investment = {
  id: string
  amount: number
  dailyProfit: number
  totalExpected: number
  totalEarned: number
  status: string
  startDate: string
  endDate: string
  plan: { name: string; dailyRoiPercent: number }
}

export default function InvestmentsPage() {
  const { data: session } = useSession()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) return
    fetch("/api/investments")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setInvestments(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [session])

  if (loading) return <div className="text-gray-400">Loading investments...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">My Investments</h1>
        <p className="text-gray-400 mt-1">Track your active and completed plans.</p>
      </div>

      {investments.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          You have no investments yet.{" "}
          <a href="/user/plans" className="text-tesla-red hover:underline">
            Browse plans
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {investments.map((inv) => (
            <div key={inv.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{inv.plan.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        inv.status === "ACTIVE"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : inv.status === "COMPLETED"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {Number(inv.plan.dailyRoiPercent).toFixed(2)}% ROI · Started{" "}
                    {new Date(inv.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${Number(inv.amount).toLocaleString()}</div>
                  <div className="text-sm text-emerald-400">
                    +${Number(inv.totalEarned).toFixed(2)} earned
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Daily Profit</div>
                  <div className="font-medium">${Number(inv.dailyProfit).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Expected Total</div>
                  <div className="font-medium">${Number(inv.totalExpected).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Ends</div>
                  <div className="font-medium">{new Date(inv.endDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-gray-500">Progress</div>
                  <div className="font-medium">
                    {Math.min(
                      100,
                      Math.round(
                        ((new Date().getTime() - new Date(inv.startDate).getTime()) /
                          (new Date(inv.endDate).getTime() - new Date(inv.startDate).getTime())) *
                          100
                      )
                    )}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
