'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import WaitlistModal from '@/components/WaitlistModal'

export default function EmployersPage() {
  const [showWaitlistModal, setShowWaitlistModal] = useState(false)
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white flex flex-col">
      {/* Hero Section */}
      <section className="relative py-28 bg-gradient-to-br from-blue-950 via-black to-purple-950 shadow-xl">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="max-w-4xl mx-auto text-center rounded-3xl shadow-2xl bg-gray-900/70 p-12 border border-gray-800">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg">Smart Money Management for Freelancers</h1>
            <p className="text-2xl text-gray-200 mb-10 font-medium">Automate your finances, track your income, and grow your business with our intelligent banking platform.</p>
            <div className="flex justify-center gap-6 mt-8">
              <button
                className="btn btn-primary text-lg px-10 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 whitespace-nowrap shadow-lg font-semibold"
                onClick={() => setShowWaitlistModal(true)}
              >
                Get Started
              </button>
              <a
                href="mailto:ventureai2025@gmail.com?subject=AnkFin Business Inquiry&body=Hello,%0D%0A%0D%0AI'm interested in learning more about AnkFin's services for my business.%0D%0A%0D%0ABest regards,"
                className="btn btn-secondary text-lg px-10 py-4 rounded-xl shadow-lg font-semibold"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-blue-900/60 to-gray-900/80 rounded-2xl shadow-xl border border-blue-700/30 p-10 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Automated Income Tracking</h3>
              <p className="text-lg text-gray-300">Automatically categorize and track your income from multiple sources with smart AI-powered tools.</p>
            </motion.div>
            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-purple-900/60 to-pink-900/80 rounded-2xl shadow-xl border border-purple-700/30 p-10 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Smart Tax Management</h3>
              <p className="text-lg text-gray-300">Automatically set aside taxes, track deductions, and prepare for tax season with our intelligent system.</p>
            </motion.div>
            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-pink-900/60 to-blue-900/80 rounded-2xl shadow-xl border border-pink-700/30 p-10 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-blue-500 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Growth Analytics</h3>
              <p className="text-lg text-gray-300">Get detailed insights into your business growth with advanced analytics and forecasting tools.</p>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Why Choose AnkFin for Your Business?</h2>
            <div className="space-y-10">
              <div className="flex items-start gap-8 bg-gradient-to-br from-blue-900/60 to-gray-900/80 rounded-2xl shadow-xl border border-blue-700/30 p-8">
                <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2 text-white">Automated Financial Management</h3>
                  <p className="text-lg text-gray-300">Save hours every month with automated income tracking, expense categorization, and financial reporting.</p>
                </div>
              </div>
              <div className="flex items-start gap-8 bg-gradient-to-br from-purple-900/60 to-pink-900/80 rounded-2xl shadow-xl border border-purple-700/30 p-8">
                <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2 text-white">Time-Saving Tools</h3>
                  <p className="text-lg text-gray-300">Focus on growing your business while we handle the financial management with our smart automation tools.</p>
                </div>
              </div>
              <div className="flex items-start gap-8 bg-gradient-to-br from-pink-900/60 to-blue-900/80 rounded-2xl shadow-xl border border-pink-700/30 p-8">
                <div className="w-16 h-16 bg-pink-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2 text-white">Enterprise-Grade Security</h3>
                  <p className="text-lg text-gray-300">Bank with confidence using our secure platform with advanced encryption and fraud protection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Ready to Transform Your Business Finances?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Join thousands of freelancers and small business owners who trust AnkFin for their financial management needs.</p>
          <div className="flex justify-center gap-6">
            <button
              className="btn btn-primary text-lg px-10 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 whitespace-nowrap shadow-lg font-semibold"
              onClick={() => setShowWaitlistModal(true)}
            >
              Start Free Trial
            </button>
            <a
              href="mailto:ventureai2025@gmail.com?subject=AnkFin Business Inquiry&body=Hello,%0D%0A%0D%0AI'm interested in learning more about AnkFin's services for my business.%0D%0A%0D%0ABest regards,"
              className="btn btn-secondary text-lg px-10 py-4 rounded-xl shadow-lg font-semibold"
            >
              Request Demo
            </a>
          </div>
          <WaitlistModal open={showWaitlistModal} onClose={() => setShowWaitlistModal(false)} />
        </div>
      </section>
    </div>
  )
} 