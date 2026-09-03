'use client'

import { User, MapPin, Phone, LogOut, FileText, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function WarmProfile() {
  const router = useRouter()

  const handleLogout = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans">
      <div className="w-full max-w-md bg-awaaz-cream min-h-screen relative shadow-xl pb-24 overflow-x-hidden">
        
        {/* Profile Header */}
        <div className="bg-awaaz-teal text-awaaz-surface p-6 pt-12 rounded-b-[2.5rem] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-awaaz-surface text-awaaz-teal rounded-full flex items-center justify-center text-2xl font-bold shadow-inner">
              RA
            </div>
            <div>
              <h1 className="text-2xl font-bold">Rahul Agarwal</h1>
              <p className="opacity-90 flex items-center gap-1 text-sm mt-1">
                <MapPin size={14} /> Indore, Madhya Pradesh
              </p>
            </div>
          </div>
        </div>

        {/* User Details & Actions */}
        <div className="p-6 space-y-6">
          
          {/* Contact Info */}
          <div className="bg-awaaz-surface p-4 rounded-2xl border border-awaaz-line shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-awaaz-muted">
              <Phone size={18} />
              <span className="text-gray-900 font-medium">+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3 text-awaaz-muted pt-3 border-t border-awaaz-line">
              <User size={18} />
              <span className="text-gray-900 font-medium">Citizen Account</span>
            </div>
          </div>

          {/* Complaint History Shortcut */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3 px-1">My Activity</h2>
            <div className="bg-awaaz-surface rounded-2xl border border-awaaz-line shadow-sm overflow-hidden">
              <Link href="/awaaz/tracking" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-awaaz-teal/10 text-awaaz-teal rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Total Complaints</p>
                    <p className="text-sm text-awaaz-muted">3 Raised, 2 Resolved</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-awaaz-muted" />
              </Link>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 text-awaaz-orange bg-awaaz-orange/10 rounded-2xl font-bold hover:bg-awaaz-orange/20 transition-colors mt-8"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>
        
      </div>
    </div>
  )
}