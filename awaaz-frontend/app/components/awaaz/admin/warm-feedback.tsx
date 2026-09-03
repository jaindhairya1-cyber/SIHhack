'use client'

import { useState } from 'react'
import { Star, Send, Phone, Calendar } from 'lucide-react'
import type { FeedbackData, ScheduledCall } from '@/lib/admin-data'

// ─── Admin: Schedule Callback ──────────────────────────────────────────────────
export function ScheduleCallbackForm({
  existingCall,
  onSchedule,
}: {
  existingCall?: ScheduledCall
  onSchedule: (call: ScheduledCall) => void
}) {
  const [date, setDate] = useState(existingCall?.date || '')
  const [time, setTime] = useState(existingCall?.time || '')

  const handleSubmit = () => {
    if (!date || !time) return
    onSchedule({ date, time, status: 'scheduled' })
  }

  return (
    <div className="bg-white rounded-xl border border-[#EAE5D9] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Phone size={14} className="text-[#2E6F65]" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Schedule Callback</h4>
      </div>

      {existingCall && (
        <div className="flex items-center gap-2 text-xs bg-amber-50 border border-amber-200 rounded-lg p-2">
          <Calendar size={12} className="text-amber-600" />
          <span className="text-amber-700 font-medium">
            Scheduled: {existingCall.date} at {existingCall.time} ({existingCall.status})
          </span>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 p-2 rounded-lg border border-[#EAE5D9] text-xs bg-gray-50 outline-none focus:border-[#2E6F65]"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="flex-1 p-2 rounded-lg border border-[#EAE5D9] text-xs bg-gray-50 outline-none focus:border-[#2E6F65]"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full py-2 bg-[#2E6F65] text-white rounded-lg text-xs font-bold hover:bg-[#245a52] transition-colors"
      >
        Schedule Call
      </button>
    </div>
  )
}

// ─── Citizen: Feedback Form ────────────────────────────────────────────────────
export function CitizenFeedbackForm({
  onSubmit,
}: {
  onSubmit: (feedback: FeedbackData) => void
}) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (rating === 0) return
    const feedback: FeedbackData = {
      rating,
      comment,
      satisfied: rating >= 4,
    }
    onSubmit(feedback)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
        <p className="text-sm font-semibold text-emerald-700">Thank you for your feedback!</p>
        <p className="text-xs text-emerald-600 mt-1">Your response has been recorded.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-awaaz-line p-4 space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-awaaz-muted">Rate Your Experience</h4>

      {/* Star Rating */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => setRating(s)}
            className="p-1 transition-colors"
          >
            <Star
              size={24}
              className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell us about your experience..."
        rows={3}
        className="w-full p-3 rounded-xl border border-awaaz-line text-sm bg-gray-50 outline-none focus:border-awaaz-teal resize-none"
      />

      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-awaaz-teal text-white rounded-xl text-sm font-bold disabled:opacity-40 hover:opacity-90 transition-opacity"
      >
        <Send size={14} /> Submit Feedback
      </button>
    </div>
  )
}

// ─── Admin: View Feedback ──────────────────────────────────────────────────────
export function FeedbackDisplay({ feedback }: { feedback: FeedbackData }) {
  return (
    <div className={`rounded-xl border p-3 space-y-2 ${
      feedback.satisfied ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={12} className={s <= feedback.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
          ))}
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          feedback.satisfied ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        }`}>
          {feedback.satisfied ? 'Satisfied' : 'Not Satisfied'}
        </span>
      </div>
      {feedback.comment && (
        <p className="text-xs text-gray-600 italic">&quot;{feedback.comment}&quot;</p>
      )}
    </div>
  )
}
