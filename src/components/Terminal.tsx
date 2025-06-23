import { useState, useEffect, useRef } from 'react'

interface TerminalProps {
  logs: string[]
  maxLines?: number
}

export default function Terminal({ logs, maxLines = 100 }: TerminalProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState('')

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  // Filter logs based on search term
  const filteredLogs = logs.filter(log => 
    filter ? log.toLowerCase().includes(filter.toLowerCase()) : true
  ).slice(-maxLines)

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-1/3 bg-gray-900 border-t border-l border-gray-700 shadow-lg">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium text-gray-200">Terminal</h3>
          <span className="px-2 py-0.5 text-xs bg-gray-700 text-gray-300 rounded">
            {filteredLogs.length} lines
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Filter logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-2 py-1 text-sm bg-gray-700 text-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-gray-200 focus:outline-none"
          >
            {isExpanded ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className={`bg-black font-mono text-sm overflow-auto transition-all duration-300 ${
          isExpanded ? 'h-96' : 'h-48'
        }`}
      >
        <div className="p-4 space-y-1">
          {filteredLogs.map((log, index) => (
            <div
              key={index}
              className="text-gray-300 whitespace-pre-wrap break-all"
            >
              <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 