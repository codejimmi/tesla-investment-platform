import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { WithdrawalActions } from "@/components/dashboard/withdrawal-actions"

export default async function AdminWithdrawalsPage() {
  const withdrawals = await prisma.transaction.findMany({
    where: { type: "WITHDRAWAL" },
    include: { user: { select: { id: true, email: true, name: true, balance: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Withdrawal Management</h1>
        <p className="text-gray-400 mt-1">
          Approve (deducts balance & marks paid) or reject requests
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="pb-3 font-medium">User</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Method</th>
              <th className="pb-3 font-medium">Wallet Address</th>
              <th className="pb-3 font-medium">User Balance</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {withdrawals.map((w) => (
              <tr key={w.id} className="hover:bg-white/5">
                <td className="py-4">
                  <div className="font-medium">{w.user.name || "—"}</div>
                  <div className="text-xs text-gray-500">{w.user.email}</div>
                </td>
                <td className="py-4 font-medium">{formatCurrency(Number(w.amount))}</td>
                <td className="py-4">{w.currency?.replace("_", " ") || "—"}</td>
                <td className="py-4 font-mono text-xs max-w-[180px] truncate">
                  {w.walletAddress || "—"}
                </td>
                <td className="py-4 text-gray-400">
                  {formatCurrency(Number(w.user.balance))}
                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      w.status === "APPROVED" || w.status === "COMPLETED"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : w.status === "PENDING"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {w.status}
                  </span>
                </td>
                <td className="py-4 text-gray-400 text-xs">
                  {new Date(w.createdAt).toLocaleString()}
                </td>
                <td className="py-4">
                  {w.status === "PENDING" && (
                    <WithdrawalActions
                      withdrawalId={w.id}
                      userId={w.userId}
                      amount={Number(w.amount)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {withdrawals.length === 0 && (
          <p className="text-center text-gray-500 py-12">No withdrawals yet</p>
        )}
      </div>
    </div>
  )
}
