import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Route, CheckCircle2, Circle, ChevronDown, Loader2, Globe } from 'lucide-react'
import { getRoadmaps, getRoadmapSteps } from '../api.js'

// Group steps by phase
function groupByPhase(steps) {
  const map = {}
  steps.forEach(step => {
    const phase = step.phase || `Phase ${step.week || '?'}`
    if (!map[phase]) map[phase] = []
    map[phase].push(step)
  })
  return Object.entries(map)
}

function StepNode({ step, index, isLast }) {
  const [open, setOpen] = useState(false)
  const isDone = step.completed ?? step.done ?? false

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="flex gap-4 sm:gap-6 relative"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[17px] top-10 bottom-0 w-px bg-gradient-to-b from-brand-500/40 to-transparent" />
      )}

      {/* Node */}
      <div className="flex-shrink-0 mt-1">
        {isDone ? (
          <div className="w-9 h-9 rounded-full bg-brand-600/30 border-2 border-brand-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-brand-400" />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-white/5 border-2 border-white/20 flex items-center justify-center">
            <Circle className="w-4 h-4 text-white/20" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <button
          onClick={() => setOpen(v => !v)}
          className={`w-full text-left glass p-4 rounded-xl group transition-all duration-200 hover:border-brand-500/30 ${
            isDone ? 'border-brand-500/20 bg-brand-600/5' : ''
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              {isDone && <span className="badge-brand text-xs mb-1 inline-block">Completed</span>}
              <h4 className={`font-semibold text-sm sm:text-base ${isDone ? 'text-brand-300' : 'text-white'}`}>
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
                exit={{ height: 0, opacity: 0 }}
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

function PhaseGroup({ phase, steps, phaseIndex }) {
  const doneInPhase = steps.filter(s => s.completed ?? s.done).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: phaseIndex * 0.08 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-600/20 border border-brand-600/30 text-xs font-semibold text-brand-300">
          {phase}
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-brand-600/30 to-transparent" />
        <span className="text-xs text-white/30">{doneInPhase}/{steps.length}</span>
      </div>

      <div className="flex flex-col pl-2">
        {steps.map((step, i) => (
          <StepNode
            key={step.stepId || step.id || i}
            step={step}
            index={i}
            isLast={i === steps.length - 1}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function Roadmap() {
  const [roadmaps,     setRoadmaps]     = useState([])
  const [activeRm,     setActiveRm]     = useState(null)
  const [steps,        setSteps]        = useState([])
  const [loadingRms,   setLoadingRms]   = useState(true)
  const [loadingSteps, setLoadingSteps] = useState(false)

  useEffect(() => {
    getRoadmaps()
      .then(r => {
        const list = r.data || r.roadmaps || []
        if (r.success && list.length) {
          setRoadmaps(list)
          setActiveRm(list[0])
        }
      })
      .catch(() => {})
      .finally(() => setLoadingRms(false))
  }, [])

  useEffect(() => {
    if (!activeRm) return
    setLoadingSteps(true)
    getRoadmapSteps({ roadmapId: activeRm.roadmapId || activeRm.id })
      .then(r => { if (r.success) setSteps(r.data || r.steps || []) })
      .catch(() => {})
      .finally(() => setLoadingSteps(false))
  }, [activeRm])

  const doneCount = steps.filter(s => s.completed ?? s.done).length
  const phases    = groupByPhase(steps)

  return (
    <section id="roadmap" className="py-24 relative overflow-hidden">
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
            <Route className="w-3.5 h-3.5" /> Admission Roadmap
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-heading mb-4"
          >
            Your Study Abroad <span className="gradient-text">Roadmap</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-lg mx-auto"
          >
            Phase-by-phase guidance built by our counselors — from choosing a country to landing your student visa.
          </motion.p>
        </div>

        {/* Roadmap selector */}
        {!loadingRms && roadmaps.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {roadmaps.map(rm => {
              const rid   = rm.roadmapId || rm.id
              const label = rm.title || rm.role || 'Roadmap'
              return (
                <button
                  key={rid}
                  onClick={() => setActiveRm(rm)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    (activeRm?.roadmapId || activeRm?.id) === rid
                      ? 'bg-brand-600 text-white shadow-brand'
                      : 'glass text-white/60 hover:text-white hover:border-brand-500/30'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 inline mr-1.5 opacity-70" />
                  {label}
                </button>
              )
            })}
          </div>
        )}

        {/* Progress bar */}
        {steps.length > 0 && (
          <div className="glass p-4 rounded-xl mb-8 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
                <span>Overall Progress — {activeRm?.title}</span>
                <span className="font-medium text-brand-400">{doneCount}/{steps.length} steps</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${steps.length > 0 ? (doneCount / steps.length) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="text-2xl font-bold gradient-text text-right">
              {steps.length > 0 ? Math.round((doneCount / steps.length) * 100) : 0}%
            </div>
          </div>
        )}

        {/* Phases + Steps */}
        {loadingSteps ? (
          <div className="flex items-center justify-center py-20 text-white/40">
            <Loader2 className="w-7 h-7 animate-spin mr-3" /> Loading roadmap…
          </div>
        ) : (
          <div className="flex flex-col">
            {phases.map(([phase, phaseSteps], idx) => (
              <PhaseGroup
                key={phase}
                phase={phase}
                steps={phaseSteps}
                phaseIndex={idx}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
