'use client'

import Link from 'next/link'
import { useState } from 'react'
import styles from './Navigation.module.css'

export default function Navigation({ setShowWaitlistModal }: { setShowWaitlistModal: (open: boolean) => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className={styles.nav}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className={styles.logo}>
              AnkFin
            </Link>
            <div className="hidden md:flex ml-10 space-x-6">
              <Link href="/products" className={styles.navLink}>
                Products
              </Link>
              <Link href="/solutions" className={styles.navLink}>
                Solutions
              </Link>
              <Link href="/pricing" className={styles.navLink}>
                Pricing
              </Link>
              <Link href="/employers" className={styles.navLink}>
                For Employers
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              className={styles.signUpButton}
              onClick={() => setShowWaitlistModal(true)}
            >
              Join Waitlist
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={styles.mobileMenuButton}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/products" className={styles.mobileMenuItem}>
                Products
              </Link>
              <Link href="/solutions" className={styles.mobileMenuItem}>
                Solutions
              </Link>
              <Link href="/pricing" className={styles.mobileMenuItem}>
                Pricing
              </Link>
              <Link href="/employers" className={styles.mobileMenuItem}>
                For Employers
              </Link>
              <button
                className={styles.signUpButton + " block w-full text-center mt-2"}
                onClick={() => {
                  setShowWaitlistModal(true)
                  setIsMenuOpen(false)
                }}
              >
                Join Waitlist
              </button>
            </div>
          </div>
        )}
        {/* Waitlist Modal placeholder (to be implemented in layout) */}
      </div>
    </nav>
  )
} 