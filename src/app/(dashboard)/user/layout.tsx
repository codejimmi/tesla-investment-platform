import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { UserSidebar } from "@/components/dashboard/user-sidebar"

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <UserSidebar />
      <main className="lg:pl-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
