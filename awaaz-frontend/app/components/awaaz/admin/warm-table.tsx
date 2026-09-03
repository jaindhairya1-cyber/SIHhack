'use client'

import { ChevronDown } from 'lucide-react'
import { PRIORITY_CONFIG, STATUS_OPTIONS, type Complaint } from '../../../lib/admin-data'
import { cn } from '@/lib/utils'

export function WarmTable({
  complaints,
  // onStatusChange,
}: {
  complaints: Complaint[]
  // onStatusChange: (id: string, status: StatusKind) => void
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-awaaz-line bg-awaaz-surface shadow-sm">
      <div className="flex items-center justify-between border-b border-awaaz-line px-5 py-4">
        <div>
          <h2 className="font-display text-base font-semibold text-awaaz-ink">
            Live Complaint Queue
          </h2>
          <p className="text-xs text-awaaz-muted">
            {complaints.length} complaints routed by Awaaz-AI
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-awaaz-line bg-awaaz-cream/50 text-xs uppercase tracking-wide text-awaaz-muted">
              <th scope="col" className="px-5 py-3 font-semibold">Ticket ID</th>
              <th scope="col" className="px-5 py-3 font-semibold">AI Intent Summary</th>
              <th scope="col" className="px-5 py-3 font-semibold">Department</th>
              <th scope="col" className="px-5 py-3 font-semibold">Priority</th>
              <th scope="col" className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => {
              const priority = PRIORITY_CONFIG[c.priority]
              return (
                <tr
                  key={c.id}
                  className="border-b border-awaaz-line/70 transition-colors last:border-0 hover:bg-awaaz-mint/20"
                >
                  <td className="px-5 py-4 align-top">
                    <span className="font-mono text-sm font-semibold text-awaaz-ink">{c.id}</span>
                    <span className="mt-0.5 block text-xs text-awaaz-muted">{c.channel}</span>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <p className="max-w-xs text-sm text-awaaz-ink">{c.intent}</p>
                    <p className="mt-0.5 text-xs text-awaaz-muted">{c.location}</p>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <span className="text-sm text-awaaz-ink">{c.department}</span>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
                        priority.className,
                      )}
                    >
                      {priority.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex items-center gap-2">
                     {/* <StatusBadge status={c.status} />*/}
                      <div className="relative">
                        <select
                          aria-label={`Update status for ${c.id}`}
                          value={c.status}
                          // onChange={(e) => onStatusChange(c.id, e.target.value as StatusKind)}
                          className="appearance-none rounded-lg border border-awaaz-line bg-awaaz-surface py-1.5 pl-2.5 pr-7 text-xs font-medium text-awaaz-ink transition-colors hover:border-awaaz-teal focus:border-awaaz-teal focus:outline-none focus:ring-2 focus:ring-awaaz-teal/30"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-awaaz-muted"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
