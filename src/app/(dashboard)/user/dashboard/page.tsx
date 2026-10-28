import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Layers,
  TrendingUp,
  Wallet,
  Clock,
} from "lucide-react"

export default async function UserDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      investments: { where: { status: "ACTIVE" }, include: { plan: true } },
      transactions: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  })

  const balance = Number(user?.balance || 0)
  const activeInvestments = user?.investments || []
  const totalInvested = activeInvestments.reduce((sum, inv) => sum + Number(inv.amount), 0)
  const totalEarned = activeInvestments.reduce((sum, inv) => sum + Number(inv.totalEarned), 0)
  const pendingWithdrawals = await prisma.transaction.count({
    where: { userId: session.user.id, type: "WITHDRAWAL", status: "PENDING" },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </p>
        </div>
        <Link
          href="/user/deposit"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-tesla-red hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition"
        >
          <ArrowDownToLine size={18} />
          Deposit
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Available Balance</span>
            <Wallet className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
          <div className="text-xs text-zinc-500 mt-1">Ready to invest or withdraw</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Active Investments</span>
            <Layers className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
          <div className="text-xs text-zinc-500 mt-1">{activeInvestments.length} active plan{activeInvestments.length !== 1 ? "s" : ""}</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Total Earned</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            +{formatCurrency(totalEarned)}
          </div>
          <div className="text-xs text-zinc-500 mt-1">From active plans</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Pending Withdrawals</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold">{pendingWithdrawals}</div>
          <div className="text-xs text-zinc-500 mt-1">Awaiting approval</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/user/deposit"
          className="flex items-center gap-3 p-4 bg-tesla-red/10 dark:bg-tesla-red/15 border border-tesla-red/20 rounded-2xl hover:bg-tesla-red/15 transition"
        >
          <div className="w-10 h-10 bg-tesla-red rounded-xl flex items-center justify-center text-white">
            <ArrowDownToLine size={20} />
          </div>
          <div>
            <div className="font-semibold text-sm">Deposit</div>
            <div className="text-xs text-zinc-500">Add funds</div>
          </div>
        </Link>
        <Link
          href="/user/withdraw"
          className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
        >
          <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
            <ArrowUpFromLine size={20} />
          </div>
          <div>
            <div className="font-semibold text-sm">Withdraw</div>
            <div className="text-xs text-zinc-500">Cash out</div>
          </div>
        </Link>
        <Link
          href="/user/plans"
          className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
        >
          <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
            <Layers size={20} />
          </div>
          <div>
            <div className="font-semibold text-sm">Invest</div>
            <div className="text-xs text-zinc-500">View plans</div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Activity</h2>
          <Link href="/user/history" className="text-sm text-tesla-red hover:underline">
            View all
          </Link>
        </div>
        {user?.transactions && user.transactions.length > 0 ? (
          <div className="space-y-3">
            {user.transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                <div>
                  <div className="text-sm font-medium">{tx.type}</div>
                  <div className="text-xs text-zinc-500">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${
                    tx.type === "DEPOSIT" || tx.type === "PROFIT"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-zinc-900 dark:text-white"
                  }`}>
                    {tx.type === "WITHDRAWAL" || tx.type === "INVESTMENT" ? "-" : "+"}
                    {formatCurrency(Number(tx.amount))}
                  </div>
                  <div className={`text-xs ${
                    tx.status === "APPROVED" || tx.status === "COMPLETED"
                      ? "text-emerald-500"
                      : tx.status === "PENDING"
                      ? "text-amber-500"
                      : "text-zinc-500"
                  }`}>
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-500 text-sm">
            No activity yet.{" "}
            <Link href="/user/deposit" className="text-tesla-red hover:underline">
              Make your first deposit
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
