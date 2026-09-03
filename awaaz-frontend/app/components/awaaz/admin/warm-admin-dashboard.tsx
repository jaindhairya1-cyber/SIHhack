'use client'

import { useState } from 'react'
import {
  Inbox, Clock, AlertTriangle, CheckCircle2, LayoutDashboard, ListFilter, BarChart3,
  Settings as SettingsIcon, Filter, ChevronDown, Bell, Lock, Palette, Globe, Shield, Building2,
  User, ToggleLeft, ToggleRight
} from 'lucide-react'
import { WarmHeader } from './warm-header'
import { WarmComplaintDetail } from './warm-complaint-detail'
import { WarmAiAnalytics } from './warm-ai-analytics'
import {
  COMPLAINTS, PRIORITY_CONFIG, STATUS_OPTIONS, OFFICERS, CURRENT_ADMIN,
  type Complaint, type StatusKind, type PhotoEvidence, type ScheduledCall
} from '@/lib/admin-data'

export function WarmAdminDashboard() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'live-queue' | 'analytics' | 'settings'>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [wardFilter, setWardFilter] = useState<string>('All')
  const [complaints, setComplaints] = useState<Complaint[]>(COMPLAINTS)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [settingsTab, setSettingsTab] = useState<'profile' | 'notifications' | 'preferences' | 'security' | 'admin'>('profile')

  // Settings state (mock)
  const [notifSettings, setNotifSettings] = useState({ newComplaint: true, slaWarning: true, escalation: true, resolution: false })
  const [prefSettings, setPrefSettings] = useState({ language: 'English', theme: 'Light', dateFormat: 'DD/MM/YYYY' })

  // Today's date
  const today = new Date().toISOString().split('T')[0]
  const todaysPending = complaints.filter(c => c.date === today && c.status !== 'completed' && c.status !== 'feedback-pending')

  // Unique wards from data
  const allWards = [...new Set(complaints.map(c => c.location))]

  // Filter logic for search & status & ward & date/time
  const filteredComplaints = complaints.filter(c => {
    const q = searchQuery.toLowerCase()
    const matchesSearch = !q ||
      c.id.toLowerCase().includes(q) ||
      c.citizen.toLowerCase().includes(q) ||
      c.intent.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.submittedAt.toLowerCase().includes(q) ||
      c.date.includes(q)

    const matchesStatus = statusFilter === 'All' ||
      (statusFilter === 'Pending' && c.status !== 'completed') ||
      (statusFilter === 'Completed' && c.status === 'completed') ||
      (statusFilter === 'SLA' && c.slaHoursLeft < 0) ||
      c.status === statusFilter

    const matchesWard = wardFilter === 'All' || c.location === wardFilter

    return matchesSearch && matchesStatus && matchesWard
  })

  // ─── Actions ──────────────────────────────────────────────────────────
  const handleStatusChange = (id: string, newStatus: StatusKind) => {
    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c
      const newEntry = { status: newStatus, label: newStatus.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()), officer: CURRENT_ADMIN.name, timestamp: new Date().toISOString() }
      return { ...c, status: newStatus, activityLog: [...c.activityLog, newEntry] }
    }))
    if (selectedComplaint?.id === id) {
      setSelectedComplaint(prev => prev ? { ...prev, status: newStatus } : null)
    }
  }

  const handleAssignJE = (id: string, officerId: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c
      const je = OFFICERS.find(o => o.id === officerId)
      const newEntry = { status: 'assigned-je' as StatusKind, label: 'Assigned to JE', officer: CURRENT_ADMIN.name, timestamp: new Date().toISOString() }
      return { ...c, assignedJE: officerId, status: 'assigned-je', activityLog: [...c.activityLog, newEntry] }
    }))
    refreshSelected(id)
  }

  const handleAssignKaramchari = (id: string, officerId: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c
      const newEntry = { status: 'assigned-field' as StatusKind, label: 'Field Assigned', officer: OFFICERS.find(o => o.id === c.assignedJE)?.name || 'JE', timestamp: new Date().toISOString() }
      return { ...c, assignedKaramchari: officerId, status: 'assigned-field', activityLog: [...c.activityLog, newEntry] }
    }))
    refreshSelected(id)
  }

  const handlePhotoUpload = (id: string, photo: PhotoEvidence) => {
    setComplaints(prev => prev.map(c => {
      if (c.id !== id) return c
      const newStatus: StatusKind = photo.aiVerdict?.match && photo.aiVerdict.confidence > 80 ? 'senior-review' : 'photo-uploaded'
      const entries = [
        { status: 'photo-uploaded' as StatusKind, label: 'Photo Uploaded', officer: photo.uploadedBy, timestamp: photo.timestamp },
        ...(newStatus === 'senior-review' ? [{ status: 'senior-review' as StatusKind, label: 'Auto: AI Approved → Senior Review', officer: 'AI System', timestamp: new Date().toISOString() }] : []),
      ]
      return { ...c, photos: [...c.photos, photo], status: newStatus, activityLog: [...c.activityLog, ...entries] }
    }))
    refreshSelected(id)
  }

  const handleScheduleCall = (id: string, call: ScheduledCall) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, scheduledCall: call } : c))
    refreshSelected(id)
  }

  const refreshSelected = (id: string) => {
    setTimeout(() => {
      setComplaints(prev => {
        const updated = prev.find(c => c.id === id)
        if (updated) setSelectedComplaint({ ...updated })
        return prev
      })
    }, 50)
  }

  // Status badge color helper
  const getStatusColor = (status: StatusKind): string => {
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

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className="text-gray-400 hover:text-[#2E6F65]">
      {enabled ? <ToggleRight size={22} className="text-[#2E6F65]" /> : <ToggleLeft size={22} />}
    </button>
  )

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex font-sans text-gray-900">
      
      {/* Sidebar */}
      <div className="w-64 border-r border-[#EAE5D9] bg-[#FDFBF7] p-4 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-[#EAE5D9]">
            <div className="w-8 h-8 rounded-lg bg-[#E5A040]/20 flex items-center justify-center text-[#E5A040] font-bold">
              A
            </div>
            <div>
              <h2 className="font-bold text-sm">Awaaz-AI</h2>
              <p className="text-[11px] text-gray-500">Officer Console</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => { setCurrentTab('dashboard'); setStatusFilter('All'); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${currentTab === 'dashboard' ? 'bg-[#2E6F65] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button 
              onClick={() => { setCurrentTab('live-queue'); setStatusFilter('All'); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${currentTab === 'live-queue' ? 'bg-[#2E6F65] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <ListFilter size={18} /> Live Queue
            </button>
            <button 
              onClick={() => setCurrentTab('analytics')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${currentTab === 'analytics' ? 'bg-[#2E6F65] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <BarChart3 size={18} /> AI Analytics
            </button>
            <button 
              onClick={() => setCurrentTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${currentTab === 'settings' ? 'bg-[#2E6F65] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <SettingsIcon size={18} /> Settings
            </button>
          </nav>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-[#EAE5D9] shadow-sm">
          <p className="text-xs font-bold text-gray-900 mb-1">SLA Health</p>
          <p className="text-[11px] text-gray-500">{complaints.filter(c => c.slaHoursLeft < 0).length} ticket(s) breached. Review the queue.</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <WarmHeader query={searchQuery} onQueryChange={setSearchQuery} onOpenSettings={() => setCurrentTab('settings')} />

        {/* Content Body */}
        <main className="p-6 overflow-y-auto flex-1">
          
          {/* ═══════ DASHBOARD TAB ═══════ */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Overview of citizen grievances routed by Awaaz-AI</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                  onClick={() => { setCurrentTab('live-queue'); setStatusFilter('All'); }}
                  className="p-5 bg-white rounded-2xl border border-[#EAE5D9] shadow-sm flex items-center gap-4 cursor-pointer hover:border-[#2E6F65] transition-all"
                >
                  <div className="p-3 bg-[#FDFBF7] border border-[#EAE5D9] rounded-xl text-[#2E6F65]"><Inbox size={20} /></div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Total Complaints</p>
                    <p className="text-2xl font-extrabold text-gray-900">{complaints.length}</p>
                  </div>
                </div>

                <div 
                  onClick={() => { setCurrentTab('live-queue'); setStatusFilter('Pending'); }}
                  className="p-5 bg-white rounded-2xl border border-amber-200 shadow-sm flex items-center gap-4 cursor-pointer hover:ring-2 hover:ring-amber-200 transition-all"
                >
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-600"><Clock size={20} /></div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Pending</p>
                    <p className="text-2xl font-extrabold text-gray-900">{complaints.filter(c => c.status !== 'completed').length}</p>
                  </div>
                </div>

                <div 
                  onClick={() => { setCurrentTab('live-queue'); setStatusFilter('SLA'); }}
                  className="p-5 bg-white rounded-2xl border border-orange-200 ring-1 ring-orange-200 shadow-sm flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-all"
                >
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-orange-600"><AlertTriangle size={20} /></div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">SLA Breached</p>
                    <p className="text-2xl font-extrabold text-orange-600">{complaints.filter(c => c.slaHoursLeft < 0).length}</p>
                  </div>
                </div>

                <div 
                  onClick={() => { setCurrentTab('live-queue'); setStatusFilter('completed'); }}
                  className="p-5 bg-white rounded-2xl border border-emerald-200 shadow-sm flex items-center gap-4 cursor-pointer hover:ring-2 hover:ring-emerald-200 transition-all"
                >
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600"><CheckCircle2 size={20} /></div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Resolved</p>
                    <p className="text-2xl font-extrabold text-gray-900">{complaints.filter(c => c.status === 'completed').length}</p>
                  </div>
                </div>
              </div>

              {/* Today's Pending Complaints */}
              <div className="bg-white rounded-2xl border border-[#EAE5D9] shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#EAE5D9]">
                  <h2 className="font-bold text-base text-gray-900">Today&apos;s Pending Complaints</h2>
                  <p className="text-xs text-gray-500">{todaysPending.length} complaints need attention today</p>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-[#EAE5D9] text-xs font-bold text-gray-500 uppercase">
                      <th className="p-4">Ticket ID</th>
                      <th className="p-4">Citizen</th>
                      <th className="p-4">Intent</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5D9] text-sm">
                    {todaysPending.length > 0 ? todaysPending.map(c => (
                      <tr key={c.id} onClick={() => setSelectedComplaint(c)} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                        <td className="p-4 font-bold text-[#2E6F65]">{c.id}</td>
                        <td className="p-4 text-gray-900">{c.citizen}</td>
                        <td className="p-4 text-gray-600 max-w-xs truncate">{c.intent}</td>
                        <td className="p-4 text-gray-600">{c.department}</td>
                        <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${PRIORITY_CONFIG[c.priority].className}`}>{PRIORITY_CONFIG[c.priority].label}</span></td>
                        <td className="p-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(c.status)}`}>{STATUS_OPTIONS.find(s => s.value === c.status)?.label}</span></td>
                      </tr>
                    )) : (
                      <tr><td colSpan={6} className="p-8 text-center text-gray-400 text-sm">No pending complaints today 🎉</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════ LIVE QUEUE TAB ═══════ */}
          {currentTab === 'live-queue' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Live Queue</h1>
                  <p className="text-sm text-gray-500">Manage and update incoming departmental grievances</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Filter */}
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#EAE5D9] shadow-sm">
                    <Filter size={14} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-600">Status:</span>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="text-xs font-semibold text-gray-900 bg-transparent outline-none cursor-pointer"
                    >
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="SLA">SLA Breached</option>
                      {STATUS_OPTIONS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Ward/Zone Filter */}
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#EAE5D9] shadow-sm">
                    <span className="text-xs font-bold text-gray-600">Ward:</span>
                    <select
                      value={wardFilter}
                      onChange={(e) => setWardFilter(e.target.value)}
                      className="text-xs font-semibold text-gray-900 bg-transparent outline-none cursor-pointer"
                    >
                      <option value="All">All Locations</option>
                      {allWards.map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#EAE5D9] shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-[#EAE5D9] text-xs font-bold text-gray-500 uppercase">
                      <th className="p-4">Ticket ID</th>
                      <th className="p-4">Citizen</th>
                      <th className="p-4">Intent Summary</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Assigned To</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5D9] text-sm">
                    {filteredComplaints.length > 0 ? (
                      filteredComplaints.map(c => (
                        <tr key={c.id} onClick={() => setSelectedComplaint(c)} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                          <td className="p-4 font-bold text-[#2E6F65]">{c.id}</td>
                          <td className="p-4 text-gray-900">{c.citizen}</td>
                          <td className="p-4 text-gray-600 max-w-xs truncate">{c.intent}</td>
                          <td className="p-4 text-gray-600">{c.department}</td>
                          <td className="p-4 text-gray-600 text-xs">
                            {c.assignedKaramchari
                              ? OFFICERS.find(o => o.id === c.assignedKaramchari)?.name
                              : c.assignedJE
                              ? OFFICERS.find(o => o.id === c.assignedJE)?.name
                              : '—'}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${getStatusColor(c.status)}`}>
                              {STATUS_OPTIONS.find(s => s.value === c.status)?.label}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-400 text-sm">
                          No complaints match your search or filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════ ANALYTICS TAB ═══════ */}
          {currentTab === 'analytics' && <WarmAiAnalytics />}

          {/* ═══════ SETTINGS TAB ═══════ */}
          {currentTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500">Manage officer profile, notifications, and department config</p>
              </div>

              {/* Settings Tabs */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {([
                  { key: 'profile', label: 'Profile', icon: User },
                  { key: 'notifications', label: 'Notifications', icon: Bell },
                  { key: 'preferences', label: 'Preferences', icon: Palette },
                  { key: 'security', label: 'Security', icon: Lock },
                  { key: 'admin', label: 'Admin-only', icon: Shield },
                ] as const).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setSettingsTab(tab.key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      settingsTab === tab.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon size={14} /> {tab.label}
                  </button>
                ))}
              </div>

              {/* Profile Section */}
              {settingsTab === 'profile' && (
                <div className="bg-white p-6 rounded-2xl border border-[#EAE5D9] shadow-sm max-w-lg space-y-4">
                  {[
                    { label: 'Officer Name', value: CURRENT_ADMIN.name },
                    { label: 'Officer ID', value: CURRENT_ADMIN.id },
                    { label: 'Department', value: CURRENT_ADMIN.department },
                    { label: 'Designation', value: CURRENT_ADMIN.designation },
                    { label: 'Ward / Zone', value: CURRENT_ADMIN.wardZone },
                    { label: 'Email', value: CURRENT_ADMIN.email },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{field.label}</label>
                      <input type="text" defaultValue={field.value} className="w-full p-3 rounded-xl border border-[#EAE5D9] text-sm bg-gray-50" />
                    </div>
                  ))}
                  <button className="px-5 py-2.5 bg-[#2E6F65] text-white rounded-xl text-sm font-bold shadow-sm">
                    Save Changes
                  </button>
                </div>
              )}

              {/* Notifications Section */}
              {settingsTab === 'notifications' && (
                <div className="bg-white p-6 rounded-2xl border border-[#EAE5D9] shadow-sm max-w-lg space-y-4">
                  {[
                    { key: 'newComplaint' as const, label: 'New Complaint', desc: 'Get notified when a new complaint arrives' },
                    { key: 'slaWarning' as const, label: 'SLA Warning', desc: 'Alert when SLA deadline is approaching' },
                    { key: 'escalation' as const, label: 'Escalation', desc: 'Notify on complaint escalation' },
                    { key: 'resolution' as const, label: 'Resolution', desc: 'Notify when a complaint is resolved' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-[#EAE5D9]">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                        <p className="text-[11px] text-gray-500">{item.desc}</p>
                      </div>
                      <Toggle
                        enabled={notifSettings[item.key]}
                        onToggle={() => setNotifSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Preferences Section */}
              {settingsTab === 'preferences' && (
                <div className="bg-white p-6 rounded-2xl border border-[#EAE5D9] shadow-sm max-w-lg space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Language</label>
                    <select
                      value={prefSettings.language}
                      onChange={(e) => setPrefSettings(p => ({ ...p, language: e.target.value }))}
                      className="w-full p-3 rounded-xl border border-[#EAE5D9] text-sm bg-gray-50 outline-none"
                    >
                      {['English', 'हिन्दी', 'मराठी', 'తెలుగు', 'தமிழ்', 'বাংলা'].map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Theme</label>
                    <select
                      value={prefSettings.theme}
                      onChange={(e) => setPrefSettings(p => ({ ...p, theme: e.target.value }))}
                      className="w-full p-3 rounded-xl border border-[#EAE5D9] text-sm bg-gray-50 outline-none"
                    >
                      <option>Light</option>
                      <option>Dark</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Date Format</label>
                    <select
                      value={prefSettings.dateFormat}
                      onChange={(e) => setPrefSettings(p => ({ ...p, dateFormat: e.target.value }))}
                      className="w-full p-3 rounded-xl border border-[#EAE5D9] text-sm bg-gray-50 outline-none"
                    >
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <button className="px-5 py-2.5 bg-[#2E6F65] text-white rounded-xl text-sm font-bold shadow-sm">
                    Save Preferences
                  </button>
                </div>
              )}

              {/* Security Section */}
              {settingsTab === 'security' && (
                <div className="bg-white p-6 rounded-2xl border border-[#EAE5D9] shadow-sm max-w-lg space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Change Password</label>
                    <input type="password" placeholder="Current password" className="w-full p-3 rounded-xl border border-[#EAE5D9] text-sm bg-gray-50 mb-2" />
                    <input type="password" placeholder="New password" className="w-full p-3 rounded-xl border border-[#EAE5D9] text-sm bg-gray-50 mb-2" />
                    <input type="password" placeholder="Confirm new password" className="w-full p-3 rounded-xl border border-[#EAE5D9] text-sm bg-gray-50" />
                  </div>
                  <button className="px-5 py-2.5 bg-[#2E6F65] text-white rounded-xl text-sm font-bold shadow-sm">
                    Update Password
                  </button>

                  <div className="pt-4 border-t border-[#EAE5D9]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Login Activity</h4>
                    <div className="space-y-2">
                      {[
                        { device: 'Chrome · Windows', time: 'Today, 10:15 AM', active: true },
                        { device: 'Mobile App · Android', time: 'Yesterday, 6:30 PM', active: false },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-[#EAE5D9]">
                          <div>
                            <p className="text-xs font-semibold text-gray-900">{s.device}</p>
                            <p className="text-[10px] text-gray-500">{s.time}</p>
                          </div>
                          {s.active && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Admin-only Section */}
              {settingsTab === 'admin' && (
                <div className="bg-white p-6 rounded-2xl border border-[#EAE5D9] shadow-sm max-w-lg space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Department Name</label>
                    <input type="text" defaultValue={CURRENT_ADMIN.department} className="w-full p-3 rounded-xl border border-[#EAE5D9] text-sm bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">SLA Time Limit (hours)</label>
                    <input type="number" defaultValue={24} className="w-full p-3 rounded-xl border border-[#EAE5D9] text-sm bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Auto-Escalation After (hours)</label>
                    <input type="number" defaultValue={48} className="w-full p-3 rounded-xl border border-[#EAE5D9] text-sm bg-gray-50" />
                  </div>
                  <button className="px-5 py-2.5 bg-[#2E6F65] text-white rounded-xl text-sm font-bold shadow-sm">
                    Save Configuration
                  </button>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Complaint Detail Panel */}
      {selectedComplaint && (
        <WarmComplaintDetail
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onStatusChange={handleStatusChange}
          onAssignJE={handleAssignJE}
          onAssignKaramchari={handleAssignKaramchari}
          onPhotoUpload={handlePhotoUpload}
          onScheduleCall={handleScheduleCall}
        />
      )}
    </div>
  )
}