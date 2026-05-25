import React, { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, LayoutDashboard, BookOpen, Calendar, Mic2, FileText,
  Route, Bell, LogOut, TrendingUp, Award, Star,
  ChevronRight, Loader2, CheckCircle2, Circle, ExternalLink,
  X, Menu, Target, Brain, Code2, Layers, Building2, Crown,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts'
import toast from 'react-hot-toast'
import {
  getStudentProgress, getMockInterviews, getResumeReviews,
  getBookings, getRoadmapSteps, getNotifications, getAIInsights,
  getDashboardMetrics,
} from './api.js'
import { clearSession, initials, formatDate } from './utils.js'

// ─── Sidebar config ────────────────────────────────────────────────────────────
const SIDEBAR_ITEMS = [
  { key: 'overview',       label: 'Overview',         icon: LayoutDashboard },
  { key: 'progress',       label: 'My Progress',      icon: TrendingUp      },
  { key: 'bookings',       label: 'My Bookings',      icon: Calendar        },
  { key: 'interviews',     label: 'Mock Interviews',  icon: Mic2            },
  { key: 'resume',         label: 'Resume Reviews',   icon: FileText        },
  { key: 'roadmap',        label: 'Roadmap',          icon: Route           },
  { key: 'notifications',  label: 'Notifications',    icon: Bell            },
]

// ─── Static chart data (placeholder) ──────────────────────────────────────────
const PROGRESS_CHART = [
  { week: 'W1', score: 40 },
  { week: 'W2', score: 52 },
  { week: 'W3', score: 61 },
  { week: 'W4', score: 58 },
  { week: 'W5', score: 69 },
  { week: 'W6', score: 74 },
  { week: 'W7', score: 70 },
  { week: 'W8', score: 82 },
]

const SEVERITY_COLORS = {
  high:   'border-l-rose-500   bg-rose-500/5',
  medium: 'border-l-amber-500  bg-amber-500/5',
  low:    'border-l-blue-500   bg-blue-500/5',
}

// ─── Helper: KPI card ──────────────────────────────────────────────────────────
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

// ─── Helper: Progress bar row ──────────────────────────────────────────────────
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

// ─── Panel: Overview ──────────────────────────────────────────────────────────
function OverviewPanel({ session, progress, insights, metrics }) {
  // Derive overall % from the three domain scores if real backend data is present
  const overallPct = progress
    ? Math.round(((progress.dsaProgress || 0) + (progress.mlProgress || 0) + (progress.systemDesignProgress || 0)) / 3)
    : 0

  return (
    <div className="flex flex-col gap-6">
      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={TrendingUp} label="Placement Readiness"  value={`${overallPct}%`}                                        color="brand"   delay={0}    />
        <KpiCard icon={Target}     label="Target Company"       value={progress?.targetCompany || '—'}                          color="violet"  delay={0.05} />
        <KpiCard icon={Brain}      label="ML Progress"          value={`${progress?.mlProgress ?? '—'}%`}                      color="emerald" delay={0.1}  />
        <KpiCard icon={Code2}      label="DSA Progress"         value={`${progress?.dsaProgress ?? '—'}%`}                     color="amber"   delay={0.15} />
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
          Interview Readiness Trend
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
            Personalized AI Insights
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

      {/* Platform-wide stats */}
      {metrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { label: 'Engineers Placed',   value: `${metrics.totalStudents?.toLocaleString('en-IN')}+` },
            { label: 'Placement Rate',     value: `${metrics.placementRate}%` },
            { label: 'Avg Salary Hike',    value: `${metrics.avgSalaryHike}x` },
            { label: 'Mock Interviews',    value: `${(metrics.mockInterviews || 0).toLocaleString('en-IN')}+` },
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

// ─── Panel: Progress ──────────────────────────────────────────────────────────
// Uses exact backend fields: username | targetCompany | dsaProgress | mlProgress | systemDesignProgress | status
function ProgressPanel({ progress }) {
  if (!progress) return <PanelLoader text="Loading progress…" />

  const {
    targetCompany       = '—',
    dsaProgress         = 0,
    mlProgress          = 0,
    systemDesignProgress = 0,
    status              = 'active',
  } = progress

  const overall = Math.round((dsaProgress + mlProgress + systemDesignProgress) / 3)

  // Radar chart data
  const radarData = [
    { subject: 'DSA',           value: dsaProgress },
    { subject: 'ML Theory',     value: mlProgress },
    { subject: 'System Design', value: systemDesignProgress },
    { subject: 'Behavioral',    value: Math.round((dsaProgress + mlProgress) / 2) },
    { subject: 'GenAI',         value: Math.round(mlProgress * 0.9) },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">

      {/* Target + Status */}
      <div className="glass p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-white/40 mb-1 flex items-center gap-1">
            <Target className="w-3.5 h-3.5" /> Target Company
          </div>
          <div className="text-xl font-bold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-400" />
            {targetCompany}
          </div>
        </div>
        <span className={`badge capitalize ${status === 'active' ? 'badge-green' : 'badge-yellow'}`}>
          {status}
        </span>
      </div>

      {/* Overall readiness */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold mb-6">Interview Readiness</h2>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Radar */}
          <div className="flex-shrink-0">
            <ResponsiveContainer width={220} height={200}>
              <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                <Radar name="Readiness" dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} dot={{ fill: '#7c3aed', r: 3 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Progress bars */}
          <div className="flex-1 w-full flex flex-col gap-4">
            <ProgressRow label="DSA & Coding"          value={dsaProgress}          color="from-brand-600 to-violet-500" delay={0.05} />
            <ProgressRow label="ML Theory & Practice"  value={mlProgress}           color="from-emerald-600 to-teal-500"  delay={0.1}  />
            <ProgressRow label="ML System Design"      value={systemDesignProgress} color="from-blue-600 to-indigo-500"   delay={0.15} />
            <div className="border-t border-white/10 pt-4">
              <ProgressRow label="Overall Readiness"   value={overall}              color="from-brand-600 to-violet-400"  delay={0.2}  />
            </div>
          </div>
        </div>
      </div>

      {/* Next steps tip */}
      <div className="glass p-4 rounded-xl border-l-2 border-l-brand-500 bg-brand-600/5">
        <div className="text-xs text-white/40 mb-1">Recommended focus area</div>
        <div className="text-sm font-medium text-white/80">
          {systemDesignProgress < dsaProgress && systemDesignProgress < mlProgress
            ? 'Dedicate more time to ML System Design — it\'s the most common gap in FAANG interviews.'
            : dsaProgress < mlProgress
            ? 'Strengthen DSA patterns. Aim for 3–5 LeetCode problems daily focused on DP and graphs.'
            : 'Keep up the ML momentum. Review recent FAANG ML interview reports for trending topics.'
          }
        </div>
      </div>
    </motion.div>
  )
}

// ─── Panel: Bookings ─────────────────────────────────────────────────────────
// Backend fields: bookingId | username | sessionId | preferredDate | preferredTime | notes | status
function BookingsPanel({ bookings }) {
  const statusColor = { upcoming: 'badge-brand', active: 'badge-green', completed: 'badge-yellow', cancelled: 'badge-red' }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6 flex flex-col gap-5">
      <h2 className="text-xl font-bold">My Bookings</h2>
      {!bookings?.length ? (
        <div className="text-center py-16 text-white/30">No bookings yet. Explore programs to get started.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map(b => (
            <div key={b.bookingId || b.id} className="glass p-4 rounded-xl flex items-start sm:items-center flex-col sm:flex-row justify-between gap-3">
              <div>
                <div className="text-xs text-white/40 mb-0.5">
                  {b.sessionId ? 'Session Booking' : 'Program Enrollment'}
                </div>
                <div className="font-semibold text-sm">{b.title || b.sessionId || b.programId}</div>
                <div className="text-xs text-white/40 mt-0.5">
                  {formatDate(b.preferredDate || b.date)}
                  {b.preferredTime ? ` · ${b.preferredTime}` : ''}
                </div>
              </div>
              <span className={`${statusColor[b.status] || 'badge-brand'} capitalize flex-shrink-0`}>{b.status}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Panel: Mock Interviews ───────────────────────────────────────────────────
// Backend fields: interviewId | username | role | score | feedback | nextSteps
function InterviewsPanel({ interviews }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6 flex flex-col gap-5">
      <h2 className="text-xl font-bold">Mock Interviews</h2>
      {!interviews?.length ? (
        <div className="text-center py-16 text-white/30">No interviews scheduled yet.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {interviews.map(iv => (
            <div key={iv.interviewId || iv.id} className="glass p-5 rounded-xl flex flex-col gap-3">
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge-brand">{iv.type || 'Interview'}</span>
                    {iv.role && (
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {iv.role}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold mt-1">with {iv.mentor}</div>
                  <div className="text-xs text-white/40">{formatDate(iv.date)}</div>
                </div>
                {iv.score != null
                  ? <div className="text-2xl font-bold gradient-text flex-shrink-0">{iv.score}<span className="text-sm text-white/30">/100</span></div>
                  : <span className={`${iv.status === 'scheduled' ? 'badge-yellow' : 'badge-brand'} capitalize flex-shrink-0`}>{iv.status}</span>
                }
              </div>

              {/* Feedback */}
              {iv.feedback && (
                <div className="text-xs text-white/60 bg-white/5 rounded-lg px-3 py-2 border-l-2 border-l-brand-500">
                  <div className="text-white/40 mb-0.5 font-medium">Feedback</div>
                  {iv.feedback}
                </div>
              )}

              {/* Next steps */}
              {iv.nextSteps && (
                <div className="text-xs text-white/60 bg-emerald-500/5 rounded-lg px-3 py-2 border-l-2 border-l-emerald-500">
                  <div className="text-emerald-400 mb-0.5 font-medium">Next Steps</div>
                  {iv.nextSteps}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Panel: Resume Reviews ────────────────────────────────────────────────────
// Backend fields: reviewId | username | targetRole | status | reviewerNotes
function ResumePanel({ reviews }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6 flex flex-col gap-5">
      <h2 className="text-xl font-bold">Resume Reviews</h2>
      {!reviews?.length ? (
        <div className="text-center py-16 text-white/30">No resume reviews yet.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map(r => (
            <div key={r.reviewId || r.id} className="glass p-5 rounded-xl flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  {r.targetRole && (
                    <div className="text-xs text-white/40 mb-1 flex items-center gap-1">
                      <Target className="w-3 h-3" /> {r.targetRole}
                    </div>
                  )}
                  <div className="text-sm font-semibold">
                    Reviewed by {r.reviewer || r.mentor}
                  </div>
                  <div className="text-xs text-white/40">
                    Submitted: {formatDate(r.submittedOn)}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {r.score != null && (
                    <div className="text-2xl font-bold gradient-text">{r.score}<span className="text-sm text-white/30">/100</span></div>
                  )}
                  <span className={`${r.status === 'reviewed' ? 'badge-green' : 'badge-yellow'} capitalize mt-1`}>
                    {r.status}
                  </span>
                </div>
              </div>

              {/* Reviewer notes (backend field: reviewerNotes) */}
              {r.reviewerNotes && (
                <div className="text-xs text-white/60 bg-white/5 rounded-lg px-3 py-2 border-l-2 border-l-amber-500">
                  <div className="text-amber-400 mb-0.5 font-medium">Reviewer Notes</div>
                  {r.reviewerNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Panel: Roadmap ───────────────────────────────────────────────────────────
// Backend fields: stepId | roadmapId | phase | title | completed
function RoadmapPanel({ steps }) {
  const done = steps?.filter(s => s.completed ?? s.done).length || 0
  const total = steps?.length || 0
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">My Roadmap</h2>
        <span className="badge-brand">{done}/{total} steps · {pct}%</span>
      </div>

      {/* Overall progress bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>

      {!total ? (
        <div className="text-center py-16 text-white/30">No roadmap data.</div>
      ) : (
        <div className="flex flex-col gap-1">
          {steps.map(s => {
            const isDone = s.completed ?? s.done ?? false
            return (
              <div key={s.stepId || s.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                {isDone
                  ? <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                  : <Circle      className="w-5 h-5 text-white/20 flex-shrink-0 mt-0.5" />
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

// ─── Panel: Notifications ─────────────────────────────────────────────────────
// Backend fields: notificationId | username | title | message | read
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
                  {/* Support both message (backend) and body (legacy) */}
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

// ─── Loader util ──────────────────────────────────────────────────────────────
function PanelLoader({ text }) {
  return (
    <div className="flex items-center justify-center py-24 text-white/40">
      <Loader2 className="w-7 h-7 animate-spin mr-3" /> {text}
    </div>
  )
}

// Keep Briefcase available (used in InterviewsPanel JSX)
function Briefcase({ className }) {
  return <Award className={className} />
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard({ session, setSession: setGlobalSession }) {
  const [activePanel,   setActivePanel]   = useState('overview')
  const [sidebarOpen,   setSidebarOpen]   = useState(false)
  const [progress,      setProgress]      = useState(null)
  const [interviews,    setInterviews]    = useState(null)
  const [reviews,       setReviews]       = useState(null)
  const [bookings,      setBookings]      = useState(null)
  const [roadmapSteps,  setRoadmapSteps]  = useState(null)
  const [notifications, setNotifications] = useState(null)
  const [insights,      setInsights]      = useState([])
  const [metrics,       setMetrics]       = useState(null)
  const navigate = useNavigate()
  const uid      = session?.userId   || ''
  const uname    = session?.username || ''

  // Fetch all data on mount
  useEffect(() => {
    Promise.all([
      getStudentProgress({ userId: uid, username: uname }).then(r => r.success && setProgress(r.progress)),
      getMockInterviews({ userId: uid, username: uname }).then(r => r.success && setInterviews(r.interviews)),
      getResumeReviews({ userId: uid, username: uname }).then(r => r.success && setReviews(r.reviews)),
      getBookings({ userId: uid, username: uname }).then(r => r.success && setBookings(r.bookings)),
      getRoadmapSteps({ roadmapId: 'rm1' }).then(r => r.success && setRoadmapSteps(r.steps)),
      getNotifications({ userId: uid, username: uname }).then(r => r.success && setNotifications(r.notifications)),
      getAIInsights({ userId: uid }).then(r => r.success && setInsights(r.insights)),
      getDashboardMetrics({ userId: uid }).then(r => r.success && setMetrics(r.metrics)),
    ]).catch(() => {})
  }, [uid, uname])

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

  // Tier badge
  const tierBadge = session?.tier === 'premium'
    ? <span className="badge-yellow text-xs flex items-center gap-1"><Crown className="w-3 h-3" /> Premium</span>
    : <span className="badge text-xs bg-white/5 text-white/40 border border-white/10">Free</span>

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
                {initials(session?.name || session?.username || '')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">{session?.name || session?.username || 'Student'}</div>
                <div className="text-xs text-white/40 truncate">{session?.email || ''}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {tierBadge}
              {session?.role && session.role !== 'student' && (
                <span className="text-xs text-white/30 capitalize">{session.role}</span>
              )}
            </div>
            {/* Progress mini bar */}
            {progress && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-white/40 mb-1">
                  <span>Readiness</span>
                  <span className="text-brand-400 font-medium">
                    {Math.round(((progress.dsaProgress || 0) + (progress.mlProgress || 0) + (progress.systemDesignProgress || 0)) / 3)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${Math.round(((progress.dsaProgress || 0) + (progress.mlProgress || 0) + (progress.systemDesignProgress || 0)) / 3)}%`
                  }} />
                </div>
              </div>
            )}
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
            {SIDEBAR_ITEMS.map(item => {
              const isActive    = activePanel === item.key
              const badgeCount  = item.key === 'notifications' ? unread : 0
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
            {progress?.targetCompany && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-white/40 px-3 py-1.5 glass rounded-full">
                <Target className="w-3 h-3 text-brand-400" />
                {progress.targetCompany}
              </span>
            )}
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
