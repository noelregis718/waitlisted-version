'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import NotificationService from '@/services/NotificationService'
import { NotificationData, NotificationHistory, NotificationSettings } from '@/types/notifications'
import { useAuth } from '@/contexts/AuthContext'
import AIChatBox from '@/components/AIChatBox'
import Tesseract from 'tesseract.js'
import { usePlaidLink } from 'react-plaid-link'

interface IncomeSplit {
  needs: number
  wants: number
  savings: number
  investments: number
}

interface SavingsGoal {
  name: string
  target: number
  current: number
  deadline?: Date
}

interface UpcomingAllocation {
  category: string
  amount: number
  date: Date
  type: 'bill' | 'savings' | 'investment'
}

interface Bill {
  name: string
  amount: number
  dueDate: Date
  category: string
  status: 'paid' | 'pending' | 'overdue'
}

const SAVINGS_GOALS_KEY = 'savingsGoals';

// Add icons (simple SVGs) for the side-panel
const DashboardIcon = () => (
  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-6 0v6m0 0H7m6 0h6" /></svg>
);
const TransactionsIcon = () => (
  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2M5 12h14M12 15v2m0 4h.01" /></svg>
);
const StatisticsIcon = () => (
  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 17a4 4 0 01-4-4V5a4 4 0 018 0v8a4 4 0 01-4 4zm0 0v2m0 0h2m-2 0H9" /></svg>
);

// Add icons for new side-panel options
const AccountsIcon = () => (
  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);
const BillPayIcon = () => (
  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14l2-2 4 4m0 0l-4-4-2 2" /></svg>
);
const SettingsIcon = () => (
  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
);
const PlanIcon = () => (
  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" /></svg>
);
const GoalsIcon = () => (
  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
);
const ReceiptIcon = () => (
  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>
);

// Add at the top of the file:
const CATEGORY_MAP: { [key: string]: string } = {
  'Rent': 'housing',
  'Mortgage': 'housing',
  'Utilities': 'utilities',
  'Electric': 'utilities',
  'Gas': 'utilities',
  'Water': 'utilities',
  'Transportation': 'transportation',
  'Taxi': 'transportation',
  'Public Transport': 'transportation',
  'Groceries': 'food',
  'Restaurants': 'food',
  'Dining': 'food',
  'Entertainment': 'entertainment',
  'Movies': 'entertainment',
  'Music': 'entertainment',
  'Miscellaneous': 'miscellaneous',
  // Add more mappings as needed
};

function categorizeTransaction(txn: any) {
  // Try to map Plaid's category to our dashboard categories
  if (txn.category && txn.category.length > 0) {
    for (const cat of txn.category) {
      if (CATEGORY_MAP[cat]) return CATEGORY_MAP[cat];
    }
  }
  return 'other';
}

function getBudgetSummary(transactions: any[]) {
  const summary: { [key: string]: number } = {
    housing: 0,
    utilities: 0,
    transportation: 0,
    food: 0,
    entertainment: 0,
    miscellaneous: 0,
    other: 0,
  };
  for (const txn of transactions) {
    const cat = categorizeTransaction(txn);
    summary[cat] += txn.amount;
  }
  return summary;
}

// Place this at the very top of the file, before any component definitions
function getLastMonthTimeline(transactions) {
  if (!transactions || transactions.length === 0) return [];
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  // Filter transactions for last month
  const txs = transactions.filter(tx => {
    const d = new Date(tx.date);
    return d >= lastMonth && d < thisMonth;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
  // Build timeline: start with balance at beginning of last month
  let timeline = [];
  let balance = 0;
  // Optionally, you could estimate starting balance from previous month
  txs.forEach(tx => {
    balance += tx.amount;
    timeline.push({
      date: tx.date,
      balance: Math.round(balance),
      label: tx.amount > 0 ? `Credited $${tx.amount}` : `Debited $${Math.abs(tx.amount)}`,
      mood: balance > 1000 ? '😃' : balance < 200 ? '😬' : '🙂',
    });
  });
  return timeline;
}

// Helper to get last 30 days timeline events
function getLast30DaysTimeline(transactions) {
  if (!transactions || transactions.length === 0) return [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  // Filter transactions for last 30 days
  const txs = transactions.filter(tx => {
    const d = new Date(tx.date);
    return d >= thirtyDaysAgo && d <= now;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
  let timeline = [];
  let balance = 0;
  txs.forEach(tx => {
    balance += tx.amount;
    timeline.push({
      date: tx.date,
      balance: Math.round(balance),
      label: tx.amount > 0 ? `Credited $${tx.amount}` : `Debited $${Math.abs(tx.amount)}`,
      mood: balance > 1000 ? '😃' : balance < 200 ? '😬' : '🙂',
    });
  });
  return timeline;
}

export default function LiveDashboardPage() {
  const router = useRouter()
  const notificationService = NotificationService.getInstance()
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [incomeSplit, setIncomeSplit] = useState<IncomeSplit>({
    needs: 0,
    wants: 0,
    savings: 0,
    investments: 0
  })
  const [bills, setBills] = useState<Bill[]>([
    { name: 'Rent', amount: 1200, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), category: 'Housing', status: 'pending' },
    { name: 'Electricity', amount: 150, dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), category: 'Utilities', status: 'pending' },
    { name: 'Internet', amount: 80, dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), category: 'Utilities', status: 'pending' }
  ])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SAVINGS_GOALS_KEY);
      if (stored) return JSON.parse(stored);
    }
    return [
      { name: 'Emergency Fund', target: 10000, current: 2500 },
      { name: 'New Car', target: 25000, current: 5000 },
      { name: 'Vacation Fund', target: 5000, current: 1500 }
    ];
  })
  const [upcomingAllocations, setUpcomingAllocations] = useState<UpcomingAllocation[]>([])
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([])
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(notificationService.getSettings())
  const lastNotificationTime = useRef<{ [key: string]: number }>({})
  const notificationCooldown = 5 * 60 * 1000 // 5 minutes in milliseconds
  const [lastCheckTime, setLastCheckTime] = useState<number>(Date.now())
  const checkInterval = useRef<NodeJS.Timeout>()
  const { user } = useAuth()
  const [showPlaidSandbox, setShowPlaidSandbox] = useState(false)
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'transactions' | 'statistics' | 'accounts' | 'billpay' | 'settings' | 'plan' | 'goals' | 'receipt'>('dashboard');
  const [showAIChat, setShowAIChat] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState<'highest' | 'recent' | 'lowest' | 'oldest' | 'all'>('all');
  const [statsStartDate, setStatsStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 5);
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [statsEndDate, setStatsEndDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0); // last day of current month
    return d.toISOString().slice(0, 10);
  });
  const [statsFilterApplied, setStatsFilterApplied] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  // Store user expenses in a ref for use in generateTransactions
  const userExpensesRef = useRef<any[]>([]);
  // Add state for receipt capture
  const [selectedReceipts, setSelectedReceipts] = useState<any[]>([]);
  const [uploadedReceipts, setUploadedReceipts] = useState<any[]>([]);
  const [ocrResults, setOcrResults] = useState<any[]>([]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [plaidLoading, setPlaidLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  // Goals state
  const [goals, setGoals] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  // Get current month and year
  const now = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonth = monthNames[now.getMonth()];
  const currentYear = now.getFullYear();

  // Generate bar chart data for the current month (simulate 5 weeks)
  const barChartLabels = useMemo(() => {
    const days = [1, 8, 15, 22, 29];
    return days.map(day => `${day} ${currentMonth.toLowerCase().slice(0,3)}`);
  }, [currentMonth]);

  // Use actual user data for the dashboard
  const totalBalance = useMemo(() => {
    // Simulate: income - total bills for the month
    const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0);
    return monthlyIncome - totalBills;
  }, [monthlyIncome, bills]);

  const educationGoal = savingsGoals[0] || { name: 'Education', target: 10000, current: 0 };
  const educationPercent = Math.round((educationGoal.current / educationGoal.target) * 100);

  const incomeThisMonth = monthlyIncome;
  const spentThisMonth = bills.reduce((sum, bill) => sum + bill.amount, 0);

  // Simulate bar chart values based on allocations
  const barChartValues = useMemo(() => {
    // Spread income and spending over 5 weeks
    const incomePerBar = incomeThisMonth / 5;
    const spentPerBar = spentThisMonth / 5;
    return Array(5).fill(0).map((_, i) => ({
      income: incomePerBar,
      spent: spentPerBar,
      scheduled: 0,
      savings: (monthlyIncome * incomeSplit.savings / 100) / 5
    }));
  }, [monthlyIncome, spentThisMonth, incomeSplit]);

  // Helper to get previous month range
  function getPreviousMonthRange(now = new Date()) {
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const month = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 1);
    return { start, end };
  }

  // Simulate user transactions from bills/expenses for the last 6 months
  const generateTransactions = () => {
    const now = new Date();
    let txs: any[] = [];
    // Only include the last 6 months, including the current month
    for (let m = 0; m < 6; m++) {
      // Calculate the correct month and year
      const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
      // Prevent any future months
      if (monthDate > now) continue;
      let monthBills = bills.length ? bills : [
        { name: 'Utilities', amount: 100, dueDate: monthDate, category: 'Utilities', status: 'pending' },
        { name: 'Groceries', amount: 200, dueDate: monthDate, category: 'Food', status: 'pending' },
        { name: 'Transport', amount: 50, dueDate: monthDate, category: 'Transportation', status: 'pending' }
      ];
      // For the previous month, use userExpensesRef if available
      if (m === 1 && userExpensesRef.current.length > 0) {
        const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const prevMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        monthBills = userExpensesRef.current.map((exp: any, idx) => ({
          name: exp.name,
          amount: exp.amount,
          dueDate: new Date(prevMonthYear, prevMonth, 5 + idx),
          category: exp.name,
          status: 'pending',
        }));
      }
      monthBills.forEach((bill, i) => {
        // Transaction date should not be in the future
        const txDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 5 + i * 7);
        if (txDate > now) return;
        txs.push({
          name: bill.name,
          date: txDate,
          amount: -bill.amount,
          category: bill.category,
        });
      });
    }
    // Sort transactions by date descending (most recent first)
    txs.sort((a, b) => b.date - a.date);
    return txs;
  };
  const allTransactions = generateTransactions();

  // Now define recentTransactions and allRecentTransactions
  const { start: prevMonthStart, end: prevMonthEnd } = getPreviousMonthRange();
  const recentTransactions = useMemo(() => {
    return allTransactions.filter(tx => tx.date >= prevMonthStart && tx.date < prevMonthEnd).slice(0, 4);
  }, [allTransactions, prevMonthStart, prevMonthEnd]);
  const allRecentTransactions = useMemo(() => {
    return allTransactions.filter(tx => tx.date >= prevMonthStart && tx.date < prevMonthEnd);
  }, [allTransactions, prevMonthStart, prevMonthEnd]);

  // Use actual allocations for top spending
  const topSpending = useMemo(() => {
    // Group by category
    const categoryTotals: { [cat: string]: number } = {};
    bills.forEach(bill => {
      categoryTotals[bill.category] = (categoryTotals[bill.category] || 0) + bill.amount;
    });
    return Object.entries(categoryTotals).map(([cat, amt]) => ({ category: cat, amount: amt }));
  }, [bills]);

  const checkAndSendNotifications = useCallback(() => {
    const now = Date.now()
    if (now - lastCheckTime < 60000) {
      return
    }
    setLastCheckTime(now)

    if (monthlyIncome > 0) {
      notificationService.sendNotification({
        type: 'income',
        title: 'Income Received',
        message: `Your monthly income of ${formatCurrency(monthlyIncome)} has been processed.`,
        amount: monthlyIncome,
        priority: 'medium'
      })
    }

    savingsGoals.forEach(goal => {
      const progress = (goal.current / goal.target) * 100
      if (progress >= 100) {
        notificationService.sendNotification({
          type: 'goal',
          title: 'Goal Achieved! 🎉',
          message: `Congratulations! You've reached your ${goal.name} goal.`,
          goalName: goal.name,
          progress: 100,
          priority: 'high'
        })
      } else if (progress >= 90) {
        notificationService.sendNotification({
          type: 'goal',
          title: 'Goal Almost Complete!',
          message: `You're ${Math.round(progress)}% of the way to your ${goal.name} goal.`,
          goalName: goal.name,
          progress: Math.round(progress),
          priority: 'medium'
        })
      }
    })

    const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0)
    const needsAllocation = (monthlyIncome * incomeSplit.needs) / 100
    if (totalBills > needsAllocation) {
      notificationService.sendNotification({
        type: 'overspend',
        title: '⚠️ Overspending Alert',
        message: `Your bills (${formatCurrency(totalBills)}) exceed your needs allocation (${formatCurrency(needsAllocation)}).`,
        amount: totalBills - needsAllocation,
        priority: 'high'
      })
    }
  }, [monthlyIncome, incomeSplit, bills, savingsGoals, lastCheckTime])

  // Initial data load (runs only once)
  useEffect(() => {
    // Load dynamic bills from localStorage if available
    const storedIncome = localStorage.getItem('monthlyIncome')
    const storedSplit = localStorage.getItem('incomeSplit')
    const storedExpenses = localStorage.getItem('monthlyExpenses')
    if (storedIncome) setMonthlyIncome(Number(storedIncome))
    if (storedSplit) setIncomeSplit(JSON.parse(storedSplit))

    let userBills = []
    // If user has entered expenses, use them as bills
    if (storedExpenses) {
      try {
        const expenses = JSON.parse(storedExpenses)
        userExpensesRef.current = expenses.filter((exp: any) => exp.amount > 0);
        // Only include categories with amount > 0
        // Set dueDate to a date in the previous month for dashboard display
        const now = new Date();
        const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const prevMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        userBills = expenses.filter((exp: any) => exp.amount > 0).map((exp: any, idx: number) => ({
          name: exp.name,
          amount: exp.amount,
          dueDate: new Date(prevMonthYear, prevMonth, 5 + idx), // e.g., 5th, 6th, ... of last month
          category: exp.name,
          status: 'pending',
        }))
      } catch (e) {
        // fallback to default bills if parsing fails
        userExpensesRef.current = [];
      }
    }

    // If no user bills, split needs into default categories
    if (userBills.length === 0 && storedIncome && storedSplit) {
      const split = JSON.parse(storedSplit)
      const needsAmount = Number(storedIncome) * (split.needs / 100)
      const categories = ['Utilities', 'Transportation', 'Entertainment', 'Other']
      const perCategory = Math.floor((needsAmount / categories.length) * 100) / 100
      let remainder = Math.round((needsAmount - perCategory * categories.length) * 100) / 100
      const now = new Date();
      const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const prevMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      userBills = categories.map((cat, idx) => ({
        name: cat,
        amount: perCategory + (idx === 0 ? remainder : 0), // add any rounding remainder to the first
        dueDate: new Date(prevMonthYear, prevMonth, 5 + idx),
        category: cat,
        status: 'pending',
      }))
    }
    setBills(userBills)

    const history = notificationService.getHistory()
    setNotificationHistory(history)
  }, [])

  // Update allocations when relevant state changes
  useEffect(() => {
    const allocations: UpcomingAllocation[] = []
    const today = new Date()
    // Use bills (from user expenses or needs split) for allocations
    bills.forEach(bill => {
      allocations.push({
        category: bill.name,
        amount: bill.amount,
        date: bill.dueDate,
        type: 'bill'
      })
    })
    // Add savings and investments allocations
    const savingsAmount = (monthlyIncome * incomeSplit.savings) / 100
    if (savingsAmount > 0) {
      allocations.push({
        category: 'Savings',
        amount: savingsAmount,
        date: new Date(today.getFullYear(), today.getMonth() + 1, 1),
        type: 'savings'
      })
    }
    const investmentAmount = (monthlyIncome * incomeSplit.investments) / 100
    if (investmentAmount > 0) {
      allocations.push({
        category: 'Investments',
        amount: investmentAmount,
        date: new Date(today.getFullYear(), today.getMonth() + 1, 1),
        type: 'investment'
      })
    }
    setUpcomingAllocations(allocations)
  }, [monthlyIncome, incomeSplit, bills])

  // Notification interval effect
  useEffect(() => {
    const interval = setInterval(() => {
      checkAndSendNotifications()
    }, 60000)
    return () => clearInterval(interval)
  }, [monthlyIncome, incomeSplit, bills, savingsGoals])

  // Demo notifications on first dashboard visit after signup
  useEffect(() => {
    if (user && !sessionStorage.getItem('demoNotificationsShown')) {
      notificationService.sendNotification({
        type: 'income',
        title: 'Income Received',
        message: 'Your monthly income of $5,000 has been processed.',
        amount: 5000,
        priority: 'medium',
      })
      notificationService.sendNotification({
        type: 'goal',
        title: 'Goal Progress',
        message: 'You are 60% of the way to your Emergency Fund goal!',
        goalName: 'Emergency Fund',
        progress: 60,
        priority: 'medium',
      })
      notificationService.sendNotification({
        type: 'bill',
        title: 'Upcoming Bill',
        message: 'Your Rent bill of $1,200 is due in 5 days.',
        amount: 1200,
        category: 'Housing',
        priority: 'high',
      })
      notificationService.sendNotification({
        type: 'overspend',
        title: 'Overspending Alert',
        message: 'You have exceeded your needs allocation for this month.',
        amount: 200,
        priority: 'high',
      })
      sessionStorage.setItem('demoNotificationsShown', 'true')
    }
  }, [user])

  // Persist savings goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(SAVINGS_GOALS_KEY, JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  // Fetch goals/subaccounts from backend
  useEffect(() => {
    if (activeSection === 'goals') {
      fetch('/api/goals')
        .then(res => res.json())
        .then(setGoals);
    }
  }, [activeSection]);

  // Handler to add a new goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName.trim() || !newGoalTarget || isNaN(Number(newGoalTarget))) return;
    setSavingsGoals(prev => [
      ...prev,
      { name: newGoalName.trim(), target: Number(newGoalTarget), current: 0 }
    ]);
    setNewGoalName('');
    setNewGoalTarget('');
  };

  // Handler to update current contribution for a goal
  const handleUpdateGoalCurrent = (index: number, value: number) => {
    setSavingsGoals(prev => prev.map((goal, i) => i === index ? { ...goal, current: value } : goal));
  };

  // Add a handler to remove a goal
  const handleRemoveGoal = (index: number) => {
    setSavingsGoals(prev => prev.filter((_, i) => i !== index));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const handleNotificationSettingsChange = (channel: 'email' | 'browser', setting: string, value: boolean) => {
    const newSettings = {
      ...notificationSettings,
      [channel]: {
        ...notificationSettings[channel],
        [setting]: value
      }
    }
    setNotificationSettings(newSettings)
    notificationService.updateSettings(newSettings)
  }

  // Filter logic
  let filteredTransactions = [...allTransactions];
  if (transactionFilter === 'highest') {
    filteredTransactions = [allTransactions.reduce((a, b) => (a.amount < b.amount ? a : b), allTransactions[0])];
  } else if (transactionFilter === 'lowest') {
    filteredTransactions = [allTransactions.reduce((a, b) => (a.amount > b.amount ? a : b), allTransactions[0])];
  } else if (transactionFilter === 'recent') {
    filteredTransactions = [allTransactions.reduce((a, b) => (a.date > b.date ? a : b), allTransactions[0])];
  } else if (transactionFilter === 'oldest') {
    filteredTransactions = [allTransactions.reduce((a, b) => (a.date < b.date ? a : b), allTransactions[0])];
  }

  // Group by month
  const transactionsByMonth = filteredTransactions.reduce((acc, tx) => {
    const key = tx.date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(tx);
    return acc;
  }, {});

  // Compute filtered months for statistics
  const statsStart = new Date(statsStartDate);
  const statsEnd = new Date(statsEndDate);
  const filteredMonths = [];
  let temp = new Date(statsStart);
  temp.setDate(1);
  while (temp <= statsEnd) {
    filteredMonths.push(new Date(temp));
    temp.setMonth(temp.getMonth() + 1);
  }
  const statsCashFlowData = filteredMonths.map(monthDate => {
    const month = monthDate.getMonth();
    const year = monthDate.getFullYear();
    // For income, use monthlyIncome if set, otherwise sum positive transactions
    const isCurrentOrPast = monthDate <= now;
    const income = isCurrentOrPast ? monthlyIncome : 0;
    // For expenses, sum all negative transactions for this month
    const monthTxs = allTransactions.filter(tx => tx.date.getMonth() === month && tx.date.getFullYear() === year && tx.date >= statsStart && tx.date <= statsEnd);
    const expenses = monthTxs.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    // Estimate savings and investments from incomeSplit if not in transactions
    let savings = 0;
    let investments = 0;
    if (monthlyIncome && incomeSplit) {
      savings = (monthlyIncome * (incomeSplit.savings || 0) / 100);
      investments = (monthlyIncome * (incomeSplit.investments || 0) / 100);
    }
    return {
      label: monthDate.toLocaleString('default', { month: 'short', year: '2-digit' }),
      income,
      expenses,
      savings,
      investments,
      net: income - expenses - savings - investments,
    };
  });
  const statsTotalIncome = statsCashFlowData.reduce((sum, d) => sum + d.income, 0);
  const statsTotalExpenses = statsCashFlowData.reduce((sum, d) => sum + d.expenses, 0);
  const statsTotalSavings = statsCashFlowData.reduce((sum, d) => sum + d.savings, 0);
  const statsTotalInvestments = statsCashFlowData.reduce((sum, d) => sum + d.investments, 0);
  const statsNetCashFlow = statsTotalIncome - statsTotalExpenses - statsTotalSavings - statsTotalInvestments;

  function handleReceiptFileChange(e: any) {
    if (!e.target) return;
    const files = Array.from(e.target.files || []);
    setSelectedReceipts((prev: any[]) => [...prev, ...files]);
  }

  async function handleUploadReceipt(idx: any) {
    setOcrLoading(true);
    const file = selectedReceipts[idx];
    setUploadedReceipts(prev => [...prev, file]);
    setSelectedReceipts(prev => prev.filter((_, i) => i !== idx));

    // Convert file to data URL for Tesseract
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (!e.target?.result) {
        setOcrResults(prev => [...prev, { name: file.name, text: 'Could not read file.' }]);
        setOcrLoading(false);
        return;
      }
      try {
        const { data } = await Tesseract.recognize(e.target.result as string, 'eng');
        setOcrResults(prev => [...prev, { name: file.name, text: data.text }]);
      } catch (e) {
        setOcrResults(prev => [...prev, { name: file.name, text: 'Could not extract text.' }]);
      }
      setOcrLoading(false);
    };
    reader.onerror = () => {
      setOcrResults(prev => [...prev, { name: file.name, text: 'Could not read file.' }]);
      setOcrLoading(false);
    };
    reader.readAsDataURL(file);
  }

  const handlePlaidSuccess = async function(publicToken: string, metadata: any) {
    try {
      const res = await fetch('/api/plaid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'exchange_public_token', data: { public_token: publicToken } }),
      });
      const data = await res.json();
      if (data.access_token) {
        // Fetch accounts
        const accountsRes = await fetch('/api/plaid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'fetch_accounts', data: { access_token: data.access_token } }),
        });
        const accountsData = await accountsRes.json();
        setAccounts(accountsData.accounts || []);
        // Fetch transactions (last 30 days)
        const endDate = new Date().toISOString().slice(0, 10);
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        const transactionsRes = await fetch('/api/plaid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'fetch_transactions', data: { access_token: data.access_token, start_date: startDate, end_date: endDate } }),
        });
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData.transactions || []);
        console.log('Fetched accounts:', accountsData.accounts);
        console.log('Fetched transactions:', transactionsData.transactions);

        // Step 3: Notifications - check for overspending
        const budgetSummary = getBudgetSummary(transactionsData.transactions || []);
        Object.entries(budgetSummary).forEach(([cat, total]) => {
          if (total > 1000) { // Example threshold
            NotificationService.getInstance().sendNotification({
              type: 'overspend',
              title: `Overspending Alert: ${cat}`,
              message: `You've spent ${formatCurrency(total)} on ${cat} this month.`,
              amount: total,
              category: cat,
              priority: 'high',
            });
          }
        });
      } else {
        console.error('Failed to exchange public token:', data);
      }
    } catch (error) {
      console.error('Error exchanging public token:', error);
    }
    setLinkToken(null); // Close Plaid Link
  }

  // Handler to create a new goal (subaccount)
  async function handleCreateGoal() {
    const name = prompt('Enter goal name:');
    if (!name) return;
    const target = prompt('Enter target amount for this goal:');
    if (!target || isNaN(Number(target))) return;
    setStatusMessage('Creating goal...');
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, target: Number(target) }),
    });
    if (res.ok) {
      setStatusMessage('Goal created!');
      setGoals(await (await fetch('/api/goals')).json());
    } else {
      setStatusMessage('Failed to create goal.');
    }
  }

  // Handler to add money to a goal (subaccount)
  async function handleAddMoney(goalId) {
    const amount = prompt('Enter amount to add:');
    if (!amount || isNaN(Number(amount))) return;
    setStatusMessage('Adding money...');
    const res = await fetch(`/api/goals/${goalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount) }),
    });
    if (res.ok) {
      setStatusMessage('Money added!');
      setGoals(await (await fetch('/api/goals')).json());
    } else {
      setStatusMessage('Failed to add money.');
      // Try to refetch goals in case of error
      setGoals(await (await fetch('/api/goals')).json());
      const errorText = await res.text();
      console.error('PATCH /api/goals/:id failed:', errorText);
    }
  }

  // Helper to calculate AnkTrust score
  function calculateAnkTrustScore(transactions) {
    // Example logic: base score, penalize for outlier spending, reward for consistency
    let score = 750;
    if (!transactions || transactions.length === 0) return 745;
    // Behavior pattern: check if last 3 transactions are similar to previous 60 days
    const now = new Date();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const recent = transactions.slice(0, 3);
    const past = transactions.filter(tx => new Date(tx.date) < recent[recent.length-1]?.date && new Date(tx.date) > sixtyDaysAgo);
    let behaviorPenalty = 0;
    recent.forEach(tx => {
      const similar = past.find(p => p.category === tx.category && Math.abs(p.amount - tx.amount) < 0.2 * tx.amount);
      if (!similar) behaviorPenalty += 20;
    });
    score -= behaviorPenalty;
    // Spending flow: penalize for large outlier transactions
    const avg = transactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0) / transactions.length;
    transactions.forEach(tx => {
      if (Math.abs(tx.amount) > 2 * avg) score -= 15;
    });
    // Clamp score
    score = Math.max(420, Math.min(820, Math.round(score)));
    return score;
  }

  function getAnkTrustCategory(score) {
    if (score >= 820) return { color: 'bg-blue-700', emoji: '🔵', label: 'High Trust', message: 'Seamless access' };
    if (score >= 610) return { color: 'bg-yellow-500', emoji: '🟡', label: 'Moderate', message: '2FA triggered' };
    return { color: 'bg-red-600', emoji: '🔴', label: 'Risky', message: 'Identity re-auth required, transfer blocked' };
  }

  // Helper to get last month's timeline events
  function getLastMonthTimeline(transactions) {
    if (!transactions || transactions.length === 0) return [];
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // Filter transactions for last month
    const txs = transactions.filter(tx => {
      const d = new Date(tx.date);
      return d >= lastMonth && d < thisMonth;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
    // Build timeline: start with balance at beginning of last month
    let timeline = [];
    let balance = 0;
    // Optionally, you could estimate starting balance from previous month
    txs.forEach(tx => {
      balance += tx.amount;
      timeline.push({
        date: tx.date,
        balance: Math.round(balance),
        label: tx.amount > 0 ? `Credited $${tx.amount}` : `Debited $${Math.abs(tx.amount)}`,
        mood: balance > 1000 ? '😃' : balance < 200 ? '😬' : '🙂',
      });
    });
    return timeline;
  }

  // Get the latest expense breakdown from localStorage or dashboard state
  let expenseBreakdown = [];
  let monthlyExpenses = 0;
  if (typeof window !== 'undefined') {
    try {
      expenseBreakdown = JSON.parse(localStorage.getItem('monthlyExpenses') || '[]');
      monthlyExpenses = expenseBreakdown.reduce((sum, e) => sum + (e.amount || 0), 0);
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white pt-24 flex flex-row">
      {/* Side Panel */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col py-8 px-4 min-h-screen sticky top-0 left-0 z-20">
        <div className="mb-10 flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-400">FinDash</span>
        </div>
        <nav className="flex flex-col gap-2">
          <button className={`flex items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${activeSection === 'dashboard' ? 'bg-blue-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`} onClick={() => setActiveSection('dashboard')}><DashboardIcon /> Dashboard</button>
          <button className={`flex items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${activeSection === 'transactions' ? 'bg-blue-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`} onClick={() => setActiveSection('transactions')}><TransactionsIcon /> Transactions</button>
          <button className={`flex items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${activeSection === 'statistics' ? 'bg-blue-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`} onClick={() => setActiveSection('statistics')}><StatisticsIcon /> Statistics</button>
          <button className={`flex items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${activeSection === 'accounts' ? 'bg-blue-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`} onClick={() => setActiveSection('accounts')}><AccountsIcon /> Accounts</button>
          <button className={`flex items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${activeSection === 'billpay' ? 'bg-blue-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`} onClick={() => setActiveSection('billpay')}><BillPayIcon /> Bill Pay</button>
          <button className={`flex items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${activeSection === 'settings' ? 'bg-blue-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`} onClick={() => setActiveSection('settings')}><SettingsIcon /> Settings</button>
          <button className={`flex items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${activeSection === 'plan' ? 'bg-blue-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`} onClick={() => setActiveSection('plan')}><PlanIcon /> Plan</button>
          <button className={`flex items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${activeSection === 'goals' ? 'bg-blue-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`} onClick={() => setActiveSection('goals')}><GoalsIcon /> Goals</button>
          <button className={`flex items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${activeSection === 'receipt' ? 'bg-blue-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`} onClick={() => setActiveSection('receipt')}><ReceiptIcon /> Receipt Capture</button>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 px-4">
        {activeSection === 'dashboard' && (
          <div className="w-full px-8 py-8 flex flex-row gap-8 items-start">
            {/* Main Dashboard Content */}
            <div className="flex-1">
              {/* Header Section */}
              <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-bold">Live Financial Dashboard</h1>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowNotificationSettings(!showNotificationSettings)}
                    className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    Notification Settings
                  </button>
                </div>
              </div>

              {/* Notification Settings Panel */}
              {showNotificationSettings && (
                <div className="bg-gray-800/80 border border-gray-700/40 rounded-xl p-6 mb-8 shadow">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Notification Settings</h2>
                    <button
                      onClick={() => setShowNotificationSettings(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Email Settings */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={notificationSettings.email.enabled}
                            onChange={(e) => handleNotificationSettingsChange('email', 'enabled', e.target.checked)}
                            className="form-checkbox h-4 w-4 text-blue-500"
                          />
                          <span>Enable Email Notifications</span>
                        </label>
                        <div className="ml-6 space-y-2">
                          <h4 className="text-sm font-medium text-gray-400">Notification Types</h4>
                          {Object.entries(notificationSettings.email.types).map(([type, enabled]) => (
                            <label key={type} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={enabled}
                                onChange={(e) => handleNotificationSettingsChange('email', `types.${type}`, e.target.checked)}
                                className="form-checkbox h-4 w-4 text-blue-500"
                                disabled={!notificationSettings.email.enabled}
                              />
                              <span className="capitalize">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Browser Settings */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Browser Notifications</h3>
                      <div className="space-y-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={notificationSettings.browser.enabled}
                            onChange={(e) => handleNotificationSettingsChange('browser', 'enabled', e.target.checked)}
                            className="form-checkbox h-4 w-4 text-blue-500"
                          />
                          <span>Enable Browser Notifications</span>
                        </label>
                        <div className="ml-6 space-y-2">
                          <h4 className="text-sm font-medium text-gray-400">Notification Types</h4>
                          {Object.entries(notificationSettings.browser.types).map(([type, enabled]) => (
                            <label key={type} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={enabled}
                                onChange={(e) => handleNotificationSettingsChange('browser', `types.${type}`, e.target.checked)}
                                className="form-checkbox h-4 w-4 text-blue-500"
                                disabled={!notificationSettings.browser.enabled}
                              />
                              <span className="capitalize">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dashboard Grid */}
              <div className="w-full flex flex-col gap-8">
                {/* Top Row: Balance, Education, Income, Spent, Budget Chart */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Balance Card */}
                  <div className="bg-yellow-300/90 text-gray-900 rounded-xl p-6 shadow flex flex-col justify-between min-h-[180px]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg">Total balance</span>
                      <span className="bg-yellow-400/80 rounded px-2 py-1 text-xs font-semibold">{formatCurrency(totalBalance)}</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{formatCurrency(totalBalance)}</div>
                    {/* Simulated chart (replace with real chart if available) */}
                    <div className="h-16 w-full bg-yellow-200 rounded mb-2 flex items-end">
                      {barChartValues.map((bar, i) => (
                        <div key={i} className={`w-1/6 mx-0.5 rounded`} style={{ height: `${10 + (bar.income / monthlyIncome) * 50}px`, background: '#fde047' }}></div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-700">↑ 10% compared to last month</div>
                  </div>
                  {/* Education Goal Card */}
                  <div className="bg-yellow-100 text-gray-900 rounded-xl p-6 shadow flex flex-col justify-between min-h-[180px]">
                    <div className="font-bold text-lg mb-2">Education</div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3/4 h-2 bg-yellow-400 rounded-full relative">
                        <div className="absolute left-0 top-0 h-2 bg-yellow-600 rounded-full" style={{width: `${educationPercent}%`}}></div>
                      </div>
                      <span className="text-xs font-semibold">{educationPercent}%</span>
                    </div>
                    <div className="text-xs text-gray-700">Goal completion</div>
                  </div>
                  {/* Budget Chart Card */}
                  <div className="bg-gray-900 rounded-xl p-6 shadow flex flex-col justify-between min-h-[180px]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg text-white">Budget</span>
                      <span className="text-gray-400 text-xs">{currentMonth} {currentYear}</span>
                    </div>
                    <div className="flex items-end gap-2 h-32 w-full mb-4">
                      {barChartValues.map((bar, i) => (
                        <div key={i} className="flex flex-col items-center w-1/5">
                          <div className="bg-teal-400 rounded-t-lg w-6" style={{ height: `${40 + (bar.income / monthlyIncome) * 60}px` }}></div>
                          <span className="text-xs text-gray-400 mt-1">{barChartLabels[i]}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Income</span>
                      <span>Spent</span>
                      <span>Scheduled</span>
                      <span>Savings</span>
                    </div>
                  </div>
                </div>
                {/* Middle Row: Income/Spent Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-100 rounded-xl p-6 shadow flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-green-600 font-bold">+ {formatCurrency(monthlyIncome)}</span>
                      <span className="text-xs text-green-500">↑ 12%</span>
                    </div>
                    <div className="text-xs text-gray-400">Income this month</div>
                  </div>
                  <div className="bg-red-100 rounded-xl p-6 shadow flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-red-600 font-bold">- {formatCurrency(spentThisMonth)}</span>
                      <span className="text-xs text-red-500">↓ 7%</span>
                    </div>
                    <div className="text-xs text-gray-400">Spent this month</div>
                  </div>
                </div>
                {/* Bottom Row: Recent Transactions, Credit Card, Top Spending */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Recent Transactions */}
                  <div className="bg-white rounded-xl p-6 shadow flex flex-col min-h-[200px]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg text-gray-900">Recent transactions</span>
                    </div>
                    <ul className="space-y-2">
                      {recentTransactions.length === 0 ? (
                        <li className="text-gray-400">No recent transactions.</li>
                      ) : (
                        recentTransactions.map((tx, i) => (
                          <li key={i} className="flex justify-between items-center text-gray-800">
                            <span className="flex items-center gap-2"><span className={`bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center`}><span className={`text-gray-700 font-bold`}>{tx.name.charAt(0).toUpperCase()}</span></span>{tx.name}</span>
                            <span className="text-xs">{tx.date.toLocaleDateString()}</span>
                            <span className="font-semibold">{formatCurrency(tx.amount)}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                  {/* Credit Card Summary */}
                  <div className="bg-yellow-200/80 text-gray-900 rounded-xl p-6 shadow flex flex-col items-center min-h-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-lg">Credit</span>
                      <span className="bg-green-200 text-green-800 rounded px-2 py-1 text-xs font-semibold">$600.21</span>
                    </div>
                    <div className="bg-yellow-300 rounded-xl p-4 w-full flex flex-col items-center mb-2">
                      <span className="text-2xl font-bold">Universal</span>
                      <span className="text-3xl font-bold">$8,523.20</span>
                      <span className="text-xs text-gray-700 mt-1">*9423  06/28</span>
                    </div>
                    <button className="mt-2 px-4 py-2 bg-gray-900 text-yellow-300 rounded-lg font-semibold shadow">Add new card</button>
                  </div>
                  {/* Top Spending */}
                  <div className="bg-white rounded-xl p-6 shadow flex flex-col min-h-[200px]">
                    <div className="font-bold text-lg mb-4 text-gray-900">Top spending</div>
                    <div className="flex items-center gap-6">
                      <div className="relative w-32 h-32">
                        {/* Pie chart simulation */}
                        <svg viewBox="0 0 32 32" className="w-32 h-32">
                          <circle r="16" cx="16" cy="16" fill="#fef08a" />
                          {/* Pie slices for top spending categories (simulate for now) */}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-gray-900">{topSpending.length > 0 ? Math.round((topSpending[0].amount / spentThisMonth) * 100) : 0}%</span>
                          <span className="text-xs text-gray-700">{topSpending.length > 0 ? topSpending[0].category : 'N/A'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {topSpending.map((cat, i) => (
                          <div key={i} className="flex items-center gap-2 text-gray-800"><span className="w-3 h-3 rounded-full bg-yellow-300 inline-block"></span> {cat.category} <span className="ml-auto">{formatCurrency(cat.amount)}</span></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* After the dashboard grid (recent transactions, credit, top spending), insert the AnkTrust Score card */}
              <div className="max-w-3xl mx-auto w-full">
                {(() => {
                  const score = calculateAnkTrustScore(transactions);
                  const cat = getAnkTrustCategory(score);
                  let trustSentence = '';
                  if (cat.label === 'High Trust') {
                    trustSentence = `${cat.emoji} Your AnkTrust score is ${score} — enjoy seamless access!`;
                  } else if (cat.label === 'Moderate') {
                    trustSentence = `${cat.emoji} Your AnkTrust score is ${score} — 2FA will be triggered for extra security.`;
                  } else {
                    trustSentence = `${cat.emoji} Your AnkTrust score is ${score} — identity re-auth required, transfers temporarily blocked.`;
                  }
                  return (
                    <div className="w-full flex justify-center items-center mb-8" style={{marginTop: '2.5rem'}}>
                      <span className="text-lg md:text-xl font-semibold text-gray-100 text-center" style={{letterSpacing: '0.01em'}}>{trustSentence}</span>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
        {activeSection === 'transactions' && (
          <div className="max-w-3xl mx-auto py-12">
            <h2 className="text-3xl font-bold mb-6">Transactions (Last 6 Months)</h2>
            {/* Filters */}
            <div className="flex gap-3 mb-6">
              <button onClick={() => setTransactionFilter('all')} className={`px-4 py-2 rounded-lg font-semibold ${transactionFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>All</button>
              <button onClick={() => setTransactionFilter('highest')} className={`px-4 py-2 rounded-lg font-semibold ${transactionFilter === 'highest' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Highest</button>
              <button onClick={() => setTransactionFilter('recent')} className={`px-4 py-2 rounded-lg font-semibold ${transactionFilter === 'recent' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Most Recent</button>
              <button onClick={() => setTransactionFilter('lowest')} className={`px-4 py-2 rounded-lg font-semibold ${transactionFilter === 'lowest' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Lowest</button>
              <button onClick={() => setTransactionFilter('oldest')} className={`px-4 py-2 rounded-lg font-semibold ${transactionFilter === 'oldest' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Oldest</button>
            </div>
            {/* Transactions List */}
            {Object.keys(transactionsByMonth).length === 0 ? (
              <div className="text-gray-400">No transactions found.</div>
            ) : (
              Object.entries(transactionsByMonth).map(([month, txs]) => (
                <div key={month} className="mb-8">
                  <h3 className="text-xl font-bold mb-2 text-blue-400">{month}</h3>
                  <div className="bg-gray-800 rounded-xl shadow p-4">
                    <ul className="divide-y divide-gray-700">
                      {(txs as any[]).map((tx: any, i: number) => (
                        <li key={i} className="flex justify-between items-center py-3">
                          <div>
                            <div className="font-semibold text-white">{tx.name}</div>
                            <div className="text-xs text-gray-400">{tx.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-blue-300">{formatCurrency(tx.amount)}</div>
                            <div className="text-xs text-gray-400">{tx.date.toLocaleDateString()}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {activeSection === 'statistics' && (
          <div className="max-w-4xl mx-auto py-12">
            <h2 className="text-3xl font-bold mb-8">Statistics</h2>
            {/* Date Range Filter */}
            <form className="flex flex-wrap gap-4 items-center mb-8" onSubmit={e => { e.preventDefault(); setStatsFilterApplied(true); }}>
              <label className="text-gray-200 font-semibold">From:
                <input type="date" value={statsStartDate} onChange={e => setStatsStartDate(e.target.value)} className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white" />
              </label>
              <label className="text-gray-200 font-semibold">To:
                <input type="date" value={statsEndDate} onChange={e => setStatsEndDate(e.target.value)} className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white" />
              </label>
              <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold">Apply</button>
            </form>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-blue-900/80 rounded-xl p-6 text-white flex flex-col items-center shadow">
                <span className="text-lg font-semibold mb-2">Total Income</span>
                <span className="text-2xl font-bold text-green-400">{formatCurrency(statsTotalIncome)}</span>
              </div>
              <div className="bg-blue-900/80 rounded-xl p-6 text-white flex flex-col items-center shadow">
                <span className="text-lg font-semibold mb-2">Total Expenses</span>
                <span className="text-2xl font-bold text-red-400">{formatCurrency(statsTotalExpenses)}</span>
              </div>
              <div className="bg-blue-900/80 rounded-xl p-6 text-white flex flex-col items-center shadow">
                <span className="text-lg font-semibold mb-2">Total Savings</span>
                <span className="text-2xl font-bold text-yellow-300">{formatCurrency(statsTotalSavings)}</span>
              </div>
              <div className="bg-blue-900/80 rounded-xl p-6 text-white flex flex-col items-center shadow">
                <span className="text-lg font-semibold mb-2">Total Investments</span>
                <span className="text-2xl font-bold text-purple-300">{formatCurrency(statsTotalInvestments)}</span>
              </div>
              <div className="bg-blue-900/80 rounded-xl p-6 text-white flex flex-col items-center shadow">
                <span className="text-lg font-semibold mb-2">Net Cash Flow</span>
                <span className={`text-2xl font-bold ${statsNetCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(statsNetCashFlow)}</span>
              </div>
            </div>
            {/* Cash Flow Graph */}
            <div className="bg-gray-900 rounded-xl p-8 shadow mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Cash Flow ({filteredMonths[0]?.toLocaleString('default', { month: 'short', year: '2-digit' })} - {filteredMonths[filteredMonths.length-1]?.toLocaleString('default', { month: 'short', year: '2-digit' })})</h3>
              {/* Multi-bar Chart: Income, Expenses, Savings, Investments */}
              <div className="w-full h-64 flex items-end gap-4">
                {statsCashFlowData.map((d, i) => {
                  const max = Math.max(...statsCashFlowData.map(x => Math.max(x.income, x.expenses, x.savings, x.investments)));
                  const incomeHeight = max ? (d.income / max) * 180 : 0;
                  const expensesHeight = max ? (d.expenses / max) * 180 : 0;
                  const savingsHeight = max ? (d.savings / max) * 180 : 0;
                  const investmentsHeight = max ? (d.investments / max) * 180 : 0;
                  return (
                    <div key={i} className="flex flex-col items-center w-1/6">
                      <div className="flex flex-row items-end h-44 gap-1">
                        <div className="bg-green-400 rounded-t w-3" style={{ height: `${incomeHeight}px` }} title={`Income: ${formatCurrency(d.income)}`}></div>
                        <div className="bg-red-400 rounded-t w-3" style={{ height: `${expensesHeight}px` }} title={`Expenses: ${formatCurrency(d.expenses)}`}></div>
                        <div className="bg-yellow-300 rounded-t w-3" style={{ height: `${savingsHeight}px` }} title={`Savings: ${formatCurrency(d.savings)}`}></div>
                        <div className="bg-purple-300 rounded-t w-3" style={{ height: `${investmentsHeight}px` }} title={`Investments: ${formatCurrency(d.investments)}`}></div>
                      </div>
                      <span className="text-xs text-gray-300 mt-2">{d.label}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-8 mt-4 flex-wrap">
                <div className="flex items-center gap-2"><span className="w-4 h-2 bg-green-400 rounded inline-block"></span> <span className="text-xs text-gray-200">Income</span></div>
                <div className="flex items-center gap-2"><span className="w-4 h-2 bg-red-400 rounded inline-block"></span> <span className="text-xs text-gray-200">Expenses</span></div>
                <div className="flex items-center gap-2"><span className="w-4 h-2 bg-yellow-300 rounded inline-block"></span> <span className="text-xs text-gray-200">Savings</span></div>
                <div className="flex items-center gap-2"><span className="w-4 h-2 bg-purple-300 rounded inline-block"></span> <span className="text-xs text-gray-200">Investments</span></div>
              </div>
            </div>
            {/* Timeline Horizon for Last Month */}
            {/* Timeline Horizon for Last 30 Days */}
            {/* ...rest of statistics page... */}
          </div>
        )}
        {activeSection === 'accounts' && (
          <div className="max-w-3xl mx-auto py-12">
            <h2 className="text-3xl font-bold mb-6">Accounts</h2>
            {/* Example: List of user accounts (simulate with user object or placeholder) */}
            <div className="bg-gray-800 rounded-xl p-6 shadow mb-6">
              <div className="text-lg font-semibold mb-2">Primary Account</div>
              <div className="text-gray-300">Name: {user?.email ? user.email.split('@')[0] : 'N/A'}</div>
              <div className="text-gray-300">Email: {user?.email || 'N/A'}</div>
              <div className="text-gray-300">Balance: {formatCurrency(totalBalance)}</div>
            </div>
            {/* Add more accounts or link new accounts here */}
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
              onClick={async () => {
                setPlaidLoading(true);
                const res = await fetch('/api/plaid', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'create_link_token' }),
                });
                const data = await res.json();
                setLinkToken(data.link_token);
                setPlaidLoading(false);
              }}
              disabled={plaidLoading}
            >
              {plaidLoading ? 'Loading...' : 'Link New Account'}
            </button>
            {linkToken && (
              <PlaidLinkComponent linkToken={linkToken} onSuccess={handlePlaidSuccess} />
            )}
            {accounts.length > 0 ? (
              <>
                <div className="bg-gray-800 rounded-xl p-6 shadow mb-6">
                  <div className="text-lg font-semibold mb-2">Linked Accounts</div>
                  {accounts.map((acct, idx) => (
                    <div key={acct.account_id} className="mb-4">
                      <div className="text-gray-300">Name: {acct.name}</div>
                      <div className="text-gray-300">Type: {acct.type} ({acct.subtype})</div>
                      <div className="text-gray-300">Mask: {acct.mask}</div>
                      <div className="text-gray-300">Balance: {acct.balances?.current != null ? formatCurrency(acct.balances.current) : 'N/A'}</div>
                    </div>
                  ))}
                </div>
                {transactions.length > 0 && (
                  <div className="bg-gray-800 rounded-xl p-6 shadow mb-6">
                    <div className="text-lg font-semibold mb-2">Recent Transactions</div>
                    <table className="min-w-full text-left text-gray-300">
                      <thead>
                        <tr>
                          <th className="py-2 px-4">Date</th>
                          <th className="py-2 px-4">Name</th>
                          <th className="py-2 px-4">Account</th>
                          <th className="py-2 px-4">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((txn, idx) => (
                          <tr key={txn.transaction_id} className="border-b border-gray-700">
                            <td className="py-2 px-4">{txn.date}</td>
                            <td className="py-2 px-4">{txn.name}</td>
                            <td className="py-2 px-4">{accounts.find(a => a.account_id === txn.account_id)?.name || 'N/A'}</td>
                            <td className="py-2 px-4">{formatCurrency(txn.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {transactions.length > 0 && (
                  <div className="bg-gray-800 rounded-xl p-6 shadow mb-6">
                    <div className="text-lg font-semibold mb-2">Budget Summary (Real Data)</div>
                    <table className="min-w-full text-left text-gray-300">
                      <thead>
                        <tr>
                          <th className="py-2 px-4">Category</th>
                          <th className="py-2 px-4">Total Spent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(getBudgetSummary(transactions)).map(([cat, total]) => (
                          <tr key={cat} className="border-b border-gray-700">
                            <td className="py-2 px-4 capitalize">{cat}</td>
                            <td className="py-2 px-4">{formatCurrency(total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {transactions.length > 0 && (
                  <PieChart data={getBudgetSummary(transactions)} />
                )}
              </>
            ) : (
              <div className="text-gray-400">No accounts linked yet. Link a bank account to see your data here.</div>
            )}
          </div>
        )}
        {activeSection === 'billpay' && (
          <div className="max-w-3xl mx-auto py-12">
            <h2 className="text-3xl font-bold mb-6">Bill Pay</h2>
            {/* List of bills and pay option */}
            <div className="bg-gray-800 rounded-xl p-6 shadow mb-6">
              <h3 className="text-lg font-semibold mb-4">Upcoming Bills</h3>
              <ul className="divide-y divide-gray-700">
                {(() => {
                  // Get user expenses from localStorage
                  let billsToShow = [];
                  if (typeof window !== 'undefined') {
                    const storedExpenses = localStorage.getItem('monthlyExpenses');
                    if (storedExpenses) {
                      try {
                        const expenses = JSON.parse(storedExpenses).filter((exp: any) => exp.amount > 0);
                        const now = new Date();
                        const currentYear = now.getFullYear();
                        const currentMonth = now.getMonth();
                        let day = now.getDate() + 7; // Start 1 week from today
                        billsToShow = expenses.map((exp: any, idx: number) => {
                          // Ensure the due date is after today, but within this month
                          let dueDay = day + idx * 3;
                          const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
                          if (dueDay > lastDay) dueDay = lastDay;
                          return {
                            name: exp.name,
                            amount: exp.amount,
                            dueDate: new Date(currentYear, currentMonth, dueDay),
                          };
                        });
                      } catch (e) {}
                    }
                  }
                  return billsToShow.length === 0 ? (
                    <li className="text-gray-400">No upcoming bills.</li>
                  ) : (
                    billsToShow.map((bill: any, i: number) => (
                      <li key={i} className="flex justify-between items-center py-3">
                        <div>
                          <div className="font-semibold text-white">{bill.name}</div>
                          <div className="text-xs text-gray-400">Due: {bill.dueDate.toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-blue-300">{formatCurrency(bill.amount)}</div>
                          <button className="mt-1 px-3 py-1 bg-green-600 text-white rounded">Pay</button>
                        </div>
                      </li>
                    ))
                  );
                })()}
              </ul>
            </div>
          </div>
        )}
        {activeSection === 'settings' && (
          <div className="max-w-3xl mx-auto py-12">
            <h2 className="text-3xl font-bold mb-6">Settings</h2>
            <div className="bg-gray-800 rounded-xl p-6 shadow mb-6">
              {/* Profile Settings */}
              <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
              <div className="mb-4">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-gray-400 w-32">Name:</span>
                  <span className="text-white">{user?.email ? user.email.split('@')[0] : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 w-32">Email:</span>
                  <span className="text-white">{user?.email || 'N/A'}</span>
                </div>
              </div>
              {/* Notification Preferences */}
              <h3 className="text-lg font-semibold mb-4 mt-8">Notification Preferences</h3>
              <div className="flex flex-col gap-2 mb-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={notificationSettings.email.enabled} onChange={e => handleNotificationSettingsChange('email', 'enabled', e.target.checked)} className="form-checkbox h-4 w-4 text-blue-500" />
                  <span className="text-white">Enable Email Notifications</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={notificationSettings.browser.enabled} onChange={e => handleNotificationSettingsChange('browser', 'enabled', e.target.checked)} className="form-checkbox h-4 w-4 text-blue-500" />
                  <span className="text-white">Enable Browser Notifications</span>
                </label>
              </div>
              {/* Security */}
              <h3 className="text-lg font-semibold mb-4 mt-8">Security</h3>
              <button className="px-4 py-2 bg-yellow-500 text-gray-900 rounded font-semibold">Change Password</button>
            </div>
          </div>
        )}
        {activeSection === 'plan' && (
          <div className="max-w-3xl mx-auto py-12">
            <h2 className="text-3xl font-bold mb-6">Plan</h2>
            {/* Pie chart for income split */}
            <div className="bg-gray-800 rounded-xl p-6 shadow mb-6 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-4">Income Split Plan</h3>
              {/* Pie chart SVG */}
              {(() => {
                const data = [
                  { label: 'Needs', value: incomeSplit.needs, color: '#60a5fa' },
                  { label: 'Wants', value: incomeSplit.wants, color: '#fbbf24' },
                  { label: 'Savings', value: incomeSplit.savings, color: '#34d399' },
                  { label: 'Investments', value: incomeSplit.investments, color: '#a78bfa' },
                ];
                const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
                let cumulative = 0;
                const radius = 60;
                const cx = 70;
                const cy = 70;
                const pieSegments = data.map((d, i) => {
                  const startAngle = (cumulative / total) * 2 * Math.PI;
                  const endAngle = ((cumulative + d.value) / total) * 2 * Math.PI;
                  const x1 = cx + radius * Math.sin(startAngle);
                  const y1 = cy - radius * Math.cos(startAngle);
                  const x2 = cx + radius * Math.sin(endAngle);
                  const y2 = cy - radius * Math.cos(endAngle);
                  const largeArc = d.value / total > 0.5 ? 1 : 0;
                  const pathData = `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;
                  const midAngle = (startAngle + endAngle) / 2;
                  const labelX = cx + (radius * 0.7) * Math.sin(midAngle);
                  const labelY = cy - (radius * 0.7) * Math.cos(midAngle);
                  const percent = Math.round((d.value / total) * 100);
                  cumulative += d.value;
                  return (
                    <g key={d.label}>
                      <path d={pathData} fill={d.color} />
                      {d.value > 0 && (
                        <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle" fontSize="14" fill="#fff" fontWeight="bold">
                          {percent}%
                        </text>
                      )}
                    </g>
                  );
                });
                return (
                  <svg width="140" height="140" viewBox="0 0 140 140" className="mb-4">
                    {pieSegments}
                  </svg>
                );
              })()}
              {/* Legend */}
              <div className="flex flex-wrap gap-4 justify-center mt-4">
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full inline-block" style={{background:'#60a5fa'}}></span> <span className="text-white">Needs ({incomeSplit.needs}%)</span></div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full inline-block" style={{background:'#fbbf24'}}></span> <span className="text-white">Wants ({incomeSplit.wants}%)</span></div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full inline-block" style={{background:'#34d399'}}></span> <span className="text-white">Savings ({incomeSplit.savings}%)</span></div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full inline-block" style={{background:'#a78bfa'}}></span> <span className="text-white">Investments ({incomeSplit.investments}%)</span></div>
              </div>
              {/* Suggestion for Needs if above 30% */}
              {incomeSplit.needs > 30 && (
                <div className="mt-8 bg-blue-900/80 border-l-4 border-blue-400 p-4 rounded text-white shadow">
                  <div className="font-bold text-blue-300 mb-1">Suggestion</div>
                  <div>
                    Your current <span className="font-semibold">Needs</span> allocation is <span className="font-semibold">{incomeSplit.needs}%</span>. Consider reducing it to <span className="font-semibold">30%</span> or below. This will allow you to increase your <span className="font-semibold">Savings</span> and <span className="font-semibold">Investments</span>, which is better for your long-term financial health.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {activeSection === 'receipt' && (
          <div className="max-w-3xl mx-auto py-12">
            <h2 className="text-3xl font-bold mb-6">Receipt Capture</h2>
            {/* File upload for receipts */}
            <div className="bg-gray-800 rounded-xl p-6 shadow mb-6">
              <h3 className="text-lg font-semibold mb-4">Upload Receipt</h3>
              <input type="file" accept="image/*,application/pdf" className="mb-4" multiple onChange={handleReceiptFileChange} />
              <ul className="mb-4">
                {selectedReceipts.length === 0 ? (
                  <li className="text-gray-400">No file selected.</li>
                ) : (
                  selectedReceipts.map((file, idx) => (
                    <li key={idx} className="flex items-center gap-4 mb-2">
                      <span className="text-white">{file.name}</span>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => handleUploadReceipt(idx)} disabled={ocrLoading}>Upload</button>
                    </li>
                  ))
                )}
              </ul>
              {ocrLoading && <div className="text-blue-400">Processing receipt, please wait...</div>}
            </div>
            {/* List of uploaded receipts */}
            <div className="bg-gray-800 rounded-xl p-6 shadow">
              <h3 className="text-lg font-semibold mb-4">Uploaded Receipts</h3>
              {uploadedReceipts.length === 0 ? (
                <div className="text-gray-400">No receipts uploaded yet.</div>
              ) : (
                <ul>
                  {uploadedReceipts.map((file, idx) => (
                    <li key={idx} className="text-white mb-2">
                      <div>{file.name}</div>
                      <div className="text-xs text-green-300 whitespace-pre-line mt-1">
                        {ocrResults.find(r => r.name === file.name)?.text || 'No text extracted yet.'}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        {activeSection === 'goals' && (
          <div className="max-w-3xl mx-auto py-12">
            <h2 className="text-3xl font-bold mb-6">Goals</h2>
            <div className="bg-gray-800 rounded-xl p-6 shadow mb-6">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
                onClick={handleCreateGoal}
              >
                Create a new goal
              </button>
              <ul className="divide-y divide-gray-700 mb-4">
                {goals.length === 0 ? (
                  <li className="text-gray-400">No goals yet. Create your first goal!</li>
                ) : (
                  goals.map((goal, i) => (
                    <li key={goal.id} className="flex flex-col gap-2 py-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-white">{goal.name}</div>
                          <div className="text-xs text-gray-400">Target: {goal.target ? `$${goal.target}` : 'N/A'}</div>
                          <div className="text-xs text-gray-400">Balance: {goal.balance ? `$${goal.balance}` : '$0'}</div>
                          <div className="text-xs text-green-400">Remaining: {goal.target && goal.balance !== undefined ? `$${Math.max(goal.target - goal.balance, 0)}` : 'N/A'}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="px-3 py-1 bg-green-600 text-white rounded"
                            onClick={() => handleAddMoney(goal.id)}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="text-xs text-blue-300 font-semibold mb-1">Transactions</div>
                        {goal.transactions && goal.transactions.length > 0 ? (
                          <ul className="text-xs text-gray-200">
                            {goal.transactions.map((tx, idx) => (
                              <li key={idx} className="flex justify-between">
                                <span>{tx.description}</span>
                                <span>{tx.amount > 0 ? '+' : ''}{tx.amount}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-xs text-gray-500">No transactions yet.</div>
                        )}
                      </div>
                    </li>
                  ))
                )}
              </ul>
              {statusMessage && <div className="text-green-400 mt-2">{statusMessage}</div>}
            </div>
          </div>
        )}
      </main>
      {/* Floating AI Assistant Button and Chatbox */}
      <div>
        {/* Floating Button */}
        {!showAIChat && (
          <button
            onClick={() => setShowAIChat(true)}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl hover:scale-105 transition-transform"
            title="Open AnkFin AI Assistant"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
        {/* Enlarged Chatbox */}
        {showAIChat && (
          <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-full h-[600px] bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900 border border-blue-700 rounded-3xl shadow-2xl flex flex-col p-2 min-h-0 animate-fade-in">
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="font-bold text-lg text-white">AnkFin AI Assistant</span>
              <button
                onClick={() => setShowAIChat(false)}
                className="text-white hover:text-red-400 text-2xl font-bold px-2"
                title="Close"
              >
                ×
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <AIChatBox monthlyIncome={monthlyIncome} monthlyExpenses={monthlyExpenses} expenseBreakdown={expenseBreakdown} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PlaidLinkComponent({ linkToken, onSuccess }: { linkToken: string, onSuccess: (publicToken: string, metadata: any) => void }) {
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });
  // Open Plaid Link when ready
  useEffect(() => { if (ready) open(); }, [ready, open]);
  return null;
}

// Add this PieChart component at the bottom of the file:
function PieChart({ data }: { data: { [key: string]: number } }) {
  const categories = Object.keys(data);
  const total = Object.values(data).reduce((sum, v) => sum + v, 0) || 1;
  let cumulative = 0;
  const radius = 60;
  const cx = 70;
  const cy = 70;
  const colors = [
    '#60a5fa', // housing
    '#fbbf24', // utilities
    '#34d399', // transportation
    '#a78bfa', // food
    '#f472b6', // entertainment
    '#f87171', // miscellaneous
    '#d1d5db', // other
  ];
  const pieSegments = categories.map((cat, i) => {
    const value = data[cat];
    const startAngle = (cumulative / total) * 2 * Math.PI;
    const endAngle = ((cumulative + value) / total) * 2 * Math.PI;
    const x1 = cx + radius * Math.sin(startAngle);
    const y1 = cy - radius * Math.cos(startAngle);
    const x2 = cx + radius * Math.sin(endAngle);
    const y2 = cy - radius * Math.cos(endAngle);
    const largeArc = value / total > 0.5 ? 1 : 0;
    const pathData = `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;
    const percent = Math.round((value / total) * 100);
    cumulative += value;
    return (
      <g key={cat}>
        <path d={pathData} fill={colors[i % colors.length]} />
        {value > 0 && (
          <text x={cx + (radius * 0.7) * Math.sin((startAngle + endAngle) / 2)} y={cy - (radius * 0.7) * Math.cos((startAngle + endAngle) / 2)} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="#fff">{percent}%</text>
        )}
      </g>
    );
  });
  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">{pieSegments}</svg>
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {categories.map((cat, i) => (
          <div key={cat} className="flex items-center gap-2"><span className="w-4 h-4 rounded-full inline-block" style={{background:colors[i % colors.length]}}></span> <span className="text-white capitalize">{cat}</span></div>
        ))}
      </div>
    </div>
  );
}

// TimelineHorizon component
function TimelineHorizon({ transactions }) {
  const timeline = useMemo(() => getLast30DaysTimeline(transactions), [transactions]);
  const [index, setIndex] = useState(timeline.length > 0 ? timeline.length - 1 : 0);
  if (timeline.length === 0) {
    return (
      <div className="w-full flex flex-col items-center mt-10 mb-8">
        <div className="text-gray-400 text-lg">No transaction data available for the last 30 days.</div>
      </div>
    );
  }
  const current = timeline[index];
  return (
    <div className="w-full flex flex-col items-center mt-10 mb-8">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <input
          type="range"
          min={0}
          max={timeline.length - 1}
          value={index}
          onChange={e => setIndex(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex flex-col items-center mt-4">
          <span className="text-2xl font-bold flex items-center gap-2">
            {current.mood} <span className="text-blue-400">{new Date(current.date).toLocaleDateString()}</span>
          </span>
          <span className="text-lg font-semibold text-white mt-1">Balance: ${current.balance}</span>
          <span className="text-sm text-gray-300 mt-1">{current.label}</span>
        </div>
      </div>
    </div>
  );
}