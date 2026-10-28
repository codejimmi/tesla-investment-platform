"use client"

import { useEffect, useState } from "react"

export default function SmtpPage() {
  const [form, setForm] = useState({
    host: "",
    port: "587",
    username: "",
    password: "",
    fromEmail: "",
    fromName: "Tesla Investment",
    secure: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetch("/api/admin/smtp")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.host) {
          setForm({
            host: data.host || "",
            port: String(data.port || 587),
            username: data.username || "",
            password: data.password || "",
            fromEmail: data.fromEmail || "",
            fromName: data.fromName || "Tesla Investment",
            secure: data.secure ?? true,
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
      const res = await fetch("/api/admin/smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          port: parseInt(form.port),
        }),
      })
      if (res.ok) {
        setMessage({ type: "success", text: "SMTP settings saved" })
      } else {
        setMessage({ type: "error", text: "Failed to save" })
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" })
    } finally {
      setSaving(false)
    }
  }

  async function testEmail() {
    const email = prompt("Send test email to:")
    if (!email) return
    const res = await fetch("/api/admin/smtp/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: email }),
    })
    const data = await res.json()
    alert(data.message || data.error || "Done")
  }

  if (loading) return <div className="text-gray-400">Loading...</div>

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">SMTP Settings</h1>
        <p className="text-gray-400 mt-1">Configure email for notifications.</p>
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
          <label className="block text-sm text-gray-400 mb-1">Host</label>
          <input
            required
            value={form.host}
            onChange={(e) => setForm({ ...form, host: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5"
            placeholder="smtp.gmail.com"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Port</label>
            <input
              required
              type="number"
              value={form.port}
              onChange={(e) => setForm({ ...form, port: e.target.value })}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5"
            />
          </div>
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.secure}
                onChange={(e) => setForm({ ...form, secure: e.target.checked })}
              />
              Secure (TLS)
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Username</label>
          <input
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">From Email</label>
          <input
            required
            type="email"
            value={form.fromEmail}
            onChange={(e) => setForm({ ...form, fromEmail: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">From Name</label>
          <input
            value={form.fromName}
            onChange={(e) => setForm({ ...form, fromName: e.target.value })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-tesla-red hover:bg-red-700 disabled:opacity-50 rounded-lg font-medium"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          <button
            type="button"
            onClick={testEmail}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg"
          >
            Send Test
          </button>
        </div>
      </form>
    </div>
  )
}
