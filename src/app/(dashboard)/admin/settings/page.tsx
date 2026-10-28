"use client"

import { useEffect, useState } from "react"

export default function SettingsPage() {
  const [form, setForm] = useState({
    siteName: "Tesla Investment",
    supportEmail: "support@teslainvest.com",
    minDeposit: "100",
    minWithdrawal: "50",
    referralPercent: "5",
    maintenanceMode: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setForm({
            siteName: data.siteName || "Tesla Investment",
            supportEmail: data.supportEmail || "",
            minDeposit: String(data.minDeposit ?? 100),
            minWithdrawal: String(data.minWithdrawal ?? 50),
            referralPercent: String(data.referralPercent ?? 5),
            maintenanceMode: data.maintenanceMode ?? false,
          })
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          minDeposit: parseFloat(form.minDeposit),
          minWithdrawal: parseFloat(form.minWithdrawal),
          referralPercent: parseFloat(form.referralPercent),
        }),
      })
      if (res.ok) {
        setMessage({ type: "success", text: "Settings saved" })
      } else {
        setMessage({ type: "error", text: "Failed to save" })
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-gray-400">Loading...</div>

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <p className="text-gray-400 mt-1">Configure global platform settings.</p>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Site Name</label>
          <input
            value={form.siteName}
            onChange={(e) => setForm({ ...form, siteName: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Support Email</label>
          <input
            type="email"
            value={form.supportEmail}
            onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Min Deposit</label>
            <input
              type="number"
              step="0.01"
              value={form.minDeposit}
              onChange={(e) => setForm({ ...form, minDeposit: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Min Withdrawal</label>
            <input
              type="number"
              step="0.01"
              value={form.minWithdrawal}
              onChange={(e) => setForm({ ...form, minWithdrawal: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Referral Commission %</label>
          <input
            type="number"
            step="0.1"
            value={form.referralPercent}
            onChange={(e) => setForm({ ...form, referralPercent: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.maintenanceMode}
            onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
          />
          Maintenance Mode
        </label>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-tesla-red hover:bg-red-700 disabled:opacity-50 font-semibold py-3 rounded-lg transition"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  )
}
