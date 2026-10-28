"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"

type Plan = {
  id: string
  name: string
  description: string | null
  minAmount: number
  maxAmount: number | null
  dailyRoiPercent: number
  durationDays: number
  capitalReturn: boolean
  isActive: boolean
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Plan | null>(null)
  const [form, setForm] = useState({
    name: "",
    description: "",
    minAmount: "",
    maxAmount: "",
    dailyRoiPercent: "",
    durationDays: "",
    capitalReturn: true,
    isActive: true,
  })

  async function load() {
    const res = await fetch("/api/admin/plans")
    const data = await res.json()
    if (Array.isArray(data)) setPlans(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function openCreate() {
    setEditing(null)
    setForm({
      name: "",
      description: "",
      minAmount: "",
      maxAmount: "",
      dailyRoiPercent: "",
      durationDays: "",
      capitalReturn: true,
      isActive: true,
    })
    setShowForm(true)
  }

  function openEdit(plan: Plan) {
    setEditing(plan)
    setForm({
      name: plan.name,
      description: plan.description || "",
      minAmount: String(plan.minAmount),
      maxAmount: plan.maxAmount ? String(plan.maxAmount) : "",
      dailyRoiPercent: String(plan.dailyRoiPercent),
      durationDays: String(plan.durationDays),
      capitalReturn: plan.capitalReturn,
      isActive: plan.isActive,
    })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      name: form.name,
      description: form.description || null,
      minAmount: parseFloat(form.minAmount),
      maxAmount: form.maxAmount ? parseFloat(form.maxAmount) : null,
      dailyRoiPercent: parseFloat(form.dailyRoiPercent),
      durationDays: parseInt(form.durationDays),
      capitalReturn: form.capitalReturn,
      isActive: form.isActive,
    }

    const url = editing ? `/api/admin/plans/${editing.id}` : "/api/admin/plans"
    const method = editing ? "PATCH" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setShowForm(false)
      load()
    } else {
      alert("Failed to save plan")
    }
  }

  async function toggleActive(plan: Plan) {
    await fetch(`/api/admin/plans/${plan.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !plan.isActive }),
    })
    load()
  }

  if (loading) return <div className="text-gray-400">Loading plans...</div>

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Investment Plans</h1>
          <p className="text-gray-400 mt-1">Create and manage investment plans.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-tesla-red hover:bg-red-700 rounded-lg font-medium"
        >
          <Plus size={18} /> New Plan
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Daily ROI %</label>
              <input
                required
                type="number"
                step="0.01"
                value={form.dailyRoiPercent}
                onChange={(e) => setForm({ ...form, dailyRoiPercent: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Min Amount</label>
              <input
                required
                type="number"
                step="0.01"
                value={form.minAmount}
                onChange={(e) => setForm({ ...form, minAmount: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Max Amount (blank = unlimited)</label>
              <input
                type="number"
                step="0.01"
                value={form.maxAmount}
                onChange={(e) => setForm({ ...form, maxAmount: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Duration (days)</label>
              <input
                required
                type="number"
                value={form.durationDays}
                onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5"
              />
            </div>
            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.capitalReturn}
                  onChange={(e) => setForm({ ...form, capitalReturn: e.target.checked })}
                />
                Capital Return
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                Active
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-5 py-2 bg-tesla-red hover:bg-red-700 rounded-lg font-medium">
              {editing ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2 bg-white/10 hover:bg-white/15 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">{plan.name}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    plan.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {plan.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {Number(plan.dailyRoiPercent).toFixed(2)}% · {plan.durationDays}d · ${Number(plan.minAmount).toLocaleString()}
                {plan.maxAmount ? ` – $${Number(plan.maxAmount).toLocaleString()}` : "+"}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleActive(plan)}
                className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/15 rounded-lg"
              >
                {plan.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => openEdit(plan)}
                className="p-2 bg-white/10 hover:bg-white/15 rounded-lg"
              >
                <Pencil size={16} />
              </button>
            </div>
          </div>
        ))}
        {plans.length === 0 && <div className="text-gray-500 text-center py-8">No plans yet.</div>}
      </div>
    </div>
  )
}
