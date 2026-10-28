"use client"

import { useEffect, useState } from "react"

type Wallet = {
  id?: string
  currency: string
  address: string
  network: string | null
  isActive: boolean
}

const METHODS = [
  { value: "BTC", label: "Bitcoin (BTC)", network: "Bitcoin" },
  { value: "ETH", label: "Ethereum (ETH)", network: "ERC-20" },
  { value: "USDT_ERC20", label: "USDT (ERC-20)", network: "Ethereum" },
  { value: "USDT_TRC20", label: "USDT (TRC-20)", network: "Tron" },
]

export default function AdminWalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("/api/admin/wallets")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setWallets(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function getWallet(currency: string): Wallet {
    return (
      wallets.find((w) => w.currency === currency) || {
        currency,
        address: "",
        network: METHODS.find((c) => c.value === currency)?.network || null,
        isActive: true,
      }
    )
  }

  async function saveWallet(currency: string, address: string, isActive: boolean) {
    setSaving(currency)
    setMessage("")
    try {
      const res = await fetch("/api/admin/wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency,
          address,
          network: METHODS.find((c) => c.value === currency)?.network,
          isActive,
        }),
      })
      if (res.ok) {
        setMessage("Saved successfully")
        const updated = await fetch("/api/admin/wallets").then((r) => r.json())
        setWallets(updated)
      } else {
        const data = await res.json()
        setMessage(data.error || "Failed to save")
      }
    } catch {
      setMessage("Error saving")
    } finally {
      setSaving(null)
    }
  }

  if (loading) return <div className="text-gray-400">Loading...</div>

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Deposit Methods / Wallets</h1>
        <p className="text-gray-400 mt-1">
          Set the wallet addresses users will use for deposits. Withdrawals use the same currencies.
        </p>
      </div>

      {message && (
        <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm">
          {message}
        </div>
      )}

      <div className="space-y-6">
        {METHODS.map((c) => {
          const w = getWallet(c.value)
          return (
            <WalletForm
              key={c.value}
              currency={c.value}
              label={c.label}
              network={c.network}
              initialAddress={w.address}
              initialActive={w.isActive}
              saving={saving === c.value}
              onSave={saveWallet}
            />
          )
        })}
      </div>
    </div>
  )
}

function WalletForm({
  currency,
  label,
  network,
  initialAddress,
  initialActive,
  saving,
  onSave,
}: {
  currency: string
  label: string
  network: string
  initialAddress: string
  initialActive: boolean
  saving: boolean
  onSave: (currency: string, address: string, isActive: boolean) => void
}) {
  const [address, setAddress] = useState(initialAddress)
  const [isActive, setIsActive] = useState(initialActive)

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{label}</h3>
          <div className="text-xs text-gray-500">Network: {network}</div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded"
          />
          Active
        </label>
      </div>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Wallet address"
        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-tesla-red"
      />
      <button
        onClick={() => onSave(currency, address, isActive)}
        disabled={saving}
        className="px-5 py-2 bg-tesla-red hover:bg-red-700 disabled:opacity-50 rounded-lg text-sm font-medium"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  )
}
