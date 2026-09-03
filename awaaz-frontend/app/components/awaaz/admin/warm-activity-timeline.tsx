'use client'

import { STATUS_PIPELINE, type ActivityEntry, type StatusKind } from '@/lib/admin-data'

export function WarmActivityTimeline({
  activityLog,
  currentStatus,
  mode = 'admin',
}: {
  activityLog: ActivityEntry[]
  currentStatus: StatusKind
  mode?: 'admin' | 'citizen'
}) {
  const pipelineSteps = STATUS_PIPELINE.filter(s => s.value !== 'not-satisfied' && s.value !== 'feedback-pending' && s.value !== 'escalated')
  const currentIdx = pipelineSteps.findIndex(s => s.value === currentStatus)

  return (
    <div className="space-y-1">
      {pipelineSteps.map((step, i) => {
        const logEntry = activityLog.find(a => a.status === step.value)
        const isCompleted = logEntry !== undefined
        const isCurrent = step.value === currentStatus
        const isFuture = !isCompleted && !isCurrent

        return (
          <div key={step.value} className="flex items-start gap-3">
            {/* Vertical line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full border-2 mt-1 shrink-0 ${
                  isCompleted
                    ? 'bg-[#2E6F65] border-[#2E6F65]'
                    : isCurrent
                    ? 'bg-[#E5A040] border-[#E5A040]'
                    : 'bg-gray-200 border-gray-300'
                }`}
              />
              {i < pipelineSteps.length - 1 && (
                <div className={`w-0.5 h-8 ${i < currentIdx ? 'bg-[#2E6F65]' : 'bg-gray-200'}`} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 -mt-0.5 pb-2">
              <p className={`text-xs font-semibold ${isFuture ? 'text-gray-400' : 'text-gray-900'}`}>
                <span className="mr-1.5">{step.icon}</span>
                {mode === 'citizen' ? step.citizenLabel : step.label}
              </p>
              {logEntry && (
                <div className="mt-0.5">
                  {mode === 'admin' && (
                    <p className="text-[10px] text-gray-500">by {logEntry.officer}</p>
                  )}
                  <p className="text-[10px] text-gray-400">
                    {new Date(logEntry.timestamp).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
