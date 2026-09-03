"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Route, ChevronRight, X,
  MapPin, Clock, Phone, Tag, Paperclip, Image, Video, MessageSquare,
} from "lucide-react"
import { BottomNav } from "./bottom-nav"
import { useComplaints, type ComplaintItem } from "@/lib/complaint-store"
import { WarmActivityTimeline } from "./admin/warm-activity-timeline"
import { CitizenFeedbackForm } from "./admin/warm-feedback"

// ─── Status badge (same as before) ───────────────────────────────────────────
function StatusBadge({ status }: { status: ComplaintItem["status"] }) {
  const styles =
    status === "Resolved"
      ? "bg-awaaz-resolved text-awaaz-resolved-foreground"
      : "bg-awaaz-pending text-awaaz-pending-foreground"
  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${styles}`}>
      {status}
    </span>
  )
}

// ─── Full detail bottom-sheet ─────────────────────────────────────────────────
function DetailSheet({
  complaint,
  onClose,
  onSubmitFeedback,
}: {
  complaint: ComplaintItem
  onClose: () => void
  onSubmitFeedback?: (id: string, feedback: import('@/lib/admin-data').FeedbackData) => void
}) {
  const Icon = complaint.icon
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm z-50 bg-awaaz-surface rounded-t-[2rem] shadow-2xl overflow-y-auto max-h-[85dvh] pb-6">
        
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-awaaz-line" />
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-awaaz-line">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-awaaz-yellow/25 text-awaaz-orange">
              <Icon className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <div>
              <p className="font-bold text-sm text-awaaz-ink leading-tight">{complaint.title}</p>
              <p className="text-[11px] text-awaaz-muted font-mono mt-0.5">{complaint.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-awaaz-cream text-awaaz-muted hover:bg-awaaz-line transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Status badge */}
        <div className="px-5 pt-4">
          <StatusBadge status={complaint.status} />
        </div>

        {/* Detail rows */}
        <div className="px-5 pt-4 space-y-3">

          {/* Department */}
          <div className="flex items-start gap-3 bg-awaaz-cream rounded-2xl p-3.5 border border-awaaz-line">
            <Tag className="h-4 w-4 text-awaaz-teal mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-awaaz-muted mb-0.5">Department</p>
              <p className="text-sm font-semibold text-awaaz-ink">{complaint.department}</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex gap-3">
            <div className="flex-1 flex items-start gap-3 bg-awaaz-cream rounded-2xl p-3.5 border border-awaaz-line">
              <Clock className="h-4 w-4 text-awaaz-teal mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-awaaz-muted mb-0.5">Date</p>
                <p className="text-sm font-semibold text-awaaz-ink">{complaint.date}</p>
              </div>
            </div>
            <div className="flex-1 flex items-start gap-3 bg-awaaz-cream rounded-2xl p-3.5 border border-awaaz-line">
              <Clock className="h-4 w-4 text-awaaz-orange mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-awaaz-muted mb-0.5">Time</p>
                <p className="text-sm font-semibold text-awaaz-ink">{complaint.time}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3 bg-awaaz-cream rounded-2xl p-3.5 border border-awaaz-line">
            <MapPin className="h-4 w-4 text-awaaz-teal mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-awaaz-muted mb-0.5">Location</p>
              <p className="text-sm font-semibold text-awaaz-ink">{complaint.location}</p>
            </div>
          </div>

          {/* Channel */}
          <div className="flex items-start gap-3 bg-awaaz-cream rounded-2xl p-3.5 border border-awaaz-line">
            <Phone className="h-4 w-4 text-awaaz-teal mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-awaaz-muted mb-0.5">Channel</p>
              <p className="text-sm font-semibold text-awaaz-ink">{complaint.channel}</p>
            </div>
          </div>

          {/* Transcript / Description */}
          {complaint.transcript && (
            <div className="flex items-start gap-3 bg-awaaz-cream rounded-2xl p-3.5 border border-awaaz-line">
              <MessageSquare className="h-4 w-4 text-awaaz-teal mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-awaaz-muted mb-0.5">Complaint Details</p>
                <p className="text-sm text-awaaz-ink leading-relaxed">{complaint.transcript}</p>
              </div>
            </div>
          )}

          {/* Attachments */}
          {complaint.attachments.length > 0 && (
            <div className="bg-awaaz-cream rounded-2xl p-3.5 border border-awaaz-line">
              <div className="flex items-center gap-2 mb-3">
                <Paperclip className="h-4 w-4 text-awaaz-teal" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-awaaz-muted">
                  Attachments ({complaint.attachments.length})
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {complaint.attachments.map((a, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-awaaz-line aspect-square bg-awaaz-surface">
                    {a.type === "image" ? (
                      <img src={a.url} alt={a.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-1 p-2">
                        <Video className="h-5 w-5 text-awaaz-teal" />
                        <span className="text-[8px] text-awaaz-muted text-center truncate w-full">{a.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No attachments note */}
          {complaint.attachments.length === 0 && (
            <div className="flex items-center gap-3 bg-awaaz-cream rounded-2xl p-3.5 border border-awaaz-line">
              <Image className="h-4 w-4 text-awaaz-muted shrink-0" />
              <p className="text-sm text-awaaz-muted">No attachments</p>
            </div>
          )}

          {/* Workflow Status Progress */}
          <div className="bg-awaaz-cream rounded-2xl p-3.5 border border-awaaz-line">
            <div className="flex items-center gap-2 mb-3">
              <Route className="h-4 w-4 text-awaaz-teal" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-awaaz-muted">Complaint Progress</p>
            </div>
            <WarmActivityTimeline
              activityLog={complaint.activityLog}
              currentStatus={complaint.workflowStatus}
              mode="citizen"
            />
          </div>

          {/* Feedback Form (when status = feedback-pending) */}
          {complaint.workflowStatus === 'feedback-pending' && onSubmitFeedback && (
            <div className="bg-awaaz-cream rounded-2xl p-3.5 border border-awaaz-line">
              <CitizenFeedbackForm onSubmit={(fb) => onSubmitFeedback(complaint.id, fb)} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function WarmTracking() {
  const { complaints, submitFeedback } = useComplaints()
  const searchParams = useSearchParams()

  const [selected, setSelected] = useState<ComplaintItem | null>(null)

  // Handle URL deep-link: ?id=AWZ-xxx or ?filter=active|resolved
  useEffect(() => {
    const id = searchParams.get("id")
    const filter = searchParams.get("filter")

    if (id) {
      const found = complaints.find((c) => c.id === id)
      if (found) setSelected(found)
    } else if (filter === "active") {
      // scroll to active section — just ensure no sheet open
      setSelected(null)
    } else if (filter === "resolved") {
      setSelected(null)
    }
  }, [searchParams, complaints])

  const filterParam = searchParams.get("filter")
  const active = complaints.filter((c) => c.status === "Pending")
  const resolved = complaints.filter((c) => c.status === "Resolved")

  // If filter=active show only active, filter=resolved show only resolved
  const showActive = filterParam !== "resolved"
  const showResolved = filterParam !== "active"

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col bg-awaaz-cream">

      {/* ── Header (unchanged) ──────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-b-[2.5rem] bg-awaaz-teal px-5 pb-16 pt-8 text-awaaz-teal-foreground">
        <span aria-hidden className="absolute -right-8 top-4 h-28 w-28 rounded-full bg-awaaz-yellow/40" />
        <div className="relative flex items-center gap-3">
          <Link
            href="/"
            aria-label="Go back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-awaaz-surface/25"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-xs font-medium text-awaaz-teal-foreground/75">Your Complaints</p>
            <h1 className="font-display text-xl font-bold">Track Status</h1>
          </div>
        </div>
        <div className="relative mt-6 flex gap-3">
          <div className="flex-1 rounded-2xl bg-awaaz-surface/20 px-4 py-3">
            <p className="font-display text-2xl font-bold">{active.length}</p>
            <p className="text-xs text-awaaz-teal-foreground/80">Active</p>
          </div>
          <div className="flex-1 rounded-2xl bg-awaaz-surface/20 px-4 py-3">
            <p className="font-display text-2xl font-bold">{resolved.length}</p>
            <p className="text-xs text-awaaz-teal-foreground/80">Resolved</p>
          </div>
        </div>
      </header>

      <main className="-mt-8 flex-1 space-y-6 px-5 pb-6">

        {/* ── Active complaints ──────────────────────────────────────── */}
        {showActive && (
          <section>
            <h2 className="mb-3 px-1 font-display text-sm font-bold text-awaaz-ink">
              Active Complaints
            </h2>
            <ul className="space-y-3">
              {active.map((c) => {
                const Icon = c.icon
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(c)}
                      className="flex w-full items-center gap-3 rounded-3xl bg-awaaz-surface p-4 text-left shadow-[0_16px_36px_-24px_rgba(47,47,52,0.5)]"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-awaaz-yellow/25 text-awaaz-orange">
                        <Icon className="h-5 w-5" strokeWidth={2.2} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate font-semibold text-awaaz-ink">{c.title}</span>
                          <StatusBadge status={c.status} />
                        </span>
                        <span className="mt-1 flex items-center gap-2 text-xs text-awaaz-muted">
                          <span className="font-mono">{c.id}</span>
                          <span aria-hidden>·</span>
                          <span>{c.department}</span>
                        </span>
                        <span className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-awaaz-teal">
                          <Route className="h-3.5 w-3.5" />
                          {c.date}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-awaaz-muted" />
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {/* ── Resolved complaints ────────────────────────────────────── */}
        {showResolved && (
          <section>
            <h2 className="mb-3 px-1 font-display text-sm font-bold text-awaaz-ink">Resolved</h2>
            <ul className="space-y-3">
              {resolved.map((c) => {
                const Icon = c.icon
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(c)}
                      className="flex w-full items-center gap-3 rounded-3xl bg-awaaz-surface/70 p-4 text-left"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-awaaz-resolved text-awaaz-resolved-foreground">
                        <Icon className="h-5 w-5" strokeWidth={2.2} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate font-semibold text-awaaz-ink">{c.title}</span>
                          <StatusBadge status={c.status} />
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-awaaz-muted">
                          <span className="font-mono">{c.id}</span>
                          <span aria-hidden>·</span>
                          <span>{c.date}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-awaaz-muted" />
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

      </main>

      <BottomNav active="tracking" />

      {/* ── Detail Bottom Sheet ─────────────────────────────────────── */}
      {selected && (
        <DetailSheet complaint={selected} onClose={() => setSelected(null)} onSubmitFeedback={submitFeedback} />
      )}
    </div>
  )
}
