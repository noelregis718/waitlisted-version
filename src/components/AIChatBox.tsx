import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const AIChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput('');
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      if (!res.ok) throw new Error('Failed to get AI response');
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'ai', content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'ai', content: 'Sorry, I could not get a response from the AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Modern Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-blue-700/40 bg-gradient-to-r from-blue-800/60 via-gray-900/60 to-purple-800/60 rounded-t-2xl flex-shrink-0">
        <span className="text-2xl">🤖</span>
        <span className="font-semibold text-lg tracking-wide text-white">AnkFin AI Assistant</span>
      </div>
      
      {/* Scrollable Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-white/5 backdrop-blur-md min-h-0"
        style={{ 
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          maxHeight: 'calc(100% - 120px)' // Reserve space for header and input
        }}
      >
        {messages.length === 0 && (
          <div className="text-gray-400 text-center mt-16">
            Ask me anything about AnkFin, our founder, or your finances!<br/>
            Try: 'Who is the founder?', 'My salary is 5000', or 'How can I save more?'
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs break-words text-sm shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-800/80 text-blue-100 border border-blue-700/30'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl bg-gray-800/80 text-blue-100 border border-blue-700/30">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="p-3 border-t border-blue-700/30 bg-gradient-to-r from-gray-900/70 to-blue-900/70 flex gap-2 rounded-b-2xl flex-shrink-0">
        <input
          type="text"
          className="flex-1 rounded-xl px-3 py-2 bg-gray-800/80 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-700/30 placeholder-gray-400 shadow-sm"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2 rounded-xl font-semibold shadow-md transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChatBox; 