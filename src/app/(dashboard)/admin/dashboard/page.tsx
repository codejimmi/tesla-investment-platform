"use client"

import { useEffect, useState } from "react"
import { Users, ArrowDownToLine, ArrowUpFromLine, Layers, DollarSign } from "lucide-react"
import Link from "next/link"

type Stats = {
  users: number
  pendingDeposits: number
  pendingWithdrawals: number
  activeInvestments: number
  totalDeposited: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-zinc-500">Loading...</div>

  const cards = [
    { label: "Total Users", value: stats?.users ?? 0, icon: Users, href: "/admin/users" },
    { label: "Pending Deposits", value: stats?.pendingDeposits ?? 0, icon: ArrowDownToLine, href: "/admin/deposits" },
    { label: "Pending Withdrawals", value: stats?.pendingWithdrawals ?? 0, icon: ArrowUpFromLine, href: "/admin/withdrawals" },
    { label: "Active Investments", value: stats?.activeInvestments ?? 0, icon: Layers, href: "/admin/plans" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">Platform activity at a glance.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition"
          >
            <div className="flex items-center justify-between mb-3">
              <c.icon className="w-5 h-5 text-tesla-red" />
            </div>
            <div className="text-3xl font-bold">{c.value}</div>
            <div className="text-sm text-zinc-500 mt-1">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-emerald-500" />
          <h2 className="font-semibold">Total Deposited (Approved)</h2>
        </div>
        <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
          ${Number(stats?.totalDeposited ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  )
}
