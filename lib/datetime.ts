// Default timezone for the application
export const DEFAULT_TIMEZONE = 'Europe/Copenhagen'

/**
 * Format date and time for display in Copenhagen timezone
 */
export const formatDateTime = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('da-DK', {
    timeZone: DEFAULT_TIMEZONE,
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options
  }).format(dateObj)
}

/**
 * Format only time in Copenhagen timezone
 */
export const formatTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('da-DK', {
    timeZone: DEFAULT_TIMEZONE,
    timeStyle: 'short'
  }).format(dateObj)
}

/**
 * Format only date in Copenhagen timezone
 */
export const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('da-DK', {
    timeZone: DEFAULT_TIMEZONE,
    dateStyle: 'medium'
  }).format(dateObj)
}

/**
 * Get countdown string for upcoming sessions
 */
export const getCountdownString = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = dateObj.getTime() - now.getTime()
  
  if (diff < 0) return 'Session started'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

/**
 * Check if user can join session (T-5 minutes)
 */
export const canJoinSession = (startTime: Date | string) => {
  const dateObj = typeof startTime === 'string' ? new Date(startTime) : startTime
  const now = new Date()
  const fiveMinutesBefore = new Date(dateObj.getTime() - 5 * 60 * 1000)
  return now >= fiveMinutesBefore
}

/**
 * Check if session is happening now
 */
export const isSessionActive = (startTime: Date | string, endTime: Date | string) => {
  const startObj = typeof startTime === 'string' ? new Date(startTime) : startTime
  const endObj = typeof endTime === 'string' ? new Date(endTime) : endTime
  const now = new Date()
  
  return now >= startObj && now <= endObj
}

/**
 * Get current time in Copenhagen timezone
 */
export const getCurrentTimeInCopenhagen = () => {
  return new Date().toLocaleString('sv-SE', { timeZone: DEFAULT_TIMEZONE })
}

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: currency
  }).format(amount)
}