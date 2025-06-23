'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PrivacyPage() {
  const privacySections = [
    {
      title: "Data Protection",
      content: "AnkFin adheres to strict data protection standards in compliance with US banking regulations. We implement industry-leading encryption and security measures to protect your personal and financial information."
    },
    {
      title: "Information Collection",
      content: "We collect only the information necessary to provide our banking services, including personal identification, financial information, and transaction data. All data collection follows US banking regulations and consumer protection laws."
    },
    {
      title: "Data Usage",
      content: "Your information is used solely for providing banking services, processing transactions, and maintaining regulatory compliance. We never sell your personal data to third parties."
    },
    {
      title: "Regulatory Compliance",
      content: "AnkFin operates in full compliance with US banking regulations, including the Bank Secrecy Act (BSA), Anti-Money Laundering (AML) laws, and the Gramm-Leach-Bliley Act (GLBA)."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white py-20">
      {/* Header Section */}
      <div className="container mx-auto px-4 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Privacy Policy
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Your privacy and security are our top priorities. Learn how we protect your information and comply with US banking regulations.
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {privacySections.map((section, index) => (
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
        <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Have Questions?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Our team is here to help you understand our privacy practices.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="mailto:ventureai2025@gmail.com?subject=AnkFin Privacy Policy Inquiry&body=Hello,%0D%0A%0D%0AI have a question about AnkFin's privacy policy:%0D%0A%0D%0ABest regards,"
            className="btn btn-primary text-lg px-8 py-4"
          >
            Contact Us
          </a>
          <Link href="/terms" className="btn btn-secondary text-lg px-8 py-4">
            View Terms of Service
          </Link>
        </div>
      </div>
    </div>
  )
} 