"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { InvestButton } from "@/components/dashboard/invest-button"

type Plan = {
  id: string
  name: string
  description: string | null
  minAmount: number
  maxAmount: number | null
  dailyRoiPercent: number
  durationDays: number
  capitalReturn: boolean
  isActive: boolean
}

export default function PlansPage() {
  const { data: session } = useSession()
  const [plans, setPlans] = useState<Plan[]>([])
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/plans").then((r) => r.json()),
      fetch("/api/user/balance").then((r) => r.json()),
    ])
      .then(([plansData, balanceData]) => {
        if (Array.isArray(plansData)) setPlans(plansData.filter((p: Plan) => p.isActive))
        if (typeof balanceData.balance === "number") setBalance(balanceData.balance)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-zinc-500">Loading plans...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Investment Plans</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">
          Choose a plan and start earning. Capital is returned at maturity.
        </p>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">No active plans available.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition"
            >
              <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-tesla-red mb-1">
                {Number(plan.dailyRoiPercent).toFixed(2)}%
              </div>
              <div className="text-sm text-zinc-500 mb-4">
                After {plan.durationDays} day{plan.durationDays > 1 ? "s" : ""}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                Min: <span className="font-medium text-zinc-900 dark:text-white">${Number(plan.minAmount).toLocaleString()}</span>
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Max:{" "}
                <span className="font-medium text-zinc-900 dark:text-white">
                  {plan.maxAmount ? `$${Number(plan.maxAmount).toLocaleString()}` : "Unlimited"}
                </span>
              </div>
              {plan.description && (
                <p className="text-xs text-zinc-500 mb-5">{plan.description}</p>
              )}
              <InvestButton
                planId={plan.id}
                planName={plan.name}
                minAmount={Number(plan.minAmount)}
                maxAmount={plan.maxAmount ? Number(plan.maxAmount) : undefined}
                balance={balance}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
