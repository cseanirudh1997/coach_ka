import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, TrendingUp, BarChart2, DollarSign, Loader2, AlertCircle } from 'lucide-react'
import { getAIInsights } from '../api.js'

const SEVERITY_STYLES = {
  high:   { bar: 'bg-rose-500',   text: 'text-rose-400',   bg: 'bg-rose-500/10   border-rose-500/20',   label: '🔥 Hot',     icon: AlertCircle },
  medium: { bar: 'bg-amber-500',  text: 'text-amber-400',  bg: 'bg-amber-500/10  border-amber-500/20',  label: '📈 Trending', icon: TrendingUp  },
  low:    { bar: 'bg-blue-500',   text: 'text-blue-400',   bg: 'bg-blue-500/10   border-blue-500/20',   label: '💡 Insight',  icon: Zap         },
}

function InsightCard({ item, index }) {
  const severity = typeof item === 'string' ? 'medium' : (item.severity || 'medium')
  const text     = typeof item === 'string' ? item : item.insight
  const style    = SEVERITY_STYLES[severity] || SEVERITY_STYLES.medium
  const Icon     = style.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      className={`glass p-5 flex items-start gap-4 border ${style.bg} hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-0.5`}
    >
      {/* Severity dot */}
      <div className={`w-2 h-2 rounded-full ${style.bar} flex-shrink-0 mt-2`} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-semibold mb-1.5 ${style.text}`}>{style.label}</div>
        <p className="text-sm text-white/75 leading-relaxed">{text}</p>
        {item.timestamp && (
          <div className="text-xs text-white/30 mt-2">
            {new Date(item.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function AIInsights() {
  const [insights, setInsights] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getAIInsights({})
      .then(r => { if (r.success) setInsights(r.insights || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="insights" className="py-24 relative overflow-hidden">
      {/* BG glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-950/15 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-tag mb-4"
          >
            <BarChart2 className="w-3.5 h-3.5" /> AI Market Intelligence
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-heading mb-4"
          >
            AI Hiring Trends &amp;{' '}
            <span className="gradient-text">Market Insights</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-xl mx-auto"
          >
            Real-time intelligence on AI hiring trends, salary benchmarks, role demand, and GenAI market shifts — updated daily.
          </motion.p>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { icon: TrendingUp,  label: 'AI Job Growth',         value: '+143%',   sub: 'YoY in 2026'       },
            { icon: DollarSign,  label: 'Avg Applied Sci. CTC',  value: '₹58 LPA', sub: 'Median FAANG offer' },
            { icon: Zap,         label: 'GenAI Role Demand',      value: '3.4x',    sub: 'vs 2024 baseline'  },
            { icon: BarChart2,   label: 'ML Engineer Openings',  value: '12,400+', sub: 'India + Remote'     },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="glass p-4 text-center group hover:border-brand-500/40 transition-all duration-300"
            >
              <s.icon className="w-5 h-5 text-brand-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-white/60 mt-0.5 font-medium">{s.label}</div>
              <div className="text-xs text-white/30 mt-0.5">{s.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Insights grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-white/40">
            <Loader2 className="w-7 h-7 animate-spin mr-3" /> Loading insights…
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((item, i) => (
              <InsightCard key={i} item={item} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-white/40 text-sm mb-4">
            Get personalized insights in your dashboard after enrolling in a program.
          </p>
          <a href="/signup" className="btn-brand inline-flex">
            Start Free — Get Your Roadmap <Zap className="w-4 h-4 ml-1" fill="currentColor" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
