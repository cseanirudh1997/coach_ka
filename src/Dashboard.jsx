import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, LayoutDashboard, BookOpen, Calendar, Mic2, FileText,
  Map, Bell, Settings, LogOut, TrendingUp, Award, Star,
  ChevronRight, Loader2, CheckCircle2, Circle, ExternalLink,
  X, Menu, User, Flame, Target,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import toast from 'react-hot-toast'
import {
  getStudentProgress, getMockInterviews, getResumeReviews,
  getBookings, getRoadmapSteps, getNotifications, getAIInsights,
  getDashboardMetrics,
} from './api.js'
import { clearSession, initials, formatDate, pluralize } from './utils.js'

// ─── Sidebar config ────────────────────────────────────────────────────────────
const SIDEBAR_ITEMS = [
  { key: 'overview',    label: 'Overview',         icon: LayoutDashboard },
  { key: 'progress',   label: 'My Progress',       icon: TrendingUp      },
  { key: 'bookings',   label: 'My Bookings',       icon: Calendar        },
  { key: 'interviews', label: 'Mock Interviews',   icon: Mic2            },
  { key: 'resume',     label: 'Resume Reviews',    icon: FileText        },
  { key: 'roadmap',    label: 'Roadmap',           icon: Map             },
  { key: 'notifications', label: 'Notifications',  icon: Bell            },
]

// ─── Mock progress chart data ──────────────────────────────────────────────────
const PROGRESS_CHART = [
  { week: 'W1', score: 45 },
  { week: 'W2', score: 52 },
  { week: 'W3', score: 60 },
  { week: 'W4', score: 58 },
  { week: 'W5', score: 67 },
  { week: 'W6', score: 72 },
  { week: 'W7', score: 68 },
  { week: 'W8', score: 78 },
]

// ─── Helper: stat card ─────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, color = 'brand', delay = 0 }) {
  const colorMap = {
    brand:   'bg-brand-600/20 text-brand-400 border-brand-600/30',
    emerald: 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30',
    amber:   'bg-amber-600/20 text-amber-400 border-amber-600/30',
    violet:  'bg-violet-600/20 text-violet-400 border-violet-600/30',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass p-5 flex items-start gap-4"
    >
      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-white/50">{label}</div>
        {sub && <div className="text-xs text-white/30 mt-0.5">{sub}</div>}
      </div>
    </motion.div>
  )
}

// ─── Panel: Overview ──────────────────────────────────────────────────────────
function OverviewPanel({ session, progress, insights, metrics }) {
  return (
    <div className="flex flex-col gap-6">
      {/* KPI grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={TrendingUp} label="Overall Progress" value={`${progress?.overallPercent || 0}%`}    color="brand"   delay={0}    />
        <KpiCard icon={Flame}      label="Day Streak"       value={`${progress?.streak || 0} days`}         color="amber"   delay={0.05} />
        <KpiCard icon={Award}      label="Points Earned"    value={(progress?.points || 0).toLocaleString('en-IN')} color="violet" delay={0.1}  />
        <KpiCard icon={Target}     label="Leaderboard Rank" value={`#${progress?.rank || '—'}`}             color="emerald" delay={0.15} />
      </div>

      {/* Progress chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-6"
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-400" />
          Assessment Score Trend
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={PROGRESS_CHART} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#7c3aed" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} domain={[30, 100]} />
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 10, fontSize: 12 }}
              labelStyle={{ color: '#a78bfa' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={2} fill="url(#scoreGrad)" dot={{ fill: '#7c3aed', r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* AI Insights */}
      {insights?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-400" fill="currentColor" />
            AI Insights for You
          </h3>
          <ul className="flex flex-col gap-3">
            {insights.map((ins, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                <span className="w-5 h-5 rounded-full bg-brand-600/20 border border-brand-600/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-brand-400 text-xs font-bold">{i + 1}</span>
                {ins}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  )
}

// ─── Panel: Progress ──────────────────────────────────────────────────────────
function ProgressPanel({ progress }) {
  if (!progress) return <PanelLoader text="Loading progress…" />
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6 flex flex-col gap-6">
      <h2 className="text-xl font-bold">My Progress</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { label: 'Modules Complete',  value: `${progress.modulesComplete}/${progress.modulesTotal}`, pct: Math.round((progress.modulesComplete / progress.modulesTotal) * 100) },
          { label: 'Overall Progress',  value: `${progress.overallPercent}%`,  pct: progress.overallPercent },
        ].map(item => (
          <div key={item.label} className="glass p-4 rounded-xl flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">{item.label}</span>
              <span className="font-bold text-brand-400">{item.value}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${item.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="glass p-4 rounded-xl">
        <div className="text-xs text-white/40 mb-1">Up Next</div>
        <div className="font-semibold text-sm">{progress.nextMilestone}</div>
      </div>
    </motion.div>
  )
}

// ─── Panel: Bookings ─────────────────────────────────────────────────────────
function BookingsPanel({ bookings }) {
  const statusColor = { upcoming: 'badge-brand', active: 'badge-green', completed: 'badge-yellow' }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6 flex flex-col gap-5">
      <h2 className="text-xl font-bold">My Bookings</h2>
      {!bookings?.length ? (
        <div className="text-center py-16 text-white/30">No bookings yet.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map(b => (
            <div key={b.id} className="glass p-4 rounded-xl flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-white/40 mb-1 capitalize">{b.type}</div>
                <div className="font-semibold text-sm">{b.title}</div>
                <div className="text-xs text-white/40 mt-0.5">{formatDate(b.date)}</div>
              </div>
              <span className={`${statusColor[b.status] || 'badge-brand'} capitalize`}>{b.status}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Panel: Mock Interviews ───────────────────────────────────────────────────
function InterviewsPanel({ interviews }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6 flex flex-col gap-5">
      <h2 className="text-xl font-bold">Mock Interviews</h2>
      {!interviews?.length ? (
        <div className="text-center py-16 text-white/30">No interviews scheduled.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {interviews.map(iv => (
            <div key={iv.id} className="glass p-4 rounded-xl flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="badge-brand mr-2">{iv.type}</span>
                  <span className="text-sm font-semibold">{iv.mentor}</span>
                </div>
                {iv.score !== null
                  ? <span className="badge-green">Score: {iv.score}/100</span>
                  : <span className={iv.status === 'scheduled' ? 'badge-yellow' : 'badge-brand'} style={{ textTransform: 'capitalize' }}>{iv.status}</span>
                }
              </div>
              <div className="text-xs text-white/40">{formatDate(iv.date)}</div>
              {iv.feedback && (
                <p className="text-xs text-white/60 bg-white/5 rounded-lg px-3 py-2 mt-1">{iv.feedback}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Panel: Resume Reviews ────────────────────────────────────────────────────
function ResumePanel({ reviews }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6 flex flex-col gap-5">
      <h2 className="text-xl font-bold">Resume Reviews</h2>
      {!reviews?.length ? (
        <div className="text-center py-16 text-white/30">No resume reviews yet.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map(r => (
            <div key={r.id} className="glass p-4 rounded-xl flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-white/40 mb-0.5">Reviewed by {r.mentor}</div>
                <div className="text-xs text-white/40">Submitted: {formatDate(r.submittedOn)}</div>
                {r.suggestions != null && (
                  <div className="text-xs text-amber-400 mt-1">{pluralize(r.suggestions, 'suggestion')}</div>
                )}
              </div>
              <div className="text-right">
                {r.score != null
                  ? <div className="text-xl font-bold gradient-text">{r.score}/100</div>
                  : null
                }
                <span className={r.status === 'reviewed' ? 'badge-green mt-1' : 'badge-yellow mt-1'} style={{ textTransform: 'capitalize' }}>
                  {r.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Panel: Roadmap ───────────────────────────────────────────────────────────
function RoadmapPanel({ steps }) {
  const done = steps?.filter(s => s.done).length || 0
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">My Roadmap</h2>
        <span className="badge-brand">{done}/{steps?.length || 0} weeks</span>
      </div>
      {!steps?.length ? (
        <div className="text-center py-16 text-white/30">No roadmap data.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {steps.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
              {s.done
                ? <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0" />
                : <Circle className="w-5 h-5 text-white/20 flex-shrink-0" />
              }
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{s.title}</div>
                <div className="text-xs text-white/40">Week {s.week}</div>
              </div>
              {s.done && <span className="badge-green text-xs">Done</span>}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Panel: Notifications ─────────────────────────────────────────────────────
function NotificationsPanel({ notifications, markRead }) {
  const typeIcon = { info: '💡', success: '✅', warning: '⚠️', error: '❌' }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6 flex flex-col gap-5">
      <h2 className="text-xl font-bold">Notifications</h2>
      {!notifications?.length ? (
        <div className="text-center py-16 text-white/30">No notifications.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`glass p-4 rounded-xl flex items-start gap-3 transition-all ${!n.read ? 'border-brand-500/30 bg-brand-600/5' : 'opacity-60'}`}
            >
              <span className="text-lg flex-shrink-0">{typeIcon[n.type] || '📩'}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{n.title}</div>
                <div className="text-xs text-white/60 mt-0.5">{n.body}</div>
                <div className="text-xs text-white/30 mt-1">{n.time}</div>
              </div>
              {!n.read && (
                <button onClick={() => markRead(n.id)} className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Loader util ──────────────────────────────────────────────────────────────
function PanelLoader({ text }) {
  return (
    <div className="flex items-center justify-center py-24 text-white/40">
      <Loader2 className="w-7 h-7 animate-spin mr-3" /> {text}
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard({ session, setSession: setGlobalSession }) {
  const [activePanel,    setActivePanel]    = useState('overview')
  const [sidebarOpen,    setSidebarOpen]    = useState(false)
  const [progress,       setProgress]       = useState(null)
  const [interviews,     setInterviews]     = useState(null)
  const [reviews,        setReviews]        = useState(null)
  const [bookings,       setBookings]       = useState(null)
  const [roadmapSteps,   setRoadmapSteps]   = useState(null)
  const [notifications,  setNotifications]  = useState(null)
  const [insights,       setInsights]       = useState([])
  const [metrics,        setMetrics]        = useState(null)
  const navigate = useNavigate()
  const uid = session?.userId || ''

  // Fetch all data on mount
  useEffect(() => {
    Promise.all([
      getStudentProgress({ userId: uid }).then(r => r.success && setProgress(r.progress)),
      getMockInterviews({ userId: uid }).then(r => r.success && setInterviews(r.interviews)),
      getResumeReviews({ userId: uid }).then(r => r.success && setReviews(r.reviews)),
      getBookings({ userId: uid }).then(r => r.success && setBookings(r.bookings)),
      getRoadmapSteps({ roadmapId: 'rm1' }).then(r => r.success && setRoadmapSteps(r.steps)),
      getNotifications({ userId: uid }).then(r => r.success && setNotifications(r.notifications)),
      getAIInsights({ userId: uid }).then(r => r.success && setInsights(r.insights)),
      getDashboardMetrics({ userId: uid }).then(r => r.success && setMetrics(r.metrics)),
    ]).catch(() => {})
  }, [uid])

  function handleLogout() {
    clearSession()
    setGlobalSession(null)
    toast.success('Logged out.')
    navigate('/', { replace: true })
  }

  function markRead(id) {
    setNotifications(prev => prev?.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const unread = notifications?.filter(n => !n.read).length || 0

  // Panel renderer
  function renderPanel() {
    switch (activePanel) {
      case 'overview':      return <OverviewPanel session={session} progress={progress} insights={insights} metrics={metrics} />
      case 'progress':      return <ProgressPanel progress={progress} />
      case 'bookings':      return <BookingsPanel bookings={bookings} />
      case 'interviews':    return <InterviewsPanel interviews={interviews} />
      case 'resume':        return <ResumePanel reviews={reviews} />
      case 'roadmap':       return <RoadmapPanel steps={roadmapSteps} />
      case 'notifications': return <NotificationsPanel notifications={notifications} markRead={markRead} />
      default:              return null
    }
  }

  const activeLabel = SIDEBAR_ITEMS.find(i => i.key === activePanel)?.label || 'Dashboard'

  return (
    <div className="min-h-screen flex bg-surface-950">

      {/* ── Sidebar ── */}
      <>
        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/60 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <motion.aside
          initial={false}
          animate={{ x: sidebarOpen ? 0 : -280 }}
          className="fixed inset-y-0 left-0 z-40 w-64 bg-surface-900/95 backdrop-blur-xl border-r border-white/10 flex flex-col lg:translate-x-0 lg:static lg:z-auto"
          style={{ willChange: 'transform' }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="font-bold text-base tracking-tight">
              Neural<span className="text-brand-400">Path</span>
            </span>
          </div>

          {/* User card */}
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-600 to-violet-700 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {initials(session?.name || '')}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{session?.name || 'Student'}</div>
                <div className="text-xs text-white/40 truncate">{session?.email || ''}</div>
              </div>
            </div>
            {progress && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-white/40 mb-1">
                  <span>Progress</span>
                  <span className="text-brand-400 font-medium">{progress.overallPercent}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress.overallPercent}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
            {SIDEBAR_ITEMS.map(item => {
              const isActive = activePanel === item.key
              const badgeCount = item.key === 'notifications' ? unread : 0
              return (
                <button
                  key={item.key}
                  onClick={() => { setActivePanel(item.key); setSidebarOpen(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-600/20 text-brand-300 border border-brand-600/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : ''}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {badgeCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">
                      {badgeCount}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Bottom links */}
          <div className="px-3 py-4 border-t border-white/10 flex flex-col gap-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <ExternalLink className="w-4 h-4" /> Back to Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </motion.aside>
      </>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 h-14 border-b border-white/10 bg-surface-950/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
              onClick={() => setSidebarOpen(v => !v)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold">{activeLabel}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePanel('notifications')}
              className="relative p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <Bell className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Panel content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0  }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderPanel()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
