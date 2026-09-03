// ─── Workflow Status Pipeline ──────────────────────────────────────────────────
export type StatusKind =
  | 'received'
  | 'under-review'
  | 'assigned-je'
  | 'assigned-field'
  | 'inspection'
  | 'photo-uploaded'
  | 'senior-review'
  | 'completed'
  | 'escalated'
  | 'feedback-pending'
  | 'not-satisfied'

export type Priority = 'critical' | 'high' | 'medium' | 'low'

export type OfficerRole = 'senior' | 'je' | 'karamchari'

export type Officer = {
  id: string
  name: string
  role: OfficerRole
  department: string
  designation: string
  wardZone: string
  email: string
}

export type ActivityEntry = {
  status: StatusKind
  label: string
  officer: string
  timestamp: string // ISO
}

export type FeedbackData = {
  rating: number // 1-5
  comment: string
  satisfied: boolean
}

export type PhotoEvidence = {
  url: string // base64 or blob URL
  timestamp: string
  uploadedBy: string
  aiVerdict?: {
    match: boolean
    confidence: number
    suggestion: string
  }
}

export type ScheduledCall = {
  date: string
  time: string
  status: 'scheduled' | 'completed' | 'missed'
}

export type Complaint = {
  id: string
  citizen: string
  phone: string
  intent: string
  detail: string
  department: string
  category: string
  priority: Priority
  status: StatusKind
  location: string
  submittedAt: string // display string
  date: string // ISO date for filtering
  slaHoursLeft: number
  channel: 'Voice' | 'Text' | 'IVR'
  assignedJE?: string // officer id
  assignedKaramchari?: string // officer id
  activityLog: ActivityEntry[]
  photos: PhotoEvidence[]
  feedback?: FeedbackData
  scheduledCall?: ScheduledCall
}

// ─── Status Config ─────────────────────────────────────────────────────────────
export const STATUS_PIPELINE: { value: StatusKind; label: string; citizenLabel: string; icon: string }[] = [
  { value: 'received', label: 'Received', citizenLabel: 'Complaint Received', icon: '📥' },
  { value: 'under-review', label: 'Under Review', citizenLabel: 'Under Review by Officer', icon: '🔍' },
  { value: 'assigned-je', label: 'Assigned to JE', citizenLabel: 'Assigned to Junior Executive', icon: '📋' },
  { value: 'assigned-field', label: 'Field Assigned', citizenLabel: 'Assigned to Field Worker', icon: '👷' },
  { value: 'inspection', label: 'Inspection', citizenLabel: 'Inspection in Progress', icon: '🔧' },
  { value: 'photo-uploaded', label: 'Photo Uploaded', citizenLabel: 'Evidence Collected', icon: '📸' },
  { value: 'senior-review', label: 'Senior Review', citizenLabel: 'Final Review', icon: '✅' },
  { value: 'completed', label: 'Completed', citizenLabel: 'Resolved ✅', icon: '🏁' },
  { value: 'escalated', label: 'Escalated', citizenLabel: 'Escalated ⚠️', icon: '⚠️' },
  { value: 'feedback-pending', label: 'Feedback Pending', citizenLabel: 'Awaiting Your Feedback', icon: '💬' },
  { value: 'not-satisfied', label: 'Not Satisfied', citizenLabel: 'Under Re-review', icon: '❌' },
]

export const STATUS_OPTIONS = STATUS_PIPELINE.map(s => ({ value: s.value, label: s.label }))

export const PRIORITY_CONFIG: Record<Priority, { label: string; className: string }> = {
  critical: { label: 'Critical', className: 'bg-red-100 text-red-700' },
  high: { label: 'High', className: 'bg-orange-100 text-orange-700' },
  medium: { label: 'Medium', className: 'bg-amber-100 text-amber-700' },
  low: { label: 'Low', className: 'bg-gray-100 text-gray-600' },
}

// ─── Officers Mock Data ────────────────────────────────────────────────────────
export const OFFICERS: Officer[] = [
  { id: 'OFC-SR-001', name: 'Officer Verma', role: 'senior', department: 'Water & Sanitation', designation: 'Senior Executive', wardZone: 'Ward 14, Gurugram', email: 'verma@awaaz.gov.in' },
  { id: 'OFC-JE-001', name: 'Rajesh Mehra', role: 'je', department: 'Water & Sanitation', designation: 'Junior Engineer', wardZone: 'Ward 14, Gurugram', email: 'mehra@awaaz.gov.in' },
  { id: 'OFC-JE-002', name: 'Deepak Singh', role: 'je', department: 'Electricity', designation: 'Junior Engineer', wardZone: 'Ward 22, Jaipur', email: 'deepak@awaaz.gov.in' },
  { id: 'OFC-FK-001', name: 'Ramu Kaka', role: 'karamchari', department: 'Water & Sanitation', designation: 'Field Worker', wardZone: 'Ward 14, Gurugram', email: 'ramu@awaaz.gov.in' },
  { id: 'OFC-FK-002', name: 'Suresh Yadav', role: 'karamchari', department: 'Electricity', designation: 'Field Worker', wardZone: 'Ward 22, Jaipur', email: 'suresh@awaaz.gov.in' },
  { id: 'OFC-FK-003', name: 'Mohan Das', role: 'karamchari', department: 'Municipal / Sanitation', designation: 'Field Worker', wardZone: 'Charminar, Hyderabad', email: 'mohan@awaaz.gov.in' },
]

// ─── Current Admin Profile ─────────────────────────────────────────────────────
export const CURRENT_ADMIN: Officer & { lastLogin: string } = {
  ...OFFICERS[0],
  lastLogin: '3 Sep 2026, 10:15 AM',
}

// ─── Helper: today ISO ─────────────────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0]

// ─── Complaints Mock Data ──────────────────────────────────────────────────────
export const COMPLAINTS: Complaint[] = [
  {
    id: 'AWZ-2K5-8813',
    citizen: 'Ramesh Kumar',
    phone: '+91 98xxxxxx12',
    intent: 'No water supply in area for 3 days',
    detail: 'Citizen reports complete water outage across Sector 14 for the past 72 hours.',
    department: 'Water & Sanitation',
    category: 'Water Supply',
    priority: 'critical',
    status: 'assigned-je',
    location: 'Sector 14, Gurugram',
    submittedAt: '3 Sep, 09:14',
    date: today,
    slaHoursLeft: -4,
    channel: 'Voice',
    assignedJE: 'OFC-JE-001',
    activityLog: [
      { status: 'received', label: 'Complaint Received', officer: 'System', timestamp: `${today}T09:14:00` },
      { status: 'under-review', label: 'Under Review', officer: 'Officer Verma', timestamp: `${today}T09:30:00` },
      { status: 'assigned-je', label: 'Assigned to JE', officer: 'Officer Verma', timestamp: `${today}T09:45:00` },
    ],
    photos: [],
  },
  {
    id: 'AWZ-2K5-8810',
    citizen: 'Sunita Devi',
    phone: '+91 97xxxxxx45',
    intent: 'Street light not working near park',
    detail: 'Multiple street lights non-functional near the community park.',
    department: 'Electricity',
    category: 'Street Lighting',
    priority: 'medium',
    status: 'inspection',
    location: 'Ward 22, Jaipur',
    submittedAt: '2 Sep, 08:02',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    slaHoursLeft: 18,
    channel: 'Text',
    assignedJE: 'OFC-JE-002',
    assignedKaramchari: 'OFC-FK-002',
    activityLog: [
      { status: 'received', label: 'Complaint Received', officer: 'System', timestamp: `${today}T08:02:00` },
      { status: 'under-review', label: 'Under Review', officer: 'Officer Verma', timestamp: `${today}T08:15:00` },
      { status: 'assigned-je', label: 'Assigned to JE', officer: 'Officer Verma', timestamp: `${today}T08:30:00` },
      { status: 'assigned-field', label: 'Field Assigned', officer: 'Deepak Singh', timestamp: `${today}T09:00:00` },
      { status: 'inspection', label: 'Inspection Started', officer: 'Suresh Yadav', timestamp: `${today}T10:00:00` },
    ],
    photos: [],
  },
  {
    id: 'AWZ-2K5-8807',
    citizen: 'Abdul Rahman',
    phone: '+91 99xxxxxx88',
    intent: 'Garbage not collected for a week',
    detail: 'Uncollected waste piling up on the main road, causing hygiene issues.',
    department: 'Municipal / Sanitation',
    category: 'Waste Management',
    priority: 'high',
    status: 'received',
    location: 'Charminar, Hyderabad',
    submittedAt: '3 Sep, 07:40',
    date: today,
    slaHoursLeft: 6,
    channel: 'IVR',
    activityLog: [
      { status: 'received', label: 'Complaint Received', officer: 'System', timestamp: `${today}T07:40:00` },
    ],
    photos: [],
  },
  {
    id: 'AWZ-2K5-8802',
    citizen: 'Priya Nair',
    phone: '+91 96xxxxxx03',
    intent: 'Pothole causing accidents on highway',
    detail: 'Large pothole on the service road has caused two minor accidents this week.',
    department: 'Public Works (PWD)',
    category: 'Road Maintenance',
    priority: 'high',
    status: 'completed',
    location: 'NH-66, Kochi',
    submittedAt: '1 Sep, 15:22',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    slaHoursLeft: 0,
    channel: 'Voice',
    assignedJE: 'OFC-JE-001',
    assignedKaramchari: 'OFC-FK-001',
    activityLog: [
      { status: 'received', label: 'Complaint Received', officer: 'System', timestamp: `${today}T15:22:00` },
      { status: 'under-review', label: 'Under Review', officer: 'Officer Verma', timestamp: `${today}T15:40:00` },
      { status: 'assigned-je', label: 'Assigned to JE', officer: 'Officer Verma', timestamp: `${today}T16:00:00` },
      { status: 'assigned-field', label: 'Field Assigned', officer: 'Rajesh Mehra', timestamp: `${today}T16:30:00` },
      { status: 'inspection', label: 'Inspection', officer: 'Ramu Kaka', timestamp: `${today}T17:00:00` },
      { status: 'photo-uploaded', label: 'Photo Uploaded', officer: 'Ramu Kaka', timestamp: `${today}T17:30:00` },
      { status: 'senior-review', label: 'Senior Review', officer: 'Officer Verma', timestamp: `${today}T18:00:00` },
      { status: 'completed', label: 'Completed', officer: 'Officer Verma', timestamp: `${today}T18:15:00` },
    ],
    photos: [],
  },
  {
    id: 'AWZ-2K5-8799',
    citizen: 'Mohan Lal',
    phone: '+91 95xxxxxx71',
    intent: 'Ration card correction pending',
    detail: 'Name spelling error in ration card not corrected despite prior application.',
    department: 'Food & Civil Supplies',
    category: 'Documentation',
    priority: 'low',
    status: 'feedback-pending',
    location: 'Patna Sadar, Patna',
    submittedAt: '31 Aug, 11:05',
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    slaHoursLeft: 0,
    channel: 'Text',
    activityLog: [
      { status: 'received', label: 'Complaint Received', officer: 'System', timestamp: `${today}T11:05:00` },
      { status: 'completed', label: 'Completed', officer: 'Officer Verma', timestamp: `${today}T14:00:00` },
      { status: 'feedback-pending', label: 'Feedback Requested', officer: 'System', timestamp: `${today}T14:05:00` },
    ],
    photos: [],
    scheduledCall: { date: today, time: '15:00', status: 'scheduled' },
  },
  {
    id: 'AWZ-2K5-8795',
    citizen: 'Fatima Sheikh',
    phone: '+91 94xxxxxx26',
    intent: 'Open drain overflow near school',
    detail: 'Overflowing drain outside the primary school posing health hazards to children.',
    department: 'Water & Sanitation',
    category: 'Drainage',
    priority: 'critical',
    status: 'received',
    location: 'Kurla, Mumbai',
    submittedAt: '3 Sep, 09:48',
    date: today,
    slaHoursLeft: 2,
    channel: 'Voice',
    activityLog: [
      { status: 'received', label: 'Complaint Received', officer: 'System', timestamp: `${today}T09:48:00` },
    ],
    photos: [],
  },
  {
    id: 'AWZ-2K5-8790',
    citizen: 'Harpreet Singh',
    phone: '+91 93xxxxxx59',
    intent: 'Illegal parking blocking ambulance access',
    detail: 'Chronic illegal parking on the lane blocks emergency vehicle access.',
    department: 'Traffic Police',
    category: 'Traffic & Parking',
    priority: 'medium',
    status: 'not-satisfied',
    location: 'Model Town, Ludhiana',
    submittedAt: '30 Aug, 16:31',
    date: new Date(Date.now() - 345600000).toISOString().split('T')[0],
    slaHoursLeft: 0,
    channel: 'IVR',
    activityLog: [
      { status: 'received', label: 'Complaint Received', officer: 'System', timestamp: `${today}T16:31:00` },
      { status: 'completed', label: 'Completed', officer: 'Officer Verma', timestamp: `${today}T18:00:00` },
      { status: 'feedback-pending', label: 'Feedback Requested', officer: 'System', timestamp: `${today}T18:05:00` },
      { status: 'not-satisfied', label: 'Citizen Not Satisfied', officer: 'System', timestamp: `${today}T19:00:00` },
    ],
    photos: [],
    feedback: { rating: 2, comment: 'Issue not properly resolved, cars still parked.', satisfied: false },
  },
]
