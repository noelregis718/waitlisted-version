'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface IncomeSource {
  type: string
  amount: number
  frequency: 'monthly' | 'weekly' | 'biweekly' | 'annually'
  description?: string
}

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

interface UserProfile {
  fullName: string;
  dateOfBirth: string;
  location: {
    city: string;
    state: string;
  };
  employmentStatus: 'Employed' | 'Self-Employed' | 'Student' | 'Unemployed' | 'Retired';
  incomeRange: '<$30k' | '$30k–$60k' | '$60k–$100k' | '>$100k';
}

interface FinancialGoal {
  id: string;
  name: string;
  timeline: 'short' | 'medium' | 'long';
  priority: number;
  selected: boolean;
}

interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
}

interface BudgetingPreferences {
  savesIncome: boolean;
  usedBudgetingTools: boolean;
  monthlyExpenses: ExpenseCategory[];
}

interface InvestmentPreference {
  experienceLevel: 'None' | 'Beginner' | 'Intermediate' | 'Advanced';
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive';
  interests: string[];
}

interface LifestylePreference {
  financialValues: {
    value: string;
    priority: number;
  }[];
  lifestyleChoice: 'Frugal' | 'Balanced' | 'Spender';
  philanthropicInterest: boolean;
}

interface FinalFeedback {
  additionalInfo: string;
}

const DEFAULT_SPLITS = {
  '50-30-20': { needs: 50, wants: 30, savings: 20, investments: 0 },
  'FIRE': { needs: 40, wants: 20, savings: 20, investments: 20 },
  'Conservative': { needs: 60, wants: 20, savings: 15, investments: 5 },
  'Aggressive': { needs: 40, wants: 20, savings: 10, investments: 30 },
}

const FINANCIAL_GOALS: FinancialGoal[] = [
  // Short-term goals
  { id: 'vacation', name: 'Saving for vacation', timeline: 'short', priority: 0, selected: false },
  { id: 'apparel', name: 'New Apparel or Products', timeline: 'short', priority: 0, selected: false },
  { id: 'emergency', name: 'Emergency fund', timeline: 'short', priority: 0, selected: false },
  { id: 'credit', name: 'Pay off credit cards', timeline: 'short', priority: 0, selected: false },
  { id: 'other_short', name: 'Other short-term goal', timeline: 'short', priority: 0, selected: false },
  // Medium-term goals
  { id: 'home', name: 'Buying a home', timeline: 'medium', priority: 0, selected: false },
  { id: 'business', name: 'Starting a business', timeline: 'medium', priority: 0, selected: false },
  // Long-term goals
  { id: 'retirement', name: 'Retirement planning', timeline: 'long', priority: 0, selected: false },
  { id: 'education', name: "Children's education", timeline: 'long', priority: 0, selected: false },
];

const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'housing', name: 'Housing', amount: 0, percentage: 0 },
  { id: 'utilities', name: 'Utilities', amount: 0, percentage: 0 },
  { id: 'transportation', name: 'Transportation', amount: 0, percentage: 0 },
  { id: 'food', name: 'Food', amount: 0, percentage: 0 },
  { id: 'entertainment', name: 'Entertainment', amount: 0, percentage: 0 },
  { id: 'miscellaneous', name: 'Miscellaneous', amount: 0, percentage: 0 },
  { id: 'other', name: 'Other', amount: 0, percentage: 0 },
];

const INVESTMENT_INTERESTS = [
  'Stocks',
  'Bonds',
  'Real Estate',
  'Mutual Funds',
  'Crypto',
  'CDs',
  'Other'
];

const FINANCIAL_VALUES = [
  { id: 'security', label: 'Security', description: 'Financial stability and safety' },
  { id: 'growth', label: 'Growth', description: 'Wealth accumulation and investment' },
  { id: 'freedom', label: 'Freedom', description: 'Financial independence and flexibility' },
  { id: 'philanthropy', label: 'Philanthropy', description: 'Giving back and social impact' },
];

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [showIncomeForm, setShowIncomeForm] = useState(true)
  const [showSplitForm, setShowSplitForm] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: '',
    dateOfBirth: '',
    location: {
      city: '',
      state: ''
    },
    employmentStatus: 'Employed',
    incomeRange: '$30k–$60k'
  })
  const [incomeSplit, setIncomeSplit] = useState<IncomeSplit>(DEFAULT_SPLITS['50-30-20'])
  const [selectedStrategy, setSelectedStrategy] = useState('50-30-20')
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    { name: 'Emergency Fund', target: 10000, current: 2500 },
    { name: 'New Car', target: 25000, current: 5000 },
    { name: 'Vacation Fund', target: 5000, current: 1500 }
  ])
  const [upcomingAllocations, setUpcomingAllocations] = useState<UpcomingAllocation[]>([
    { category: 'Rent', amount: 1200, date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), type: 'bill' },
    { category: 'Emergency Fund', amount: 500, date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), type: 'savings' },
    { category: 'Investment Contribution', amount: 300, date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), type: 'investment' }
  ])
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>(FINANCIAL_GOALS);
  const [showGoalsForm, setShowGoalsForm] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<FinancialGoal[]>([]);
  const [showSpendingForm, setShowSpendingForm] = useState(false);
  const [budgetingPreferences, setBudgetingPreferences] = useState<BudgetingPreferences>({
    savesIncome: false,
    usedBudgetingTools: false,
    monthlyExpenses: DEFAULT_EXPENSE_CATEGORIES,
  });
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [investmentPreferences, setInvestmentPreferences] = useState<InvestmentPreference>({
    experienceLevel: 'None',
    riskTolerance: 'Moderate',
    interests: [],
  });
  const [showLifestyleForm, setShowLifestyleForm] = useState(false);
  const [lifestylePreferences, setLifestylePreferences] = useState<LifestylePreference>({
    financialValues: FINANCIAL_VALUES.map(value => ({ value: value.id, priority: 0 })),
    lifestyleChoice: 'Balanced',
    philanthropicInterest: false,
  });
  const [showFinalFeedback, setShowFinalFeedback] = useState(false);
  const [finalFeedback, setFinalFeedback] = useState<FinalFeedback>({
    additionalInfo: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const amount = Number(form.amount.value)
    setMonthlyIncome(amount)
    setShowIncomeForm(false)
    setShowGoalsForm(true)
  }

  const handleProfileChange = (field: keyof UserProfile, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLocationChange = (field: 'city' | 'state', value: string) => {
    setUserProfile(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }))
  }

  const handleStrategyChange = (strategy: string) => {
    setSelectedStrategy(strategy)
    setIncomeSplit(DEFAULT_SPLITS[strategy as keyof typeof DEFAULT_SPLITS])
  }

  const handleSplitChange = (category: keyof IncomeSplit, value: number) => {
    setIncomeSplit(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const handleSubmitIncomeSources = async () => {
    try {
      const response = await fetch('/api/user/income-split', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          strategy: selectedStrategy,
          split: incomeSplit,
          totalMonthlyIncome: monthlyIncome
        })
      })

      if (response.ok) {
        // Save current split and income to localStorage
        localStorage.setItem('monthlyIncome', monthlyIncome.toString())
        localStorage.setItem('incomeSplit', JSON.stringify(incomeSplit))
        // Redirect to the live dashboard page
        router.push('/dashboard/live')
      }
    } catch (error) {
      console.error('Error saving income split:', error)
    }
  }

  const handleViewDashboard = () => {
    // Save current split and income to localStorage
    localStorage.setItem('monthlyIncome', monthlyIncome.toString())
    localStorage.setItem('incomeSplit', JSON.stringify(incomeSplit))
    router.push('/dashboard/live')
  }

  const handleGoalSelection = (goalId: string) => {
    setFinancialGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, selected: !goal.selected } : goal
    ));
  };

  const handlePriorityChange = (goalId: string, newPriority: number) => {
    setFinancialGoals(prev => {
      const updatedGoals = prev.map(goal => {
        if (goal.id === goalId) {
          return { ...goal, priority: newPriority };
        }
        if (goal.priority >= newPriority) {
          return { ...goal, priority: goal.priority + 1 };
        }
        return goal;
      });
      return updatedGoals.sort((a, b) => a.priority - b.priority);
    });
  };

  const handleGoalsSubmit = () => {
    const selected = financialGoals.filter(goal => goal.selected);
    setSelectedGoals(selected);
    setShowGoalsForm(false);
    setShowSpendingForm(true);
  };

  const handleExpenseChange = (categoryId: string, value: number) => {
    setBudgetingPreferences(prev => {
      const updatedExpenses = prev.monthlyExpenses.map(expense => {
        if (expense.id === categoryId) {
          return { ...expense, amount: value };
        }
        return expense;
      });

      // Calculate total expenses
      const totalExpenses = updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      // Update percentages
      const expensesWithPercentages = updatedExpenses.map(expense => ({
        ...expense,
        percentage: totalExpenses > 0 ? (expense.amount / totalExpenses) * 100 : 0,
      }));

      return {
        ...prev,
        monthlyExpenses: expensesWithPercentages,
      };
    });
  };

  const handlePreferenceChange = (field: keyof Omit<BudgetingPreferences, 'monthlyExpenses'>, value: boolean) => {
    setBudgetingPreferences(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setInvestmentPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleValuePriorityChange = (valueId: string, newPriority: number) => {
    setLifestylePreferences(prev => {
      const updatedValues = prev.financialValues.map(v => {
        if (v.value === valueId) {
          return { ...v, priority: newPriority };
        }
        if (v.priority >= newPriority) {
          return { ...v, priority: v.priority + 1 };
        }
        return v;
      });
      return {
        ...prev,
        financialValues: updatedValues.sort((a, b) => a.priority - b.priority),
      };
    });
  };

  const handleLifestyleSubmit = () => {
    setShowLifestyleForm(false);
    setShowFinalFeedback(true);
  };

  const handleInvestmentSubmit = () => {
    setShowInvestmentForm(false);
    setShowLifestyleForm(true);
  };

  const handleSpendingSubmit = () => {
    setShowSpendingForm(false);
    setShowInvestmentForm(true);
  };

  const handleFinalSubmit = () => {
    setShowFinalFeedback(false);
    setShowSplitForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <div className="text-xl text-white animate-pulse">Loading...</div>
      </div>
    )
  }

  if (showIncomeForm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Welcome to AnkFin!</h1>
              <p className="text-xl text-gray-300 mb-8">Let's tailor your financial journey together</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
                  <div className="text-blue-400 text-3xl mb-4">📊</div>
                  <h3 className="font-semibold mb-2">Customized Budgeting</h3>
                  <p className="text-sm text-gray-400">Get personalized spending insights and recommendations</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
                  <div className="text-green-400 text-3xl mb-4">🎯</div>
                  <h3 className="font-semibold mb-2">Goal Tracking</h3>
                  <p className="text-sm text-gray-400">Set and track your financial goals with AI-powered insights</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
                  <div className="text-purple-400 text-3xl mb-4">💡</div>
                  <h3 className="font-semibold mb-2">Smart Insights</h3>
                  <p className="text-sm text-gray-400">Receive tailored investment and savings recommendations</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Let's Get Started</h2>
              <form onSubmit={handleIncomeSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={userProfile.fullName}
                      onChange={(e) => handleProfileChange('fullName', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={userProfile.dateOfBirth}
                      onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={userProfile.location.city}
                      onChange={(e) => handleLocationChange('city', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white"
                      placeholder="Enter your city"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={userProfile.location.state}
                      onChange={(e) => handleLocationChange('state', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white"
                      placeholder="Enter your state"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-300 mb-2">
                      Employment Status
                    </label>
                    <select
                      id="employmentStatus"
                      name="employmentStatus"
                      value={userProfile.employmentStatus}
                      onChange={(e) => handleProfileChange('employmentStatus', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white"
                      required
                    >
                      <option value="Employed">Employed</option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Student">Student</option>
                      <option value="Unemployed">Unemployed</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Income Range
                    </label>
                    <div className="space-y-2">
                      {['<$30k', '$30k–$60k', '$60k–$100k', '>$100k'].map((range) => (
                        <label key={range} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="incomeRange"
                            value={range}
                            checked={userProfile.incomeRange === range}
                            onChange={(e) => handleProfileChange('incomeRange', e.target.value)}
                            className="form-radio text-blue-500"
                          />
                          <span className="text-gray-300">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                    Monthly Income
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-white"
                    placeholder="Enter your monthly income"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn btn-primary text-lg px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 mt-8"
                >
                  Continue to Financial Planning
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showGoalsForm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Set Your Financial Goals</h1>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
              <div className="space-y-8">
                {/* Short-term Goals */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Short-Term Goals (2-6 months or 1-3 years)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {financialGoals
                      .filter(goal => goal.timeline === 'short')
                      .map(goal => (
                        <label key={goal.id} className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={goal.selected}
                            onChange={() => handleGoalSelection(goal.id)}
                            className="form-checkbox h-5 w-5 text-blue-500"
                          />
                          <span>{goal.name}</span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Medium-term Goals */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Medium-Term Goals (2-4 years)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {financialGoals
                      .filter(goal => goal.timeline === 'medium')
                      .map(goal => (
                        <label key={goal.id} className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={goal.selected}
                            onChange={() => handleGoalSelection(goal.id)}
                            className="form-checkbox h-5 w-5 text-blue-500"
                          />
                          <span>{goal.name}</span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Long-term Goals */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Long-Term Goals (5+ years)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {financialGoals
                      .filter(goal => goal.timeline === 'long')
                      .map(goal => (
                        <label key={goal.id} className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={goal.selected}
                            onChange={() => handleGoalSelection(goal.id)}
                            className="form-checkbox h-5 w-5 text-blue-500"
                          />
                          <span>{goal.name}</span>
                        </label>
                    ))}
                  </div>
                </div>

                {/* Priority Ranking Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Priority Ranking</h2>
                  <p className="text-gray-400 mb-4">Drag and drop to rank your selected goals by priority</p>
                  <div className="space-y-2">
                    {financialGoals
                      .filter(goal => goal.selected)
                      .sort((a, b) => a.priority - b.priority)
                      .map((goal, index) => (
                        <div
                          key={goal.id}
                          className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg"
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData('text/plain', goal.id)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const draggedId = e.dataTransfer.getData('text/plain');
                            handlePriorityChange(draggedId, index);
                          }}
                        >
                          <span className="text-gray-400">{index + 1}.</span>
                          <span>{goal.name}</span>
                          <span className="text-sm text-gray-400">({goal.timeline}-term)</span>
                        </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    onClick={() => setShowGoalsForm(false)}
                    className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleGoalsSubmit}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showSpendingForm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Your Spending Habits</h1>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
              <div className="space-y-8">
                {/* Monthly Expenses Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-6">Monthly Expenses</h2>
                  <div className="space-y-6">
                    {budgetingPreferences.monthlyExpenses.map((category) => (
                      <div key={category.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-gray-300">{category.name}</label>
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-400">
                              {formatCurrency(category.amount)}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({category.percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={monthlyIncome}
                          value={category.amount}
                          onChange={(e) => handleExpenseChange(category.id, Number(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <input
                          type="number"
                          value={category.amount}
                          onChange={(e) => handleExpenseChange(category.id, Number(e.target.value))}
                          className="w-32 px-3 py-1 rounded bg-gray-700/50 border border-gray-600 text-white"
                          placeholder="Amount"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Savings Behavior Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Savings Behavior</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label className="text-gray-300">Do you currently save a portion of your income?</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            checked={budgetingPreferences.savesIncome}
                            onChange={() => handlePreferenceChange('savesIncome', true)}
                            className="form-radio text-blue-500"
                          />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            checked={!budgetingPreferences.savesIncome}
                            onChange={() => handlePreferenceChange('savesIncome', false)}
                            className="form-radio text-blue-500"
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budgeting Tools Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Budgeting Experience</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label className="text-gray-300">Have you used budgeting tools before?</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            checked={budgetingPreferences.usedBudgetingTools}
                            onChange={() => handlePreferenceChange('usedBudgetingTools', true)}
                            className="form-radio text-blue-500"
                          />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            checked={!budgetingPreferences.usedBudgetingTools}
                            onChange={() => handlePreferenceChange('usedBudgetingTools', false)}
                            className="form-radio text-blue-500"
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="bg-gray-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Monthly Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Income:</span>
                      <span className="font-medium">{formatCurrency(monthlyIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Expenses:</span>
                      <span className="font-medium">
                        {formatCurrency(budgetingPreferences.monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Remaining:</span>
                      <span className="font-medium">
                        {formatCurrency(
                          monthlyIncome - budgetingPreferences.monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    onClick={() => setShowSpendingForm(false)}
                    className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSpendingSubmit}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showInvestmentForm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Investment Preferences</h1>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
              <div className="space-y-8">
                {/* Experience Level Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-6">Investment Experience</h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {(['None', 'Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
                      <label
                        key={level}
                        className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all ${
                          investmentPreferences.experienceLevel === level
                            ? 'bg-blue-500/20 border-blue-500'
                            : 'bg-gray-700/30 border-gray-700 hover:bg-gray-700/50'
                        } border`}
                      >
                        <input
                          type="radio"
                          name="experienceLevel"
                          value={level}
                          checked={investmentPreferences.experienceLevel === level}
                          onChange={() => setInvestmentPreferences(prev => ({
                            ...prev,
                            experienceLevel: level
                          }))}
                          className="hidden"
                        />
                        <span className="text-lg font-medium mb-2">{level}</span>
                        <span className="text-sm text-gray-400 text-center">
                          {level === 'None' && 'No prior investment experience'}
                          {level === 'Beginner' && 'Basic understanding of investments'}
                          {level === 'Intermediate' && 'Regular investment experience'}
                          {level === 'Advanced' && 'Professional investment knowledge'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Risk Tolerance Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-6">Risk Tolerance</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['Conservative', 'Moderate', 'Aggressive'] as const).map((risk) => (
                      <label
                        key={risk}
                        className={`flex flex-col items-center p-6 rounded-lg cursor-pointer transition-all ${
                          investmentPreferences.riskTolerance === risk
                            ? 'bg-blue-500/20 border-blue-500'
                            : 'bg-gray-700/30 border-gray-700 hover:bg-gray-700/50'
                        } border`}
                      >
                        <input
                          type="radio"
                          name="riskTolerance"
                          value={risk}
                          checked={investmentPreferences.riskTolerance === risk}
                          onChange={() => setInvestmentPreferences(prev => ({
                            ...prev,
                            riskTolerance: risk
                          }))}
                          className="hidden"
                        />
                        <span className="text-lg font-medium mb-2">{risk}</span>
                        <span className="text-sm text-gray-400 text-center">
                          {risk === 'Conservative' && 'Focus on capital preservation'}
                          {risk === 'Moderate' && 'Balanced growth and security'}
                          {risk === 'Aggressive' && 'Maximum growth potential'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Investment Interests Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-6">Investment Interests</h2>
                  <p className="text-gray-400 mb-4">Select all investment types you're interested in:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {INVESTMENT_INTERESTS.map((interest) => (
                      <label
                        key={interest}
                        className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all ${
                          investmentPreferences.interests.includes(interest)
                            ? 'bg-blue-500/20 border-blue-500'
                            : 'bg-gray-700/30 border-gray-700 hover:bg-gray-700/50'
                        } border`}
                      >
                        <input
                          type="checkbox"
                          checked={investmentPreferences.interests.includes(interest)}
                          onChange={() => handleInterestToggle(interest)}
                          className="form-checkbox h-5 w-5 text-blue-500"
                        />
                        <span>{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Summary Section */}
                <div className="bg-gray-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Your Investment Profile</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Experience Level:</span>
                      <span className="font-medium">{investmentPreferences.experienceLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Risk Tolerance:</span>
                      <span className="font-medium">{investmentPreferences.riskTolerance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Selected Interests:</span>
                      <span className="font-medium">
                        {investmentPreferences.interests.length > 0
                          ? investmentPreferences.interests.join(', ')
                          : 'None selected'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    onClick={() => setShowInvestmentForm(false)}
                    className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleInvestmentSubmit}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showLifestyleForm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Lifestyle & Values</h1>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
              <div className="space-y-8">
                {/* Financial Values Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-6">Financial Values</h2>
                  <p className="text-gray-400 mb-4">Based on your choices we have used AI to decode your financial planning:</p>
                  <div className="space-y-4">
                    {lifestylePreferences.financialValues
                      .sort((a, b) => a.priority - b.priority)
                      .map((value, index) => {
                        const valueInfo = FINANCIAL_VALUES.find(v => v.id === value.value);
                        return (
                          <div
                            key={value.value}
                            className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg"
                          >
                            <span className="text-gray-400">{index + 1}.</span>
                            <div className="flex-1">
                              <h3 className="font-medium">{valueInfo?.label}</h3>
                              <p className="text-sm text-gray-400">{valueInfo?.description}</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Lifestyle Choice Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-6">Lifestyle Preference</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['Frugal', 'Balanced', 'Spender'] as const).map((choice) => (
                      <label
                        key={choice}
                        className={`flex flex-col items-center p-6 rounded-lg cursor-pointer transition-all ${
                          lifestylePreferences.lifestyleChoice === choice
                            ? 'bg-blue-500/20 border-blue-500'
                            : 'bg-gray-700/30 border-gray-700 hover:bg-gray-700/50'
                        } border`}
                      >
                        <input
                          type="radio"
                          name="lifestyleChoice"
                          value={choice}
                          checked={lifestylePreferences.lifestyleChoice === choice}
                          onChange={() => setLifestylePreferences(prev => ({
                            ...prev,
                            lifestyleChoice: choice
                          }))}
                          className="hidden"
                        />
                        <span className="text-lg font-medium mb-2">{choice}</span>
                        <span className="text-sm text-gray-400 text-center">
                          {choice === 'Frugal' && 'Careful spending and saving'}
                          {choice === 'Balanced' && 'Moderate spending with savings'}
                          {choice === 'Spender' && 'Comfortable with higher spending'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Philanthropic Interest Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-6">Philanthropic Interest</h2>
                  <div className="flex items-center space-x-4">
                    <label className="text-gray-300">Are charitable donations part of your plan?</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={lifestylePreferences.philanthropicInterest}
                          onChange={() => setLifestylePreferences(prev => ({
                            ...prev,
                            philanthropicInterest: true
                          }))}
                          className="form-radio text-blue-500"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={!lifestylePreferences.philanthropicInterest}
                          onChange={() => setLifestylePreferences(prev => ({
                            ...prev,
                            philanthropicInterest: false
                          }))}
                          className="form-radio text-blue-500"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="bg-gray-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Your Lifestyle Profile</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Top Financial Value:</span>
                      <span className="font-medium">
                        {FINANCIAL_VALUES.find(v => v.id === lifestylePreferences.financialValues[0]?.value)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Lifestyle Choice:</span>
                      <span className="font-medium">{lifestylePreferences.lifestyleChoice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Philanthropic Interest:</span>
                      <span className="font-medium">
                        {lifestylePreferences.philanthropicInterest ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    onClick={() => setShowLifestyleForm(false)}
                    className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleLifestyleSubmit}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showFinalFeedback) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Almost Done!</h1>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
              <div className="space-y-8">
                {/* AI Chat Interface */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 bg-gray-700/30 rounded-lg p-4">
                      <p className="text-gray-300">
                        Is there anything else you'd like us to know to better assist you?
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <textarea
                      value={finalFeedback.additionalInfo}
                      onChange={(e) => setFinalFeedback(prev => ({
                        ...prev,
                        additionalInfo: e.target.value
                      }))}
                      placeholder="Share any additional information that might help us provide better financial guidance..."
                      className="w-full h-32 px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white resize-none focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Security Message */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <h3 className="font-medium text-blue-400 mb-1">Your Information is Secure</h3>
                      <p className="text-sm text-gray-400">
                        We take your privacy seriously. Your information is encrypted and helps us provide you with personalized financial guidance. We never share your data with third parties without your consent.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    onClick={() => setShowFinalFeedback(false)}
                    className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    Complete Setup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showSplitForm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-12 text-center pt-12">Smart Income Split</h1>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Your Monthly Income: {formatCurrency(monthlyIncome)}</h2>
                <p className="text-gray-400 mb-6">Choose how you want to allocate your income</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(DEFAULT_SPLITS).map(([strategy, split]) => (
                    <button
                      key={strategy}
                      onClick={() => handleStrategyChange(strategy)}
                      className={`p-6 rounded-lg border ${
                        selectedStrategy === strategy
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <h3 className="font-medium text-lg mb-3">{strategy}</h3>
                      <div className="text-sm space-y-2">
                        {Object.entries(split).map(([category, percentage]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span className="text-gray-300 capitalize">{category}</span>
                            <div className="text-right">
                              <p className="text-gray-400">{percentage}%</p>
                              <p className="text-blue-400 font-medium">
                                {formatCurrency((monthlyIncome * percentage) / 100)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Customize Your Split</h2>
                <div className="space-y-6">
                  {Object.entries(incomeSplit).map(([category, value]) => (
                    <div key={category}>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-gray-300 capitalize">
                          {category}
                        </label>
                        <div className="text-right">
                          <span className="text-sm text-gray-400">{value}%</span>
                          <p className="text-sm text-blue-400 font-medium">
                            {formatCurrency((monthlyIncome * value) / 100)}
                          </p>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => handleSplitChange(category as keyof IncomeSplit, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Monthly Allocation Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(incomeSplit).map(([category, percentage]) => (
                    <div key={category} className="bg-gray-700/30 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-300 capitalize mb-2">{category}</h3>
                      <p className="text-2xl font-bold text-blue-400">
                        {formatCurrency((monthlyIncome * percentage) / 100)}
                      </p>
                      <p className="text-sm text-gray-400">{percentage}%</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleViewDashboard}
                  className="flex-1 btn btn-secondary text-lg px-8 py-3 rounded-lg bg-gray-700 hover:bg-gray-600"
                >
                  View Live Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showDashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h1 className="text-3xl font-bold">Financial Dashboard</h1>
              <button
                onClick={() => setShowDashboard(false)}
                className="btn btn-secondary px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                Back to Split
              </button>
            </div>

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
              <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
                <h2 className="text-xl font-semibold mb-6">Upcoming Allocations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingAllocations.map((allocation, index) => (
                    <div key={index} className="bg-gray-700/30 p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-lg capitalize">{allocation.category}</h3>
                          <p className="text-gray-400 text-sm">
                            {allocation.date.toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          allocation.type === 'bill' ? 'bg-red-500/20 text-red-400' :
                          allocation.type === 'savings' ? 'bg-green-500/20 text-green-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {allocation.type}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-blue-400">
                        {formatCurrency(allocation.amount)}
                      </p>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-12 pt-8">Welcome, {user?.firstName || user?.email}</h1>
          
          {/* Dashboard content goes here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
              <h2 className="text-xl font-semibold mb-6">Account Overview</h2>
              <p className="text-gray-400 mb-4">View your account details and recent transactions.</p>
              <div className="mt-4">
                <Link href="/accounts" className="text-blue-400 hover:text-blue-300 transition-colors">
                  View Details →
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              <p className="text-gray-400 mb-4">Perform common banking tasks.</p>
              <div className="mt-4">
                <Link href="/transactions" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Get Started →
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8">
              <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
              <p className="text-gray-400 mb-4">Track your recent transactions and updates.</p>
              <div className="mt-4">
                <Link href="/activity" className="text-blue-400 hover:text-blue-300 transition-colors">
                  View Activity →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 