'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PrivacyPage() {
  const privacySections = [
    {
      title: "Data Protection",
      content: "AnkFin adheres to strict data protection standards in compliance with US Financial Operation System regulations. We implement industry-leading encryption and security measures to protect your personal and financial information."
    },
    {
      title: "Information Collection",
      content: "We collect only the information necessary to provide our Financial Operation System services, including personal identification, financial information, and transaction data. All data collection follows US Financial Operation System regulations and consumer protection laws."
    },
    {
      title: "Data Usage",
      content: "Your information is used solely for providing Financial Operation System services, processing transactions, and maintaining regulatory compliance. We never sell your personal data to third parties."
    },
    {
      title: "Regulatory Compliance",
      content: "AnkFin operates in full compliance with US Financial Operation System regulations, including the Bank Secrecy Act (BSA), Anti-Money Laundering (AML) laws, and the Gramm-Leach-Bliley Act (GLBA)."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white py-24">
      {/* Header Section */}
      <div className="container mx-auto px-4 text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg">
          Privacy Policy
        </h1>
        <p className="text-2xl text-gray-300 max-w-2xl mx-auto font-medium">
          Your privacy and security are our top priorities. Learn how we protect your information and comply with US Financial Operation System regulations.
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {privacySections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl hover:shadow-blue-400/30 transition-shadow duration-300 p-10 rounded-3xl mb-10 group"
            >
              <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 group-hover:from-pink-400 group-hover:to-blue-400 transition-colors duration-300">
                {section.title}
              </h2>
              <p className="text-gray-200 text-lg leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 text-center mt-24">
        <h2 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg">
          Have Questions?
        </h2>
        <p className="text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-medium">
          Our team is here to help you understand our privacy practices.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <a
            href="mailto:ventureai2025@gmail.com?subject=AnkFin Privacy Policy Inquiry&body=Hello,%0D%0A%0D%0AI have a question about AnkFin's privacy policy:%0D%0A%0D%0ABest regards,"
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold text-lg px-10 py-4 shadow-lg hover:scale-105 hover:shadow-pink-400/40 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Contact Us
          </a>
          <Link
            href="/terms"
            className="inline-block rounded-full border-2 border-blue-400 text-blue-200 font-semibold text-lg px-10 py-4 bg-white/5 shadow-lg hover:bg-blue-400/10 hover:text-white hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            View Terms of Service
          </Link>
        </div>
      </div>
    </div>
  )
} 