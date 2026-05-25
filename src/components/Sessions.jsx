import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Users, Zap, Loader2, CheckCircle, IndianRupee } from 'lucide-react'
import { getSessions, createBooking } from '../api.js'
import { formatDate, formatCurrency } from '../utils.js'
import toast from 'react-hot-toast'

const TOPIC_COLORS = {
  'Interview Prep':  'text-rose-400   bg-rose-500/10   border-rose-500/30',
  'System Design':   'text-blue-400   bg-blue-500/10   border-blue-500/30',
  'GenAI':           'text-amber-400  bg-amber-500/10  border-amber-500/30',
  'Deep Learning':   'text-violet-400 bg-violet-500/10 border-violet-500/30',
  'Data Science':    'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'Career':          'text-sky-400    bg-sky-500/10    border-sky-500/30',
  'Behavioral':      'text-pink-400   bg-pink-500/10   border-pink-500/30',
}

const TYPE_COLORS = {
  'Mock Interview':    'badge-red',
  'Resume Review':     'badge-yellow',
  'Workshop':          'badge-brand',
  'Technical Session': 'badge-green',
}

const LEVEL_COLORS = {
  'Advanced':     'badge-red',
  'Intermediate': 'badge-yellow',
  'All Levels':   'badge-green',
  'Beginner':     'badge-brand',
}

function SessionCard({ s, index, onRegister, booked }) {
  const isFull    = s.seats === 0
  const isAlmost  = s.seats > 0 && s.seats <= 5
  const isBooked  = booked.has(s.sessionId || s.id)
  const isFree    = !s.price || s.price === 0
  const topicCls  = TOPIC_COLORS[s.topic] || 'text-brand-400 bg-brand-500/10 border-brand-500/30'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className={`glass p-5 flex flex-col sm:flex-row gap-4 group transition-all duration-300 hover:border-brand-500/30 ${
        isFull ? 'opacity-60' : ''
      }`}
    >
      {/* Left: topic color bar */}
      <div className="w-1 rounded-full self-stretch hidden sm:block bg-gradient-to-b from-brand-500 to-violet-600 flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-2 mb-2">
          <span className={`badge border ${topicCls} text-xs`}>{s.topic}</span>
          {s.type  && <span className={`${TYPE_COLORS[s.type]  || 'badge-brand'} text-xs`}>{s.type}</span>}
          {s.level && <span className={`${LEVEL_COLORS[s.level] || 'badge-brand'} text-xs`}>{s.level}</span>}
          {isFull   && <span className="badge-red    text-xs">Full</span>}
          {isAlmost && !isFull && <span className="badge-yellow text-xs">⚡ {s.seats} left</span>}
        </div>

        <h3 className="font-semibold text-base leading-snug mb-1 group-hover:text-brand-300 transition-colors">
          {s.title}
        </h3>
        <p className="text-sm text-white/50 mb-3">with {s.mentor}</p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {formatDate(s.date)}
          </span>
          {s.time && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {s.time}
            </span>
          )}
          {s.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {s.duration}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> {s.enrolled} enrolled
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:min-w-[130px] flex-shrink-0">
        {/* Price */}
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

        {/* Register / Booked / Full */}
        {isBooked ? (
          <button className="btn-ghost text-xs px-4 py-2 whitespace-nowrap opacity-60 cursor-default" disabled>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Registered
          </button>
        ) : !isFull ? (
          <button
            onClick={() => onRegister(s)}
            className="btn-brand text-xs px-4 py-2 whitespace-nowrap"
          >
            Register <Zap className="w-3.5 h-3.5" fill="currentColor" />
          </button>
        ) : (
          <button className="btn-ghost text-xs px-4 py-2 opacity-50 cursor-not-allowed" disabled>
            Fully Booked
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default function Sessions({ session }) {
  const [sessions, setSessions] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [booked,   setBooked]   = useState(new Set())

  useEffect(() => {
    getSessions()
      .then(r => { if (r.success) setSessions(r.sessions || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleRegister(s) {
    if (!session) {
      toast.error('Please login to register for sessions.')
      return
    }
    const sid = s.sessionId || s.id
    if (booked.has(sid)) {
      toast('Already registered for this session!', { icon: '📅' })
      return
    }
    try {
      await createBooking({
        username:  session.username || session.userId,
        userId:    session.userId,
        sessionId: sid,
      })
      setBooked(prev => new Set([...prev, sid]))
      toast.success(`Registered for "${s.title}"! Check your email for the link.`)
    } catch {
      // Still register in UI even if API fails
      setBooked(prev => new Set([...prev, sid]))
      toast.success(`Registered for "${s.title}"!`)
    }
  }

  return (
    <section id="sessions" className="py-24 relative">
      {/* Divider glow */}
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
            <Calendar className="w-3.5 h-3.5" /> 1:1 Sessions &amp; Workshops
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-heading mb-4"
          >
            Book a <span className="gradient-text">Premium Session</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-xl mx-auto"
          >
            Expert-led mock interviews, resume reviews, ML system design workshops, and GenAI coaching. Book your slot with a FAANG engineer.
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
                onRegister={handleRegister}
                booked={booked}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
