import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { DepositActions } from "@/components/dashboard/deposit-actions"

export default async function AdminDepositsPage() {
  const deposits = await prisma.transaction.findMany({
    where: { type: "DEPOSIT" },
    include: { user: { select: { id: true, email: true, name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Deposit Management</h1>
        <p className="text-gray-400 mt-1">Approve or reject user deposit requests</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="pb-3 font-medium">User</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Method</th>
              <th className="pb-3 font-medium">Tx Hash / Proof</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {deposits.map((d) => (
              <tr key={d.id} className="hover:bg-white/5">
                <td className="py-4">
                  <div className="font-medium">{d.user.name || "—"}</div>
                  <div className="text-xs text-gray-500">{d.user.email}</div>
                </td>
                <td className="py-4 font-medium">{formatCurrency(Number(d.amount))}</td>
                <td className="py-4">{d.currency?.replace("_", " ") || "—"}</td>
                <td className="py-4 text-xs font-mono max-w-[160px] truncate">
                  {d.txHash || d.proofUrl || "—"}
                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      d.status === "APPROVED" || d.status === "COMPLETED"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : d.status === "PENDING"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="py-4 text-gray-400 text-xs">
                  {new Date(d.createdAt).toLocaleString()}
                </td>
                <td className="py-4">
                  {d.status === "PENDING" && (
                    <DepositActions depositId={d.id} userId={d.userId} amount={Number(d.amount)} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {deposits.length === 0 && (
          <p className="text-center text-gray-500 py-12">No deposits yet</p>
        )}
      </div>
    </div>
  )
}
