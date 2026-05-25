import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileCheck, ChevronDown, Loader2, Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import { getVisaGuides } from '../api.js'
import { countryFlag } from '../utils.js'

const VISA_STEPS = [
  { step: 1, title: 'University Admission',     desc: 'Get your offer letter / CAS from an accredited institution.',           icon: '🎓' },
  { step: 2, title: 'Financial Documentation',  desc: 'Show proof of funds: bank statements, sponsor letter, scholarships.', icon: '💰' },
  { step: 3, title: 'Visa Application',         desc: 'Submit online application, biometrics, and attend the VFS/embassy.',  icon: '📋' },
  { step: 4, title: 'Visa Approval & Travel',   desc: 'Receive vignette/COS, book flights, arrange pre-departure docs.',     icon: '✈️' },
]

function GuideCard({ guide, index }) {
  const [open, setOpen] = useState(false)
  const country         = guide.country || 'Country'
  const flag            = countryFlag(country)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="glass rounded-xl overflow-hidden group"
    >
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{flag}</span>
          <div>
            <h3 className="font-semibold text-base group-hover:text-brand-300 transition-colors">
              {country} Student Visa
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              {guide.processingTime && (
                <span className="flex items-center gap-1 text-xs text-white/40">
                  <Clock className="w-3 h-3" /> {guide.processingTime}
                </span>
              )}
              {guide.successRate && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <TrendingUp className="w-3 h-3" /> {guide.successRate} success rate
                </span>
              )}
            </div>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-white/40 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/10">
              {guide.notes ? (
                <div className="mt-4 p-4 rounded-xl bg-brand-600/5 border border-brand-600/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-white/70 leading-relaxed">{guide.notes}</p>
                  </div>
                </div>
              ) : null}

              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {[
                  'Ensure passport validity (6+ months beyond study period)',
                  'Enroll in OSHC / student health insurance',
                  'Attend visa appointment on time with all originals',
                  'Keep digital copies of all documents uploaded',
                ].map(tip => (
                  <div key={tip} className="flex items-start gap-2 text-xs text-white/60">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-400 flex-shrink-0 mt-0.5" />
                    {tip}
                  </div>
                ))}
              </div>

              <button className="mt-4 btn-ghost text-xs px-4 py-2">
                Book Free Visa Consultation →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function VisaGuides() {
  const [guides,  setGuides]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getVisaGuides()
      .then(r => { if (r.success) setGuides(r.data || r.guides || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="visa" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-brand-500/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-950/10 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Heading */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-tag mb-4"
          >
            <FileCheck className="w-3.5 h-3.5" /> Visa Guidance
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-heading mb-4"
          >
            Student Visa{' '}
            <span className="gradient-text">Guides</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-xl mx-auto"
          >
            Country-specific visa guides with processing times, success rates, and expert tips from our 94% visa approval track record.
          </motion.p>
        </div>

        {/* 4-Step Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="glass p-6 rounded-2xl mb-12"
        >
          <h3 className="font-semibold text-center mb-6 text-white/80">How the Visa Process Works</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VISA_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex flex-col items-center text-center gap-3 p-4"
              >
                {/* Step number + connector */}
                <div className="relative flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-brand-600/20 border-2 border-brand-500/40 flex items-center justify-center text-xl">
                    {step.icon}
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                </div>
                <h4 className="font-semibold text-sm text-white/90">{step.title}</h4>
                <p className="text-xs text-white/50 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Country guides */}
        <div className="mb-8">
          <h3 className="font-semibold text-white/70 text-sm mb-4 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-brand-400" />
            Country-Specific Visa Guides
          </h3>
          {loading ? (
            <div className="flex items-center justify-center py-20 text-white/40">
              <Loader2 className="w-7 h-7 animate-spin mr-3" /> Loading visa guides…
            </div>
          ) : guides.length === 0 ? (
            <div className="text-center py-16 text-white/30">No visa guides available yet.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {guides.map((g, i) => (
                <GuideCard key={g.guideId || g.country || i} guide={g} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass p-6 rounded-2xl text-center border-brand-500/20"
        >
          <h3 className="font-bold text-lg mb-2">Need personalised visa guidance?</h3>
          <p className="text-white/50 text-sm mb-4">
            Our visa counselors have a 94% approval rate. Book a free 30-minute consultation.
          </p>
          <a href="/signup" className="btn-brand inline-flex text-sm px-6 py-3">
            Book Free Visa Consultation →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
