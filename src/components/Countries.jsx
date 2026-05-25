import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Loader2, Briefcase, DollarSign, Filter } from 'lucide-react'
import { getCountries } from '../api.js'
import { visaDifficultyColor, countryFlag } from '../utils.js'

const DIFFICULTY_FILTERS = ['All', 'Easy', 'Moderate', 'Hard']

const COUNTRY_HIGHLIGHTS = {
  Canada:           { highlights: ['Work Permit Post-Study', 'PR Pathway', 'Top QS Universities'] },
  'United Kingdom': { highlights: ['PSW Visa 2 Years', 'World-Class Research', 'Diverse Cities'] },
  Australia:        { highlights: ['485 Grad Visa', 'High Living Standards', 'Strong Job Market'] },
  Germany:          { highlights: ['Free/Low Tuition', 'Work in EU', 'Engineering Hub'] },
  'United States':  { highlights: ['OPT 3 Years STEM', 'Top-Ranked Universities', 'Research Opportunities'] },
  Ireland:          { highlights: ['Stamp 1G Permit', 'EU Gateway', 'Tech Hub - Dublin'] },
  Netherlands:      { highlights: ['Orientation Year', 'English Programs', 'Central EU Location'] },
  'New Zealand':    { highlights: ['PGWP 3 Years', 'Safe Environment', 'Nature & Adventure'] },
}

function CountryCard({ item, index }) {
  const name       = item.country || item.name || 'Unknown'
  const flag       = item.flag || countryFlag(name)
  const difficulty = item.visaDifficulty || 'Moderate'
  const diffCls    = visaDifficultyColor(difficulty)
  const highlights = COUNTRY_HIGHLIGHTS[name]?.highlights || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      className={`glass p-6 flex flex-col gap-4 group hover:border-brand-500/40 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${
        item.featured ? 'border-brand-500/30 shadow-brand' : ''
      }`}
    >
      {item.featured && (
        <div className="absolute top-3 right-3">
          <span className="badge-brand text-xs">⭐ Popular</span>
        </div>
      )}

      {/* Flag + Country name */}
      <div className="flex items-center gap-3">
        <span className="text-4xl">{flag}</span>
        <div>
          <h3 className="font-bold text-lg leading-tight">{name}</h3>
          <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border mt-1 ${diffCls}`}>
            Visa: {difficulty}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {item.avgCost && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-7 h-7 rounded-lg bg-brand-600/20 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-3.5 h-3.5 text-brand-400" />
            </div>
            <div>
              <div className="text-xs text-white/40">Avg. Cost / yr</div>
              <div className="font-semibold text-white/80 text-xs">{item.avgCost}</div>
            </div>
          </div>
        )}
        {item.workPermit !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-7 h-7 rounded-lg bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs text-white/40">Work Permit</div>
              <div className={`font-semibold text-xs ${item.workPermit ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.workPermit ? 'Available' : 'Limited'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {highlights.map(h => (
            <li key={h} className="flex items-center gap-2 text-xs text-white/60">
              <span className="w-1 h-1 rounded-full bg-brand-400 flex-shrink-0" />
              {h}
            </li>
          ))}
        </ul>
      )}

      <button className="mt-auto text-sm text-brand-400 hover:text-brand-300 transition-colors self-start font-medium flex items-center gap-1 group-hover:gap-2">
        Explore Visas →
      </button>
    </motion.div>
  )
}

export default function Countries() {
  const [countries, setCountries] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [filter,    setFilter]    = useState('All')

  useEffect(() => {
    getCountries()
      .then(r => { if (r.success) setCountries(r.data || r.countries || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const visible = filter === 'All'
    ? countries
    : countries.filter(c => (c.visaDifficulty || '').toLowerCase() === filter.toLowerCase())

  return (
    <section id="countries" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-brand-500/50 to-transparent" />
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
            <Globe className="w-3.5 h-3.5" /> Destinations
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-heading mb-4"
          >
            Study Abroad{' '}
            <span className="gradient-text">Destinations</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-xl mx-auto text-balance"
          >
            Explore top study destinations — compare visa difficulty, costs, work permit options, and post-study opportunities.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <Filter className="w-4 h-4 text-white/30" />
          {DIFFICULTY_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === f
                  ? 'bg-brand-600 text-white shadow-brand'
                  : 'glass text-white/60 hover:text-white hover:border-brand-500/30'
              }`}
            >
              {f === 'All' ? 'All Destinations' : `${f} Visa`}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-white/40">
            <Loader2 className="w-8 h-8 animate-spin mr-3" /> Loading destinations…
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-16 text-white/30">No destinations match this filter.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visible.map((c, i) => (
              <CountryCard key={c.countryId || c.country || i} item={c} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
