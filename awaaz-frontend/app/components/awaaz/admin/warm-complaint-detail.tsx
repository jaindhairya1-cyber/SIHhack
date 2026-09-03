'use client'

import { useState } from 'react'
import { X, MapPin, Clock, Phone, User, ChevronDown, AlertTriangle } from 'lucide-react'
import { OFFICERS, PRIORITY_CONFIG, STATUS_OPTIONS, type Complaint, type StatusKind } from '@/lib/admin-data'
import { WarmActivityTimeline } from './warm-activity-timeline'
import { WarmPhotoUpload } from './warm-photo-upload'
import { ScheduleCallbackForm, FeedbackDisplay } from './warm-feedback'
import type { PhotoEvidence, ScheduledCall } from '@/lib/admin-data'

export function WarmComplaintDetail({
  complaint,
  onClose,
  onStatusChange,
  onAssignJE,
  onAssignKaramchari,
  onPhotoUpload,
  onScheduleCall,
}: {
  complaint: Complaint
  onClose: () => void
  onStatusChange: (id: string, status: StatusKind) => void
  onAssignJE: (complaintId: string, officerId: string) => void
  onAssignKaramchari: (complaintId: string, officerId: string) => void
  onPhotoUpload: (complaintId: string, photo: PhotoEvidence) => void
  onScheduleCall: (complaintId: string, call: ScheduledCall) => void
}) {
  const [selectedJE, setSelectedJE] = useState(complaint.assignedJE || '')
  const [selectedKaramchari, setSelectedKaramchari] = useState(complaint.assignedKaramchari || '')

  const jeOfficers = OFFICERS.filter(o => o.role === 'je')
  const fieldWorkers = OFFICERS.filter(o => o.role === 'karamchari')
  const priority = PRIORITY_CONFIG[complaint.priority]

  const getStatusBadgeColor = (status: StatusKind): string => {
    const colors: Partial<Record<StatusKind, string>> = {
      'received': 'bg-blue-100 text-blue-700',
      'under-review': 'bg-indigo-100 text-indigo-700',
      'assigned-je': 'bg-purple-100 text-purple-700',
      'assigned-field': 'bg-violet-100 text-violet-700',
      'inspection': 'bg-amber-100 text-amber-700',
      'photo-uploaded': 'bg-cyan-100 text-cyan-700',
      'senior-review': 'bg-teal-100 text-teal-700',
      'completed': 'bg-emerald-100 text-emerald-700',
      'escalated': 'bg-red-100 text-red-700',
      'feedback-pending': 'bg-orange-100 text-orange-700',
      'not-satisfied': 'bg-rose-100 text-rose-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#FDFBF7] z-50 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#FDFBF7] border-b border-[#EAE5D9] px-5 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-bold text-base text-gray-900">{complaint.id}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priority.className}`}>
                {priority.label}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeColor(complaint.status)}`}>
                {STATUS_OPTIONS.find(s => s.value === complaint.status)?.label}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Citizen Info */}
          <div className="bg-white rounded-xl border border-[#EAE5D9] p-4 space-y-2">
            <div className="flex items-center gap-2">
              <User size={14} className="text-[#2E6F65]" />
              <span className="text-xs font-bold text-gray-900">{complaint.citizen}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-gray-400" />
              <span className="text-xs text-gray-600">{complaint.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-gray-400" />
              <span className="text-xs text-gray-600">{complaint.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              <span className="text-xs text-gray-600">{complaint.submittedAt} · {complaint.channel}</span>
            </div>
          </div>

          {/* Intent & Detail */}
          <div className="bg-white rounded-xl border border-[#EAE5D9] p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">AI Intent Summary</h4>
            <p className="text-sm font-semibold text-gray-900">{complaint.intent}</p>
            <p className="text-xs text-gray-600 mt-1">{complaint.detail}</p>
          </div>

          {/* SLA Warning */}
          {complaint.slaHoursLeft < 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertTriangle size={14} className="text-red-600 shrink-0" />
              <p className="text-xs font-semibold text-red-700">SLA Breached by {Math.abs(complaint.slaHoursLeft)}h</p>
            </div>
          )}
          {complaint.slaHoursLeft > 0 && complaint.slaHoursLeft <= 6 && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <AlertTriangle size={14} className="text-amber-600 shrink-0" />
              <p className="text-xs font-semibold text-amber-700">SLA Warning: {complaint.slaHoursLeft}h remaining</p>
            </div>
          )}

          {/* Status Update */}
          <div className="bg-white rounded-xl border border-[#EAE5D9] p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Update Status</h4>
            <div className="relative">
              <select
                value={complaint.status}
                onChange={(e) => onStatusChange(complaint.id, e.target.value as StatusKind)}
                className="w-full appearance-none p-2.5 rounded-lg border border-[#EAE5D9] text-sm font-medium text-gray-900 bg-gray-50 outline-none focus:border-[#2E6F65] pr-8"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Assignment: Senior → JE */}
          <div className="bg-white rounded-xl border border-[#EAE5D9] p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Assign Junior Executive</h4>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select
                  value={selectedJE}
                  onChange={(e) => setSelectedJE(e.target.value)}
                  className="w-full appearance-none p-2 rounded-lg border border-[#EAE5D9] text-xs font-medium bg-gray-50 outline-none focus:border-[#2E6F65] pr-7"
                >
                  <option value="">Select JE...</option>
                  {jeOfficers.map(o => (
                    <option key={o.id} value={o.id}>{o.name} — {o.wardZone}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={() => { if (selectedJE) onAssignJE(complaint.id, selectedJE) }}
                disabled={!selectedJE}
                className="px-3 py-2 bg-[#2E6F65] text-white rounded-lg text-xs font-bold disabled:opacity-40 hover:bg-[#245a52] transition-colors"
              >
                Assign
              </button>
            </div>
            {complaint.assignedJE && (
              <p className="text-[10px] text-emerald-600 font-medium">
                ✓ Assigned: {OFFICERS.find(o => o.id === complaint.assignedJE)?.name}
              </p>
            )}
          </div>

          {/* Assignment: JE → Karamchari */}
          {complaint.assignedJE && (
            <div className="bg-white rounded-xl border border-[#EAE5D9] p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Assign Field Worker</h4>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    value={selectedKaramchari}
                    onChange={(e) => setSelectedKaramchari(e.target.value)}
                    className="w-full appearance-none p-2 rounded-lg border border-[#EAE5D9] text-xs font-medium bg-gray-50 outline-none focus:border-[#2E6F65] pr-7"
                  >
                    <option value="">Select Worker...</option>
                    {fieldWorkers.map(o => (
                      <option key={o.id} value={o.id}>{o.name} — {o.wardZone}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <button
                  onClick={() => { if (selectedKaramchari) onAssignKaramchari(complaint.id, selectedKaramchari) }}
                  disabled={!selectedKaramchari}
                  className="px-3 py-2 bg-[#2E6F65] text-white rounded-lg text-xs font-bold disabled:opacity-40 hover:bg-[#245a52] transition-colors"
                >
                  Assign
                </button>
              </div>
              {complaint.assignedKaramchari && (
                <p className="text-[10px] text-emerald-600 font-medium">
                  ✓ Assigned: {OFFICERS.find(o => o.id === complaint.assignedKaramchari)?.name}
                </p>
              )}
            </div>
          )}

          {/* Photo Evidence */}
          <WarmPhotoUpload
            photos={complaint.photos}
            onUpload={(photo) => onPhotoUpload(complaint.id, photo)}
          />

          {/* Feedback Display */}
          {complaint.feedback && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Citizen Feedback</h4>
              <FeedbackDisplay feedback={complaint.feedback} />
            </div>
          )}

          {/* Schedule Callback (for escalation flow) */}
          {(complaint.status === 'completed' || complaint.status === 'feedback-pending' || complaint.status === 'not-satisfied') && (
            <ScheduleCallbackForm
              existingCall={complaint.scheduledCall}
              onSchedule={(call) => onScheduleCall(complaint.id, call)}
            />
          )}

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl border border-[#EAE5D9] p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Activity Timeline</h4>
            <WarmActivityTimeline activityLog={complaint.activityLog} currentStatus={complaint.status} mode="admin" />
          </div>
        </div>
      </div>
    </>
  )
}
