'use client'

import { Inbox, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Kpi = {
  label: string
  value: number
  delta: string
  icon: LucideIcon
  iconWrap: string
  warning?: boolean
}

export function WarmKpiCards({
  total,
  pending,
  breached,
  resolved,
}: {
  total: number
  pending: number
  breached: number
  resolved: number
}) {
  const cards: Kpi[] = [
    {
      label: 'Total Complaints',
      value: total,
      delta: '+12 today',
      icon: Inbox,
      iconWrap: 'bg-awaaz-cream text-awaaz-teal', 
    },
    {
      label: 'Pending',
      value: pending,
      delta: 'Action required',
      icon: Clock,
      iconWrap: 'bg-awaaz-yellow/20 text-awaaz-yellow',
    },
    {
      label: 'SLA Breached',
      value: breached,
      delta: 'High priority',
      icon: AlertTriangle,
      iconWrap: 'bg-awaaz-orange/20 text-awaaz-orange',
      warning: true,
    },
    {
      label: 'Resolved',
      value: resolved,
      delta: 'Good job',
      icon: CheckCircle2,
      iconWrap: 'bg-awaaz-cream text-awaaz-teal',
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {cards.map((card, i) => (
        <div 
          key={i} 
          className={cn(
            "p-4 bg-awaaz-surface rounded-xl border border-awaaz-line shadow-sm flex items-center gap-4",
            card.warning && "border-awaaz-orange ring-1 ring-awaaz-orange"
          )}
        >
          <div className={cn("p-3 rounded-lg flex-shrink-0", card.iconWrap)}>
            <card.icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-awaaz-muted">{card.label}</h3>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}