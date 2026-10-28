import Link from "next/link"
import { ArrowRight, Shield, TrendingUp, Zap, Lock, Users, CheckCircle2, Clock, Wallet } from "lucide-react"

const plans = [
  { name: "Starter Plan", roi: "5.50%", period: "After 24 Hours", range: "$100 – $499", popular: false },
  { name: "Elite Plan", roi: "8.90%", period: "After 24 Hours", range: "$500 – $999", popular: true },
  { name: "Deluxe Plan", roi: "11.50%", period: "After 24 Hours", range: "$1,000 – $1,999", popular: false },
  { name: "Superior Plan", roi: "15%", period: "After 48 Hours", range: "$2,000 – $4,999", popular: false },
  { name: "Ultimate Plan", roi: "15.50%", period: "After 24 Hours", range: "$5,000 – $8,999", popular: false },
  { name: "Platinum VIP", roi: "15%", period: "After 24 Hours", range: "$9,000 – Unlimited", popular: false },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-tesla-red rounded-lg flex items-center justify-center font-bold text-sm">T</div>
              <span className="font-semibold tracking-tight">Tesla Investment</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
              <a href="#plans" className="hover:text-white transition">Plans</a>
              <a href="#how" className="hover:text-white transition">How it Works</a>
              <a href="#security" className="hover:text-white transition">Security</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm px-4 py-2 text-zinc-300 hover:text-white transition">
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm px-5 py-2 bg-tesla-red hover:bg-red-700 rounded-full font-medium transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-tesla-red/10 border border-tesla-red/20 rounded-full text-xs text-tesla-red font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-tesla-red rounded-full" />
            Crypto Investment Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
            Structured returns.<br />
            <span className="text-tesla-red">Clear terms.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Deposit BTC, ETH, or USDT. Choose a fixed-term plan. Receive your return at maturity with principal returned. No hidden fees. Manual verification on every deposit and withdrawal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-tesla-red hover:bg-red-700 rounded-full font-semibold text-lg transition"
            >
              Open Account <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#plans"
              className="inline-flex items-center justify-center px-8 py-4 border border-zinc-700 hover:bg-zinc-900 rounded-full font-semibold text-lg transition"
            >
              View Plans
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Minimum Deposit", value: "$100" },
            { label: "Plan Returns", value: "5.5% – 15.5%" },
            { label: "Settlement", value: "24 – 48 hrs" },
            { label: "Supported Assets", value: "BTC · ETH · USDT" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Investment Plans</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Each plan has a fixed return and a fixed term. Principal is returned at maturity. Select the range that matches your capital.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 border transition ${
                  plan.popular
                    ? "border-tesla-red bg-tesla-red/5"
                    : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-tesla-red text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-tesla-red mb-1">{plan.roi}</div>
                <div className="text-sm text-zinc-400 mb-4">{plan.period}</div>
                <div className="text-sm text-zinc-300 mb-6">
                  Range: <span className="font-medium text-white">{plan.range}</span>
                </div>
                <Link
                  href="/register"
                  className={`block text-center py-3 rounded-full font-medium transition ${
                    plan.popular
                      ? "bg-tesla-red hover:bg-red-700"
                      : "bg-zinc-800 hover:bg-zinc-700"
                  }`}
                >
                  Invest Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-24 px-4 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-zinc-400">Four steps from registration to withdrawal.</p>
          </div>
          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Create your account",
                desc: "Register with your email. Your account is ready immediately. No documents required to start.",
              },
              {
                step: "02",
                title: "Deposit crypto",
                desc: "Send BTC, ETH, or USDT to the platform wallet. Upload a screenshot of the transaction and submit for approval. Deposits are reviewed manually before your balance is credited.",
              },
              {
                step: "03",
                title: "Choose a plan",
                desc: "Select a plan that matches your capital. The return and term are fixed and shown before you confirm. Your principal is locked for the plan duration.",
              },
              {
                step: "04",
                title: "Receive return and withdraw",
                desc: "At maturity, your profit is credited and principal is returned to your available balance. Request a withdrawal to your personal wallet. Withdrawals are processed manually.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                <div className="text-3xl font-bold text-tesla-red/30 shrink-0">{item.step}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform features</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Manual verification", desc: "Every deposit and withdrawal is reviewed by an administrator before processing." },
              { icon: TrendingUp, title: "Fixed returns", desc: "Each plan shows its return percentage and term before you invest. No variable rates." },
              { icon: Lock, title: "Principal returned", desc: "Your capital is returned to your balance at the end of every plan." },
              { icon: Wallet, title: "Multi-asset support", desc: "Deposit and withdraw with Bitcoin, Ethereum, USDT ERC-20, and USDT TRC-20." },
              { icon: Users, title: "Referral commissions", desc: "Earn a percentage of deposits made by users you refer." },
              { icon: Clock, title: "Clear timelines", desc: "Plans mature in 24 or 48 hours. Returns are credited automatically at maturity." },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                <f.icon className="w-8 h-8 text-tesla-red mb-4" />
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-24 px-4 bg-zinc-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-tesla-red/10 rounded-2xl mb-6">
            <Shield className="w-7 h-7 text-tesla-red" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Security and process</h2>
          <p className="text-zinc-400 leading-relaxed mb-10">
            Deposits require proof of payment and admin approval before funds are credited. Withdrawals are reviewed before being sent. All activity is logged. Your principal is returned at the end of each investment term.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {[
              { title: "Deposit review", desc: "Screenshots and transaction hashes are checked before approval." },
              { title: "Withdrawal review", desc: "Payout requests are processed manually to your provided wallet." },
              { title: "Activity log", desc: "Every deposit, investment, profit, and withdrawal is recorded." },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-xl border border-zinc-800 bg-zinc-900">
                <h3 className="font-semibold mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start with a plan</h2>
          <p className="text-zinc-400 mb-8">Create an account, deposit, and select a plan. Returns are credited at maturity.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-tesla-red hover:bg-red-700 rounded-full font-semibold text-lg transition"
          >
            Create Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-tesla-red rounded-lg flex items-center justify-center font-bold text-xs">T</div>
            <span className="font-semibold">Tesla Investment</span>
          </div>
          <div className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Tesla Investment
          </div>
          <div className="flex gap-6 text-sm text-zinc-400">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
