'use client'

import './globals.css'
import Navigation from '@/components/Navigation'
import { Inter } from 'next/font/google'
import WaitlistModal from '@/components/WaitlistModal'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showWaitlistModal, setShowWaitlistModal] = useState(false)
  return (
    <html lang="en" className="dark">
      <head>
        <title>AnkFin - Financial Operating System</title>
        <meta name="description" content="Experience seamless Financial Operation System with smart automation and intelligent insights with AnkFin." />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white`}>
        <Navigation setShowWaitlistModal={setShowWaitlistModal} />
        <WaitlistModal open={showWaitlistModal} onClose={() => setShowWaitlistModal(false)} />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
} 