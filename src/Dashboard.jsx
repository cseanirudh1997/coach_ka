import React, { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe, LayoutDashboard, BookOpen, Calendar, FileText,
  Route, Bell, LogOut, TrendingUp, Award, Star,
  ChevronRight, Loader2, CheckCircle2, Circle,
  X, Menu, Target, Plane, GraduationCap, Crown, Home,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import toast from 'react-hot-toast'
import {
  getStudentProgress, getBookings, getRoadmapSteps,
  getNotifications, getAIInsights, getDashboardMetrics,
} from './api.js'
import { clearSession, initials, formatDate } from './utils.js'

// ─── Sidebar config ────────────────────────────────────────────────────────────
const SIDEBAR_ITEMS = [
  { key: 'overview',       label: 'Overview',          icon: LayoutDashboard },
  { key: 'applications',   label: 'My Bookings',       icon: Calendar        },
  { key: 'progress',       label: 'My Progress',       icon: TrendingUp      },
  { key: 'roadmap',        label: 'Roadmap',           icon: Route           },
  { key: 'notifications',  label: 'Notifications',     icon: Bell            },
]

// ─── Placeholder activity chart data ──────────────────────────────────────────
const ACTIVITY_CHART = [
  { month: 'Oct', sessions: 1 },
  { month: 'Nov', sessions: 2 },
  { month: 'Dec', sessions: 3 },
  { month: 'Jan', sessions: 2 },
  { month: 'Feb', sessions: 4 },
  { month: 'Mar', sessions: 3 },
  { month: 'Apr', sessions: 5 },
  { month: 'May', sessions: 4 },
]

const SEVERITY_COLORS = {
  high:   'border-l-rose-500   bg-rose-500/5',
  medium: 'border-l-amber-500  bg-amber-500/5',
  low:    'border-l-blue-500   bg-blue-500/5',
}

// ─── KPI card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, color = 'brand', delay = 0 }) {
  const colorMap = {
    brand:   'bg-brand-600/20  text-brand-400  border-brand-600/30',
    emerald: 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30',
    amber:   'bg-amber-600/20  text-amber-400  border-amber-600/30',
    violet:  'bg-violet-600/20 text-violet-400 border-violet-600/30',
    rose:    'bg-rose-600/20   text-rose-400   border-rose-600/30',
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

// ─── Progress bar row ──────────────────────────────────────────────────────────
function ProgressRow({ label, value, max = 100, color = 'from-brand-600 to-violet-500', delay = 0 }) {
  const pct = Math.min(Math.round((value / max) * 100), 100)
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex flex-col gap-1.5"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/70">{label}</span>
        <span className="font-bold text-brand-400">{value}%</span>
      </div>
      <div className="progress-bar">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </motion.div>
  )
}

// ─── Panel loader ──────────────────────────────────────────────────────────────
function PanelLoader({ text }) {
  return (
    <div className="flex items-center justify-center py-24 text-white/40">
      <Loader2 className="w-7 h-7 animate-spin mr-3" /> {text}
    </div>
  )
}

// ─── Overview panel ───────────────────────────────────────────────────────────
function OverviewPanel({ session, progress, insights, metrics }) {
  // Backend fields from StudentProgress:
  //   dsaProgress  → IELTS Readiness
  //   mlProgress   → Visa Progress
  //   systemDesignProgress → Application Progress
  //   targetCompany → Target Country (display only)
  const ieltsReadiness  = progress?.dsaProgress         || 0
  const visaProgress    = progress?.mlProgress          || 0
  const appProgress     = progress?.systemDesignProgress || 0
  const overallPct      = progress ? Math.round((ieltsReadiness + visaProgress + appProgress) / 3) : 0

  return (
    <div className="flex flex-col gap-6">
      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={TrendingUp}    label="Journey Progress"    value={`${overallPct}%`}                                color="brand"   delay={0}    />
        <KpiCard icon={Target}        label="Target Country"      value={progress?.targetCompany || '—'}                  color="violet"  delay={0.05} />
        <KpiCard icon={Award}         label="IELTS Readiness"     value={`${ieltsReadiness}%`}                            color="emerald" delay={0.1}  />
        <KpiCard icon={Plane}         label="Visa Progress"       value={`${visaProgress}%`}                              color="amber"   delay={0.15} />
      </div>

      {/* Activity chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-6"
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-400" />
          Counseling Session Activity
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={ACTIVITY_CHART} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#7c3aed" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month"    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="sessions" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 10, fontSize: 12 }}
              labelStyle={{ color: '#a78bfa' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="sessions" stroke="#7c3aed" strokeWidth={2} fill="url(#activityGrad)" dot={{ fill: '#7c3aed', r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* AI/study abroad insights */}
      {insights?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-400" />
            Study Abroad Insights
          </h3>
          <ul className="flex flex-col gap-3">
            {insights.slice(0, 4).map((ins, i) => {
              const item = typeof ins === 'string' ? { insight: ins, severity: 'medium' } : ins
              return (
                <li
                  key={i}
                  className={`flex items-start gap-3 text-sm p-3 rounded-xl border-l-2 ${SEVERITY_COLORS[item.severity] || SEVERITY_COLORS.medium}`}
                >
                  <span className="w-5 h-5 rounded-full bg-brand-600/20 border border-brand-600/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-brand-400 text-xs font-bold">{i + 1}</span>
                  <span className="text-white/70">{item.insight || item}</span>
                </li>
              )
            })}
          </ul>
        </motion.div>
      )}

      {/* Platform metrics */}
      {metrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { label: 'Students Guided',    value: `${(metrics.activeStudents  ?? 0).toLocaleString('en-IN')}+` },
            { label: 'Visa Success',       value: `${metrics.placements       ?? 94}%`                         },
            { label: 'Counseling Sessions',value: `${(metrics.mentorshipCalls ?? 0).toLocaleString('en-IN')}+` },
            { label: 'Partner Universities',value:`${(metrics.mockInterviews  ?? 50)}+`                        },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

// ─── Applications (Bookings) panel ────────────────────────────────────────────
// Backend fields: bookingId | username | sessionId | preferredDate | preferredTime | notes | status
function ApplicationsPanel({ bookings }) {
  const statusColor = { upcoming: 'badge-brand', active: 'badge-green', completed: 'badge-yellow', cancelled: 'badge-red', pending: 'badge-yellow' }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6 flex flex-col gap-5">
      <h2 className="text-xl font-bold">My Bookings & Applications</h2>
      {!bookings?.length ? (
        <div className="text-center py-16 text-white/30">
          No bookings yet. Browse counseling sessions or packages to get started.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map(b => (
            <div key={b.bookingId || b.id} className="glass p-4 rounded-xl flex items-start sm:items-center flex-col sm:flex-row justify-between gap-3">
              <div>
                <div className="text-xs text-white/40 mb-0.5">
                  {b.sessionId ? 'Counseling Session' : 'Package Enrollment'}
                </div>
                <div className="font-semibold text-sm">{b.title || b.sessionId || b.programId || 'Session'}</div>
                <div className="text-xs text-white/40 mt-0.5">
                  {formatDate(b.preferredDate || b.date)}
                  {b.preferredTime ? ` · ${b.preferredTime}` : ''}
                </div>
                {b.notes && (
                  <div className="text-xs text-white/30 mt-0.5 truncate max-w-xs">{b.notes}</div>
                )}
              </div>
              <span className={`${statusColor[b.status] || 'badge-brand'} capitalize flex-shrink-0`}>
                {b.status || 'pending'}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Progress panel ───────────────────────────────────────────────────────────
// Backend fields: username | targetCompany | dsaProgress | mlProgress | systemDesignProgress | status
// UI labels: targetCompany→Target Country, dsaProgress→IELTS, mlProgress→Visa, systemDesignProgress→App
function ProgressPanel({ progress }) {
  if (!progress) return <PanelLoader text="Loading progress…" />

  const {
    targetCompany        = '—',
    dsaProgress          = 0,
    mlProgress           = 0,
    systemDesignProgress = 0,
    status               = 'active',
  } = progress

  const overall = Math.round((dsaProgress + mlProgress + systemDesignProgress) / 3)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">

      {/* Target + Status */}
      <div className="glass p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-white/40 mb-1 flex items-center gap-1">
            <Target className="w-3.5 h-3.5" /> Target Country / Program
          </div>
          <div className="text-xl font-bold flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-400" />
            {targetCompany}
          </div>
        </div>
        <span className={`badge capitalize ${status === 'active' ? 'badge-green' : 'badge-yellow'}`}>
          {status}
        </span>
      </div>

      {/* Progress */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold mb-6">Journey Readiness</h2>
        <div className="flex flex-col gap-5">
          <ProgressRow label="IELTS / Language Readiness"   value={dsaProgress}          color="from-brand-600 to-violet-500"  delay={0.05} />
          <ProgressRow label="Visa Application Progress"    value={mlProgress}           color="from-emerald-600 to-teal-500"  delay={0.1}  />
          <ProgressRow label="Admission Progress"           value={systemDesignProgress} color="from-blue-600 to-indigo-500"   delay={0.15} />
          <div className="border-t border-white/10 pt-4">
            <ProgressRow label="Overall Journey Progress"   value={overall}              color="from-brand-600 to-violet-400"  delay={0.2}  />
          </div>
        </div>
      </div>

      {/* Next steps tip */}
      <div className="glass p-4 rounded-xl border-l-2 border-l-brand-500 bg-brand-600/5">
        <div className="text-xs text-white/40 mb-1">Recommended next step</div>
        <div className="text-sm font-medium text-white/80">
          {dsaProgress < 50
            ? 'Focus on your IELTS / English language test preparation. A score of 7.0+ is required for most universities.'
            : mlProgress < 50
            ? 'Start your visa documentation checklist. Early preparation ensures a smoother application.'
            : systemDesignProgress < 50
            ? 'Work on your university shortlist and application essays. A strong SOP is key to admissions.'
            : 'You\'re in great shape! Book a final counseling session to review your complete application package.'
          }
        </div>
      </div>
    </motion.div>
  )
}

// ─── Roadmap panel ────────────────────────────────────────────────────────────
function RoadmapPanel({ steps }) {
  const done  = steps?.filter(s => s.completed ?? s.done).length || 0
  const total = steps?.length || 0
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Study Abroad Roadmap</h2>
        <span className="badge-brand">{done}/{total} steps · {pct}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      {!total ? (
        <div className="text-center py-16 text-white/30">No roadmap data available yet.</div>
      ) : (
        <div className="flex flex-col gap-1">
          {steps.map(s => {
            const isDone = s.completed ?? s.done ?? false
            return (
              <div key={s.stepId || s.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                {isDone
                  ? <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                  : <Circle       className="w-5 h-5 text-white/20 flex-shrink-0 mt-0.5" />
                }
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.title}</div>
                  {s.phase && <div className="text-xs text-white/30 truncate">{s.phase}</div>}
                </div>
                {isDone && <span className="badge-green text-xs flex-shrink-0">Done</span>}
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

// ─── Notifications panel ──────────────────────────────────────────────────────
function NotificationsPanel({ notifications, markRead }) {
  const typeIcon = { info: '💡', success: '✅', warning: '⚠️', error: '❌' }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6 flex flex-col gap-5">
      <h2 className="text-xl font-bold">Notifications</h2>
      {!notifications?.length ? (
        <div className="text-center py-16 text-white/30">No notifications.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map(n => {
            const nid = n.notificationId || n.id
            return (
              <div
                key={nid}
                className={`glass p-4 rounded-xl flex items-start gap-3 transition-all ${!n.read ? 'border-brand-500/30 bg-brand-600/5' : 'opacity-60'}`}
              >
                <span className="text-lg flex-shrink-0">{typeIcon[n.type] || '📩'}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{n.title}</div>
                  <div className="text-xs text-white/60 mt-0.5">{n.message || n.body}</div>
                  <div className="text-xs text-white/30 mt-1">{n.time}</div>
                </div>
                {!n.read && (
                  <button onClick={() => markRead(nid)} className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard({ session, setSession: setGlobalSession }) {
  const [activePanel,   setActivePanel]   = useState('overview')
  const [sidebarOpen,   setSidebarOpen]   = useState(false)
  const [progress,      setProgress]      = useState(null)
  const [bookings,      setBookings]      = useState(null)
  const [roadmapSteps,  setRoadmapSteps]  = useState(null)
  const [notifications, setNotifications] = useState(null)
  const [insights,      setInsights]      = useState([])
  const [metrics,       setMetrics]       = useState(null)
  const navigate = useNavigate()
  const uname    = session?.username || ''

  useEffect(() => {
    Promise.all([
      getStudentProgress({ username: uname }).then(r => r.success && setProgress(r.data || r.progress)),
      getBookings({ username: uname }).then(r => r.success && setBookings(r.data || r.bookings)),
      getRoadmapSteps({ roadmapId: 'rm1' }).then(r => r.success && setRoadmapSteps(r.data || r.steps)),
      getNotifications({ username: uname }).then(r => r.success && setNotifications(r.data || r.notifications)),
      getAIInsights().then(r => r.success && setInsights(r.data || r.insights || [])),
      getDashboardMetrics().then(r => r.success && setMetrics(r.data?.[0] || r.metrics)),
    ]).catch(() => {})
  }, [uname])

  function handleLogout() {
    clearSession()
    setGlobalSession(null)
    toast.success('Logged out.')
    navigate('/', { replace: true })
  }

  function markRead(id) {
    setNotifications(prev => prev?.map(n => {
      const nid = n.notificationId || n.id
      return nid === id ? { ...n, read: true } : n
    }))
  }

  const unread = useMemo(
    () => notifications?.filter(n => !n.read).length || 0,
    [notifications]
  )

  // dsaProgress → IELTS Readiness; mlProgress → Visa; systemDesignProgress → App
  const overallPct = progress
    ? Math.round(((progress.dsaProgress || 0) + (progress.mlProgress || 0) + (progress.systemDesignProgress || 0)) / 3)
    : 0

  const tierBadge = session?.tier === 'premium'
    ? <span className="badge-yellow text-xs flex items-center gap-1"><Crown className="w-3 h-3" /> Premium</span>
    : <span className="badge text-xs bg-white/5 text-white/40 border border-white/10">Free</span>

  function renderPanel() {
    switch (activePanel) {
      case 'overview':       return <OverviewPanel session={session} progress={progress} insights={insights} metrics={metrics} />
      case 'applications':   return <ApplicationsPanel bookings={bookings} />
      case 'progress':       return <ProgressPanel progress={progress} />
      case 'roadmap':        return <RoadmapPanel steps={roadmapSteps} />
      case 'notifications':  return <NotificationsPanel notifications={notifications} markRead={markRead} />
      default:               return null
    }
  }

  const activeLabel = SIDEBAR_ITEMS.find(i => i.key === activePanel)?.label || 'Dashboard'

  return (
    <div className="h-screen flex overflow-hidden bg-surface-950">

      {/* ── Mobile overlay ── */}
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

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-surface-900/95 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:inset-auto lg:translate-x-0 lg:z-auto lg:flex-shrink-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight">
            Global<span className="text-brand-400">Path</span>
          </span>
        </div>

        {/* User card */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-600 to-violet-700 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {initials(session?.username || '')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">{session?.username || 'Student'}</div>
              <div className="text-xs text-white/40 truncate">{session?.email || ''}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {tierBadge}
          </div>
          {/* Journey progress mini bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-white/40 mb-1">
              <span>Journey Progress</span>
              <span className="text-brand-400 font-medium">{overallPct}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${overallPct}%` }} />
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          {SIDEBAR_ITEMS.map(item => {
            const isActive   = activePanel === item.key
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
            <Home className="w-4 h-4" /> Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

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
            {progress?.targetCompany && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-white/40 px-3 py-1.5 glass rounded-full">
                <Globe className="w-3 h-3 text-brand-400" />
                {progress.targetCompany}
              </span>
            )}
            <Link
              to="/"
              title="Back to site"
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <Home className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setActivePanel(p => p === 'notifications' ? 'overview' : 'notifications')}
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
              animate={{ opacity: 1, y: 0 }}
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
