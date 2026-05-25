import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { getTestimonials } from '../api.js'
import { initials } from '../utils.js'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`}
        />
      ))}
    </div>
  )
}

function TestimonialCard({ t }) {
  // Backend fields: name | company | review | rating
  // Support legacy fields (quote/role) as fallback for graceful degradation
  const displayName    = t.name    || 'Anonymous'
  const displayCompany = t.company || t.role || ''
  const displayReview  = t.review  || t.quote || ''
  const displayRating  = t.rating  || 5

  return (
    <div className="glass p-6 flex flex-col gap-4 h-full min-w-[300px] max-w-sm mx-4 flex-shrink-0 hover:border-brand-500/30 transition-all duration-300">
      <Quote className="w-8 h-8 text-brand-500/40 flex-shrink-0" />
      <p className="text-white/70 text-sm leading-relaxed flex-1">"{displayReview}"</p>
      <div className="flex items-center gap-3 pt-3 border-t border-white/10">
        {/* Avatar — initials */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-violet-700 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
          {initials(displayName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{displayName}</div>
          {displayCompany && (
            <div className="text-xs text-white/50 truncate">{displayCompany}</div>
          )}
        </div>
        <StarRating rating={displayRating} />
      </div>
    </div>
  )
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading,      setLoading]      = useState(true)
  const trackRef = useRef(null)

  useEffect(() => {
    getTestimonials()
      .then(r => { if (r.success) setTestimonials(r.testimonials || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function scroll(dir) {
    if (!trackRef.current) return
    const card = trackRef.current.querySelector('[data-card]')
    const w = (card?.offsetWidth || 300) + 32
    trackRef.current.scrollBy({ left: dir * w, behavior: 'smooth' })
  }

  const looped = [...testimonials, ...testimonials]

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-tag mb-4"
          >
            <Star className="w-3.5 h-3.5 fill-current" /> Success Stories
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-heading mb-4"
          >
            Engineers Who <span className="gradient-text">Made It to FAANG</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-lg mx-auto"
          >
            Real results from real engineers. Join 1,200+ AI professionals who transformed their careers with NeuralPath.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-white/40">
            <Loader2 className="w-7 h-7 animate-spin mr-3" /> Loading success stories…
          </div>
        ) : (
          <>
            {/* Carousel */}
            <div className="relative">
              {/* Fade masks */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-surface-950 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-surface-950 to-transparent z-10 pointer-events-none" />

              <div
                ref={trackRef}
                className="flex overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {looped.map((t, i) => (
                  <div key={`${t.id || i}-${i}`} className="snap-start flex-shrink-0" data-card>
                    <TestimonialCard t={t} />
                  </div>
                ))}
              </div>
            </div>

            {/* Nav buttons */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => scroll(-1)}
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:border-brand-500/40 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-white/60" />
              </button>
              <button
                onClick={() => scroll(1)}
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:border-brand-500/40 transition-all"
              >
                <ChevronRight className="w-5 h-5 text-white/60" />
              </button>
            </div>
          </>
        )}

        {/* Aggregate rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 glass p-6 rounded-2xl max-w-lg mx-auto"
        >
          <div className="text-center">
            <div className="text-5xl font-bold gradient-text">4.9</div>
            <div className="flex justify-center mt-1 mb-1"><StarRating rating={5} /></div>
            <div className="text-xs text-white/40">Overall Rating</div>
          </div>
          <div className="w-px h-16 bg-white/10 hidden sm:block" />
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">1,284</div>
              <div className="text-xs text-white/40">Engineers Placed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">94%</div>
              <div className="text-xs text-white/40">Placement Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">3.2x</div>
              <div className="text-xs text-white/40">Avg Salary Hike</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-xs text-white/40">Partner Companies</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
