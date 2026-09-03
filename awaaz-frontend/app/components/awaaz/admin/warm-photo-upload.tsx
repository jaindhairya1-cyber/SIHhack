'use client'

import { useState, useRef } from 'react'
import { Upload, X, CheckCircle2, AlertTriangle, ImageIcon } from 'lucide-react'
import type { PhotoEvidence } from '@/lib/admin-data'

export function WarmPhotoUpload({
  photos,
  originalPhoto,
  onUpload,
  readOnly = false,
}: {
  photos: PhotoEvidence[]
  originalPhoto?: string // base64 of citizen's original complaint photo
  onUpload?: (photo: PhotoEvidence) => void
  readOnly?: boolean
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onUpload) return

    setUploading(true)
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result as string

      // Mock AI comparison
      const confidence = Math.floor(60 + Math.random() * 35) // 60-95%
      const match = confidence > 70
      const aiVerdict = {
        match,
        confidence,
        suggestion: match
          ? 'Issue appears resolved based on photo comparison.'
          : 'Photo does not clearly show resolution. Manual review needed.',
      }

      const photo: PhotoEvidence = {
        url,
        timestamp: new Date().toISOString(),
        uploadedBy: 'Field Worker',
        aiVerdict,
      }
      onUpload(photo)
      setUploading(false)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Photo Evidence</h4>

      {/* Upload area */}
      {!readOnly && (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-[#EAE5D9] rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-[#2E6F65] hover:bg-gray-50/50 transition-all"
        >
          <Upload size={20} className="text-gray-400" />
          <p className="text-xs text-gray-500 font-medium">
            {uploading ? 'Uploading...' : 'Click or drag photo to upload'}
          </p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
      )}

      {/* Uploaded photos */}
      {photos.length > 0 && (
        <div className="space-y-3">
          {photos.map((photo, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#EAE5D9] overflow-hidden">
              <img src={photo.url} alt={`Evidence ${i + 1}`} className="w-full h-40 object-cover" />
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-gray-500">
                    {new Date(photo.timestamp).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
                    })}
                  </p>
                  <p className="text-[10px] text-gray-500">by {photo.uploadedBy}</p>
                </div>

                {/* AI Verdict */}
                {photo.aiVerdict && (
                  <div className={`flex items-start gap-2 p-2 rounded-lg text-xs ${
                    photo.aiVerdict.match
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'bg-amber-50 border border-amber-200'
                  }`}>
                    {photo.aiVerdict.match
                      ? <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                      : <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" />}
                    <div>
                      <p className={`font-semibold ${photo.aiVerdict.match ? 'text-emerald-700' : 'text-amber-700'}`}>
                        AI Confidence: {photo.aiVerdict.confidence}%
                      </p>
                      <p className="text-gray-600 mt-0.5">{photo.aiVerdict.suggestion}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && readOnly && (
        <div className="flex items-center gap-2 text-gray-400 text-xs p-3 bg-gray-50 rounded-xl">
          <ImageIcon size={14} />
          <span>No photos uploaded yet</span>
        </div>
      )}
    </div>
  )
}
