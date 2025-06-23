'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function APIPage() {
  const apiFeatures = [
    {
      name: "RESTful API",
      description: "Modern RESTful API with comprehensive documentation and SDKs",
      endpoints: [
        "Authentication & Authorization",
        "Account Management",
        "Transaction Processing",
        "Payment Processing",
        "Financial Analytics"
      ]
    },
    {
      name: "Webhooks",
      description: "Real-time event notifications for your applications",
      endpoints: [
        "Transaction Events",
        "Account Updates",
        "Payment Status",
        "Security Alerts",
        "System Notifications"
      ]
    },
    {
      name: "Data Analytics",
      description: "Access to powerful financial analytics and reporting tools",
      endpoints: [
        "Financial Metrics",
        "Custom Reports",
        "Trend Analysis",
        "Performance Indicators",
        "Risk Assessment"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white py-20">
      {/* Header Section */}
      <div className="container mx-auto px-4 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          AnkFin API Documentation
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Build powerful financial applications with our comprehensive API suite. Integrate banking features into your applications with ease.
        </p>
      </div>

      {/* API Features */}
      <div className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {apiFeatures.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl"
            >
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {feature.name}
              </h3>
              <p className="text-gray-400 mb-6">{feature.description}</p>
              <ul className="space-y-2">
                {feature.endpoints.map((endpoint) => (
                  <li key={endpoint} className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {endpoint}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Code Example Section */}
      <div className="container mx-auto px-4 mb-20">
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Quick Start Guide
        </h2>
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl max-w-4xl mx-auto">
          <pre className="text-sm text-gray-300 overflow-x-auto">
            <code>{`// Initialize AnkFin API client
const ankfin = new AnkFinAPI({
  apiKey: 'your_api_key',
  environment: 'production'
});

// Example: Get account balance
async function getBalance() {
  try {
    const balance = await ankfin.accounts.getBalance('acc_123');
    console.log('Account balance:', balance);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example: Create a transaction
async function createTransaction() {
  try {
    const transaction = await ankfin.transactions.create({
      amount: 1000,
      currency: 'USD',
      description: 'Payment for services',
      recipient: 'rec_456'
    });
    console.log('Transaction created:', transaction);
  } catch (error) {
    console.error('Error:', error);
  }
}`}</code>
          </pre>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Ready to Start Building?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Get started with our API today and transform your financial applications.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/signup" className="btn btn-primary text-lg px-8 py-4">
            Get API Key
          </Link>
          <Link href="/login" className="btn btn-secondary text-lg px-8 py-4">
            View Full Documentation
          </Link>
        </div>
      </div>
    </div>
  )
} 