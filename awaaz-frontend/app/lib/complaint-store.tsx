'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Droplet, Lightbulb, Trash2, type LucideIcon } from 'lucide-react'
import type { StatusKind, ActivityEntry, PhotoEvidence, FeedbackData, ScheduledCall } from './admin-data'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AttachmentItem = {
  type: 'image' | 'video'
  url: string
  name: string
}

export type ComplaintItem = {
  id: string
  title: string
  department: string
  icon: LucideIcon
  status: 'Pending' | 'Resolved'
  workflowStatus: StatusKind
  date: string
  time: string
  location: string
  channel: 'Voice' | 'Text'
  transcript: string
  attachments: AttachmentItem[]
  activityLog: ActivityEntry[]
  photos: PhotoEvidence[]
  feedback?: FeedbackData
  scheduledCall?: ScheduledCall
}

// ─── Initial seed data ────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0]

const SEED: ComplaintItem[] = [
  {
    id: 'AWZ-2K5-8813',
    title: 'No water supply in the area',
    department: 'Water Department',
    icon: Droplet,
    status: 'Pending',
    workflowStatus: 'assigned-je',
    date: '2 Feb 2026',
    time: '09:14 AM',
    location: 'Sector 14, Indore, MP',
    channel: 'Voice',
    transcript: 'Mere area mein paani nahi aa raha hai pichle 3 dino se.',
    attachments: [],
    activityLog: [
      { status: 'received', label: 'Complaint Received', officer: 'System', timestamp: `${today}T09:14:00` },
      { status: 'under-review', label: 'Under Review', officer: 'Officer Verma', timestamp: `${today}T09:30:00` },
      { status: 'assigned-je', label: 'Assigned to JE', officer: 'Officer Verma', timestamp: `${today}T09:45:00` },
    ],
    photos: [],
  },
  {
    id: 'AWZ-2K5-7420',
    title: 'Street light not working',
    department: 'Electricity Board',
    icon: Lightbulb,
    status: 'Pending',
    workflowStatus: 'inspection',
    date: '28 Jan 2026',
    time: '08:02 AM',
    location: 'Ward 22, Indore, MP',
    channel: 'Voice',
    transcript: 'Street light near the park is not working for 5 days.',
    attachments: [],
    activityLog: [
      { status: 'received', label: 'Complaint Received', officer: 'System', timestamp: `${today}T08:02:00` },
      { status: 'inspection', label: 'Inspection', officer: 'Suresh', timestamp: `${today}T10:00:00` },
    ],
    photos: [],
  },
  {
    id: 'AWZ-2K4-9981',
    title: 'Garbage not collected',
    department: 'Sanitation Dept.',
    icon: Trash2,
    status: 'Resolved',
    workflowStatus: 'completed',
    date: '22 Jan 2026',
    time: '07:30 AM',
    location: 'Main Road, Indore, MP',
    channel: 'Text',
    transcript: 'Garbage has not been collected for a week on our street.',
    attachments: [],
    activityLog: [
      { status: 'received', label: 'Complaint Received', officer: 'System', timestamp: `${today}T07:30:00` },
      { status: 'completed', label: 'Completed', officer: 'Officer Verma', timestamp: `${today}T14:00:00` },
    ],
    photos: [],
  },
]

// ─── Context ──────────────────────────────────────────────────────────────────

type ComplaintStore = {
  complaints: ComplaintItem[]
  addComplaint: (c: ComplaintItem) => void
  updateWorkflowStatus: (id: string, status: StatusKind, officer: string) => void
  addPhoto: (id: string, photo: PhotoEvidence) => void
  submitFeedback: (id: string, feedback: FeedbackData) => void
  scheduleCall: (id: string, call: ScheduledCall) => void
}

const ComplaintContext = createContext<ComplaintStore | null>(null)

export function ComplaintProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<ComplaintItem[]>(SEED)

  const addComplaint = useCallback((c: ComplaintItem) => {
    setComplaints((prev) => [c, ...prev])
  }, [])

  const updateWorkflowStatus = useCallback((id: string, status: StatusKind, officer: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c
      const newEntry: ActivityEntry = {
        status,
        label: status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        officer,
        timestamp: new Date().toISOString(),
      }
      const simpleStatus: 'Pending' | 'Resolved' = status === 'completed' ? 'Resolved' : 'Pending'
      return { ...c, workflowStatus: status, status: simpleStatus, activityLog: [...c.activityLog, newEntry] }
    }))
  }, [])

  const addPhoto = useCallback((id: string, photo: PhotoEvidence) => {
    setComplaints(prev => prev.map(c =>
      c.id === id ? { ...c, photos: [...c.photos, photo] } : c
    ))
  }, [])

  const submitFeedback = useCallback((id: string, feedback: FeedbackData) => {
    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c
      const newStatus: StatusKind = feedback.satisfied ? 'completed' : 'not-satisfied'
      const newEntry: ActivityEntry = {
        status: newStatus,
        label: feedback.satisfied ? 'Citizen Satisfied' : 'Citizen Not Satisfied',
        officer: 'Citizen',
        timestamp: new Date().toISOString(),
      }
      return { ...c, feedback, workflowStatus: newStatus, status: feedback.satisfied ? 'Resolved' : 'Pending', activityLog: [...c.activityLog, newEntry] }
    }))
  }, [])

  const scheduleCall = useCallback((id: string, call: ScheduledCall) => {
    setComplaints(prev => prev.map(c =>
      c.id === id ? { ...c, scheduledCall: call } : c
    ))
  }, [])

  return (
    <ComplaintContext.Provider value={{ complaints, addComplaint, updateWorkflowStatus, addPhoto, submitFeedback, scheduleCall }}>
      {children}
    </ComplaintContext.Provider>
  )
}

export function useComplaints(): ComplaintStore {
  const ctx = useContext(ComplaintContext)
  if (!ctx) throw new Error('useComplaints must be used inside ComplaintProvider')
  return ctx
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function generateTicketId(): string {
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return `AWZ-2K6-${suffix}`
}

export function formatDate(d: Date): { date: string; time: string } {
  const date = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  return { date, time }
}
