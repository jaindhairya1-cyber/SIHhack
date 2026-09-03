'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, User, ArrowRight, Lock, Phone, KeyRound } from 'lucide-react'
import { cn } from '@/lib/utils'

export function WarmLogin() {
  const [role, setRole] = useState<'citizen' | 'admin'>('citizen')
  const [otpSent, setOtpSent] = useState(false)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [adminId, setAdminId] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (role === 'admin') {
      // Security check: yahan future mein backend auth lagega
      if (adminId && adminPassword) {
        router.push('/admin')
      }
    } else {
      if (!otpSent) {
        setOtpSent(true)
      } else {
        router.push('/')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans">
      <div className="w-full max-w-md bg-awaaz-cream min-h-screen relative shadow-xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-awaaz-orange text-awaaz-surface pt-12 pb-10 px-6 rounded-b-[2.5rem] shadow-sm relative">
          <div className="flex items-center gap-2 mb-8 opacity-90">
            <div className="w-8 h-8 rounded-full bg-awaaz-surface/20 flex items-center justify-center backdrop-blur-sm">
              <Shield size={16} />
            </div>
            <div>
              <h2 className="font-bold leading-tight">Awaaz-AI</h2>
              <p className="text-[10px] opacity-80">Amrit Awaaz, Safai Department Tak</p>
            </div>
          </div>
          
          <h1 className="text-4xl font-extrabold mb-2">Namaste!</h1>
          <p className="opacity-90 text-sm max-w-[85%]">
            Sign in to raise and track your complaints.
          </p>
        </div>

        {/* Form Section */}
        <div className="flex-1 px-6 pt-8 pb-6 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {role === 'admin' ? 'Admin Secure Portal' : otpSent ? 'Enter OTP' : 'Login'}
          </h2>
          <p className="text-sm text-awaaz-muted mb-6">
            {role === 'admin' 
              ? 'Enter official credentials and password for secure access.' 
              : otpSent 
              ? `Please enter the 4-digit code sent to +91 ${phone}` 
              : "We'll send a one-time password to your phone."}
          </p>

          {/* Citizen & Admin Switch */}
          <div className="flex p-1 bg-awaaz-surface rounded-xl border border-awaaz-line mb-6 shadow-inner">
            <button 
              type="button" 
              onClick={() => { setRole('citizen'); setOtpSent(false); }} 
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all", 
                role === 'citizen' ? "bg-awaaz-teal text-awaaz-surface shadow-sm" : "text-awaaz-muted hover:text-gray-900"
              )}
            >
              <User size={16} /> Citizen
            </button>
            <button 
              type="button" 
              onClick={() => { setRole('admin'); setOtpSent(false); }} 
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all", 
                role === 'admin' ? "bg-awaaz-teal text-awaaz-surface shadow-sm" : "text-awaaz-muted hover:text-gray-900"
              )}
            >
              <Shield size={16} /> Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 flex-1">
            {role === 'admin' ? (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Admin ID</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-awaaz-muted" size={18} />
                    <input 
                      type="text"
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      placeholder="e.g. ADM-001"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-awaaz-line bg-awaaz-surface text-gray-900 focus:ring-2 focus:ring-awaaz-teal focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Secure Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-awaaz-muted" size={18} />
                    <input 
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-awaaz-line bg-awaaz-surface text-gray-900 focus:ring-2 focus:ring-awaaz-teal focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </>
            ) : !otpSent ? (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-awaaz-muted" size={18} />
                  <input 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-awaaz-line bg-awaaz-surface text-gray-900 focus:ring-2 focus:ring-awaaz-teal focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Verification OTP</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-awaaz-muted" size={18} />
                  <input 
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 4-digit OTP (e.g. 1234)"
                    maxLength={4}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-awaaz-line bg-awaaz-surface text-gray-900 tracking-widest font-bold text-lg focus:ring-2 focus:ring-awaaz-teal focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => setOtpSent(false)}
                  className="text-xs text-awaaz-teal font-semibold mt-2 hover:underline"
                >
                  Change Mobile Number?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 p-4 bg-awaaz-teal text-white rounded-xl font-bold shadow-md hover:bg-opacity-90 transition-all mt-4"
            >
              {role === 'admin' ? 'Access Secure Dashboard' : !otpSent ? 'Get OTP' : 'Verify & Login'} 
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer Area */}
          <div className="mt-auto pt-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs text-awaaz-muted font-medium">
              <Shield size={14} /> Secured by Government of India
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}