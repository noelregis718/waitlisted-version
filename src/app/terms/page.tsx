"use client"

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col justify-center items-center">
      <section className="w-full py-24 bg-gradient-to-r from-blue-900 via-black to-purple-900 shadow-lg">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-center drop-shadow-lg">Terms of Service</h1>
          <p className="text-xl text-gray-200 max-w-2xl text-center mb-8 font-medium">
            Please read these Terms of Service carefully before using AnkFin.
          </p>
        </div>
      </section>
      <section className="w-full py-16 flex-1 flex flex-col justify-center">
        <div className="container mx-auto px-4 max-w-3xl flex flex-col items-center">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-xl p-10 border border-gray-700 flex flex-col text-left w-full">
            <h2 className="text-2xl font-semibold mb-4 text-blue-300">1. Acceptance of Terms</h2>
            <p className="text-gray-300 mb-6">By accessing or using AnkFin, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, please do not use our services.</p>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">2. Use of Service</h2>
            <p className="text-gray-300 mb-6">You agree to use AnkFin only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.</p>
            <h2 className="text-2xl font-semibold mb-4 text-pink-300">3. Privacy</h2>
            <p className="text-gray-300 mb-6">Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and safeguard your information.</p>
            <h2 className="text-2xl font-semibold mb-4 text-green-300">4. Limitation of Liability</h2>
            <p className="text-gray-300 mb-6">AnkFin is provided "as is" and "as available" without warranties of any kind. We are not liable for any damages or losses resulting from your use of our services.</p>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-300">5. Contact</h2>
            <p className="text-gray-300">If you have any questions about these Terms, please contact us at <a href="mailto:ventureai2025@gmail.com" className="text-blue-400 underline">ventureai2025@gmail.com</a>.</p>
          </div>
        </div>
      </section>
    </div>
  );
} 