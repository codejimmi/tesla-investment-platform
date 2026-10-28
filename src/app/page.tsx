import Link from "next/link"
import { ArrowRight, Shield, TrendingUp, Zap, Lock, Users, BarChart3, CheckCircle2, Globe, Smartphone } from "lucide-react"

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
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-tesla-red rounded-sm flex items-center justify-center font-bold text-sm">T</div>
              <span className="font-semibold text-lg tracking-tight">Tesla Investment</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
              <a href="#plans" className="hover:text-white transition">Plans</a>
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#how" className="hover:text-white transition">How it Works</a>
              <a href="#security" className="hover:text-white transition">Security</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm px-4 py-2 text-gray-300 hover:text-white transition">
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
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-tesla-red/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-tesla-red/10 border border-tesla-red/20 rounded-full text-xs text-tesla-red font-medium mb-6">
                <span className="w-1.5 h-1.5 bg-tesla-red rounded-full animate-pulse" />
                Live Investment Platform
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
                Invest smarter.<br />
                <span className="text-tesla-red">Grow faster.</span>
              </h1>
              <p className="text-lg text-gray-400 max-w-lg mb-8 leading-relaxed">
                Institutional-grade crypto investment plans with transparent returns. Deposit BTC, ETH, or USDT and start earning in 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-tesla-red hover:bg-red-700 rounded-full font-semibold text-lg transition"
                >
                  Start Investing <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#plans"
                  className="inline-flex items-center justify-center px-8 py-4 border border-white/20 hover:bg-white/5 rounded-full font-semibold text-lg transition"
                >
                  View Plans
                </a>
              </div>
              <div className="flex items-center gap-6 mt-10 text-sm text-gray-500">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No hidden fees</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Capital returned</div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-tesla-red/20 to-transparent rounded-3xl blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=1200&q=80"
                alt="Bitcoin and Ethereum with trading charts"
                className="relative rounded-3xl border border-white/10 shadow-2xl w-full object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-6 -left-6 bg-black/80 backdrop-blur border border-white/10 rounded-2xl p-4 shadow-xl hidden sm:block">
                <div className="text-xs text-gray-400">24h Return</div>
                <div className="text-2xl font-bold text-emerald-400">+8.90%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/10 bg-black/40">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Active Investors", value: "12,400+" },
            { label: "Total Invested", value: "$48M+" },
            { label: "Daily Returns", value: "5.5% – 15.5%" },
            { label: "Supported Assets", value: "BTC · ETH · USDT" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Investment Plans</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Choose a plan that matches your capital. Capital is returned at maturity on every plan.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 border transition hover:border-white/20 ${
                  plan.popular
                    ? "border-tesla-red bg-tesla-red/5"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-tesla-red text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-tesla-red mb-1">{plan.roi}</div>
                <div className="text-sm text-gray-400 mb-4">{plan.period}</div>
                <div className="text-sm mb-6 text-gray-300">
                  Range: <span className="font-medium text-white">{plan.range}</span>
                </div>
                <Link
                  href="/register"
                  className={`block text-center py-3 rounded-full font-medium transition ${
                    plan.popular
                      ? "bg-tesla-red hover:bg-red-700"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  Invest Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image break */}
      <section className="relative h-[420px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/32299962/pexels-photo-32299962.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Professional crypto trading desk"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-md">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trade with clarity</h2>
              <p className="text-gray-300">Real-time visibility into your portfolio, deposits, and returns — all in one secure dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-black/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Tesla Investment</h2>
            <p className="text-gray-400">Built for serious investors who value transparency and control</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Bank-Grade Security", desc: "Encrypted wallets, full audit logs, and role-based admin access protect every transaction." },
              { icon: TrendingUp, title: "Transparent Returns", desc: "Clear maturity times and capital return on every plan. No surprises." },
              { icon: Zap, title: "Fast Activation", desc: "Manual verification keeps funds safe while ensuring quick processing." },
              { icon: Lock, title: "Multi-Chain Support", desc: "Deposit and withdraw with BTC, ETH, USDT ERC-20, and USDT TRC-20." },
              { icon: Users, title: "Referral Program", desc: "Earn commissions from your network with configurable referral rates." },
              { icon: BarChart3, title: "Full Control Dashboard", desc: "Sophisticated user and admin panels with complete transaction history." },
              { icon: Globe, title: "Global Access", desc: "Invest from anywhere. Your portfolio is available 24/7 on any device." },
              { icon: Smartphone, title: "Mobile Optimized", desc: "Fully responsive design. Manage investments on the go." },
              { icon: CheckCircle2, title: "Capital Protection", desc: "Your principal is returned at the end of every investment plan." },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 transition">
                <f.icon className="w-10 h-10 text-tesla-red mb-4" />
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400">Four simple steps to start earning</p>
          </div>
          <div className="space-y-6">
            {[
              { step: "01", title: "Create Your Account", desc: "Register in under a minute with your email. No KYC required to start." },
              { step: "02", title: "Deposit Crypto", desc: "Send BTC, ETH, or USDT to your assigned wallet and submit proof for quick approval." },
              { step: "03", title: "Choose a Plan", desc: "Select an investment plan that fits your capital. Activation is instant after funding." },
              { step: "04", title: "Earn & Withdraw", desc: "Receive your profit after the plan period. Withdraw anytime to your personal wallet." },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start p-6 rounded-2xl border border-white/10 bg-white/5">
                <div className="text-4xl font-bold text-tesla-red/40 shrink-0">{item.step}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-24 px-4 bg-black/40">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-tesla-red/10 rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-tesla-red" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Your Funds, Protected</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Every deposit is manually verified. Withdrawals require admin approval. Full activity logs ensure complete transparency. Your capital is returned at the end of every plan.
            </p>
            <div className="space-y-4">
              {[
                { title: "Manual Verification", desc: "Every deposit is reviewed before crediting." },
                { title: "Admin Oversight", desc: "Withdrawals are processed manually for maximum security." },
                { title: "Full Audit Trail", desc: "Every action is logged and visible in your history." },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-gray-400">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1641352109623-f7b1eff605fd?auto=format&fit=crop&w=1000&q=80"
              alt="Bitcoin coin"
              className="rounded-3xl border border-white/10 w-full object-cover aspect-square"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-tesla-red/20 to-transparent border border-tesla-red/30 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to accelerate your portfolio?</h2>
          <p className="text-gray-400 mb-8">Join investors already earning with Tesla Investment.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-tesla-red hover:bg-red-700 rounded-full font-semibold text-lg transition"
          >
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-tesla-red rounded-sm flex items-center justify-center font-bold text-xs">T</div>
            <span className="font-semibold">Tesla Investment</span>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Tesla Investment. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
