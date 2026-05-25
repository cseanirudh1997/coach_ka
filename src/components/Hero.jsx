import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronRight, Globe, Users, Award, TrendingUp, Star,
  MapPin, GraduationCap, FileCheck, Plane,
} from 'lucide-react'
import { getDashboardMetrics, getPlatformConfig } from '../api.js'

const ROTATING_DESTINATIONS = [
  'Canada  🇨🇦',
  'United Kingdom  🇬🇧',
  'Australia  🇦🇺',
  'Germany  🇩🇪',
  'United States  🇺🇸',
  'Ireland  🇮🇪',
]

const DEFAULT_BADGES = [
  { icon: Users,      value: '15,000+', label: 'Students Guided'     },
  { icon: Award,      value: '94%',     label: 'Visa Success Rate'   },
  { icon: TrendingUp, value: '50+',     label: 'Partner Universities' },
  { icon: Star,       value: '4.9/5',   label: 'Counselor Rating'    },
]

const FEATURE_PILLS = [
  { icon: GraduationCap, label: 'University Admissions' },
  { icon: FileCheck,     label: 'Visa Guidance'         },
  { icon: MapPin,        label: 'IELTS / GRE Prep'      },
  { icon: Plane,         label: 'SOP & LOR Support'     },
]

export default function Hero({ session }) {
  const [destIdx, setDestIdx] = useState(0)
  const [metrics, setMetrics] = useState(null)
  const [config,  setConfig]  = useState(null)

  useEffect(() => {
    const t = setInterval(() => setDestIdx(i => (i + 1) % ROTATING_DESTINATIONS.length), 2800)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    getDashboardMetrics().then(r => r.success && setMetrics(r.data?.[0] || r.metrics)).catch(() => {})
    getPlatformConfig().then(r => r.success && setConfig(r.data)).catch(() => {})
  }, [])

  const badges = metrics ? [
    { icon: Users,      value: `${(metrics.activeStudents  ?? 15000).toLocaleString('en-IN')}+`, label: 'Students Guided'     },
    { icon: Award,      value: `${(metrics.placements      ?? 94)}%`,                             label: 'Visa Success Rate'   },
    { icon: TrendingUp, value: `${(metrics.mentorshipCalls ?? 50)}+`,                             label: 'Partner Universities'},
    { icon: Star,       value: '4.9/5',                                                           label: 'Counselor Rating'    },
  ] : DEFAULT_BADGES

  const banner = Array.isArray(config)
    ? config.find(c => c.key === 'announcementBanner')?.value
    : config?.announcementBanner

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      <div className="absolute inset-0 mesh-gradient pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-700/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-violet-700/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="absolute top-2/3 left-1/4 w-64 h-64 bg-indigo-700/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {banner && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-brand-600/20 border border-brand-500/30 text-brand-300 text-sm font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-brand-400 opacity-75" />
              <span className="relative rounded-full h-2 w-2 bg-brand-500" />
            </span>
            {banner}
            <ChevronRight className="w-3 h-3" />
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-8"
        >
          {FEATURE_PILLS.map(pill => (
            <span key={pill.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70">
              <pill.icon className="w-3 h-3 text-brand-400" />
              {pill.label}
            </span>
          ))}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6"
        >
          Your Global Education
          <br className="hidden sm:block" />
          Journey Starts{' '}
          <span className="relative inline-block">
            <span className="gradient-text">Here</span>
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-violet-400 to-transparent rounded-full opacity-60" />
          </span>
        </motion.h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mb-4 text-lg sm:text-xl font-medium text-white/50"
        >
          Study in{' '}
          <motion.span
            key={destIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="inline-block text-brand-300 font-semibold min-w-[200px] text-left"
          >
            {ROTATING_DESTINATIONS[destIdx]}
          </motion.span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-white/60 mb-10 text-balance"
        >
          Premium study abroad counseling, visa guidance, IELTS/GRE preparation,
          and university admissions support for ambitious students.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          {session ? (
            <Link to="/dashboard" className="btn-brand text-base px-8 py-4 text-lg">
              Go to Dashboard <ChevronRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link to="/signup" className="btn-brand text-base px-8 py-4 text-lg">
              Book Counseling <ChevronRight className="w-5 h-5" />
            </Link>
          )}
          <button
            onClick={() => document.querySelector('#universities')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-ghost text-base px-8 py-4"
          >
            <GraduationCap className="w-4 h-4" /> Explore Universities
          </button>
          <button
            onClick={() => document.querySelector('#countries')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-brand-300 transition-colors px-4 py-4"
          >
            <Globe className="w-4 h-4" /> View Countries
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
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

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="mt-10 text-center">
          <p className="text-xs text-white/30 tracking-widest uppercase mb-4">Our students are studying in</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/25 text-sm font-semibold">
            {['🇨🇦 Canada', '🇺🇸 USA', '🇬🇧 UK', '🇦🇺 Australia', '🇩🇪 Germany', '🇮🇪 Ireland', '🇳🇱 Netherlands'].map(c => (
              <span key={c} className="hover:text-white/60 transition-colors">{c}</span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-12 flex justify-center">
          <button
            onClick={() => document.querySelector('#countries')?.scrollIntoView({ behavior: 'smooth' })}
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
