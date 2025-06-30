'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import NotificationService, { NotificationData, NotificationHistory, NotificationSettings } from '@/services/NotificationService'
import { useAuth } from '@/contexts/AuthContext'
import AIChatBox from '@/components/AIChatBox'

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
  const [activeSection, setActiveSection] = useState<'dashboard' | 'transactions' | 'statistics'>('dashboard');
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

  // Use actual recent transactions (simulate from bills)
  const recentTransactions = bills.slice(0, 4).map((bill, i) => ({
    name: bill.name,
    date: bill.dueDate,
    amount: -bill.amount,
    icon: bill.name.charAt(0).toUpperCase(),
    color: ['blue', 'purple', 'pink', 'green'][i % 4]
  }));

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
        // Only include categories with amount > 0
        userBills = expenses.filter((exp: any) => exp.amount > 0).map((exp: any) => ({
          name: exp.name,
          amount: exp.amount,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Placeholder: all due in 7 days
          category: exp.name,
          status: 'pending',
        }))
      } catch (e) {
        // fallback to default bills if parsing fails
      }
    }

    // If no user bills, split needs into default categories
    if (userBills.length === 0 && storedIncome && storedSplit) {
      const split = JSON.parse(storedSplit)
      const needsAmount = Number(storedIncome) * (split.needs / 100)
      const categories = ['Utilities', 'Transportation', 'Entertainment', 'Other']
      const perCategory = Math.floor((needsAmount / categories.length) * 100) / 100
      let remainder = Math.round((needsAmount - perCategory * categories.length) * 100) / 100
      userBills = categories.map((cat, idx) => ({
        name: cat,
        amount: perCategory + (idx === 0 ? remainder : 0), // add any rounding remainder to the first
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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

  // Simulate user transactions from bills/expenses for the last 6 months
  const generateTransactions = () => {
    const now = new Date();
    let txs = [];
    for (let m = 0; m < 6; m++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
      (bills.length ? bills : [
        { name: 'Utilities', amount: 100, dueDate: monthDate, category: 'Utilities', status: 'pending' },
        { name: 'Groceries', amount: 200, dueDate: monthDate, category: 'Food', status: 'pending' },
        { name: 'Transport', amount: 50, dueDate: monthDate, category: 'Transportation', status: 'pending' }
      ]).forEach((bill, i) => {
        txs.push({
          name: bill.name,
          date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 5 + i * 7),
          amount: -bill.amount,
          category: bill.category,
        });
      });
    }
    return txs;
  };
  const allTransactions = generateTransactions();

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
    const monthTxs = allTransactions.filter(tx => tx.date.getMonth() === month && tx.date.getFullYear() === year && tx.date >= statsStart && tx.date <= statsEnd);
    const income = monthTxs.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
    const expenses = monthTxs.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + tx.amount, 0);
    // Estimate savings and investments from incomeSplit if not in transactions
    let savings = 0;
    let investments = 0;
    if (monthlyIncome && incomeSplit) {
      savings = (monthlyIncome * (incomeSplit.savings || 0) / 100);
      investments = (monthlyIncome * (incomeSplit.investments || 0) / 100);
    }
    // If there are explicit savings/investment transactions, use them (future extension)
    return {
      label: monthDate.toLocaleString('default', { month: 'short', year: '2-digit' }),
      income,
      expenses: Math.abs(expenses),
      savings,
      investments,
      net: income + expenses,
    };
  });
  const statsTotalIncome = statsCashFlowData.reduce((sum, d) => sum + d.income, 0);
  const statsTotalExpenses = statsCashFlowData.reduce((sum, d) => sum + d.expenses, 0);
  const statsTotalSavings = statsCashFlowData.reduce((sum, d) => sum + d.savings, 0);
  const statsTotalInvestments = statsCashFlowData.reduce((sum, d) => sum + d.investments, 0);
  const statsNetCashFlow = statsTotalIncome - statsTotalExpenses - statsTotalSavings - statsTotalInvestments;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white pt-24 flex flex-row">
      {/* Side Panel */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col py-8 px-4 min-h-screen sticky top-0 left-0 z-20">
        <div className="mb-10 flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-400">FinDash</span>
        </div>
        <nav className="flex flex-col gap-2">
          <button
            className={`flex items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${activeSection === 'dashboard' ? 'bg-blue-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
            onClick={() => setActiveSection('dashboard')}
          >
            <DashboardIcon /> Dashboard
          </button>
          <button
            className={`flex items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${activeSection === 'transactions' ? 'bg-blue-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
            onClick={() => setActiveSection('transactions')}
          >
            <TransactionsIcon /> Transactions
          </button>
          <button
            className={`flex items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors ${activeSection === 'statistics' ? 'bg-blue-700 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
            onClick={() => setActiveSection('statistics')}
          >
            <StatisticsIcon /> Statistics
          </button>
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
                      <button className="text-xs text-blue-600 font-semibold">View all</button>
                    </div>
                    <ul className="space-y-2">
                      {recentTransactions.map((tx, i) => (
                        <li key={i} className="flex justify-between items-center text-gray-800">
                          <span className="flex items-center gap-2"><span className={`bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center`}><span className={`text-gray-700 font-bold`}>{tx.icon}</span></span>{tx.name}</span>
                          <span className="text-xs">{tx.date.toLocaleDateString()}</span>
                          <span className="font-semibold">{formatCurrency(tx.amount)}</span>
                        </li>
                      ))}
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
                      {txs.map((tx, i) => (
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
              <AIChatBox />
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 