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
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Deposit Funds</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">
          Send crypto to the address below and upload proof of payment for approval.
        </p>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-xl text-sm ${
            message.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
              : "bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400"
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
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              selected === w.currency
                ? "bg-tesla-red text-white"
                : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
            }`}
          >
            {LABELS[w.currency] || w.currency.replace("_", " ")}
          </button>
        ))}
        {wallets.length === 0 && (
          <p className="text-zinc-500 text-sm">No payment methods configured yet. Contact support.</p>
        )}
      </div>

      {currentWallet && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
          <div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1.5">Send to this address</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 font-mono text-sm break-all select-all border border-zinc-200 dark:border-zinc-700">
                {currentWallet.address}
              </div>
              <button
                onClick={copyAddress}
                className="p-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition border border-zinc-200 dark:border-zinc-700"
                title="Copy address"
              >
                {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
              </button>
            </div>
            {currentWallet.network && (
              <div className="text-xs text-amber-600 dark:text-amber-400 mt-2">Network: {currentWallet.network}</div>
            )}
          </div>
          <p className="text-xs text-zinc-500">
            Only send {LABELS[currentWallet.currency] || currentWallet.currency} to this address. Sending other
            assets may result in permanent loss.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-5">
        <div>
          <label className="block text-sm text-zinc-500 dark:text-zinc-400 mb-1.5">Amount (USD equivalent)</label>
          <input
            type="number"
            step="0.01"
            min="1"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-tesla-red"
            placeholder="100.00"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-500 dark:text-zinc-400 mb-1.5">Transaction Hash (optional but recommended)</label>
          <input
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-tesla-red font-mono text-sm"
            placeholder="0x... or blockchain tx id"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-500 dark:text-zinc-400 mb-1.5">Proof of Payment (screenshot)</label>
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
                className="max-h-48 rounded-xl border border-zinc-200 dark:border-zinc-700"
              />
              <button
                type="button"
                onClick={clearProof}
                className="absolute -top-2 -right-2 p-1 bg-tesla-red rounded-full text-white"
              >
                <X size={14} />
              </button>
              <div className="text-xs text-zinc-500 mt-1">{proofFileName}</div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-xl p-8 flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition"
            >
              <Upload size={24} />
              <span className="text-sm">Click to upload screenshot</span>
              <span className="text-xs text-zinc-400">PNG, JPG up to 5MB</span>
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !selected}
          className="w-full bg-tesla-red hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
        >
          {loading ? "Submitting..." : "Submit Deposit Request"}
        </button>
      </form>
    </div>
  )
}
