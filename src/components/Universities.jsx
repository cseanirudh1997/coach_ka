import React, { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Search, Loader2, Award, TrendingUp, ChevronRight } from 'lucide-react'
import { getUniversities } from '../api.js'
import { countryFlag } from '../utils.js'

function UniversityCard({ uni, index }) {
  const name    = uni.name || uni.universityName || 'University'
  const country = uni.country || ''
  const flag    = countryFlag(country)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className={`glass p-5 flex flex-col gap-4 group hover:border-brand-500/40 transition-all duration-300 hover:-translate-y-0.5 relative ${
        uni.featured ? 'border-brand-500/30' : ''
      }`}
    >
      {uni.featured && (
        <div className="absolute top-3 right-3">
          <span className="badge-brand text-xs">Featured</span>
        </div>
      )}

      {/* Rank badge */}
      {uni.ranking && (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-600/30 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-xs text-white/40">QS Ranking</div>
            <div className="text-lg font-bold text-amber-400">#{uni.ranking}</div>
          </div>
        </div>
      )}

      {/* Name + Country */}
      <div>
        <h3 className="font-bold text-base leading-snug group-hover:text-brand-300 transition-colors mb-1">
          {name}
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-white/50">
          <span>{flag}</span>
          <span>{country}</span>
        </div>
      </div>

      {/* Tuition */}
      {uni.tuitionRange && (
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
          <span className="text-white/60">Tuition: </span>
          <span className="font-medium text-white/80">{uni.tuitionRange}</span>
        </div>
      )}

      <button className="mt-auto flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors font-medium group-hover:gap-2">
        View Programs <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  )
}

export default function Universities() {
  const [universities, setUniversities] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [country,      setCountry]      = useState('All')

  useEffect(() => {
    getUniversities()
      .then(r => { if (r.success) setUniversities(r.data || r.universities || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const countries = useMemo(() => {
    const set = new Set(universities.map(u => u.country).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [universities])

  const visible = useMemo(() => {
    let list = universities
    if (country !== 'All') list = list.filter(u => u.country === country)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(u =>
        (u.name || '').toLowerCase().includes(q) ||
        (u.country || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [universities, country, search])

  return (
    <section id="universities" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-tag mb-4"
          >
            <GraduationCap className="w-3.5 h-3.5" /> Partner Universities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-heading mb-4"
          >
            Top-Ranked{' '}
            <span className="gradient-text">Partner Universities</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-xl mx-auto"
          >
            Browse 500+ universities across 8 countries — filter by destination and find the right fit for your profile.
          </motion.p>
        </div>

        {/* Search + Country Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search universities…"
              className="np-input pl-10"
            />
          </div>
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            className="np-input sm:w-48"
          >
            {countries.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Countries' : c}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-center text-sm text-white/30 mb-8">
            Showing {visible.length} universit{visible.length !== 1 ? 'ies' : 'y'}
            {country !== 'All' && ` in ${country}`}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-white/40">
            <Loader2 className="w-8 h-8 animate-spin mr-3" /> Loading universities…
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-16 text-white/30">No universities match your search.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visible.map((u, i) => (
              <UniversityCard key={u.universityId || u.name || i} uni={u} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
