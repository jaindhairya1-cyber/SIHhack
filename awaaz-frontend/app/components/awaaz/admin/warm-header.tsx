'use client'

import { useState } from 'react'
import { Search, Bell, User, LogOut, Settings, ShieldCheck, X, Globe, Mail, MapPin, Briefcase, Hash, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CURRENT_ADMIN } from '@/lib/admin-data'

const LANGUAGES = ['English', 'हिन्दी', 'मराठी', 'తెలుగు', 'தமிழ்', 'বাংলা']

export function WarmHeader({
  query,
  onQueryChange,
  onOpenSettings,
}: {
  query: string
  onQueryChange: (v: string) => void
  onOpenSettings?: () => void
}) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [selectedLang, setSelectedLang] = useState('English')
  const router = useRouter()

  // Use notification store data passed via props or from context
  const notifications = [
    { id: 1, text: 'New high-priority complaint AWZ-2K5-8807 received.', time: '7:40 AM', read: false },
    { id: 2, text: 'SLA deadline approaching for AWZ-2K5-8795 (2h left).', time: '8:00 AM', read: false },
    { id: 3, text: 'Citizen not satisfied with AWZ-2K5-8790. Re-review required.', time: '9:00 AM', read: true },
  ]
  const unreadCount = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    router.push('/login')
  }

  const closeAll = () => {
    setShowNotifications(false)
    setShowProfileMenu(false)
    setShowLangMenu(false)
  }

  const admin = CURRENT_ADMIN

  return (
    <header className="h-16 border-b border-[#EAE5D9] bg-[#FDFBF7] px-6 flex items-center justify-between gap-4 relative">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input 
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by Complaint ID, Citizen, Dept, Category, Location, or Date..."
          aria-label="Search complaints"
          className="w-full rounded-xl border border-[#EAE5D9] bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-[#2E6F65]"
        />
      </div>

      <div className="flex items-center gap-3 relative">

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => { setShowLangMenu(!showLangMenu); setShowNotifications(false); setShowProfileMenu(false); }}
            className="w-9 h-9 rounded-full bg-white border border-[#EAE5D9] flex items-center justify-center text-gray-600 shadow-sm cursor-pointer hover:bg-gray-50"
            title="Language"
          >
            <Globe size={16} />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-[#EAE5D9] p-2 z-50">
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => { setSelectedLang(lang); setShowLangMenu(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    selectedLang === lang ? 'bg-[#2E6F65] text-white' : 'text-gray-700 hover:bg-gray-50'
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
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); setShowLangMenu(false); }}
            className="w-9 h-9 rounded-full bg-white border border-[#EAE5D9] flex items-center justify-center text-gray-600 shadow-sm cursor-pointer hover:bg-gray-50 relative"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#EAE5D9] p-4 z-50">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#EAE5D9]">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">Notifications</h4>
                <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-2.5 rounded-xl text-xs border ${n.read ? 'bg-white border-gray-100' : 'bg-amber-50/60 border-amber-100'}`}>
                    <p className="font-semibold text-gray-900">{n.text}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Officer Profile Chip & Dropdown */}
        <div className="relative">
          <div 
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); setShowLangMenu(false); }}
            className="flex items-center gap-2 pl-3 border-l border-[#EAE5D9] cursor-pointer py-1 px-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#E5A040] text-white font-bold flex items-center justify-center text-xs">
              AV
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold leading-tight">{admin.name}</p>
              <p className="text-[10px] text-gray-500">{admin.department}</p>
            </div>
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#EAE5D9] p-4 z-50">
              {/* Avatar + Name */}
              <div className="flex items-center gap-3 pb-3 border-b border-[#EAE5D9] mb-3">
                <div className="w-10 h-10 rounded-full bg-[#E5A040] text-white font-bold flex items-center justify-center text-sm">AV</div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{admin.name}</p>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1"><ShieldCheck size={12} className="text-[#2E6F65]" /> {admin.role === 'senior' ? 'Senior Officer' : 'Officer'}</p>
                </div>
              </div>

              {/* Info Fields */}
              <div className="space-y-2.5 pb-3 border-b border-[#EAE5D9] mb-3">
                <div className="flex items-center gap-2.5">
                  <Hash size={12} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Officer ID</p>
                    <p className="text-xs font-medium text-gray-900">{admin.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Briefcase size={12} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Designation</p>
                    <p className="text-xs font-medium text-gray-900">{admin.designation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin size={12} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Ward / Zone</p>
                    <p className="text-xs font-medium text-gray-900">{admin.wardZone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail size={12} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Email</p>
                    <p className="text-xs font-medium text-gray-900">{admin.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={12} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Last Login</p>
                    <p className="text-xs font-medium text-gray-900">{admin.lastLogin}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-1">
                <button
                  onClick={() => { closeAll(); if (onOpenSettings) onOpenSettings(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <Settings size={14} /> Settings
                </button>
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 mt-2 border-t border-gray-100 pt-2">
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}