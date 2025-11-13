"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Send, CheckCircle2, XCircle } from "lucide-react"
import emailjs from "@emailjs/browser"

interface ContactFormProps {
  translations: {
    name: string
    namePlaceholder: string
    email: string
    emailPlaceholder: string
    subject: string
    subjectPlaceholder: string
    message: string
    messagePlaceholder: string
    send: string
    sending: string
    success: string
    error: string
    close: string
  }
  onClose: () => void
  theme?: 'light' | 'dark'
}

export function ContactForm({ translations: t, onClose, theme = 'dark' }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [honeypot, setHoneypot] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  
  // Rate limiting state
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number | null>(null)
  const submissionHistoryRef = useRef<number[]>([])
  const pruneIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Clean old submissions from history (keep last hour)
  useEffect(() => {
    const pruneHistory = () => {
      const oneHourAgo = Date.now() - 60 * 60 * 1000
      submissionHistoryRef.current = submissionHistoryRef.current.filter(
        time => time > oneHourAgo
      )
    }

    pruneHistory()
    pruneIntervalRef.current = setInterval(pruneHistory, 60000) // Check every minute

    return () => {
      if (pruneIntervalRef.current) {
        clearInterval(pruneIntervalRef.current)
        pruneIntervalRef.current = null
      }
    }
  }, [])

  const checkRateLimit = (): { allowed: boolean; message?: string } => {
    const now = Date.now()
    const oneHourAgo = now - 60 * 60 * 1000
    
    // Remove old submissions
    submissionHistoryRef.current = submissionHistoryRef.current.filter(
      time => time > oneHourAgo
    )

    // Limit: 3 submissions per hour per user
    if (submissionHistoryRef.current.length >= 3) {
      const timeUntilNext = Math.ceil(
        (submissionHistoryRef.current[0] + 60 * 60 * 1000 - now) / 60000
      )
      return {
        allowed: false,
        message: `Too many submissions. Please try again in ${timeUntilNext} minute(s).`
      }
    }

    // Minimum 30 seconds between submissions
    if (lastSubmissionTime && now - lastSubmissionTime < 30000) {
      return {
        allowed: false,
        message: "Please wait 30 seconds before submitting again."
      }
    }

    return { allowed: true }
  }

  const validateInputs = (): boolean => {
    // Name validation
    if (formData.name.trim().length < 2 || formData.name.trim().length > 100) {
      setErrorMessage("Name must be between 2 and 100 characters.")
      setStatus("error")
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.")
      setStatus("error")
      return false
    }

    // Subject validation
    if (formData.subject.trim().length < 3 || formData.subject.trim().length > 200) {
      setErrorMessage("Subject must be between 3 and 200 characters.")
      setStatus("error")
      return false
    }

    // Message validation
    if (formData.message.trim().length < 10 || formData.message.trim().length > 5000) {
      setErrorMessage("Message must be between 10 and 5000 characters.")
      setStatus("error")
      return false
    }

    // Check for suspicious patterns (basic spam detection)
    const spamPatterns = [
      /http[s]?:\/\//gi, // URLs
      /[A-Z]{10,}/g, // ALL CAPS
      /(.)\1{4,}/g, // Repeated characters (aaaaa)
      /(free|click here|buy now|limited time|act now)/gi, // Common spam words
    ]

    const messageLower = formData.message.toLowerCase()
    if (spamPatterns.some(pattern => pattern.test(messageLower))) {
      setErrorMessage("Message contains suspicious content. Please revise.")
      setStatus("error")
      return false
    }

    return true
  }

  const sanitizeInput = (input: string): string => {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove HTML brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .substring(0, 5000) // Max length
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Honeypot check - if filled, it's a bot
    if (honeypot) {
      setStatus("error")
      setErrorMessage("Invalid submission.")
      return
    }
    
    // Rate limiting check
    const rateLimitCheck = checkRateLimit()
    if (!rateLimitCheck.allowed) {
      setStatus("error")
      setErrorMessage(rateLimitCheck.message || t.error)
      return
    }

    // Input validation
    if (!validateInputs()) {
      return
    }

    setStatus("sending")
    setErrorMessage("")

    try {
      // Validate on server first
      const validateResponse = await fetch('/api/contact/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          message: formData.message,
        }),
      })

      if (!validateResponse.ok) {
        const error = await validateResponse.json()
        throw new Error(error.error || 'Validation failed')
      }

      // If validation passes, send email via EmailJS
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("Email service not configured. Please contact the site administrator.")
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: sanitizeInput(formData.name),
          from_email: sanitizeInput(formData.email),
          subject: sanitizeInput(formData.subject),
          message: sanitizeInput(formData.message),
          to_email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "your-email@example.com",
          timestamp: new Date().toISOString(),
          user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
        },
        publicKey
      )

      // Record successful submission
      submissionHistoryRef.current.push(Date.now())
      setLastSubmissionTime(Date.now())

      setStatus("success")
      // Reset form after success
      setTimeout(() => {
        setFormData({ name: "", email: "", subject: "", message: "" })
        setStatus("idle")
        onClose()
      }, 2000)
    } catch (error) {
      console.error("[ERROR] Email sending failed:", error)
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : t.error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "success" && (
        <div 
          className="flex items-center gap-2 p-3 rounded-md border"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)',
            borderColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)',
          }}
        >
          <CheckCircle2 
            className="h-5 w-5 flex-shrink-0"
            style={{ color: theme === 'dark' ? '#4ade80' : '#16a34a' }}
          />
          <p 
            className="text-sm"
            style={{ color: theme === 'dark' ? '#86efac' : '#15803d' }}
          >
            {t.success}
          </p>
        </div>
      )}

      {status === "error" && (
        <div 
          className="flex items-center gap-2 p-3 rounded-md border"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
            borderColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
          }}
        >
          <XCircle 
            className="h-5 w-5 flex-shrink-0"
            style={{ color: theme === 'dark' ? '#f87171' : '#dc2626' }}
          />
          <p 
            className="text-sm"
            style={{ color: theme === 'dark' ? '#fca5a5' : '#b91c1c' }}
          >
            {errorMessage || t.error}
          </p>
        </div>
      )}

      {/* Honeypot field - hidden from users */}
      <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
        <label htmlFor="website">Website (leave blank)</label>
        <input
          id="website"
          name="website"
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">{t.name}</Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder={t.namePlaceholder}
          required
          disabled={status === "sending"}
          className="border-2 border-black dark:border-white/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t.emailPlaceholder}
          required
          disabled={status === "sending"}
          className="border-2 border-black dark:border-white/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">{t.subject}</Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          placeholder={t.subjectPlaceholder}
          required
          disabled={status === "sending"}
          className="border-2 border-black dark:border-white/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t.message}</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={t.messagePlaceholder}
          required
          rows={5}
          disabled={status === "sending"}
          className="border-2 border-black dark:border-white/20 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={status === "sending" || status === "success"}
          className="flex-1 border-2 border-black dark:border-white/20 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg disabled:hover:scale-100 disabled:cursor-not-allowed group"
          style={{
            backgroundColor: status === "sending" || status === "success" 
              ? `rgb(var(--muted))` 
              : `rgb(var(--primary))`,
            color: theme === 'dark' ? 'rgb(0, 0, 0)' : undefined,
          }}
        >
          {status === "sending" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.sending}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
              {t.send}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={status === "sending"}
          className="border-2 border-black dark:border-white/20 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-lg disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {t.close}
        </Button>
      </div>
    </form>
  )
}

