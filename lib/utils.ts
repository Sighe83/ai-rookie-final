import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'DKK') {
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount / 100)
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('da-DK', {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  }).format(new Date(date))
}

export function formatTime(time: string) {
  const [hours, minutes] = time.split(':')
  return `${hours}:${minutes}`
}

export function getDayName(dayOfWeek: number) {
  const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']
  return days[dayOfWeek]
}

export function addHours(date: Date, hours: number) {
  const result = new Date(date)
  result.setHours(result.getHours() + hours)
  return result
}

export function addMinutes(date: Date, minutes: number) {
  const result = new Date(date)
  result.setMinutes(result.getMinutes() + minutes)
  return result
}