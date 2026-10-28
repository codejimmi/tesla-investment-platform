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
      <div>
        <h1 className="text-2xl font-bold">Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
        <p className="text-gray-400 mt-1">Your portfolio overview</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="text-sm text-gray-400">Available Balance</div>
        <div className="text-3xl font-bold mt-1">{formatCurrency(balance)}</div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/user/deposit"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-tesla-red hover:bg-red-700 rounded-lg font-medium transition"
        >
          <ArrowDownToLine size={18} /> Deposit
        </Link>
        <Link
          href="/user/withdraw"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg font-medium transition"
        >
          <ArrowUpFromLine size={18} /> Withdraw
        </Link>
        <Link
          href="/user/plans"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg font-medium transition"
        >
          <Layers size={18} /> Invest
        </Link>
      </div>
    </div>
  )
}
