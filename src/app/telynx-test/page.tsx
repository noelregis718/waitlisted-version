'use client'

import { useState } from 'react'

export default function TelynxTestPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testTelynxKey = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-telynx-key')
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Test failed:', error)
      setResults({ error: 'Test failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Telynx API Key Test</h1>
        
        <button
          onClick={testTelynxKey}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-6"
        >
          {loading ? 'Testing...' : 'Test Telynx API Key'}
        </button>

        {results && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">API Key Status</h3>
                <p className="text-sm text-gray-600">
                  Configured: {results.apiKeyConfigured ? 'Yes' : 'No'}
                  {results.apiKeyLength && ` | Length: ${results.apiKeyLength}`}
                </p>
              </div>

              {results.tests && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Balance Endpoint</h3>
                    <div className="bg-gray-100 p-3 rounded text-sm">
                      <p><strong>Status:</strong> {results.tests.balance.status}</p>
                      <p><strong>Success:</strong> {results.tests.balance.success ? 'Yes' : 'No'}</p>
                      <p><strong>Response:</strong></p>
                      <pre className="whitespace-pre-wrap text-xs mt-2">
                        {results.tests.balance.response}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700">Phone Numbers Endpoint</h3>
                    <div className="bg-gray-100 p-3 rounded text-sm">
                      <p><strong>Status:</strong> {results.tests.phoneNumbers.status}</p>
                      <p><strong>Success:</strong> {results.tests.phoneNumbers.success ? 'Yes' : 'No'}</p>
                      <p><strong>Response:</strong></p>
                      <pre className="whitespace-pre-wrap text-xs mt-2">
                        {results.tests.phoneNumbers.response}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700">Messaging Profiles Endpoint</h3>
                    <div className="bg-gray-100 p-3 rounded text-sm">
                      <p><strong>Status:</strong> {results.tests.messagingProfiles.status}</p>
                      <p><strong>Success:</strong> {results.tests.messagingProfiles.success ? 'Yes' : 'No'}</p>
                      <p><strong>Response:</strong></p>
                      <pre className="whitespace-pre-wrap text-xs mt-2">
                        {results.tests.messagingProfiles.response}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {results.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <strong>Error:</strong> {results.error}
                  {results.details && <p className="mt-2 text-sm">{results.details}</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 