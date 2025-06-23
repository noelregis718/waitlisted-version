'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Goal {
  id: string
  name: string
  target: number
  current: number
  deadline: string | null
}

export default function GoalsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch('/api/goals')
        if (response.ok) {
          const data = await response.json()
          setGoals(data)
        }
      } catch (error) {
        console.error('Error fetching goals:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchGoals()
    }
  }, [session])

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
            <h1 className="text-3xl font-bold animate-slide-in-right">Financial Goals</h1>
            <button className="btn btn-primary">
              Add New Goal
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-center py-12 animate-slide-in-left">
              <h3 className="text-lg font-medium text-white mb-2">No goals</h3>
              <p className="text-gray-400">
                Get started by creating a new financial goal.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {goals.map((goal, index) => (
                <div
                  key={goal.id}
                  className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 overflow-hidden animate-slide-in-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-5">
                    <h3 className="text-lg font-medium text-white">
                      {goal.name}
                    </h3>
                    <div className="mt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Target</span>
                        <span className="font-medium text-white">
                          ${goal.target.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Current</span>
                        <span className="font-medium text-white">
                          ${goal.current.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                            <div
                              style={{
                                width: `${(goal.current / goal.target) * 100}%`,
                              }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 transition-all duration-500"
                            ></div>
                          </div>
                        </div>
                      </div>
                      {goal.deadline && (
                        <div className="mt-4 text-sm text-gray-400">
                          Deadline: {new Date(goal.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 