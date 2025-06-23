'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white py-20">
      {/* Header Section */}
      <div className="container mx-auto px-4 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Join Our Team
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Be part of a team that's revolutionizing the future of banking.
        </p>
      </div>

      {/* Current Openings Message */}
      <div className="container mx-auto px-4 mb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Future Opportunities
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              While we don't have any open positions at the moment, we're always looking for talented individuals who are passionate about transforming the banking industry.
            </p>
            <p className="text-gray-300 text-lg mb-8">
              If you're interested in joining our team in the future, we encourage you to:
            </p>
            <ul className="text-gray-300 text-lg space-y-4 mb-8 text-left max-w-2xl mx-auto">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-400 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Follow us on social media for updates on future opportunities
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-400 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Submit your resume for future consideration
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-green-400 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Stay connected with our company updates
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Stay Connected
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Be the first to know when new opportunities become available.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="mailto:ventureai2025@gmail.com?subject=FlowBank Career Interest&body=Hello,%0D%0A%0D%0AI'm interested in future career opportunities at FlowBank.%0D%0A%0D%0ABest regards,"
            className="btn btn-primary text-lg px-8 py-4"
          >
            Submit Resume
          </a>
          <Link href="/about" className="btn btn-secondary text-lg px-8 py-4">
            Learn More About Us
          </Link>
        </div>
      </div>
    </div>
  )
} 