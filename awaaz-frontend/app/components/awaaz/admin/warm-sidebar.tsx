'use client'

import { LayoutDashboard, ListChecks, BarChart3, Settings, Landmark } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AdminNav = 'dashboard' | 'queue' | 'analytics' | 'settings'

const NAV_ITEMS: { key: AdminNav; label: string; icon: LucideIcon }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'queue', label: 'Live Queue', icon: ListChecks },
  { key: 'analytics', label: 'AI Analytics', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
]

export function WarmSidebar({
  active,
  onNavigate,
}: {
  active: AdminNav
  onNavigate: (key: AdminNav) => void
}) {
  return (
    <aside className="flex h-full w-16 flex-col border-r border-awaaz-line bg-awaaz-surface lg:w-64">
      <div className="flex h-16 items-center gap-3 border-b border-awaaz-line px-4 lg:px-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-awaaz-teal text-awaaz-teal-foreground">
          <Landmark className="size-5" aria-hidden="true" />
        </span>
        <div className="hidden lg:block">
          <p className="font-display text-sm font-semibold leading-tight text-awaaz-ink">
            Awaaz-AI
          </p>
          <p className="text-xs text-awaaz-muted">Officer Console</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2 lg:p-3" aria-label="Primary">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(key)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                'justify-center lg:justify-start',
                isActive
                  ? 'bg-awaaz-teal text-awaaz-teal-foreground'
                  : 'text-awaaz-muted hover:bg-awaaz-mint/50 hover:text-awaaz-ink',
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span className="hidden lg:inline">{label}</span>
            </button>
          )
        })}
      </nav>

      <div className="hidden border-t border-awaaz-line p-3 lg:block">
        <div className="rounded-2xl bg-awaaz-cream p-4">
          <p className="text-xs font-semibold text-awaaz-ink">SLA Health</p>
          <p className="mt-1 text-xs text-awaaz-muted">
            2 tickets breaching soon. Review the queue.
          </p>
        </div>
      </div>
    </aside>
  )
}
