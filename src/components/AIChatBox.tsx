import React, { useState, useRef } from 'react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const ankfinInfo = `AnkFin is a smart money automation platform designed to help users automate the allocation of their income into bills, savings, taxes, and investments, based on personalized financial goals.\n\nFeatures:\n- Smart income allocation\n- Automated bill payments\n- Investment portfolio management\n- Tax optimization\n- Financial goal tracking\n- Bank account integration\n- Real-time financial insights`;

const ankfinExtendedInfo = `\n\nFounder: Ven-Kerry Prince\nWho are we: The Financial Brain for a New Generation!\nThink of it as an AI-powered CFO in your pocket, that manages your cash flow, bills, and goals automatically. Ankfin actually thinks ahead for you by preserving your present financial situation, protects your goals, and helps you realize your future.\nWe're not building a dashboard or another budget app. It's the financial brain that thinks, plans, and protects your money automatically. Takes in consideration of financial reality, makes decisions, and protects users in real time.\n\nThe Problem:\n- 57M+ Variable Income Earners (Freelancers, gig workers, hourly employees)\n- 65% Cash Flow Struggles (Monthly financial instability)\n- $32B Annual Overdraft\n\nOur Solution:\n- Automated Bill Management: Ankfin proactively detects upcoming bills through secure integrations like Plaid and facilitates smart, timely payments via our Moov/Stripe partnership, ensuring you never miss a due date.\n- AI-Powered Cash Flow Forecasting: Our advanced AI analyzes your income patterns and spending habits to predict future cash flow, providing early warnings to prevent overdrafts and financial instability.\n- Intelligent Savings & Goals: Achieve your financial dreams faster with automated, goal-based savings. FlowBank helps you set and reach milestones through gamified challenges and smart allocation of funds.\n- Personalized AI Financial Assistant: Get tailored financial advice and explore various spending scenarios with our AI assistant. It provides actionable guidance to optimize your budget and make informed financial decisions.\n\nProduct Experience:\n- Dashboard: Upcoming bills, balance forecast, savings status\n- AI Forecast: "Cash will last 17 days given current trajectory"\n- Smart Autopay: AI schedules payments based on paycheck timing\n- AI Chat: "Can I afford $75 on groceries this week?"\n\nMarket Opportunity:\n- 57M Variable Income Americans (Current market size)\n- 86M Gig Workers by 2027 (Projected growth)\n- $20B+ Personal Finance Market (Total addressable market)\n\nCore MVP Capabilities:\n- AI-powered cash flow forecasting and split engine\n- Smart bill detection and payment scheduling\n- Emergency savings buckets with intelligent auto-allocation\n- AI chat interface for real-time financial guidance\n- Cash transaction tracking via receipt capture\n- Location-based smart payment reminders\n- Gamified savings goals and financial achievements\n- Embedded financial product recommendations\n\nTraction and Validation:\n- MVP currently in development with core functionality: AI-powered cash flow, split engine, smart bill detection, savings buckets, and live financial dashboard.\n- 20+ user interviews completed across gig, hourly, and freelance segments confirming clear need for real-time guidance\n- Initial prototypes tested internally with positive feedback on bill guidance and cash flow predictions.\n- Integration underway with Plaid, Moov, Supabase, and more to power real-time insights.\n\nCompetitive Landscape:\n- Mint: Budgeting & tracking, manual input, static UI. Ankfin: AI-automation\n- Truebill: Bill tracking, manual, lacks forecasting. Ankfin: Complete cash flow optimization\n- Dave: Paycheck advances, limited financial planning. Ankfin: End-to-end bill + cash flow AI\n- Chime: Digital banking, no forecasting or automation. Ankfin: Smart AI-integrated finance\n\nWhy Ankfin Wins:\n- Real-Time Execution, not just advice. Ankfin makes smart decisions not just suggestions and acts on them\n- Vertical Focus on Variable Income. Designed from the ground up for fluctuating pay, irregular expenses, and hybrid cash/card usage.\n- Learning Advantage Over Time. Every user interaction improves forecasting accuracy, AI recommendations, and marketplace relevance\n- Integrated Financial Operating System. Forecasts cash flow, moves money, and recommends personalized products. All in one seamless platform.\n- Platform-Ready Architecture. Embedded finance rails, APIs, and a long-term play for FlowBank-as-a-Service licensing.\n\nFees:\n- $1.18T Credit Card Debt\n\nFounder Bio: Prince (Founder & Marketer)---Banking, Marketing, Management, Ops, and Financial frontline experience. Head of Strategy & Execution.`;

const demoAnalysis = (salary: number) => {
  // Example allocation: 50% needs, 20% wants, 20% savings, 10% investments
  const needs = salary * 0.5;
  const wants = salary * 0.2;
  const savings = salary * 0.2;
  const investments = salary * 0.1;
  return `Based on your salary of $${salary}, here's a suggested allocation:\n\n- Needs (bills, rent, groceries): $${needs.toFixed(2)}\n- Wants (entertainment, dining): $${wants.toFixed(2)}\n- Savings: $${savings.toFixed(2)}\n- Investments: $${investments.toFixed(2)}\n\nThis is a demo analysis. AnkFin can help you automate and optimize these allocations!`;
};

const savingsTips = (salary: number) => {
  let tips = [
    "Set up automatic transfers to your savings account each month.",
    "Track your spending and identify areas to cut back, like subscriptions or dining out.",
    "Take advantage of employer retirement plans or matching if available.",
    "Review your bills and negotiate for better rates on services.",
    "Set clear, achievable savings goals and monitor your progress."
  ];
  if (salary < 3000) {
    tips.push("Focus on building an emergency fund first, even if it's small.");
  } else if (salary > 7000) {
    tips.push("Consider diversifying your investments and maximizing tax-advantaged accounts.");
  }
  return `Here are some AI-powered suggestions to help you save more:\n\n- ${tips.join("\n- ")}`;
};

const goalAdvice = (salary: number) => {
  return `To achieve your financial goals:\n\n1. Define your goals clearly (e.g., save $10,000 for a car).\n2. Break them into monthly targets.\n3. Use AnkFin's automated allocation to set aside money for each goal.\n4. Track your progress and adjust as needed.\n5. Celebrate milestones to stay motivated!\n\nWith your salary of $${salary}, setting aside even 10-20% monthly can help you reach your goals faster.`;
};

const expenseAdvice = (salary: number) => {
  return `To reduce expenses and optimize your budget:\n\n- Review your monthly subscriptions and cancel unused ones.\n- Cook at home more often to save on dining out.\n- Use public transport or carpool to cut commuting costs.\n- Shop with a list to avoid impulse purchases.\n- Set spending limits for non-essential categories.\n\nSmall changes can add up to big savings over time!`;
};

const AIChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [salary, setSalary] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    let aiResponse = '';
    // Check for salary input
    const salaryMatch = input.match(/(salary|income)\s*(is|=|:)\s*\$?(\d+)/i);
    if (salaryMatch) {
      const value = parseInt(salaryMatch[3], 10);
      setSalary(value);
      aiResponse = `Got it! I've set your salary as $${value}. You can now ask for a financial analysis or allocation.`;
    } else if (/founder|ven-?kerry|prince|who started|who leads|who is the founder/i.test(input)) {
      aiResponse = 'The founder of AnkFin is Ven-Kerry Prince. Prince has experience in banking, marketing, management, operations, and financial frontline work, and is the Head of Strategy & Execution.';
    } else if (/who are you|who are we|what is ankfin|about ankfin|company|platform|mission|vision|what do you do|what does ankfin do/i.test(input)) {
      aiResponse = ankfinInfo + ankfinExtendedInfo;
    } else if (/problem|struggle|overdraft|cash flow|why needed|why ankfin/i.test(input)) {
      aiResponse = 'AnkFin addresses the struggles of 57M+ variable income earners, 65% of whom face monthly financial instability, leading to $32B in annual overdraft fees. AnkFin solves this with automated bill management, AI-powered cash flow forecasting, and intelligent savings & goals.';
    } else if (/solution|how does it work|how do you solve|what is your solution/i.test(input)) {
      aiResponse = 'AnkFin provides automated bill management, AI-powered cash flow forecasting, intelligent savings & goals, and a personalized AI financial assistant. It proactively detects bills, predicts cash flow, and helps you save and reach your goals.';
    } else if (/product|experience|dashboard|ai chat|forecast|autopay/i.test(input)) {
      aiResponse = 'Product Experience:\n- Dashboard: Upcoming bills, balance forecast, savings status\n- AI Forecast: "Cash will last 17 days given current trajectory"\n- Smart Autopay: AI schedules payments based on paycheck timing\n- AI Chat: "Can I afford $75 on groceries this week?"';
    } else if (/market|opportunity|size|growth|addressable/i.test(input)) {
      aiResponse = 'Market Opportunity:\n- 57M Variable Income Americans (Current market size)\n- 86M Gig Workers by 2027 (Projected growth)\n- $20B+ Personal Finance Market (Total addressable market)';
    } else if (/mvp|capabilities|features|core/i.test(input)) {
      aiResponse = 'Core MVP Capabilities:\n- AI-powered cash flow forecasting and split engine\n- Smart bill detection and payment scheduling\n- Emergency savings buckets with intelligent auto-allocation\n- AI chat interface for real-time financial guidance\n- Cash transaction tracking via receipt capture\n- Location-based smart payment reminders\n- Gamified savings goals and financial achievements\n- Embedded financial product recommendations';
    } else if (/traction|validation|user|interview|prototype|integration/i.test(input)) {
      aiResponse = 'Traction and Validation:\n- MVP in development with core functionality: AI-powered cash flow, split engine, smart bill detection, savings buckets, and live dashboard.\n- 20+ user interviews confirm need for real-time guidance.\n- Positive feedback on bill guidance and cash flow predictions.\n- Integrations underway with Plaid, Moov, Supabase, and more.';
    } else if (/competitor|competition|compare|mint|truebill|dave|chime/i.test(input)) {
      aiResponse = 'Competitive Landscape:\n- Mint: Manual input, static UI. Ankfin: AI-automation\n- Truebill: Manual, lacks forecasting. Ankfin: Complete cash flow optimization\n- Dave: Limited financial planning. Ankfin: End-to-end bill + cash flow AI\n- Chime: No forecasting or automation. Ankfin: Smart AI-integrated finance';
    } else if (/why win|why ankfin|advantage|unique|better|differentiator/i.test(input)) {
      aiResponse = 'Why Ankfin Wins:\n- Real-Time Execution, not just advice.\n- Vertical Focus on Variable Income.\n- Learning Advantage Over Time.\n- Integrated Financial Operating System.\n- Platform-Ready Architecture.';
    } else if (/fee|cost|price|pricing/i.test(input)) {
      aiResponse = 'Fees:\n- $1.18T Credit Card Debt (context: the scale of the problem AnkFin helps address)';
    } else if (/analysis|allocate|split|distribution|how should i spend|how to use my salary|budget/i.test(input) && salary) {
      aiResponse = demoAnalysis(salary);
    } else if ((/save more|savings tips|how can i save|how to save|suggestions for saving|improve savings|increase savings/i.test(input)) && salary) {
      aiResponse = savingsTips(salary);
    } else if ((/goal|achieve my goal|reach my goal|how to achieve|goal advice|goal suggestion/i.test(input)) && salary) {
      aiResponse = goalAdvice(salary);
    } else if ((/reduce expense|cut cost|spend less|lower bills|reduce spending|expense advice|how to spend less/i.test(input)) && salary) {
      aiResponse = expenseAdvice(salary);
    } else if (/analysis|allocate|split|distribution|how should i spend|how to use my salary|budget/i.test(input)) {
      aiResponse = "Please tell me your salary first, e.g., 'My salary is 5000'.";
    } else {
      aiResponse = "I'm a demo AI assistant for AnkFin. You can ask about the AnkFin platform, the founder, our mission, or enter your salary for a financial analysis! You can also ask for savings tips, goal advice, or ways to reduce expenses.";
    }
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', content: aiResponse }]);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 400);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Modern Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-blue-700/40 bg-gradient-to-r from-blue-800/60 via-gray-900/60 to-purple-800/60 rounded-t-2xl">
        <span className="text-2xl">🤖</span>
        <span className="font-semibold text-lg tracking-wide text-white">AnkFin AI Assistant</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white/5 backdrop-blur-md rounded-b-2xl" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}>
        {messages.length === 0 && (
          <div className="text-gray-400 text-center mt-16">Ask me anything about AnkFin, our founder, or your finances!<br/>Try: 'Who is the founder?', 'My salary is 5000', or 'How can I save more?'</div>
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
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t border-blue-700/30 bg-gradient-to-r from-gray-900/70 to-blue-900/70 flex gap-2 rounded-b-2xl">
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
          disabled={!input.trim()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2 rounded-xl font-semibold shadow-md transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChatBox; 