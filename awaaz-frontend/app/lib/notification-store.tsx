'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import type { StatusKind } from './admin-data'

// ─── Types ─────────────────────────────────────────────────────────────────────
export type NotificationType = 'new-complaint' | 'sla-warning' | 'escalation' | 'resolution' | 'assignment' | 'feedback-needed' | 're-review' | 'photo-review'

export type AppNotification = {
  id: string
  type: NotificationType
  message: string
  timestamp: string // ISO
  read: boolean
  targetRole: 'senior' | 'je' | 'karamchari' | 'citizen'
  complaintId?: string
}

// ─── Auto-notification generator ───────────────────────────────────────────────
const STATUS_NOTIFICATIONS: Partial<Record<StatusKind, { type: NotificationType; targetRole: AppNotification['targetRole']; template: (id: string) => string }>> = {
  'received': { type: 'new-complaint', targetRole: 'senior', template: (id) => `New complaint ${id} received. Review needed.` },
  'assigned-je': { type: 'assignment', targetRole: 'je', template: (id) => `Complaint ${id} assigned to you. Take action.` },
  'assigned-field': { type: 'assignment', targetRole: 'karamchari', template: (id) => `Field assignment: Complaint ${id}. Start inspection.` },
  'photo-uploaded': { type: 'photo-review', targetRole: 'senior', template: (id) => `Photo evidence uploaded for ${id}. Review needed.` },
  'feedback-pending': { type: 'feedback-needed', targetRole: 'citizen', template: (id) => `Your complaint ${id} needs feedback. Please respond.` },
  'not-satisfied': { type: 're-review', targetRole: 'senior', template: (id) => `Citizen not satisfied with ${id}. Re-review required.` },
  'escalated': { type: 'escalation', targetRole: 'senior', template: (id) => `Complaint ${id} escalated due to SLA breach.` },
  'completed': { type: 'resolution', targetRole: 'citizen', template: (id) => `Your complaint ${id} has been resolved.` },
}

// ─── Initial mock notifications ────────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0]
const SEED_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', type: 'new-complaint', message: 'New high-priority complaint AWZ-2K5-8807 received.', timestamp: `${today}T07:40:00`, read: false, targetRole: 'senior', complaintId: 'AWZ-2K5-8807' },
  { id: 'n2', type: 'sla-warning', message: 'SLA deadline approaching for AWZ-2K5-8795 (2h left).', timestamp: `${today}T08:00:00`, read: false, targetRole: 'senior', complaintId: 'AWZ-2K5-8795' },
  { id: 'n3', type: 're-review', message: 'Citizen not satisfied with AWZ-2K5-8790. Re-review required.', timestamp: `${today}T09:00:00`, read: false, targetRole: 'senior', complaintId: 'AWZ-2K5-8790' },
]

// ─── Context ───────────────────────────────────────────────────────────────────
type NotificationStore = {
  notifications: AppNotification[]
  unreadCount: number
  addNotification: (n: Omit<AppNotification, 'id'>) => void
  generateFromStatusChange: (complaintId: string, newStatus: StatusKind) => void
  markRead: (id: string) => void
  markAllRead: () => void
}

const NotificationContext = createContext<NotificationStore | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED_NOTIFICATIONS)

  const addNotification = useCallback((n: Omit<AppNotification, 'id'>) => {
    const id = `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    setNotifications(prev => [{ ...n, id }, ...prev])
  }, [])

  const generateFromStatusChange = useCallback((complaintId: string, newStatus: StatusKind) => {
    const config = STATUS_NOTIFICATIONS[newStatus]
    if (!config) return
    addNotification({
      type: config.type,
      message: config.template(complaintId),
      timestamp: new Date().toISOString(),
      read: false,
      targetRole: config.targetRole,
      complaintId,
    })
  }, [addNotification])

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, generateFromStatusChange, markRead, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications(): NotificationStore {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider')
  return ctx
}
