"use client"

import Link from "next/link";

export default function CareersPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white flex flex-col justify-center items-center">
      <section className="w-full py-24 bg-gradient-to-r from-purple-900 via-black to-blue-900 shadow-lg">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 text-center drop-shadow-lg">Careers at AnkFin</h1>
          <p className="text-xl text-gray-200 max-w-2xl text-center mb-8 font-medium">
            Join us in building the future of digital Financial Operation System. We’re always looking for passionate, talented people to help us innovate and grow.
          </p>
        </div>
      </section>
      <section className="w-full py-16 flex-1 flex flex-col justify-center">
        <div className="container mx-auto px-4 max-w-2xl flex flex-col items-center">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-xl p-10 border border-gray-700 flex flex-col items-center text-center">
            <h2 className="text-3xl font-semibold mb-4 text-blue-300">No Open Roles</h2>
            <p className="text-lg text-gray-300 mb-2">We currently do not have any open positions at AnkFin.</p>
            <p className="text-md text-gray-400">Please check back soon or follow us for future opportunities!</p>
          </div>
        </div>
      </section>
    </div>
  );
} 