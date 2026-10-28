import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const { type } = await searchParams
  const filter = type === "deposit" || type === "withdrawal" ? type : "all"

  const where: any = { userId: session.user.id }
  if (filter === "deposit") where.type = "DEPOSIT"
  if (filter === "withdrawal") where.type = "WITHDRAWAL"

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
  })

  const deposits = transactions.filter((t) => t.type === "DEPOSIT")
  const withdrawals = transactions.filter((t) => t.type === "WITHDRAWAL")

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transaction History</h1>
          <p className="text-gray-400 mt-1">View all your deposits and withdrawals</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/user/history"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "all"
                ? "bg-tesla-red text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/15"
            }`}
          >
            All
          </Link>
          <Link
            href="/user/history?type=deposit"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "deposit"
                ? "bg-tesla-red text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/15"
            }`}
          >
            Deposits ({deposits.length})
          </Link>
          <Link
            href="/user/history?type=withdrawal"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "withdrawal"
                ? "bg-tesla-red text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/15"
            }`}
          >
            Withdrawals ({withdrawals.length})
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Method</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Details</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-white/5">
                <td className="py-4">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tx.type === "DEPOSIT"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : tx.type === "WITHDRAWAL"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {tx.type}
                  </span>
                </td>
                <td className="py-4 font-medium">
                  {formatCurrency(Number(tx.amount))}
                </td>
                <td className="py-4 text-gray-300">
                  {tx.currency?.replace("_", " ") || "—"}
                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tx.status === "APPROVED" || tx.status === "COMPLETED"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : tx.status === "PENDING"
                        ? "bg-amber-500/15 text-amber-400"
                        : tx.status === "REJECTED"
                        ? "bg-red-500/15 text-red-400"
                        : "bg-white/10 text-gray-400"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="py-4 text-xs font-mono text-gray-400 max-w-[200px] truncate">
                  {tx.type === "DEPOSIT"
                    ? tx.txHash || tx.proofUrl || "—"
                    : tx.walletAddress || "—"}
                </td>
                <td className="py-4 text-gray-400 text-xs whitespace-nowrap">
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {transactions.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">
              No {filter === "all" ? "transactions" : filter + "s"} found yet.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Link
                href="/user/deposit"
                className="px-4 py-2 bg-tesla-red hover:bg-red-700 rounded-lg text-sm font-medium"
              >
                Make a Deposit
              </Link>
              <Link
                href="/user/withdraw"
                className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium"
              >
                Request Withdrawal
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
