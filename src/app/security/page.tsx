'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function SecurityPage() {
  const securityFeatures = [
    {
      feature: "End-to-End Encryption",
      ankfin: "256-bit AES encryption",
      competitors: "128-bit encryption (Chime), 256-bit (YNAB, Rocket Money)",
      advantage: "Stronger encryption than most competitors"
    },
    {
      feature: "Multi-Factor Authentication",
      ankfin: "Biometric, SMS, Email, and Hardware Key support",
      competitors: "Basic 2FA (Chime), SMS only (YNAB), Email + SMS (Rocket Money)",
      advantage: "Multiple authentication options for enhanced security"
    },
    {
      feature: "Fraud Detection",
      ankfin: "AI-powered real-time monitoring",
      competitors: "Basic rule-based systems",
      advantage: "More sophisticated and proactive fraud prevention"
    },
    {
      feature: "Data Protection",
      ankfin: "GDPR, CCPA, and SOC 2 Type II compliant",
      competitors: "Basic compliance only",
      advantage: "Higher compliance standards"
    },
    {
      feature: "Secure Storage",
      ankfin: "Distributed cloud storage with redundancy",
      competitors: "Single cloud provider",
      advantage: "Better data availability and protection"
    },
    {
      feature: "Regular Security Audits",
      ankfin: "Quarterly third-party audits",
      competitors: "Annual or bi-annual audits",
      advantage: "More frequent security validation"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white py-20">
      {/* Header Section */}
      <div className="container mx-auto px-4 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Enterprise-Grade Security
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Your financial data deserves the highest level of protection. See how AnkFin's security measures compare to industry standards.
        </p>
      </div>

      {/* Security Comparison Table */}
      <div className="container mx-auto px-4 mb-20">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="p-4 text-left">Security Feature</th>
                <th className="p-4 text-left">AnkFin</th>
                <th className="p-4 text-left">Competitors</th>
                <th className="p-4 text-left">Our Advantage</th>
              </tr>
            </thead>
            <tbody>
              {securityFeatures.map((feature, index) => (
                <motion.tr
                  key={feature.feature}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border-b border-gray-800"
                >
                  <td className="p-4 font-semibold">{feature.feature}</td>
                  <td className="p-4 text-green-400">{feature.ankfin}</td>
                  <td className="p-4 text-gray-400">{feature.competitors}</td>
                  <td className="p-4 text-blue-400">{feature.advantage}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Security Features */}
      <div className="container mx-auto px-4 mb-20">
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Additional Security Measures
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold mb-4">Continuous Monitoring</h3>
            <p className="text-gray-400">
              24/7 security monitoring with automated threat detection and response systems.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold mb-4">Secure Development</h3>
            <p className="text-gray-400">
              Regular security training for developers and strict code review processes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold mb-4">Data Privacy</h3>
            <p className="text-gray-400">
              Strict data privacy controls and regular privacy impact assessments.
            </p>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Ready to Experience Secure Banking?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of businesses that trust AnkFin with their financial data.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/signup" className="btn btn-primary text-lg px-8 py-4">
            Get Started
          </Link>
          <a
            href="mailto:ventureai2025@gmail.com?subject=AnkFin Security Inquiry&body=Hello,%0D%0A%0D%0AI'm interested in learning more about AnkFin's security features.%0D%0A%0D%0ABest regards,"
            className="btn btn-secondary text-lg px-8 py-4"
          >
            Contact Sales
          </a>
        </div>
      </div>
    </div>
  )
} 