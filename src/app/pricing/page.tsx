'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import WaitlistModal from '@/components/WaitlistModal'

export default function PricingPage() {
  const [showWaitlistModal, setShowWaitlistModal] = useState(false)
  const tiers = [
    {
      name: 'Freemium',
      price: '$0',
      period: 'per month',
      description: 'Perfect for individuals and small businesses starting their financial journey',
      features: [
        'Basic income tracking',
        'Simple expense categorization',
        'Monthly financial summary',
        'Community support',
        'Up to 50 transactions/month',
        'Basic tax calculations',
        'Mobile app access',
        'Basic financial reports',
        'Basic budget planning',
        'Email notifications',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$9',
      period: 'per month',
      description: 'Ideal for growing personal portfolio with more complex needs',
      features: [
        'Everything in Freemium, plus:',
        'Advanced expense tracking',
        'Real-time financial insights',
        'Priority email & chat support',
        'Up to 1,000 transactions/month',
        'Advanced tax planning',
        'Custom financial reports',
        'Multi-currency support',
        'Automated categorization',
        'Financial forecasting',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: 'per month',
      description: 'For established businesses requiring advanced features',
      features: [
        'Everything in Professional, plus:',
        'Unlimited transactions',
        'Dedicated account manager',
        '24/7 priority support',
        'Custom integrations',
        'Advanced analytics & forecasting',
        'Team collaboration tools',
        'API access',
        'Custom onboarding',
        'White-label solutions',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white flex flex-col">
      {/* Header Section */}
      <section className="py-24 bg-gradient-to-br from-blue-950 via-black to-purple-950 shadow-xl">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="max-w-4xl mx-auto text-center rounded-3xl shadow-2xl bg-gray-900/70 p-12 border border-gray-800">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg">Simple, Transparent Pricing</h1>
            <p className="text-2xl text-gray-200 mb-10 font-medium">Choose the perfect plan for your business needs. All plans include a 14-day free trial.</p>
          </div>
        </div>
      </section>
      {/* Pricing Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-3xl p-10 shadow-2xl border-2 ${
                  tier.popular
                    ? 'bg-gradient-to-b from-purple-500/30 to-pink-500/20 border-purple-500/50'
                    : 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700/50'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-2 text-white">{tier.name}</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-extrabold text-blue-400">{tier.price}</span>
                    <span className="text-lg text-gray-400">{tier.period}</span>
                  </div>
                  <p className="text-lg text-gray-300 mt-4">{tier.description}</p>
                </div>
                <ul className="space-y-4 mb-10">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg
                        className="w-6 h-6 text-green-400 mr-3 mt-1 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-lg text-gray-200">{feature}</span>
                    </li>
                  ))}
                </ul>
                {tier.name === 'Enterprise' ? (
                  <a
                    href="mailto:ventureai2025@gmail.com?subject=FlowBank Enterprise Inquiry&body=Hello,%0D%0A%0D%0AI'm interested in the Enterprise plan for FlowBank.%0D%0A%0D%0ABest regards,"
                    className="block w-full text-center btn btn-primary text-lg px-10 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 font-semibold shadow-lg"
                  >
                    {tier.cta}
                  </a>
                ) : (
                  <button
                    className="block w-full text-center btn btn-primary text-lg px-10 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 font-semibold shadow-lg"
                    onClick={() => setShowWaitlistModal(true)}
                  >
                    {tier.cta}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 mt-20">
          <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-semibold mb-2 text-white">Can I change plans later?</h3>
              <p className="text-lg text-gray-300">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-semibold mb-2 text-white">What happens after the free trial?</h3>
              <p className="text-lg text-gray-300">After your 14-day free trial, you'll be automatically charged for the plan you selected. You can cancel anytime during the trial period.</p>
            </div>
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-semibold mb-2 text-white">Do you offer refunds?</h3>
              <p className="text-lg text-gray-300">We offer a 30-day money-back guarantee if you're not satisfied with our service. Contact our support team to process your refund.</p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 mt-20 text-center">
          <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Still have questions?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Our team is here to help you choose the right plan for your business needs.</p>
          <a
            href="mailto:ventureai2025@gmail.com?subject=FlowBank Pricing Questions&body=Hello,%0D%0A%0D%0AI have some questions about FlowBank's pricing plans.%0D%0A%0D%0ABest regards,"
            className="inline-block btn btn-secondary text-lg px-10 py-4 rounded-xl shadow-lg"
          >
            Contact Sales
          </a>
        </div>
      </section>
      <WaitlistModal open={showWaitlistModal} onClose={() => setShowWaitlistModal(false)} />
    </div>
  )
} 