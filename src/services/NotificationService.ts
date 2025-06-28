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

  private shouldSendNotification(data: NotificationData, channel: 'browser'): boolean {
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

  private sendBrowserNotification(data: NotificationData) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(data.title, {
        body: data.message,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: data.type,
        requireInteraction: data.priority === 'high'
      })
    }
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