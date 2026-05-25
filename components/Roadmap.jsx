import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Map, CheckCircle2, Circle, Lock, ChevronDown, Loader2 } from 'lucide-react'
import { getRoadmaps, getRoadmapSteps } from '../api.js'

function StepNode({ step, index, isLast }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="flex gap-4 sm:gap-6 relative"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[17px] top-10 bottom-0 w-px bg-gradient-to-b from-brand-500/40 to-transparent" />
      )}

      {/* Node */}
      <div className="flex-shrink-0 mt-1">
        {step.done ? (
          <div className="w-9 h-9 rounded-full bg-brand-600/30 border-2 border-brand-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-brand-400" />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-white/5 border-2 border-white/20 flex items-center justify-center">
            <span className="text-xs font-bold text-white/40">{step.week}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <button
          onClick={() => setOpen(v => !v)}
          className={`w-full text-left glass p-4 rounded-xl group transition-all duration-200 hover:border-brand-500/30 ${
            step.done ? 'border-brand-500/20 bg-brand-600/5' : ''
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs text-white/40 font-medium">Week {step.week}</span>
                {step.done && <span className="badge-brand text-xs">Completed</span>}
              </div>
              <h4 className={`font-semibold text-sm sm:text-base ${step.done ? 'text-brand-300' : 'text-white'}`}>
                {step.title}
              </h4>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-white/40 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{   height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/10">
                  {(step.topics || []).map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-white/60">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  )
}

export default function Roadmap() {
  const [roadmaps,    setRoadmaps]    = useState([])
  const [activeRm,    setActiveRm]    = useState(null)
  const [steps,       setSteps]       = useState([])
  const [loadingRms,  setLoadingRms]  = useState(true)
  const [loadingSteps,setLoadingSteps]= useState(false)

  useEffect(() => {
    getRoadmaps()
      .then(r => {
        if (r.success && r.roadmaps?.length) {
          setRoadmaps(r.roadmaps)
          setActiveRm(r.roadmaps[0])
        }
      })
      .catch(() => {})
      .finally(() => setLoadingRms(false))
  }, [])

  useEffect(() => {
    if (!activeRm) return
    setLoadingSteps(true)
    getRoadmapSteps({ roadmapId: activeRm.id })
      .then(r => { if (r.success) setSteps(r.steps || []) })
      .catch(() => {})
      .finally(() => setLoadingSteps(false))
  }, [activeRm])

  const doneCount = steps.filter(s => s.done).length

  return (
    <section id="roadmap" className="py-24 relative overflow-hidden">
      {/* BG accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-950/20 to-transparent pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-tag mb-4"
          >
            <Map className="w-3.5 h-3.5" /> Learning Roadmap
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-heading mb-4"
          >
            Your Structured <span className="gradient-text">Path to Success</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-lg mx-auto"
          >
            A week-by-week curriculum designed to take you from foundations to job-ready in record time.
          </motion.p>
        </div>

        {/* Roadmap selector */}
        {!loadingRms && roadmaps.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {roadmaps.map(rm => (
              <button
                key={rm.id}
                onClick={() => setActiveRm(rm)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeRm?.id === rm.id
                    ? 'bg-brand-600 text-white shadow-brand'
                    : 'glass text-white/60 hover:text-white hover:border-brand-500/30'
                }`}
              >
                {rm.title} ({rm.weeks}W)
              </button>
            ))}
          </div>
        )}

        {/* Progress bar */}
        {steps.length > 0 && (
          <div className="glass p-4 rounded-xl mb-8 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
                <span>Overall Progress</span>
                <span className="font-medium text-brand-400">{doneCount}/{steps.length} weeks</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
              </div>
            </div>
            <div className="text-2xl font-bold gradient-text text-right">
              {Math.round((doneCount / steps.length) * 100)}%
            </div>
          </div>
        )}

        {/* Steps */}
        {loadingSteps ? (
          <div className="flex items-center justify-center py-20 text-white/40">
            <Loader2 className="w-7 h-7 animate-spin mr-3" /> Loading roadmap…
          </div>
        ) : (
          <div className="flex flex-col">
            {steps.map((step, i) => (
              <StepNode key={step.id} step={step} index={i} isLast={i === steps.length - 1} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
