import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, FileText, Video, Download, Loader2, Lock, Crown } from 'lucide-react'
import { getMentorResources } from '../api.js'
import toast from 'react-hot-toast'

const TYPE_ICONS = {
  PDF:   <FileText className="w-4 h-4 text-rose-400"   />,
  Video: <Video    className="w-4 h-4 text-blue-400"   />,
  DOCX:  <FileText className="w-4 h-4 text-sky-400"    />,
  PPT:   <FileText className="w-4 h-4 text-orange-400" />,
}

const CATEGORIES = ['All', 'Interview Prep', 'GenAI', 'System Design', 'Coding', 'Career', 'Data Science']

const TIER_ORDER = ['free', 'basic', 'premium', 'enterprise']

function tierRank(tier) {
  return TIER_ORDER.indexOf((tier || 'free').toLowerCase())
}

function userHasAccess(userTier, resourceTier) {
  // A user can access a resource if their tier rank >= resource tier rank
  return tierRank(userTier || 'free') >= tierRank(resourceTier || 'free')
}

function ResourceCard({ resource, index, session }) {
  // Use resourceId (backend canonical), fall back to id
  const rid    = resource.resourceId || resource.id
  // Use resourceUrl (backend canonical), fall back to url
  const url    = resource.resourceUrl || resource.url
  const isPremium = (resource.tier || 'free') !== 'free'
  const hasAccess = userHasAccess(session?.tier, resource.tier)

  function handleDownload(e) {
    if (!hasAccess) {
      e.preventDefault()
      if (!session) {
        toast.error('Please login to access resources.')
      } else {
        toast.error(`Upgrade to ${resource.tier} to access this resource.`, {
          icon: '🔒',
        })
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className={`glass p-5 flex items-start gap-4 group transition-all duration-200 ${
        hasAccess
          ? 'hover:border-brand-500/30 hover:-translate-y-0.5'
          : 'opacity-70'
      }`}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-brand-500/30 transition-colors">
        {TYPE_ICONS[resource.type] || <BookOpen className="w-4 h-4 text-white/40" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-white/40 mb-1">
          <span>{resource.category}</span>
          {isPremium && (
            <span className="flex items-center gap-1 badge-yellow text-xs capitalize">
              <Crown className="w-3 h-3" />
              {resource.tier}
            </span>
          )}
        </div>
        <h4 className={`font-semibold text-sm leading-snug truncate transition-colors ${
          hasAccess ? 'group-hover:text-brand-300' : 'text-white/50'
        }`}>
          {resource.title}
        </h4>
        <div className="flex items-center gap-3 mt-1 text-xs text-white/30">
          <span>{resource.type}</span>
          {resource.size && <span>{resource.size}</span>}
        </div>
      </div>

      {/* Download / Lock */}
      {hasAccess ? (
        <a
          href={url && url !== '#' ? url : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-600/20 border border-brand-600/30 flex items-center justify-center hover:bg-brand-600/40 transition-colors"
          onClick={handleDownload}
          title={`Download ${resource.title}`}
        >
          <Download className="w-3.5 h-3.5 text-brand-400" />
        </a>
      ) : (
        <button
          onClick={handleDownload}
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-600/20 hover:border-amber-500/30 transition-colors"
          title="Premium resource — upgrade to access"
        >
          <Lock className="w-3.5 h-3.5 text-white/30" />
        </button>
      )}
    </motion.div>
  )
}

export default function Resources({ session }) {
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

  const freeCount    = resources.filter(r => (r.tier || 'free') === 'free').length
  const premiumCount = resources.length - freeCount

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
            FAANG-Grade <span className="gradient-text">Resource Library</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-lg mx-auto"
          >
            Curated interview guides, system design templates, GenAI cheatsheets, and AI career resources.
            {premiumCount > 0 && (
              <> <span className="text-amber-400 font-medium">{freeCount} free</span> · <span className="text-amber-400 font-medium">{premiumCount} premium</span>.</>
            )}
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
              <ResourceCard
                key={r.resourceId || r.id || i}
                resource={r}
                index={i}
                session={session}
              />
            ))}
          </div>
        )}

        {/* Premium upgrade CTA */}
        {!session && premiumCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 glass p-6 rounded-2xl text-center border-amber-500/20"
          >
            <Crown className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Unlock Premium Resources</h3>
            <p className="text-white/50 text-sm mb-4">
              Sign up and enroll in a program to access {premiumCount} premium resources including live recordings, behavioral playbooks, and more.
            </p>
            <a href="/signup" className="btn-brand inline-flex">
              Get Free Access <Crown className="w-4 h-4 ml-1" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  )
}
