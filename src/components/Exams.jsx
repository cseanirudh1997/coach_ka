import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Clock, Monitor, Target, Loader2, ChevronRight } from 'lucide-react'
import { getExams } from '../api.js'

const EXAM_COLORS = {
  IELTS:  { bg: 'bg-blue-600/20   border-blue-600/30',   text: 'text-blue-400',   tag: 'badge text-xs border text-blue-400 bg-blue-500/10 border-blue-500/30'   },
  GRE:    { bg: 'bg-violet-600/20 border-violet-600/30', text: 'text-violet-400', tag: 'badge text-xs border text-violet-400 bg-violet-500/10 border-violet-500/30' },
  TOEFL:  { bg: 'bg-emerald-600/20 border-emerald-600/30', text: 'text-emerald-400', tag: 'badge text-xs border text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  GMAT:   { bg: 'bg-amber-600/20  border-amber-600/30',  text: 'text-amber-400',  tag: 'badge text-xs border text-amber-400 bg-amber-500/10 border-amber-500/30'  },
  PTE:    { bg: 'bg-pink-600/20   border-pink-600/30',   text: 'text-pink-400',   tag: 'badge text-xs border text-pink-400 bg-pink-500/10 border-pink-500/30'     },
  SAT:    { bg: 'bg-sky-600/20    border-sky-600/30',    text: 'text-sky-400',    tag: 'badge text-xs border text-sky-400 bg-sky-500/10 border-sky-500/30'        },
  DUOLINGO: { bg: 'bg-lime-600/20 border-lime-600/30',   text: 'text-lime-400',   tag: 'badge text-xs border text-lime-400 bg-lime-500/10 border-lime-500/30'     },
}

const EXAM_EMOJIS = {
  IELTS: '🎧', GRE: '📐', TOEFL: '🖥️', GMAT: '📊', PTE: '🎤', SAT: '📚', DUOLINGO: '🦉',
}

const EXAM_DESCRIPTIONS = {
  IELTS:    'Required for UK, Canada, Australia & most English-speaking universities.',
  GRE:      'Required for most MS/PhD programs in the US, Canada & Europe.',
  TOEFL:    'Accepted by 11,000+ universities; preferred for US institutions.',
  GMAT:     'Required for MBA programs globally. Tests analytical & verbal skills.',
  PTE:      'AI-scored English test accepted by Australian & UK universities.',
  SAT:      'Undergraduate admissions test for US universities.',
  DUOLINGO: 'Convenient online English test accepted by 3,500+ programs.',
}

function ExamCard({ exam, index }) {
  const title  = exam.title || exam.exam || 'Exam'
  const key    = title.split(' ')[0].toUpperCase()
  const colors = EXAM_COLORS[key] || EXAM_COLORS.IELTS
  const emoji  = EXAM_EMOJIS[key] || '📋'
  const desc   = EXAM_DESCRIPTIONS[key] || 'International standardized examination.'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className={`glass p-6 flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-300 border ${colors.bg} ${
        exam.featured ? 'shadow-brand' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          <div>
            <h3 className={`text-xl font-bold ${colors.text}`}>{title}</h3>
            {exam.featured && <span className="badge-brand text-xs mt-0.5">Popular</span>}
          </div>
        </div>
        {exam.scoreRange && (
          <div className="text-right flex-shrink-0">
            <div className="text-xs text-white/40">Score Range</div>
            <div className={`font-bold ${colors.text}`}>{exam.scoreRange}</div>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-white/60 leading-relaxed">{desc}</p>

      {/* Stats row */}
      <div className="flex flex-wrap gap-3">
        {exam.duration && (
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <Clock className="w-3.5 h-3.5 text-white/30" />
            {exam.duration}
          </div>
        )}
        {exam.mode && (
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <Monitor className="w-3.5 h-3.5 text-white/30" />
            {exam.mode}
          </div>
        )}
      </div>

      {/* CTA */}
      <button className={`mt-auto flex items-center gap-1 text-sm font-medium transition-colors group-hover:gap-2 ${colors.text}`}>
        Start Prep <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export default function Exams() {
  const [exams,   setExams]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getExams()
      .then(r => { if (r.success) setExams(r.data || r.exams || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Summary stats
  const stats = [
    { icon: Target,   label: 'Avg IELTS Band',      value: '7.5+',    sub: 'Our students achieve' },
    { icon: BookOpen, label: 'Mock Tests/Month',     value: '200+',    sub: 'Practice resources'  },
    { icon: Clock,    label: 'Avg Prep Time',        value: '6–8 wks', sub: 'To achieve target score' },
    { icon: Monitor,  label: 'Success Rate',         value: '91%',     sub: 'On first attempt'    },
  ]

  return (
    <section id="exams" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-950/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Heading */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-tag mb-4"
          >
            <BookOpen className="w-3.5 h-3.5" /> IELTS · GRE · TOEFL
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-heading mb-4"
          >
            Exam <span className="gradient-text">Preparation</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-xl mx-auto"
          >
            Expert coaching for IELTS, GRE, TOEFL, GMAT & more — tailored study plans, mock tests, and one-on-one mentoring.
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="glass p-4 text-center group hover:border-brand-500/40 transition-all"
            >
              <s.icon className="w-5 h-5 text-brand-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-white/60 mt-0.5 font-medium">{s.label}</div>
              <div className="text-xs text-white/30 mt-0.5">{s.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Exam cards */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-white/40">
            <Loader2 className="w-8 h-8 animate-spin mr-3" /> Loading exams…
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {exams.map((e, i) => (
              <ExamCard key={e.examId || e.title || i} exam={e} index={i} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a href="/signup" className="btn-brand inline-flex text-sm px-6 py-3">
            Start Free Diagnostic Test →
          </a>
          <p className="text-xs text-white/30 mt-3">No credit card required · Personalized study plan in 24 hrs</p>
        </motion.div>
      </div>
    </section>
  )
}
