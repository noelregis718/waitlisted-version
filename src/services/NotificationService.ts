import { NotificationData, NotificationHistory, NotificationSettings } from '@/types/notifications'

interface NotificationState {
  lastSent: { [key: string]: number }
  queue: NotificationData[]
  isProcessing: boolean
}

class NotificationService {
  private static instance: NotificationService
  private settings: NotificationSettings
  private history: NotificationHistory[] = []
  private readonly MAX_HISTORY = 100
  private state: NotificationState = {
    lastSent: {},
    queue: [],
    isProcessing: false
  }
  private readonly COOLDOWN = 5 * 60 * 1000 // 5 minutes

  private constructor() {
    this.initializeBrowserNotifications()
    this.settings = this.loadSettings()
    this.loadState()
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  private loadSettings(): NotificationSettings {
    const stored = localStorage.getItem('notificationSettings')
    if (stored) {
      return JSON.parse(stored)
    }
    return {
      email: {
        enabled: true,
        types: {
          income: true,
          goal: true,
          overspend: true,
          bill: true,
          investment: true,
          budget: true,
          milestone: true
        },
        priority: {
          low: true,
          medium: true,
          high: true
        }
      },
      browser: {
        enabled: true,
        types: {
          income: true,
          goal: true,
          overspend: true,
          bill: true,
          investment: true,
          budget: true,
          milestone: true
        },
        priority: {
          low: true,
          medium: true,
          high: true
        }
      }
    }
  }

  private loadState() {
    const stored = localStorage.getItem('notificationState')
    if (stored) {
      this.state = JSON.parse(stored)
    }
  }

  private saveState() {
    localStorage.setItem('notificationState', JSON.stringify(this.state))
  }

  private saveSettings() {
    localStorage.setItem('notificationSettings', JSON.stringify(this.settings))
  }

  private getNotificationKey(data: NotificationData): string {
    return `${data.type}_${data.goalName || data.category || 'default'}`
  }

  private canSendNotification(data: NotificationData): boolean {
    const key = this.getNotificationKey(data)
    const lastSent = this.state.lastSent[key] || 0
    const now = Date.now()
    return now - lastSent >= this.COOLDOWN
  }

  private markNotificationSent(data: NotificationData) {
    const key = this.getNotificationKey(data)
    this.state.lastSent[key] = Date.now()
    this.saveState()
  }

  private async initializeBrowserNotifications() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      this.settings.browser.enabled = permission === 'granted'
      this.saveSettings()
    }
  }

  public async sendNotification(data: NotificationData) {
    // Check if notification can be sent
    if (!this.canSendNotification(data)) {
      return
    }

    const notification: NotificationHistory = {
      id: Math.random().toString(36).substr(2, 9),
      data: {
        ...data,
        timestamp: new Date(),
        priority: data.priority || 'medium'
      },
      sent: false,
      timestamp: new Date(),
      channels: []
    }

    try {
      // Check if notification should be sent based on settings
      if (this.shouldSendNotification(data, 'email')) {
        await this.sendEmailNotification(data)
        notification.channels.push('email')
      }

      if (this.shouldSendNotification(data, 'browser')) {
        this.sendBrowserNotification(data)
        notification.channels.push('browser')
      }

      if (notification.channels.length > 0) {
        notification.sent = true
        this.addToHistory(notification)
        this.markNotificationSent(data)
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      this.addToHistory(notification)
    }
  }

  private shouldSendNotification(data: NotificationData, channel: 'email' | 'browser'): boolean {
    const channelSettings = this.settings[channel]
    return (
      channelSettings.enabled &&
      channelSettings.types[data.type] &&
      channelSettings.priority[data.priority || 'medium']
    )
  }

  private addToHistory(notification: NotificationHistory) {
    this.history.unshift(notification)
    if (this.history.length > this.MAX_HISTORY) {
      this.history.pop()
    }
    localStorage.setItem('notificationHistory', JSON.stringify(this.history))
  }

  public getHistory(): NotificationHistory[] {
    return this.history
  }

  public clearHistory() {
    this.history = []
    localStorage.removeItem('notificationHistory')
  }

  private async sendEmailNotification(data: NotificationData) {
    const email = localStorage.getItem('userEmail')
    if (!email) return

    const msg = {
      to: email,
      subject: data.title,
      text: data.message,
      html: this.generateEmailTemplate(data)
    }

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(msg)
      })

      if (!response.ok) {
        throw new Error('Failed to send email')
      }
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }

  private sendBrowserNotification(data: NotificationData) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(data.title, {
        body: data.message,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: data.type,
        requireInteraction: data.priority === 'high'
      })
    }
  }

  private generateEmailTemplate(data: NotificationData): string {
    const priorityColors = {
      low: '#4CAF50',
      medium: '#2196F3',
      high: '#F44336'
    }

    const typeIcons = {
      income: '💰',
      goal: '🎯',
      overspend: '⚠️',
      bill: '📝',
      investment: '📈',
      budget: '📊',
      milestone: '🏆'
    }

    let template = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="/logo.png" alt="FlowBank Logo" style="max-width: 150px; margin-bottom: 10px;">
          <h2 style="color: #333; margin: 0;">${typeIcons[data.type]} ${data.title}</h2>
          <div style="background-color: ${priorityColors[data.priority || 'medium']}; height: 4px; width: 100px; margin: 10px auto;"></div>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #666; margin: 0; font-size: 16px; line-height: 1.5;">${data.message}</p>
        </div>
    `

    if (data.amount) {
      template += `
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          <p style="margin: 0; color: #333;"><strong>Amount:</strong> $${data.amount.toFixed(2)}</p>
        </div>
      `
    }

    if (data.goalName && data.progress !== undefined) {
      const progressColor = data.progress >= 100 ? '#4CAF50' : data.progress >= 90 ? '#FFC107' : '#2196F3'
      template += `
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          <p style="margin: 0; color: #333;"><strong>Goal:</strong> ${data.goalName}</p>
          <div style="background-color: #e0e0e0; height: 8px; border-radius: 4px; margin: 10px 0;">
            <div style="background-color: ${progressColor}; height: 8px; border-radius: 4px; width: ${data.progress}%;"></div>
          </div>
          <p style="margin: 0; color: #333;"><strong>Progress:</strong> ${data.progress}%</p>
        </div>
      `
    }

    template += `
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">This is an automated message from FlowBank. Please do not reply to this email.</p>
          <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">Priority: ${data.priority?.toUpperCase() || 'MEDIUM'}</p>
        </div>
      </div>
    `

    return template
  }

  public updateSettings(newSettings: Partial<NotificationSettings>) {
    this.settings = {
      ...this.settings,
      ...newSettings
    }
    this.saveSettings()
  }

  public getSettings(): NotificationSettings {
    return this.settings
  }

  public clearNotificationState() {
    this.state = {
      lastSent: {},
      queue: [],
      isProcessing: false
    }
    this.saveState()
  }
}

export default NotificationService 