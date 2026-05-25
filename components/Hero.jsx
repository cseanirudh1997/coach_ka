import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Play, Star, Users, Award, TrendingUp } from 'lucide-react'
import { getDashboardMetrics } from '../api.js'

const ROTATING_ROLES = [
  'ML Engineer at Google',
  'Data Scientist at Microsoft',
  'AI Engineer at OpenAI',
  'GenAI Lead at a Unicorn',
  'Research Engineer at Meta',
]

const TRUST_BADGES = [
  { icon: Users,     value: '1,200+', label: 'Students Placed'   },
  { icon: TrendingUp, value: '3.2x',  label: 'Avg Salary Hike'  },
  { icon: Star,      value: '4.9/5',  label: 'Student Rating'    },
  { icon: Award,     value: '94%',    label: 'Placement Rate'    },
]

export default function Hero({ session }) {
  const [roleIdx,  setRoleIdx]  = useState(0)
  const [metrics,  setMetrics]  = useState(null)

  // Rotate role text
  useEffect(() => {
    const t = setInterval(() => setRoleIdx(i => (i + 1) % ROTATING_ROLES.length), 2800)
    return () => clearInterval(t)
  }, [])

  // Fetch live metrics
  useEffect(() => {
    getDashboardMetrics({ userId: session?.userId || '' })
      .then(r => r.success && setMetrics(r.metrics))
      .catch(() => {})
  }, [session])

  const badges = metrics ? [
    { icon: Users,     value: `${metrics.totalStudents?.toLocaleString('en-IN')}+`, label: 'Students Placed'   },
    { icon: TrendingUp, value: `${metrics.avgSalaryHike}x`,                         label: 'Avg Salary Hike'  },
    { icon: Star,      value: `${metrics.avgRating}/5`,                              label: 'Student Rating'    },
    { icon: Award,     value: `${metrics.placementRate}%`,                          label: 'Placement Rate'    },
  ] : TRUST_BADGES

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Background mesh */}
      <div className="absolute inset-0 mesh-gradient pointer-events-none" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-700/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-violet-700/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '1s' }} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize:  '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Announcement badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full
                     bg-brand-600/20 border border-brand-500/30 text-brand-300 text-sm font-medium
                     hover:bg-brand-600/30 transition-colors cursor-default"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-brand-400 opacity-75" />
            <span className="relative rounded-full h-2 w-2 bg-brand-500" />
          </span>
          🔥 Next Cohort Starts June 1 — Only 12 Seats Left
          <ChevronRight className="w-3 h-3" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6"
        >
          Land Your Dream Job as a{' '}
          <br className="hidden sm:block" />
          <span className="relative inline-block">
            <span className="gradient-text">
              <motion.span
                key={roleIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0  }}
                exit={{   opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="inline-block"
              >
                {ROTATING_ROLES[roleIdx]}
              </motion.span>
            </span>
            {/* Underline glow */}
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-violet-400 to-transparent rounded-full opacity-60" />
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-white/60 mb-10 text-balance"
        >
          Personalized mentorship, live sessions, mock interviews, and a career roadmap
          crafted by engineers from Google, Meta, and top AI unicorns.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            to={session ? '/dashboard' : '/signup'}
            className="btn-brand text-base px-8 py-4 text-lg"
          >
            {session ? 'Go to Dashboard' : 'Start Your Journey'}
            <ChevronRight className="w-5 h-5" />
          </Link>
          <button
            onClick={() => document.querySelector('#programs')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-ghost text-base px-8 py-4"
          >
            <Play className="w-4 h-4" />
            Explore Programs
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {badges.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.75 + i * 0.08 }}
              className="glass p-4 text-center group hover:border-brand-500/40 transition-all duration-300"
            >
              <b.icon className="w-5 h-5 text-brand-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold gradient-text">{b.value}</div>
              <div className="text-xs text-white/50 mt-0.5">{b.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 flex justify-center"
        >
          <button
            onClick={() => document.querySelector('#programs')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors"
          >
            <span className="text-xs tracking-widest uppercase">Explore</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
