import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, FileText, Video, Download, Loader2, Filter } from 'lucide-react'
import { getMentorResources } from '../api.js'

const TYPE_ICONS = {
  PDF:   <FileText className="w-4 h-4 text-rose-400"    />,
  Video: <Video    className="w-4 h-4 text-blue-400"    />,
  DOCX:  <FileText className="w-4 h-4 text-sky-400"     />,
  PPT:   <FileText className="w-4 h-4 text-orange-400"  />,
}

const CATEGORIES = ['All', 'Interview Prep', 'GenAI', 'System Design', 'Coding', 'Career', 'Data Science']

function ResourceCard({ resource, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="glass p-5 flex items-start gap-4 group hover:border-brand-500/30 hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-brand-500/30 transition-colors">
        {TYPE_ICONS[resource.type] || <BookOpen className="w-4 h-4 text-white/40" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-white/40 mb-1">{resource.category}</div>
        <h4 className="font-semibold text-sm leading-snug truncate group-hover:text-brand-300 transition-colors">
          {resource.title}
        </h4>
        <div className="flex items-center gap-3 mt-1 text-xs text-white/30">
          <span>{resource.type}</span>
          {resource.size && <span>{resource.size}</span>}
        </div>
      </div>

      {/* Download */}
      <a
        href={resource.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-600/20 border border-brand-600/30 flex items-center justify-center hover:bg-brand-600/40 transition-colors"
        onClick={e => resource.url === '#' && e.preventDefault()}
        title={`Download ${resource.title}`}
      >
        <Download className="w-3.5 h-3.5 text-brand-400" />
      </a>
    </motion.div>
  )
}

export default function Resources() {
  const [resources, setResources] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [filter,    setFilter]    = useState('All')

  useEffect(() => {
    getMentorResources({})
      .then(r => { if (r.success) setResources(r.resources || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const visible = filter === 'All'
    ? resources
    : resources.filter(r => r.category === filter)

  return (
    <section id="resources" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-tag mb-4"
          >
            <BookOpen className="w-3.5 h-3.5" /> Resources
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-heading mb-4"
          >
            Free <span className="gradient-text">Premium Resources</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-lg mx-auto"
          >
            Curated PDFs, cheatsheets, templates, and video resources from our expert mentors — free for enrolled students.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === cat
                  ? 'bg-brand-600 text-white shadow-brand'
                  : 'glass text-white/60 hover:text-white hover:border-brand-500/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-white/40">
            <Loader2 className="w-7 h-7 animate-spin mr-3" /> Loading resources…
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            No resources in this category yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {visible.map((r, i) => (
              <ResourceCard key={r.id} resource={r} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
