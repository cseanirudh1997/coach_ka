import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Users, Zap, Loader2, CheckCircle, IndianRupee } from 'lucide-react'
import { getSessions, createBooking } from '../api.js'
import { formatCurrency } from '../utils.js'
import toast from 'react-hot-toast'

const TYPE_COLORS = {
  'Visa Consultation':   'text-blue-400   bg-blue-500/10   border-blue-500/30',
  'IELTS Coaching':      'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'GRE Coaching':        'text-violet-400 bg-violet-500/10 border-violet-500/30',
  'Admissions Counseling': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  'SOP Review':          'text-pink-400   bg-pink-500/10   border-pink-500/30',
  'Interview Prep':      'text-sky-400    bg-sky-500/10    border-sky-500/30',
  'Mock Visa Interview': 'text-rose-400   bg-rose-500/10   border-rose-500/30',
}

function SessionCard({ s, index, onBook, booked }) {
  const sid     = s.sessionId || s.id
  const isBooked = booked.has(sid)
  const isFree   = !s.price || s.price === 0
  const typeCls  = TYPE_COLORS[s.type] || 'text-brand-400 bg-brand-500/10 border-brand-500/30'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="glass p-5 flex flex-col sm:flex-row gap-4 group transition-all duration-300 hover:border-brand-500/30"
    >
      {/* Left color bar */}
      <div className="w-1 rounded-full self-stretch hidden sm:block bg-gradient-to-b from-brand-500 to-violet-600 flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-2 mb-2">
          {s.type && (
            <span className={`badge border text-xs ${typeCls}`}>{s.type}</span>
          )}
          {s.featured && <span className="badge-brand text-xs">⭐ Popular</span>}
        </div>

        <h3 className="font-semibold text-base leading-snug mb-1 group-hover:text-brand-300 transition-colors">
          {s.title}
        </h3>
        {s.mentor && (
          <p className="text-sm text-white/50 mb-2">with {s.mentor}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
          {s.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {s.duration}
            </span>
          )}
          {s.mode && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {s.mode}
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:min-w-[130px] flex-shrink-0">
        <div className="text-right">
          {isFree ? (
            <span className="badge-green text-xs">Free</span>
          ) : (
            <div className="flex items-center gap-0.5 text-brand-300 font-bold text-sm">
              <IndianRupee className="w-3.5 h-3.5" />
              {(s.price || 0).toLocaleString('en-IN')}
            </div>
          )}
        </div>

        {isBooked ? (
          <button className="btn-ghost text-xs px-4 py-2 whitespace-nowrap opacity-60 cursor-default" disabled>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Booked
          </button>
        ) : (
          <button
            onClick={() => onBook(s)}
            className="btn-brand text-xs px-4 py-2 whitespace-nowrap"
          >
            Book Session <Zap className="w-3.5 h-3.5" fill="currentColor" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

// Inline booking form for counseling sessions
function QuickBookForm({ session: userSession, s, onClose, onSuccess }) {
  const [form,    setForm]    = useState({ preferredDate: '', preferredTime: '', notes: '' })
  const [loading, setLoading] = useState(false)

  const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM',
  ]

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.preferredDate || !form.preferredTime) {
      toast.error('Please select a date and time slot.')
      return
    }
    setLoading(true)
    try {
      const res = await createBooking({
        username:      userSession.username,
        sessionId:     s.sessionId || s.id,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        notes:         form.notes,
      })
      if (res.success) {
        toast.success(`"${s.title}" booked! You'll receive a confirmation shortly.`)
        onSuccess(s.sessionId || s.id)
      } else {
        toast.error(res.message || 'Booking failed. Please try again.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-heavy w-full max-w-sm rounded-2xl overflow-hidden"
      >
        <div className="h-1 bg-gradient-to-r from-brand-600 via-violet-400 to-brand-600" />
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-bold text-lg">Book Session</h3>
              <p className="text-sm text-white/50 mt-0.5">{s.title}</p>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-lg leading-none">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Preferred Date *</label>
              <input
                type="date"
                min={today}
                value={form.preferredDate}
                onChange={e => setForm(f => ({ ...f, preferredDate: e.target.value }))}
                className="np-input"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-2">Preferred Time *</label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, preferredTime: t }))}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      form.preferredTime === t
                        ? 'bg-brand-600 border-brand-500 text-white'
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-brand-500/40'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">Notes (optional)</label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Any specific questions or concerns…"
                className="np-input resize-none text-sm"
                rows={2}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-brand py-3 text-sm mt-1">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking…</>
                : <><Calendar className="w-4 h-4" /> Confirm Booking</>
              }
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default function Sessions({ session }) {
  const [sessions, setSessions] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [booked,   setBooked]   = useState(new Set())
  const [booking,  setBooking]  = useState(null)   // session being booked

  useEffect(() => {
    getSessions()
      .then(r => { if (r.success) setSessions(r.data || r.sessions || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleBook(s) {
    if (!session) {
      toast.error('Please login to book a counseling session.')
      return
    }
    setBooking(s)
  }

  function handleBookSuccess(sid) {
    setBooked(prev => new Set([...prev, sid]))
    setBooking(null)
  }

  return (
    <section id="sessions" className="py-24 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-brand-500/50 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-tag mb-4"
          >
            <Calendar className="w-3.5 h-3.5" /> 1:1 Counseling Sessions
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-heading mb-4"
          >
            Book a <span className="gradient-text">Counseling Session</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-xl mx-auto"
          >
            Expert-led visa consultations, IELTS coaching, admissions counseling, and SOP reviews.
            Book a slot with a certified study abroad counselor.
          </motion.p>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-white/40">
            <Loader2 className="w-7 h-7 animate-spin mr-3" /> Loading sessions…
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sessions.map((s, i) => (
              <SessionCard
                key={s.sessionId || s.id || i}
                s={s}
                index={i}
                onBook={handleBook}
                booked={booked}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick booking modal */}
      {booking && session && (
        <QuickBookForm
          session={session}
          s={booking}
          onClose={() => setBooking(null)}
          onSuccess={handleBookSuccess}
        />
      )}
    </section>
  )
}
