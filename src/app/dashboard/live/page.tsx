'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef, useCallback } from 'react'
import NotificationService, { NotificationData, NotificationHistory, NotificationSettings } from '@/services/NotificationService'

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
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    { name: 'Emergency Fund', target: 10000, current: 2500 },
    { name: 'New Car', target: 25000, current: 5000 },
    { name: 'Vacation Fund', target: 5000, current: 1500 }
  ])
  const [upcomingAllocations, setUpcomingAllocations] = useState<UpcomingAllocation[]>([])
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([])
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(notificationService.getSettings())
  const lastNotificationTime = useRef<{ [key: string]: number }>({})
  const notificationCooldown = 5 * 60 * 1000 // 5 minutes in milliseconds
  const [lastCheckTime, setLastCheckTime] = useState<number>(Date.now())
  const checkInterval = useRef<NodeJS.Timeout>()

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

  useEffect(() => {
    const storedIncome = localStorage.getItem('monthlyIncome')
    const storedSplit = localStorage.getItem('incomeSplit')
    
    if (storedIncome) {
      setMonthlyIncome(Number(storedIncome))
    }
    if (storedSplit) {
      setIncomeSplit(JSON.parse(storedSplit))
    }

    const allocations: UpcomingAllocation[] = []
    const today = new Date()
    
    bills.forEach(bill => {
      allocations.push({
        category: bill.name,
        amount: bill.amount,
        date: bill.dueDate,
        type: 'bill'
      })
    })

    const savingsAmount = (monthlyIncome * incomeSplit.savings) / 100
    allocations.push({
      category: 'Savings',
      amount: savingsAmount,
      date: new Date(today.getFullYear(), today.getMonth() + 1, 1),
      type: 'savings'
    })

    const investmentAmount = (monthlyIncome * incomeSplit.investments) / 100
    allocations.push({
      category: 'Investments',
      amount: investmentAmount,
      date: new Date(today.getFullYear(), today.getMonth() + 1, 1),
      type: 'investment'
    })

    setUpcomingAllocations(allocations)

    const history = notificationService.getHistory()
    setNotificationHistory(history)

    if (checkInterval.current) {
      clearInterval(checkInterval.current)
    }

    checkInterval.current = setInterval(() => {
      checkAndSendNotifications()
    }, 60000)

    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current)
      }
    }
  }, [monthlyIncome, incomeSplit, bills, savingsGoals, checkAndSendNotifications])

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
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
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-gray-800/95 border border-gray-700/50 rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Notification Settings</h2>
                  <button
                    onClick={() => setShowNotificationSettings(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
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
            </div>
          )}

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Money Flow Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
              <h2 className="text-xl font-semibold mb-6">Where Your Money Goes</h2>
              <div className="space-y-6">
                {Object.entries(incomeSplit).map(([category, percentage]) => (
                  <div key={category}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300 capitalize">{category}</span>
                      <span className="text-gray-400">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <div
                        className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="mt-1 text-right text-sm text-gray-400">
                      {formatCurrency((monthlyIncome * percentage) / 100)}/month
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bills Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
              <h2 className="text-xl font-semibold mb-6">Upcoming Bills</h2>
              <div className="space-y-4">
                {bills.map((bill, index) => (
                  <div key={index} className="bg-gray-700/30 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{bill.name}</h3>
                        <p className="text-sm text-gray-400">{bill.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-blue-400">{formatCurrency(bill.amount)}</p>
                        <p className="text-sm text-gray-400">Due: {bill.dueDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        bill.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                        bill.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings Goals Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
              <h2 className="text-xl font-semibold mb-6">Savings Goals Progress</h2>
              <div className="space-y-6">
                {savingsGoals.map((goal, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">{goal.name}</span>
                      <span className="text-gray-400">
                        {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <div
                        className="h-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                        style={{ width: `${(goal.current / goal.target) * 100}%` }}
                      />
                    </div>
                    <div className="mt-1 text-right text-sm text-gray-400">
                      {Math.round((goal.current / goal.target) * 100)}% Complete
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Allocations Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
              <h2 className="text-xl font-semibold mb-6">Upcoming Allocations</h2>
              <div className="space-y-4">
                {upcomingAllocations.map((allocation, index) => (
                  <div key={index} className="bg-gray-700/30 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium capitalize">{allocation.category}</h3>
                        <p className="text-sm text-gray-400">
                          {allocation.date.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-blue-400">
                          {formatCurrency(allocation.amount)}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          allocation.type === 'bill' ? 'bg-red-500/20 text-red-400' :
                          allocation.type === 'savings' ? 'bg-green-500/20 text-green-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {allocation.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 