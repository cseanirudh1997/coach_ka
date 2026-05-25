import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Video, Calendar, User, ExternalLink, Loader2, Bell, Send, ChevronRight, Clock } from 'lucide-react'
import { getWebinars } from '../api.js'
import { formatShortDate } from '../utils.js'
import toast from 'react-hot-toast'

function WebinarCard({ webinar, index, upcoming }) {
  const isPast = !upcoming

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className={`glass p-5 flex flex-col sm:flex-row gap-4 group hover:border-brand-500/30 transition-all duration-300 ${
        isPast ? 'opacity-70' : ''
      }`}
    >
      {/* Left: date pill */}
      <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center border ${
        upcoming
          ? 'bg-brand-600/20 border-brand-600/30'
          : 'bg-white/5 border-white/10'
      }`}>
        <Video className={`w-5 h-5 mb-0.5 ${upcoming ? 'text-brand-400' : 'text-white/30'}`} />
        <span className="text-xs text-white/40">{upcoming ? 'LIVE' : 'REC'}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          {upcoming && <span className="badge-brand text-xs animate-pulse">Upcoming</span>}
          {isPast  && <span className="badge text-xs bg-white/5 text-white/40 border border-white/10">Recorded</span>}
        </div>
        <h3 className="font-semibold text-base leading-snug group-hover:text-brand-300 transition-colors mb-1">
          {webinar.title}
        </h3>

        <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
          {webinar.speaker && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> {webinar.speaker}
            </span>
          )}
          {webinar.date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {formatShortDate(webinar.date)}
            </span>
          )}
          {webinar.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {webinar.duration}
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="flex sm:flex-col items-center sm:items-end justify-end gap-2 flex-shrink-0">
        {webinar.registrationLink && upcoming ? (
          <a
            href={webinar.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand text-xs px-4 py-2 whitespace-nowrap"
          >
            Register <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : isPast && webinar.registrationLink ? (
          <a
            href={webinar.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs px-4 py-2 whitespace-nowrap"
          >
            Watch <ChevronRight className="w-3.5 h-3.5" />
          </a>
        ) : null}
      </div>
    </motion.div>
  )
}

export default function Webinars() {
  const [webinars, setWebinars] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [tab,      setTab]      = useState('upcoming')
  const [email,    setEmail]    = useState('')
  const [subbed,   setSubbed]   = useState(false)

  useEffect(() => {
    getWebinars()
      .then(r => { if (r.success) setWebinars(r.data || r.webinars || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const now = Date.now()
  const upcoming = webinars.filter(w => !w.date || new Date(w.date).getTime() >= now)
  const past     = webinars.filter(w => w.date && new Date(w.date).getTime() < now)
  const visible  = tab === 'upcoming' ? upcoming : past

  function handleSubscribe(e) {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.')
      return
    }
    setSubbed(true)
    toast.success('Subscribed! You\'ll get webinar invites in your inbox 🎉')
  }

  return (
    <section id="webinars" className="py-24 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-brand-500/50 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-tag mb-4"
          >
            <Video className="w-3.5 h-3.5" /> Live &amp; Recorded
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-heading mb-4"
          >
            Study Abroad <span className="gradient-text">Webinars</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-xl mx-auto"
          >
            Free webinars on visa processes, country guides, IELTS tips, and university admissions — hosted by experts.
          </motion.p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { key: 'upcoming', label: `Upcoming (${upcoming.length})` },
            { key: 'past',     label: `Recorded (${past.length})`    },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab === t.key
                  ? 'bg-brand-600 text-white shadow-brand'
                  : 'glass text-white/60 hover:text-white hover:border-brand-500/30'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Webinar list */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-white/40">
            <Loader2 className="w-7 h-7 animate-spin mr-3" /> Loading webinars…
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            {tab === 'upcoming' ? 'No upcoming webinars scheduled. Check back soon!' : 'No recorded webinars yet.'}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {visible.map((w, i) => (
              <WebinarCard
                key={w.webinarId || w.title || i}
                webinar={w}
                index={i}
                upcoming={tab === 'upcoming'}
              />
            ))}
          </div>
        )}

        {/* Newsletter signup */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 glass p-6 rounded-2xl"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-600/30 flex items-center justify-center">
              <Bell className="w-5 h-5 text-brand-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-0.5">Get notified about upcoming webinars</h3>
              <p className="text-sm text-white/50">Join 8,000+ students who get study abroad tips every week.</p>
            </div>
            {subbed ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                ✓ You're subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="np-input text-sm flex-1 sm:w-52"
                  required
                />
                <button type="submit" className="btn-brand text-sm px-4 py-2 whitespace-nowrap">
                  <Send className="w-3.5 h-3.5" /> Subscribe
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
