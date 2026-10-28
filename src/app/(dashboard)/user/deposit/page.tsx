"use client"

import { useEffect, useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { Copy, Check, Upload, X } from "lucide-react"

type Wallet = {
  id: string
  currency: string
  address: string
  network: string | null
  isActive: boolean
}

const LABELS: Record<string, string> = {
  BTC: "Bitcoin (BTC)",
  ETH: "Ethereum (ETH)",
  USDT_ERC20: "USDT (ERC-20)",
  USDT_TRC20: "USDT (TRC-20)",
}

export default function DepositPage() {
  const { data: session } = useSession()
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [selected, setSelected] = useState<string>("")
  const [amount, setAmount] = useState("")
  const [txHash, setTxHash] = useState("")
  const [proofImage, setProofImage] = useState<string | null>(null)
  const [proofFileName, setProofFileName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch("/api/wallets")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const active = data.filter((w: Wallet) => w.isActive)
          setWallets(active)
          if (active.length) setSelected(active[0].currency)
        }
      })
      .catch(console.error)
  }, [])

  const currentWallet = wallets.find((w) => w.currency === selected)

  async function copyAddress() {
    if (!currentWallet) return
    await navigator.clipboard.writeText(currentWallet.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please upload an image file" })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image must be under 5MB" })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setProofImage(reader.result as string)
      setProofFileName(file.name)
    }
    reader.readAsDataURL(file)
  }

  function clearProof() {
    setProofImage(null)
    setProofFileName(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!session) return
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: selected,
          txHash: txHash || undefined,
          proofUrl: proofImage || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to submit deposit" })
      } else {
        setMessage({
          type: "success",
          text: "Deposit submitted successfully. Waiting for admin approval.",
        })
        setAmount("")
        setTxHash("")
        clearProof()
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Deposit Funds</h1>
        <p className="text-gray-400 mt-1">
          Send crypto to the address below and upload proof of payment for approval.
        </p>
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

      <div className="flex flex-wrap gap-2">
        {wallets.map((w) => (
          <button
            key={w.currency}
            onClick={() => setSelected(w.currency)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selected === w.currency
                ? "bg-tesla-red text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/15"
            }`}
          >
            {LABELS[w.currency] || w.currency.replace("_", " ")}
          </button>
        ))}
        {wallets.length === 0 && (
          <p className="text-gray-500 text-sm">No payment methods configured yet. Contact support.</p>
        )}
      </div>

      {currentWallet && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <div className="text-sm text-gray-400 mb-1">Send to this address</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-black/40 rounded-lg p-4 font-mono text-sm break-all select-all">
                {currentWallet.address}
              </div>
              <button
                onClick={copyAddress}
                className="p-3 bg-white/10 hover:bg-white/15 rounded-lg transition"
                title="Copy address"
              >
                {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
              </button>
            </div>
            {currentWallet.network && (
              <div className="text-xs text-amber-400 mt-2">Network: {currentWallet.network}</div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Only send {LABELS[currentWallet.currency] || currentWallet.currency} to this address. Sending other
            assets may result in permanent loss.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Amount (USD equivalent)</label>
          <input
            type="number"
            step="0.01"
            min="1"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-tesla-red"
            placeholder="100.00"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Transaction Hash (optional but recommended)</label>
          <input
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-tesla-red font-mono text-sm"
            placeholder="0x... or blockchain tx id"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Proof of Payment (screenshot)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {proofImage ? (
            <div className="relative inline-block">
              <img
                src={proofImage}
                alt="Proof"
                className="max-h-48 rounded-lg border border-white/10"
              />
              <button
                type="button"
                onClick={clearProof}
                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
              >
                <X size={14} />
              </button>
              <div className="text-xs text-gray-400 mt-1">{proofFileName}</div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-white/20 hover:border-white/40 rounded-lg p-8 flex flex-col items-center gap-2 text-gray-400 hover:text-white transition"
            >
              <Upload size={24} />
              <span className="text-sm">Click to upload screenshot</span>
              <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !selected}
          className="w-full bg-tesla-red hover:bg-red-700 disabled:opacity-50 font-semibold py-3 rounded-lg transition"
        >
          {loading ? "Submitting..." : "Submit Deposit Request"}
        </button>
      </form>
    </div>
  )
}
