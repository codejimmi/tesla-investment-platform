"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  Layers,
  Wallet,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Activity,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/deposits", label: "Deposits", icon: ArrowDownToLine },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: ArrowUpFromLine },
  { href: "/admin/plans", label: "Plans", icon: Layers },
  { href: "/admin/wallets", label: "Wallets", icon: Wallet },
  { href: "/admin/smtp", label: "SMTP", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-tesla-dark border border-white/10 text-white"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-tesla-dark border-r border-white/10 flex flex-col transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-tesla-red rounded-sm flex items-center justify-center font-bold text-sm text-white">
              T
            </div>
            <div>
              <div className="font-semibold text-white tracking-tight text-sm">Tesla Investment</div>
              <div className="text-xs text-tesla-red">Admin Panel</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition",
                  active
                    ? "bg-tesla-red/15 text-tesla-red"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <Link
            href="/user/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5"
          >
            <Activity size={18} /> User View
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
