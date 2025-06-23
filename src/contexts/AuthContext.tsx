'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  companyName?: string
  role?: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, firstName?: string, lastName?: string, companyName?: string) => Promise<string | void>
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

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string, companyName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) {
      throw new Error(error.message)
    }
    // If user is null, email confirmation is likely required
    if (!data.user) {
      return 'Check your email to confirm your account before logging in.'
    }
    setUser(data.user)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      throw new Error(error.message)
    }
    if (!data.user) {
      throw new Error('No user found. Please check your credentials or confirm your email.')
    }
    setUser(data.user)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const signOut = async () => {
    await supabase.auth.signOut()
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