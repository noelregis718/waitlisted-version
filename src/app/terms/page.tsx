'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function TermsPage() {
  const termsSections = [
    {
      title: "Account Terms",
      content: "By opening an account with AnkFin, you agree to maintain accurate information, protect your account credentials, and comply with all applicable banking regulations. We reserve the right to close accounts that violate our terms."
    },
    {
      title: "Service Usage",
      content: "Our banking services are provided 'as is' and are subject to availability. We strive to maintain 24/7 service availability but may occasionally need to perform maintenance or updates to improve our services."
    },
    {
      title: "Customer Responsibilities",
      content: "Customers are responsible for maintaining the security of their accounts, reporting unauthorized transactions promptly, and ensuring sufficient funds for transactions. We provide tools and alerts to help you manage your account effectively."
    },
    {
      title: "Bank's Responsibilities",
      content: "AnkFin is committed to providing secure, reliable banking services. We maintain FDIC insurance, implement robust security measures, and provide 24/7 customer support to address your concerns."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white py-20">
      {/* Header Section */}
      <div className="container mx-auto px-4 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Terms of Service
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Understanding our commitment to providing you with the best banking experience while maintaining clear terms and conditions.
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {termsSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {section.title}
              </h2>
              <p className="text-gray-300 text-lg">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 text-center mt-16">
        <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-4">
          Need Clarification?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Our team is ready to help you understand our terms and conditions.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="mailto:ventureai2025@gmail.com?subject=FlowBank Terms of Service Inquiry&body=Hello,%0D%0A%0D%0AI have a question about FlowBank's terms of service:%0D%0A%0D%0ABest regards,"
            className="btn btn-primary text-lg px-8 py-4"
          >
            Contact Us
          </a>
          <Link href="/privacy" className="btn btn-secondary text-lg px-8 py-4">
            View Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
} 