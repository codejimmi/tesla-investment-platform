import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowDownToLine, ArrowUpFromLine, Layers } from "lucide-react"

export default async function UserDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  const balance = Number(user?.balance || 0)

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
          <p className="text-gray-400 mt-1">Your portfolio overview</p>
        </div>
        <Link
          href="/user/deposit"
          className="inline-flex items-center gap-2 px-6 py-3 bg-tesla-red hover:bg-red-700 text-white font-semibold rounded-xl transition shadow-lg shadow-tesla-red/20"
        >
          <ArrowDownToLine size={20} />
          Deposit Funds
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="text-sm text-gray-400">Available Balance</div>
        <div className="text-4xl font-bold mt-1">{formatCurrency(balance)}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/user/deposit"
          className="flex items-center gap-3 p-5 bg-tesla-red/10 border border-tesla-red/30 hover:bg-tesla-red/15 rounded-2xl transition"
        >
          <div className="w-10 h-10 bg-tesla-red rounded-xl flex items-center justify-center">
            <ArrowDownToLine size={20} />
          </div>
          <div>
            <div className="font-semibold">Deposit</div>
            <div className="text-xs text-gray-400">Add funds</div>
          </div>
        </Link>

        <Link
          href="/user/withdraw"
          className="flex items-center gap-3 p-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl transition"
        >
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <ArrowUpFromLine size={20} />
          </div>
          <div>
            <div className="font-semibold">Withdraw</div>
            <div className="text-xs text-gray-400">Cash out</div>
          </div>
        </Link>

        <Link
          href="/user/plans"
          className="flex items-center gap-3 p-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl transition"
        >
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Layers size={20} />
          </div>
          <div>
            <div className="font-semibold">Invest</div>
            <div className="text-xs text-gray-400">View plans</div>
          </div>
        </Link>
      </div>
    </div>
  )
}
