'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PricingPage() {
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
      price: '$59',
      period: 'per month',
      description: 'Ideal for growing businesses with more complex needs',
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
      price: '$129',
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white py-20">
      {/* Header Section */}
      <div className="container mx-auto px-4 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Choose the perfect plan for your business needs. All plans include a 14-day free trial.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                tier.popular
                  ? 'bg-gradient-to-b from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50'
                  : 'bg-gray-800/50 border border-gray-700/50'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-gray-400">{tier.period}</span>
                </div>
                <p className="text-gray-400 mt-4">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0"
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
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {tier.name === 'Enterprise' ? (
                <a
                  href="mailto:ventureai2025@gmail.com?subject=FlowBank Enterprise Inquiry&body=Hello,%0D%0A%0D%0AI'm interested in the Enterprise plan for FlowBank.%0D%0A%0D%0ABest regards,"
                  className="block w-full text-center btn btn-primary text-lg px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {tier.cta}
                </a>
              ) : (
                <Link
                  href="/signup"
                  className="block w-full text-center btn btn-primary text-lg px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {tier.cta}
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 mt-20">
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Can I change plans later?</h3>
            <p className="text-gray-400">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">What happens after the free trial?</h3>
            <p className="text-gray-400">
              After your 14-day free trial, you'll be automatically charged for the plan you selected. You can cancel anytime during the trial period.
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2">Do you offer refunds?</h3>
            <p className="text-gray-400">
              We offer a 30-day money-back guarantee if you're not satisfied with our service. Contact our support team to process your refund.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 mt-20 text-center">
        <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Still have questions?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Our team is here to help you choose the right plan for your business needs.
        </p>
        <a
          href="mailto:ventureai2025@gmail.com?subject=FlowBank Pricing Questions&body=Hello,%0D%0A%0D%0AI have some questions about FlowBank's pricing plans.%0D%0A%0D%0ABest regards,"
          className="inline-block btn btn-secondary text-lg px-8 py-3"
        >
          Contact Sales
        </a>
      </div>
    </div>
  )
} 