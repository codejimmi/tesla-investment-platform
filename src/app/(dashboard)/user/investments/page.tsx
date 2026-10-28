"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"

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

  if (loading) return <div className="text-zinc-500">Loading investments...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Investments</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">Track your active and completed plans.</p>
      </div>

      {investments.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          You have no investments yet.{" "}
          <Link href="/user/plans" className="text-tesla-red hover:underline">
            Browse plans
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {investments.map((inv) => (
            <div key={inv.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{inv.plan.name}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        inv.status === "ACTIVE"
                          ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                          : inv.status === "COMPLETED"
                          ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-500 mt-1">
                    {Number(inv.plan.dailyRoiPercent).toFixed(2)}% ROI · Started{" "}
                    {new Date(inv.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${Number(inv.amount).toLocaleString()}</div>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400">
                    +${Number(inv.totalEarned).toFixed(2)} earned
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-zinc-500 text-xs">Daily Profit</div>
                  <div className="font-medium">${Number(inv.dailyProfit).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-xs">Expected Total</div>
                  <div className="font-medium">${Number(inv.totalExpected).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-xs">Ends</div>
                  <div className="font-medium">{new Date(inv.endDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-xs">Progress</div>
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
