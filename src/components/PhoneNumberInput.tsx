'use client'

import { useState } from 'react'

interface PhoneNumberInputProps {
  initialValue?: string
  onSave: (phoneNumber: string) => Promise<void>
}

export default function PhoneNumberInput({ initialValue = '', onSave }: PhoneNumberInputProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialValue)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await onSave(phoneNumber)
      alert('Phone number updated successfully! You will now receive SMS notifications for transactions.')
    } catch (error) {
      console.error('Error updating phone number:', error)
      alert('Failed to update phone number. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">
          Phone Number (for SMS notifications)
        </label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+1234567890"
          className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <p className="mt-1 text-sm text-gray-400">
          Enter your phone number to receive SMS notifications for transactions from AnkFin (+1-856-492-8674)
        </p>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save Phone Number'}
      </button>
    </form>
  )
} 