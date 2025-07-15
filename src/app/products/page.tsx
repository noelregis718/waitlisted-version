'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('loan')
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [monthlyPayment, setMonthlyPayment] = useState(0)

  const [investmentAmount, setInvestmentAmount] = useState('')
  const [expectedReturn, setExpectedReturn] = useState('')
  const [investmentPeriod, setInvestmentPeriod] = useState('')
  const [futureValue, setFutureValue] = useState(0)

  const [assets, setAssets] = useState({
    cash: '',
    investments: '',
    property: '',
    vehicles: '',
    other: '',
  })
  const [liabilities, setLiabilities] = useState({
    mortgage: '',
    loans: '',
    creditCards: '',
    other: '',
  })
  const [netWorth, setNetWorth] = useState(0)

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount)
    const rate = parseFloat(interestRate) / 100 / 12
    const term = parseFloat(loanTerm) * 12
    const payment = (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
    setMonthlyPayment(payment)
  }

  const calculateInvestment = () => {
    const principal = parseFloat(investmentAmount)
    const rate = parseFloat(expectedReturn) / 100
    const years = parseFloat(investmentPeriod)
    const future = principal * Math.pow(1 + rate, years)
    setFutureValue(future)
  }

  const calculateNetWorth = () => {
    const totalAssets = Object.values(assets).reduce((sum, value) => sum + (parseFloat(value) || 0), 0)
    const totalLiabilities = Object.values(liabilities).reduce((sum, value) => sum + (parseFloat(value) || 0), 0)
    setNetWorth(totalAssets - totalLiabilities)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white flex flex-col">
      {/* Header Section */}
      <section className="py-24 bg-gradient-to-br from-blue-950 via-black to-purple-950 shadow-xl">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="max-w-4xl mx-auto text-center rounded-3xl shadow-2xl bg-gray-900/70 p-12 border border-gray-800">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg">Financial Products & Tools</h1>
            <p className="text-2xl text-gray-200 mb-10 font-medium">Explore our suite of financial products and powerful calculators to help you make informed decisions.</p>
          </div>
        </div>
      </section>
      {/* Tabs Navigation */}
      <section className="py-10">
        <div className="container mx-auto px-4 mb-12 flex justify-center">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveTab('loan')}
              className={`px-8 py-4 rounded-xl text-lg font-semibold shadow-md transition-all duration-200 ${activeTab === 'loan' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}
            >
              Loan Calculator
            </button>
            <button
              onClick={() => setActiveTab('investment')}
              className={`px-8 py-4 rounded-xl text-lg font-semibold shadow-md transition-all duration-200 ${activeTab === 'investment' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}
            >
              Investment Calculator
            </button>
            <button
              onClick={() => setActiveTab('networth')}
              className={`px-8 py-4 rounded-xl text-lg font-semibold shadow-md transition-all duration-200 ${activeTab === 'networth' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}
            >
              Net Worth Calculator
            </button>
          </div>
        </div>
      </section>
      {/* Calculator Content */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Loan Calculator */}
            {activeTab === 'loan' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-900/60 to-gray-900/80 rounded-2xl shadow-2xl border border-blue-700/30 p-10"
              >
                <h2 className="text-3xl font-bold mb-8 text-white">Loan Calculator</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold mb-2 text-blue-300">Loan Amount ($)</label>
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-lg shadow"
                      placeholder="Enter loan amount"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold mb-2 text-blue-300">Interest Rate (%)</label>
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-lg shadow"
                      placeholder="Enter interest rate"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold mb-2 text-blue-300">Loan Term (Years)</label>
                    <input
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-lg shadow"
                      placeholder="Enter loan term"
                    />
                  </div>
                  <button
                    onClick={calculateLoan}
                    className="w-full btn btn-primary text-lg px-10 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 font-semibold shadow-lg mt-4"
                  >
                    Calculate
                  </button>
                  {monthlyPayment > 0 && (
                    <div className="mt-8 p-6 bg-gray-700/70 rounded-xl shadow text-center">
                      <h3 className="text-2xl font-semibold mb-2 text-green-400">Monthly Payment</h3>
                      <p className="text-4xl font-bold text-green-300">${monthlyPayment.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            {/* Investment Calculator */}
            {activeTab === 'investment' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple-900/60 to-pink-900/80 rounded-2xl shadow-2xl border border-purple-700/30 p-10"
              >
                <h2 className="text-3xl font-bold mb-8 text-white">Investment Calculator</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold mb-2 text-purple-300">Initial Investment ($)</label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 text-lg shadow"
                      placeholder="Enter investment amount"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold mb-2 text-purple-300">Expected Annual Return (%)</label>
                    <input
                      type="number"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 text-lg shadow"
                      placeholder="Enter expected return"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-semibold mb-2 text-purple-300">Investment Period (Years)</label>
                    <input
                      type="number"
                      value={investmentPeriod}
                      onChange={(e) => setInvestmentPeriod(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 text-lg shadow"
                      placeholder="Enter investment period"
                    />
                  </div>
                  <button
                    onClick={calculateInvestment}
                    className="w-full btn btn-primary text-lg px-10 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-semibold shadow-lg mt-4"
                  >
                    Calculate
                  </button>
                  {futureValue > 0 && (
                    <div className="mt-8 p-6 bg-gray-700/70 rounded-xl shadow text-center">
                      <h3 className="text-2xl font-semibold mb-2 text-green-400">Future Value</h3>
                      <p className="text-4xl font-bold text-green-300">${futureValue.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            {/* Net Worth Calculator */}
            {activeTab === 'networth' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-pink-900/60 to-blue-900/80 rounded-2xl shadow-2xl border border-pink-700/30 p-10"
              >
                <h2 className="text-3xl font-bold mb-8 text-white">Net Worth Calculator</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <h3 className="text-2xl font-semibold mb-6 text-pink-300">Assets</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-semibold mb-2 text-pink-300">Cash & Savings</label>
                        <input
                          type="number"
                          value={assets.cash}
                          onChange={(e) => setAssets({ ...assets, cash: e.target.value })}
                          className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400 text-lg shadow"
                          placeholder="Enter amount"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-semibold mb-2 text-pink-300">Investments</label>
                        <input
                          type="number"
                          value={assets.investments}
                          onChange={(e) => setAssets({ ...assets, investments: e.target.value })}
                          className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400 text-lg shadow"
                          placeholder="Enter amount"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-semibold mb-2 text-pink-300">Property Value</label>
                        <input
                          type="number"
                          value={assets.property}
                          onChange={(e) => setAssets({ ...assets, property: e.target.value })}
                          className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400 text-lg shadow"
                          placeholder="Enter amount"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-semibold mb-2 text-pink-300">Vehicles</label>
                        <input
                          type="number"
                          value={assets.vehicles}
                          onChange={(e) => setAssets({ ...assets, vehicles: e.target.value })}
                          className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400 text-lg shadow"
                          placeholder="Enter amount"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-semibold mb-2 text-pink-300">Other</label>
                        <input
                          type="number"
                          value={assets.other}
                          onChange={(e) => setAssets({ ...assets, other: e.target.value })}
                          className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400 text-lg shadow"
                          placeholder="Enter amount"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-6 text-blue-300">Liabilities</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-semibold mb-2 text-blue-300">Mortgage</label>
                        <input
                          type="number"
                          value={liabilities.mortgage}
                          onChange={(e) => setLiabilities({ ...liabilities, mortgage: e.target.value })}
                          className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-lg shadow"
                          placeholder="Enter amount"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-semibold mb-2 text-blue-300">Loans</label>
                        <input
                          type="number"
                          value={liabilities.loans}
                          onChange={(e) => setLiabilities({ ...liabilities, loans: e.target.value })}
                          className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-lg shadow"
                          placeholder="Enter amount"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-semibold mb-2 text-blue-300">Credit Cards</label>
                        <input
                          type="number"
                          value={liabilities.creditCards}
                          onChange={(e) => setLiabilities({ ...liabilities, creditCards: e.target.value })}
                          className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-lg shadow"
                          placeholder="Enter amount"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-semibold mb-2 text-blue-300">Other</label>
                        <input
                          type="number"
                          value={liabilities.other}
                          onChange={(e) => setLiabilities({ ...liabilities, other: e.target.value })}
                          className="w-full px-6 py-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-lg shadow"
                          placeholder="Enter amount"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={calculateNetWorth}
                  className="w-full btn btn-primary text-lg px-10 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 font-semibold shadow-lg mt-4"
                >
                  Calculate
                </button>
                <div className="mt-8 p-6 bg-gray-700/70 rounded-xl shadow text-center">
                  <h3 className="text-2xl font-semibold mb-2 text-green-400">Net Worth</h3>
                  <p className="text-4xl font-bold text-green-300">${netWorth.toFixed(2)}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Product Information Section */}
      <div className="container mx-auto px-4 mt-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Our Financial Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Smart Savings</h3>
              <p className="text-gray-400">
                Our AI-powered savings accounts automatically optimize your returns while maintaining liquidity. Get up to 4.5% APY with no minimum balance requirements.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Investment Portfolio</h3>
              <p className="text-gray-400">
                Diversified investment portfolios managed by AI algorithms. Choose from conservative to aggressive strategies based on your risk tolerance.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Smart Loans</h3>
              <p className="text-gray-400">
                Competitive personal and business loans with flexible terms. Our AI analyzes your financial profile to offer the best possible rates.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Tax Optimization</h3>
              <p className="text-gray-400">
                Automated tax planning and optimization tools that help you maximize deductions and minimize tax liability throughout the year.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose AnkFin Section */}
      <section id="why-choose-ankfin" className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Why Choose AnkFin?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Smart Automation</h3>
              <p className="text-gray-400 text-center">
                Automate your financial workflows and save time with our intelligent banking solutions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Real-time Analytics</h3>
              <p className="text-gray-400 text-center">
                Get detailed insights into your business finances with our advanced analytics tools.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Secure Transactions</h3>
              <p className="text-gray-400 text-center">
                Bank with confidence using our enterprise-grade security infrastructure.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="container mx-auto px-4 mt-20 text-center">
        <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of users who trust AnkFin for their financial needs.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="mailto:ventureai2025@gmail.com?subject=AnkFin Products Inquiry&body=Hello,%0D%0A%0D%0AI'm interested in learning more about AnkFin's financial products.%0D%0A%0D%0ABest regards,"
            className="btn btn-secondary text-lg px-8 py-4 mt-8 shadow-lg mb-16"
          >
            Contact Sales
          </a>
        </div>
      </div>
    </div>
  )
} 