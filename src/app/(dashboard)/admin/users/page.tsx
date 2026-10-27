import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { UserActions } from "@/components/dashboard/user-actions"

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() || ""

  const users = await prisma.user.findMany({
    where: query
      ? {
          OR: [
            { email: { contains: query, mode: "insensitive" } },
            { name: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      _count: { select: { investments: true, transactions: true } },
    },
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-400 mt-1">Search, view balances, adjust funds, activate/deactivate</p>
        </div>
        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search email or name..."
            className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-tesla-red w-64"
          />
          <button type="submit" className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm">
            Search
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-white/10">
              <th className="pb-3 font-medium">User</th>
              <th className="pb-3 font-medium">Balance</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Investments</th>
              <th className="pb-3 font-medium">Joined</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/5">
                <td className="py-4">
                  <div className="font-medium">{u.name || "—"}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </td>
                <td className="py-4 font-medium text-emerald-400">
                  {formatCurrency(Number(u.balance))}
                </td>
                <td className="py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    u.role === "ADMIN" ? "bg-tesla-red/20 text-tesla-red" : "bg-white/10 text-gray-300"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    u.isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                  }`}>
                    {u.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="py-4 text-gray-400">{u._count.investments}</td>
                <td className="py-4 text-gray-400 text-xs">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4">
                  <UserActions
                    userId={u.id}
                    currentBalance={Number(u.balance)}
                    isActive={u.isActive}
                    isAdmin={u.role === "ADMIN"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-center text-gray-500 py-12">No users found</p>
        )}
      </div>
    </div>
  )
}
