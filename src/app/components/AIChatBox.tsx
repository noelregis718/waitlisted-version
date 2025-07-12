// The backend system prompt ensures the AI responds in a Siri-like, human, and personal finance-focused tone.
// All financial context (monthlyIncome, monthlyExpenses, expenseBreakdown) is always sent to the API for best results.
const sendMessage = async (message) => {
  const response = await fetch('/api/ai-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      monthlyIncome,
      monthlyExpenses,
    })
  });
} 