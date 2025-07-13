'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense' | 'PAYMENT'
  category: string
  description: string | null
  date: string
  isReversible?: boolean
  reversibleUntil?: string
  reversed?: boolean
}

export default function TransactionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [reversingId, setReversingId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        let userEmail = null;
        if (typeof window !== 'undefined') {
          const userData = localStorage.getItem('user');
          if (userData) {
            try {
              userEmail = JSON.parse(userData).email;
            } catch {}
          }
        }
        const response = await fetch('/api/transactions', {
          headers: {
            ...(userEmail ? { 'x-user-email': userEmail } : {}),
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchTransactions();
    }
  }, [session]);

  const handleReverse = async (id: string) => {
    setReversingId(id)
    try {
      const res = await fetch(`/api/transactions/reverse-bill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setTransactions((prev) => prev.map(t => t.id === id ? { ...t, reversed: true, isReversible: false } : t))
      }
    } finally {
      setReversingId(null)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <div className="text-xl text-white animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold animate-slide-in-right">Transactions</h1>
            <button className="btn btn-primary">
              Add Transaction
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-center py-12 animate-slide-in-left">
              <h3 className="text-lg font-medium text-white mb-2">
                No transactions
              </h3>
              <p className="text-gray-400">
                Get started by adding your first transaction.
              </p>
            </div>
          ) : (
            <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 overflow-hidden animate-slide-in-right">
              <ul className="divide-y divide-gray-700">
                {transactions.map((transaction) => {
                  const isReversible = transaction.isReversible && !transaction.reversed && transaction.reversibleUntil && new Date(transaction.reversibleUntil) > new Date();
                  let timeLeft = '';
                  if (isReversible && transaction.reversibleUntil) {
                    const diff = new Date(transaction.reversibleUntil).getTime() - Date.now();
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    timeLeft = `${hours}h ${mins}m left to reverse`;
                  }
                  return (
                    <li key={transaction.id} className="hover:bg-gray-700/50 transition-colors">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                  transaction.type === 'income'
                                    ? 'bg-green-900/50 text-green-400'
                                    : 'bg-red-900/50 text-red-400'
                                }`}
                              >
                                {transaction.type === 'income' ? '+' : '-'}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {transaction.description || transaction.category}
                              </div>
                              <div className="text-sm text-gray-400">
                                {transaction.category}
                              </div>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <div
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transaction.type === 'income'
                                  ? 'bg-green-900/50 text-green-400'
                                  : 'bg-red-900/50 text-red-400'
                              }`}
                            >
                              ${Math.abs(transaction.amount).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <div className="flex items-center text-sm text-gray-400">
                              {new Date(transaction.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        {isReversible && (
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              className="btn btn-warning btn-sm"
                              disabled={reversingId === transaction.id}
                              onClick={() => handleReverse(transaction.id)}
                            >
                              {reversingId === transaction.id ? 'Reversing...' : 'Reverse'}
                            </button>
                            <span className="text-xs text-yellow-400">{timeLeft}</span>
                          </div>
                        )}
                        {transaction.reversed && (
                          <div className="mt-2 text-xs text-red-400">Reversed</div>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 