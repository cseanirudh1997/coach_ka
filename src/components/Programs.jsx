import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Clock, Sparkles, CheckCircle, Loader2, Star, Tag } from 'lucide-react'
import { getPrograms } from '../api.js'
import { formatCurrency } from '../utils.js'
import BookingModal from './BookingModal.jsx'

const CATEGORY_ICONS = {
  'Visa Consulting':    '🛂',
  'IELTS Coaching':     '🎧',
  'GRE Coaching':       '📐',
  'Admissions':         '🎓',
  'SOP & LOR':          '✍️',
  'Scholarship':        '🏆',
  'University Shortlist': '🔍',
}

const CATEGORY_COLORS = {
  'Visa Consulting':    'text-blue-400   bg-blue-500/10   border-blue-500/30',
  'IELTS Coaching':     'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'GRE Coaching':       'text-violet-400 bg-violet-500/10 border-violet-500/30',
  'Admissions':         'text-amber-400  bg-amber-500/10  border-amber-500/30',
  'SOP & LOR':          'text-pink-400   bg-pink-500/10   border-pink-500/30',
  'Scholarship':        'text-sky-400    bg-sky-500/10    border-sky-500/30',
  'University Shortlist': 'text-rose-400 bg-rose-500/10  border-rose-500/30',
}

function ProgramCard({ program, index, onEnroll }) {
  const pid      = program.programId || program.id
  const catKey   = program.category || ''
  const catColor = CATEGORY_COLORS[catKey] || 'text-brand-400 bg-brand-500/10 border-brand-500/30'
  const emoji    = CATEGORY_ICONS[catKey] || '📋'

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`glass p-6 flex flex-col gap-5 group hover:border-brand-500/40 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${
        program.featured ? 'border-brand-500/30 shadow-brand' : ''
      }`}
    >
      {program.featured && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 to-violet-600/5 pointer-events-none rounded-2xl" />
      )}

      {/* Top badges */}
      <div className="flex items-start justify-between gap-2">
        {program.category && (
          <span className={`badge border text-xs ${catColor}`}>
            {program.category}
          </span>
        )}
        {program.featured && (
          <span className="badge-brand text-xs ml-auto flex-shrink-0 flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> Most Popular
          </span>
        )}
      </div>

      {/* Emoji + Title */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-brand-600/20 border border-brand-600/30 flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-brand-600/30 transition-colors">
          {emoji}
        </div>
        <div>
          <h3 className="font-bold text-lg leading-snug">{program.title}</h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-white/50">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {program.duration || '—'}
            </span>
            {program.featured && (
              <span className="flex items-center gap-1 text-brand-400">
                <Sparkles className="w-3.5 h-3.5" /> Recommended
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {program.description && (
        <p className="text-sm text-white/60 leading-relaxed">{program.description}</p>
      )}

      {/* Highlights */}
      <ul className="flex flex-col gap-2">
        {(program.highlights || []).map(h => (
          <li key={h} className="flex items-start gap-2 text-sm text-white/70">
            <CheckCircle className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
            {h}
          </li>
        ))}
      </ul>

      {/* Price + CTA */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
        <div>
          <div className="text-2xl font-bold gradient-text">{formatCurrency(program.price)}</div>
          <div className="flex items-center gap-1 text-xs text-white/40 mt-0.5">
            <Tag className="w-3 h-3" /> EMI available
          </div>
        </div>
        <button
          onClick={() => onEnroll({ ...program, programId: pid })}
          className={program.featured ? 'btn-brand text-sm px-5 py-2.5' : 'btn-ghost text-sm px-5 py-2.5'}
        >
          Enroll Now <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export default function Programs({ session }) {
  const [programs,  setPrograms]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [enrolling, setEnrolling] = useState(null)

  useEffect(() => {
    getPrograms()
      .then(r => { if (r.success) setPrograms(r.data || r.programs || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="programs" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-tag mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" /> Consulting Packages
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-heading mb-4"
          >
            Study Abroad{' '}
            <span className="gradient-text">Consulting Packages</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-xl mx-auto text-balance"
          >
            End-to-end support packages for visa consulting, IELTS/GRE coaching, university admissions, SOP writing, and scholarship assistance.
          </motion.p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-white/40">
            <Loader2 className="w-8 h-8 animate-spin mr-3" /> Loading packages…
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {programs.map((p, i) => (
              <ProgramCard
                key={p.programId || p.id || i}
                program={p}
                index={i}
                onEnroll={setEnrolling}
              />
            ))}
          </div>
        )}
      </div>

      {enrolling && (
        <BookingModal
          program={enrolling}
          session={session}
          onClose={() => setEnrolling(null)}
        />
      )}
    </section>
  )
}
