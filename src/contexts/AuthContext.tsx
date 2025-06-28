'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email?: string
  firstName?: string
  lastName?: string
  companyName?: string
  role?: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, businessName?: string, phoneNumber?: string, monthlyIncome?: string) => Promise<string | void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  const signUp = async (email: string, password: string, businessName?: string, phoneNumber?: string, monthlyIncome?: string) => {
    try {
      // Use only the custom registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName: '',
          lastName: '',
          companyName: businessName,
          profile: {
            phoneNumber,
            monthlyIncome,
          }
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create account')
      }
      
      // Set the user in local state
      const userData = {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        companyName: result.user.companyName,
        role: result.user.role
      }
      
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      
      return 'Account created successfully! Welcome to AnkFin!'
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account')
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to sign in')
      }

      // Set the user in local state
      const userData = {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        companyName: result.user.companyName,
        role: result.user.role
      }
      
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in')
    }
  }

  const signOut = async () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 