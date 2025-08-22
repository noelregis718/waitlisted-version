'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [showNotify, setShowNotify] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) {
      setError('Please enter your name and email.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('https://getform.io/f/agdlmppb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, source: 'landing_hero' }),
      })
      if (res.ok) {
        setShowNotify(true)
        setName('')
        setEmail('')
        setTimeout(() => setShowNotify(false), 4000)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white flex flex-col">
      {/* Hero Section */}
      <section className="relative py-28 bg-gradient-to-br from-blue-950 via-black to-purple-950 shadow-xl">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="w-full max-w-5xl mx-auto rounded-3xl shadow-2xl bg-gray-900/80 p-12 border border-gray-700/50 backdrop-blur-sm">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg">
                Ankfin: AI-powered finance in your pocket.
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
                Automate your cash flow, investments, and decisions, no dashboards, no spreadsheets. Just clarity and control.
              </p>
            </div>
            {/* Name + Email Input Section */}
            <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                disabled={loading}
                className="flex-1 px-6 py-4 rounded-xl bg-gray-800/70 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-lg shadow-md"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                className="flex-1 px-6 py-4 rounded-xl bg-gray-800/70 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-lg shadow-md"
              />
              <button
                type="submit"
                disabled={loading}
                className="text-lg px-12 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 whitespace-nowrap shadow-lg font-semibold disabled:opacity-60"
              >
                {loading ? 'Submitting…' : 'Join Waitlist'}
              </button>
            </form>
            {error && (
              <div className="mt-4 text-red-400 bg-gray-800/80 rounded-lg py-3 px-6 text-base text-center">
                {error}
              </div>
            )}
            {showNotify && (
              <div className="mt-6 text-green-400 bg-gray-800/80 rounded-lg py-3 px-6 animate-fade-in text-lg font-medium shadow text-center">
                Thank you! We will notify you.
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-28">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-gradient-to-br from-blue-900/60 to-gray-900/80 rounded-2xl shadow-xl border border-blue-700/30 p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Financial Operating System</h3>
              <p className="text-lg text-gray-300">Full AI-based money management system that forecasts, guides, and automates decisions, your CFO in your pocket.</p>
            </div>
            <div className="card bg-gradient-to-br from-purple-900/60 to-pink-900/80 rounded-2xl shadow-xl border border-purple-700/30 p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Split Engine</h3>
              <p className="text-lg text-gray-300">Auto-routes paychecks to bills, taxes, savings, etc. in real time, no need to input information manually.</p>
            </div>
            <div className="card bg-gradient-to-br from-pink-900/60 to-blue-900/80 rounded-2xl shadow-xl border border-pink-700/30 p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Embedded Financial Marketplace</h3>
              <p className="text-lg text-gray-300">Personalized product recommendations based on real cash flow (CDs, savings, cards, etc.).</p>
            </div>
            <div className="card bg-gradient-to-br from-green-900/60 to-blue-900/80 rounded-2xl shadow-xl border border-green-700/30 p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Non Custodial Wallet Infrastructure</h3>
              <p className="text-lg text-gray-300">Create secure, user controlled wallets with GDPR and CCPA compliance. No user funds ever held by us.</p>
            </div>
            <div className="card bg-gradient-to-br from-yellow-900/60 to-red-900/80 rounded-2xl shadow-xl border border-yellow-700/30 p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Behavioral Nudges</h3>
              <p className="text-lg text-gray-300">Personalized, AI timed nudges that promote healthy financial behavior change.</p>
            </div>
            <div className="card bg-gradient-to-br from-indigo-900/60 to-purple-900/80 rounded-2xl shadow-xl border border-indigo-700/30 p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">AI Conversational Chat LLM Interface</h3>
              <p className="text-lg text-gray-300">AI chat powered by LLM's and NLP that handles questions, executes tasks, and surfaces insights.</p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Ready to Transform Your Embedded Financial Product Marketplace?</h2>
          <div className="flex justify-center gap-4">
            <a
              href="mailto:ventureai2025@gmail.com?subject=AnkFin Sales Inquiry&body=Hello,%0D%0A%0D%0AI am interested in learning more about AnkFin.%0D%0A%0D%0ABest regards,"
              className="btn btn-secondary text-lg px-8 py-4 shadow-lg"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-black text-gray-400 py-16 border-t border-gray-800 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card bg-transparent border-none shadow-none">
              <h3 className="text-white text-sm font-semibold mb-6">Products</h3>
              <ul className="space-y-2">
                <li><Link href="/products#why-choose-ankfin" className="text-sm hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-sm hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/employers" className="text-sm hover:text-white transition-colors">Enterprise</Link></li>
              </ul>
            </div>
            <div className="card bg-transparent border-none shadow-none">
              <h3 className="text-white text-sm font-semibold mb-6">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm hover:text-white transition-colors">About</Link></li>
                <li><Link href="/careers" className="text-sm hover:text-white transition-colors">Careers</Link></li>
                <li><a href="mailto:ventureai2025@gmail.com?subject=AnkFin Contact Inquiry&body=Hello,%0D%0A%0D%0AI would like to get in touch with AnkFin regarding:%0D%0A%0D%0ABest regards," className="text-sm hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div className="card bg-transparent border-none shadow-none">
              <h3 className="text-white text-sm font-semibold mb-6">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-sm hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-sm hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-16 pt-8 text-center">
            <p className="text-sm">&copy; 2025 AnkFin. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}