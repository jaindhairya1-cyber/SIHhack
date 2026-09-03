"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bot, Mic, Keyboard, Paperclip, CheckCircle2, Send, X, Image, Video } from "lucide-react"
import { BottomNav } from "./bottom-nav"
import {
  useComplaints,
  generateTicketId,
  formatDate,
  type AttachmentItem,
} from "@/lib/complaint-store"
import { Droplet } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
type Message = {
  id: number
  from: "ai" | "user"
  text: string
  meta?: string
}

// ─── Department auto-detect helper ───────────────────────────────────────────
function detectDept(text: string): string {
  const t = text.toLowerCase()
  if (t.includes("paani") || t.includes("water") || t.includes("naali") || t.includes("drain")) return "Water Department"
  if (t.includes("light") || t.includes("bijli") || t.includes("electricity") || t.includes("street")) return "Electricity Board"
  if (t.includes("garbage") || t.includes("kachra") || t.includes("safai") || t.includes("sanitation")) return "Sanitation Dept."
  if (t.includes("road") || t.includes("pothole") || t.includes("sadak")) return "Public Works (PWD)"
  return "Municipal Corporation"
}

// ─── Speech Recognition types ────────────────────────────────────────────────

interface ISpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } }
}

interface ISpeechRecognition extends EventTarget {
  lang: string
  interimResults: boolean
  continuous: boolean
  start(): void
  stop(): void
  onstart: (() => void) | null
  onresult: ((e: ISpeechRecognitionEvent) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition
    webkitSpeechRecognition: new () => ISpeechRecognition
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export function WarmChat() {
  const { addComplaint } = useComplaints()

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: "ai", text: "Namaste! Apna problem record karein. Voice ya text mein bol sakte hain." },
  ])
  const [recording, setRecording] = useState(false)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [attachments, setAttachments] = useState<AttachmentItem[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [transcript, setTranscript] = useState("")    // accumulates full complaint text

  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<ISpeechRecognition | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(2)
  const textInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus text input when keyboard opens
  useEffect(() => {
    if (showKeyboard) textInputRef.current?.focus()
  }, [showKeyboard])

  // ── Add a message bubble ─────────────────────────────────────────────────
  function addMsg(from: "ai" | "user", text: string, meta?: string) {
    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, from, text, meta },
    ])
  }

  // ── Mic / Voice Recording ────────────────────────────────────────────────
  function toggleRecording() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      addMsg("ai", "Aapke browser mein voice support nahi hai. Kripya keyboard use karein.")
      return
    }

    if (recording) {
      recognitionRef.current?.stop()
      setRecording(false)
      return
    }

    const rec = new SR()
    rec.lang = "hi-IN"
    rec.interimResults = false
    rec.continuous = false
    recognitionRef.current = rec

    rec.onstart = () => setRecording(true)

    rec.onresult = (e) => {
      const spoken = e.results[0][0].transcript
      addMsg("user", spoken, "Voice · just now")
      setTranscript((prev) => (prev ? prev + " " + spoken : spoken))

      // AI ack
      setTimeout(() => {
        const dept = detectDept(spoken)
        addMsg("ai", `Samjha. "${spoken}" — yeh complaint ${dept} ko route ki ja rahi hai. Koi aur detail dena chahein?`)
      }, 800)
    }

    rec.onerror = () => {
      addMsg("ai", "Voice record nahi ho saka. Dobara try karein ya keyboard use karein.")
      setRecording(false)
    }

    rec.onend = () => setRecording(false)
    rec.start()
  }

  // ── Keyboard text send ───────────────────────────────────────────────────
  function sendText() {
    const text = typedText.trim()
    if (!text) return
    addMsg("user", text)
    setTranscript((prev) => (prev ? prev + " " + text : text))
    setTypedText("")

    setTimeout(() => {
      const dept = detectDept(text)
      addMsg("ai", `Theek hai. "${text}" — yeh ${dept} ko bheja jaayega. Koi attachment (photo/video) add karna chahein?`)
    }, 700)
  }

  // ── File Attachment ──────────────────────────────────────────────────────
  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const items: AttachmentItem[] = files.map((f) => ({
      type: f.type.startsWith("video") ? "video" : "image",
      url: URL.createObjectURL(f),
      name: f.name,
    }))
    setAttachments((prev) => [...prev, ...items])
    addMsg("ai", `${files.length} file(s) attach ho gayi. Ab "Confirm & Submit" dabayein complaint darz karne ke liye.`)

    // Reset so same file can be re-selected
    e.target.value = ""
  }

  // ── Confirm & Submit ─────────────────────────────────────────────────────
  function handleSubmit() {
    if (submitted) return

    const text = transcript.trim() || typedText.trim()
    if (!text && !attachments.length) {
      addMsg("ai", "Pehle apni complaint batayein — voice se bolein ya type karein.")
      return
    }

    const id = generateTicketId()
    const now = formatDate(new Date())
    const dept = detectDept(text)

    addComplaint({
      id,
      title: text.slice(0, 60) || "Complaint submitted",
      department: dept,
      icon: Droplet,
      status: "Pending",
      date: now.date,
      time: now.time,
      location: "Indore, Madhya Pradesh",
      channel: attachments.length ? "Text" : "Voice",
      transcript: text,
      attachments,
      workflowStatus: 'received',
      activityLog: [
        {
          status: 'received',
          label: 'Complaint Received',
          officer: 'System',
          timestamp: new Date().toISOString(),
        },
      ],
      photos: [],
    })

    setSubmitted(true)
    addMsg(
      "ai",
      `✅ Complaint darz ho gayi! Ticket ID: ${id}\nDepartment: ${dept}\nTracking page pe status dekh sakte hain.`
    )
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col bg-awaaz-cream">

      {/* ── Header (unchanged) ─────────────────────────────────────────── */}
      <header className="flex items-center gap-3 rounded-b-[2rem] bg-awaaz-teal px-4 pb-5 pt-6 text-awaaz-teal-foreground">
        <Link
          href="/"
          aria-label="Go back"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-awaaz-surface/25"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-awaaz-surface/90 text-awaaz-teal">
          <Bot className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <div className="flex-1">
          <p className="font-display text-base font-bold leading-tight">Awaaz-AI Assistant</p>
          <p className="flex items-center gap-1.5 text-xs text-awaaz-teal-foreground/75">
            <span className="h-2 w-2 rounded-full bg-awaaz-yellow" />
            Online · Voice ready
          </p>
        </div>
      </header>

      {/* ── Chat area ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-6">
        {messages.map((m) =>
          m.from === "ai" ? (
            <div key={m.id} className="flex items-end gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-awaaz-teal text-awaaz-teal-foreground">
                <Bot className="h-4 w-4" />
              </span>
              <div className="max-w-[78%] rounded-3xl rounded-bl-md bg-awaaz-surface px-4 py-3 text-sm text-awaaz-ink shadow-[0_10px_24px_-18px_rgba(47,47,52,0.5)] whitespace-pre-line">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={m.id} className="flex flex-col items-end">
              <div className="max-w-[78%] rounded-3xl rounded-br-md bg-awaaz-yellow px-4 py-3 text-sm text-awaaz-yellow-foreground shadow-[0_10px_24px_-18px_rgba(47,47,52,0.5)]">
                {m.text}
              </div>
              {m.meta && (
                <span className="mt-1 pr-1 text-[11px] text-awaaz-muted">{m.meta}</span>
              )}
            </div>
          )
        )}

        {/* Attachment previews inside chat */}
        {attachments.length > 0 && (
          <div className="flex flex-col items-end gap-1">
            <div className="flex gap-2 flex-wrap justify-end max-w-[78%]">
              {attachments.map((a, i) => (
                <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-awaaz-line shadow-sm bg-awaaz-surface">
                  {a.type === "image" ? (
                    <img src={a.url} alt={a.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full gap-1">
                      <Video className="h-6 w-6 text-awaaz-teal" />
                      <span className="text-[9px] text-awaaz-muted text-center px-1 truncate w-full">{a.name}</span>
                    </div>
                  )}
                  <button
                    onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
            <span className="text-[11px] text-awaaz-muted pr-1">{attachments.length} attachment(s)</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Confirm & Submit (unchanged look) ─────────────────────────── */}
      <div className="px-5">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitted}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-awaaz-orange py-3.5 font-semibold text-awaaz-orange-foreground shadow-[0_14px_30px_-14px_rgba(245,148,31,0.8)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <CheckCircle2 className="h-5 w-5" />
          {submitted ? "Submitted ✓" : "Confirm & Submit"}
        </button>
      </div>

      {/* ── Input area (unchanged look) ────────────────────────────────── */}
      <div className="mt-4 rounded-t-[2rem] bg-awaaz-surface px-6 pb-3 pt-5 shadow-[0_-8px_24px_-18px_rgba(47,47,52,0.35)]">

        {/* Keyboard text input (shown when keyboard icon tapped) */}
        {showKeyboard && (
          <div className="flex items-center gap-2 mb-4 bg-awaaz-cream rounded-2xl px-4 py-2.5 border border-awaaz-line">
            <input
              ref={textInputRef}
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendText() }}
              placeholder="Type your complaint..."
              className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-awaaz-muted"
            />
            <button
              type="button"
              onClick={sendText}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-awaaz-teal text-white shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleFiles}
          aria-label="Attach photo or video"
        />

        {/* Original 3-button row (unchanged layout) */}
        <div className="flex items-center justify-between">

          {/* Keyboard toggle */}
          <button
            type="button"
            aria-label="Type manually"
            aria-pressed={showKeyboard}
            onClick={() => setShowKeyboard((v) => !v)}
            className={[
              "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
              showKeyboard ? "bg-awaaz-teal text-white" : "bg-awaaz-cream text-awaaz-muted",
            ].join(" ")}
          >
            <Keyboard className="h-5 w-5" />
          </button>

          {/* Mic button (unchanged look) */}
          <button
            type="button"
            onClick={toggleRecording}
            aria-pressed={recording}
            aria-label={recording ? "Stop recording" : "Start voice recording"}
            className="relative flex h-20 w-20 items-center justify-center rounded-full"
          >
            <span
              aria-hidden
              className={[
                "absolute inset-0 rounded-full",
                recording ? "animate-ping bg-awaaz-orange/40" : "animate-pulse bg-awaaz-yellow/40",
              ].join(" ")}
            />
            <span
              className={[
                "relative flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-colors",
                recording
                  ? "bg-awaaz-orange text-awaaz-orange-foreground"
                  : "bg-awaaz-yellow text-awaaz-yellow-foreground",
              ].join(" ")}
            >
              <Mic className="h-7 w-7" strokeWidth={2.2} />
            </span>
          </button>

          {/* Attachment button */}
          <button
            type="button"
            aria-label="Add attachment"
            onClick={() => fileInputRef.current?.click()}
            className={[
              "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
              attachments.length > 0 ? "bg-awaaz-orange/15 text-awaaz-orange" : "bg-awaaz-cream text-awaaz-muted",
            ].join(" ")}
          >
            <Paperclip className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-awaaz-muted">
          {recording ? "Sun raha hoon… rok ne ke liye tap karein" : "Mic tap karein ya keyboard icon se type karein"}
        </p>
      </div>

      <BottomNav active="chat" />
    </div>
  )
}
