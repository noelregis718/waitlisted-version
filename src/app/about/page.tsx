"use client"

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col justify-center items-center">
      <section className="w-full py-24 bg-gradient-to-r from-blue-900 via-black to-purple-900 shadow-lg">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-center drop-shadow-lg">About AnkFin</h1>
          <p className="text-xl text-gray-200 max-w-2xl text-center mb-8 font-medium">
            Revolutionizing modern Financial Operation System for businesses and individuals with seamless, AI-powered financial management, automated workflows, and intelligent insights.
          </p>
        </div>
      </section>
      <section className="w-full py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border border-gray-700">
            <h2 className="text-3xl font-semibold mb-3 text-blue-300">Our Mission</h2>
            <p className="text-lg text-gray-300">Empowering users to take control of their finances with smart automation, transparency, and personalized insights.</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border border-gray-700">
            <h2 className="text-3xl font-semibold mb-3 text-purple-300">Our Vision</h2>
            <p className="text-lg text-gray-300">To be the most trusted and innovative digital Financial Operation System platform for the next generation of businesses and individuals.</p>
          </div>
        </div>
      </section>
      <section className="w-full py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-semibold mb-8 text-white text-center">What Makes AnkFin Different?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4 bg-gray-800/70 rounded-xl p-6 shadow-md border border-gray-700">
              <span className="text-blue-400 text-3xl">&#9733;</span>
              <span className="text-lg text-gray-200">AI-powered financial management for smarter, faster decisions.</span>
            </div>
            <div className="flex items-start gap-4 bg-gray-800/70 rounded-xl p-6 shadow-md border border-gray-700">
              <span className="text-purple-400 text-3xl">&#128640;</span>
              <span className="text-lg text-gray-200">Automated workflows that save you time and reduce manual effort.</span>
            </div>
            <div className="flex items-start gap-4 bg-gray-800/70 rounded-xl p-6 shadow-md border border-gray-700">
              <span className="text-pink-400 text-3xl">&#128176;</span>
              <span className="text-lg text-gray-200">Personalized insights and analytics to help you grow your wealth.</span>
            </div>
            <div className="flex items-start gap-4 bg-gray-800/70 rounded-xl p-6 shadow-md border border-gray-700">
              <span className="text-green-400 text-3xl">&#128274;</span>
              <span className="text-lg text-gray-200">Enterprise-grade security and privacy for your peace of mind.</span>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-semibold mb-8 text-white text-center">Meet the Founder</h2>
          <div className="bg-gradient-to-br from-blue-900/60 to-purple-900/60 rounded-2xl shadow-xl p-8 border border-gray-700 flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold mb-2 text-blue-300">Ven-Kerry Prince</h3>
            <p className="text-lg text-gray-200">
              Ven-Kerry Prince brings deep expertise in Financial Operation System, marketing, management, operations, and financial frontline experience. As Head of Strategy & Execution, Ven-Kerry leads AnkFin with a vision for innovation and excellence in financial services.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 