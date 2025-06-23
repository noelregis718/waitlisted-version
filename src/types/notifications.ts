export interface NotificationData {
  type: 'income' | 'goal' | 'overspend' | 'bill' | 'investment' | 'budget' | 'milestone'
  title: string
  message: string
  amount?: number
  category?: string
  goalName?: string
  progress?: number
  priority?: 'low' | 'medium' | 'high'
  timestamp?: Date
}

export interface NotificationHistory {
  id: string
  data: NotificationData
  sent: boolean
  timestamp: Date
  channels: ('email' | 'browser')[]
}

export interface NotificationSettings {
  email: {
    enabled: boolean
    types: {
      income: boolean
      goal: boolean
      overspend: boolean
      bill: boolean
      investment: boolean
      budget: boolean
      milestone: boolean
    }
    priority: {
      low: boolean
      medium: boolean
      high: boolean
    }
  }
  browser: {
    enabled: boolean
    types: {
      income: boolean
      goal: boolean
      overspend: boolean
      bill: boolean
      investment: boolean
      budget: boolean
      milestone: boolean
    }
    priority: {
      low: boolean
      medium: boolean
      high: boolean
    }
  }
} 