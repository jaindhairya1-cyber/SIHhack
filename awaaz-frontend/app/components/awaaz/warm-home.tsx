'use client'

import { useState } from 'react'
import { Bell, Search, Mic, CheckCircle2, Clock, X, FileText, ChevronRight, ArrowRight, Globe } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/awaaz/bottom-nav'
import { useComplaints, type ComplaintItem } from '@/lib/complaint-store'

export function WarmHome() {
  const router = useRouter()
  const { complaints } = useComplaints()

  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [selectedLang, setSelectedLang] = useState('English')
  const LANGUAGES = ['English', 'हिन्दी', 'मराठी', 'తెలుగు', 'தமிழ்', 'বাংলা']

  // ── Derived counts (live from store) ──────────────────────────────────────
  const activeComplaints = complaints.filter((c) => c.status === 'Pending')
  const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved')

  // ── Search: filter by ticket ID or title ──────────────────────────────────
  const searchResults: ComplaintItem[] =
    searchQuery.trim().length > 0
      ? complaints.filter(
          (c) =>
            c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.department.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Results already shown below — no extra action needed
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans">
      <div className="w-full max-w-md bg-awaaz-cream min-h-screen relative shadow-xl pb-24 overflow-x-hidden flex flex-col">

        {/* ── Top Header (unchanged) ──────────────────────────────────── */}
        <div className="bg-awaaz-teal text-awaaz-surface p-6 rounded-b-[2rem] shadow-sm relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs opacity-80 uppercase tracking-wider font-semibold">Amrit Awaaz</p>
              <h1 className="text-xl font-bold">Awaaz-AI Dashboard</h1>
            </div>

            <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => { setShowLangMenu(!showLangMenu); setShowNotifications(false); }}
                className="w-10 h-10 rounded-full bg-awaaz-surface/20 flex items-center justify-center hover:bg-awaaz-surface/30 transition-colors"
                title="Language"
              >
                <Globe size={20} />
              </button>
              {showLangMenu && (
                <div className="absolute right-0 top-12 w-40 bg-white text-gray-900 rounded-2xl shadow-xl border border-awaaz-line p-2 z-50">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      onClick={() => { setSelectedLang(lang); setShowLangMenu(false); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        selectedLang === lang ? 'bg-awaaz-teal text-white' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-full bg-awaaz-surface/20 flex items-center justify-center hover:bg-awaaz-surface/30 transition-colors relative"
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-awaaz-orange rounded-full ring-2 ring-awaaz-teal"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 w-72 bg-white text-gray-900 rounded-2xl shadow-xl border border-awaaz-line p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                    <h4 className="font-bold text-sm">Notifications</h4>
                    <span className="text-[10px] bg-awaaz-orange/10 text-awaaz-orange px-2 py-0.5 rounded-full font-bold">1 New</span>
                  </div>
                  <div className="space-y-2">
                    <div
                      onClick={() => setSelectedNotification(true)}
                      className="p-3 bg-awaaz-cream rounded-xl text-xs cursor-pointer hover:bg-amber-100/60 transition-colors border border-awaaz-line"
                    >
                      <p className="font-bold text-gray-900 flex items-center gap-1.5">
                        <FileText size={14} className="text-awaaz-teal" /> Complaint Resolved
                      </p>
                      <p className="text-awaaz-muted mt-1">Tap to view street light issue #AWAZ-7420 details...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative mt-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-awaaz-muted" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticket ID, department..."
              className="w-full pl-10 pr-10 py-3 bg-awaaz-surface text-gray-900 rounded-xl text-sm outline-none shadow-sm placeholder:text-awaaz-muted focus:ring-2 focus:ring-awaaz-orange transition-all"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-awaaz-teal hover:text-awaaz-orange">
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* ── Main Content ──────────────────────────────────────────────── */}
        <div className="p-6 space-y-6 flex-1">

          {/* ── Search Results (replaces old text banner) ─────────────── */}
          {searchQuery.trim().length > 0 && (
            <div className="space-y-3">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-900">
                  {searchResults.length > 0
                    ? `${searchResults.length} result${searchResults.length > 1 ? 's' : ''} for "${searchQuery}"`
                    : `No results for "${searchQuery}"`}
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Result cards */}
              {searchResults.map((c) => {
                const Icon = c.icon
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => router.push(`/awaaz/tracking?id=${c.id}`)}
                    className="w-full flex items-center gap-3 bg-white p-4 rounded-2xl border border-awaaz-line shadow-sm text-left hover:border-awaaz-teal transition-colors"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-awaaz-yellow/25 text-awaaz-orange">
                      <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold text-gray-900 text-sm truncate">{c.title}</span>
                      <span className="block text-xs text-awaaz-muted font-mono mt-0.5">{c.id} · {c.department}</span>
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                        c.status === 'Resolved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {c.status}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {/* ── Voice Assistant Card (unchanged) ──────────────────────── */}
          <div className="bg-gradient-to-br from-awaaz-orange to-amber-600 text-white p-6 rounded-3xl shadow-md relative overflow-hidden flex flex-col justify-between">
            <div>
              <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-semibold backdrop-blur-sm">AI Voice Assistant</span>
              <h2 className="text-2xl font-bold mt-3">File a complaint using your voice</h2>
              <p className="text-xs opacity-90 mt-1">Speak in your local language &amp; report municipal issues instantly.</p>
            </div>
            <Link
              href="/awaaz/chat"
              className="mt-6 flex items-center justify-center gap-2 py-3 bg-white text-gray-900 rounded-xl font-bold text-sm shadow-sm hover:bg-awaaz-cream transition-colors"
            >
              <Mic size={18} className="text-awaaz-orange" /> Tap to Speak
            </Link>
          </div>

          {/* ── Stats Cards — tappable ─────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4">

            {/* Active */}
            <button
              type="button"
              onClick={() => router.push('/awaaz/tracking?filter=active')}
              className="bg-awaaz-surface p-4 rounded-2xl border border-awaaz-line shadow-sm text-left hover:border-awaaz-teal transition-colors w-full"
            >
              <div className="flex items-center gap-2 text-awaaz-teal mb-2">
                <Clock size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Active</span>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{activeComplaints.length}</p>
              <p className="text-xs text-awaaz-muted mt-0.5">Under processing</p>
            </button>

            {/* Resolved */}
            <button
              type="button"
              onClick={() => router.push('/awaaz/tracking?filter=resolved')}
              className="bg-awaaz-surface p-4 rounded-2xl border border-awaaz-line shadow-sm text-left hover:border-awaaz-orange transition-colors w-full"
            >
              <div className="flex items-center gap-2 text-awaaz-orange mb-2">
                <CheckCircle2 size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Resolved</span>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{resolvedComplaints.length}</p>
              <p className="text-xs text-awaaz-muted mt-0.5">Closed this week</p>
            </button>

          </div>
        </div>

        {/* ── Notification Detail Modal (unchanged) ──────────────────── */}
        {selectedNotification && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95">
              <button
                onClick={() => setSelectedNotification(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-full"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Street Light Fixed</h3>
                  <p className="text-xs text-gray-500">Ticket ID: #AWAZ-7420</p>
                </div>
              </div>

              <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Department</span>
                  <span className="font-semibold text-gray-900">Electrical Dept</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Resolved On</span>
                  <span className="font-semibold text-gray-900">20 Jan 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">Closed</span>
                </div>
              </div>

              <Link
                href="/awaaz/tracking?id=AWZ-2K5-7420"
                onClick={() => setSelectedNotification(false)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-awaaz-teal text-white rounded-xl font-bold shadow-md hover:bg-opacity-90"
              >
                View in Tracking <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        )}

        <BottomNav active="home" />
      </div>
    </div>
  )
}