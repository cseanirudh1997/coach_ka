import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, User, Mail, Phone, Lock, Eye, EyeOff, Loader2, UserPlus, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { signup } from './api.js'
import { setSession } from './utils.js'

const BENEFITS = [
  'Expert visa & admissions counseling',
  'IELTS / GRE preparation support',
  'University shortlisting & SOP guidance',
  'Real-time application tracking',
]

export default function Signup({ setSession: setGlobalSession }) {
  const [form,    setForm]    = useState({ username: '', email: '', phone: '', password: '' })
  const [show,    setShow]    = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    const { username, email, password, phone } = form
    if (!username.trim() || !email.trim() || !password) {
      toast.error('Please fill all required fields.')
      return
    }
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username.trim())) {
      toast.error('Username must be 3–30 characters: letters, numbers, underscores only.')
      return
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      const res = await signup({
        username: username.trim(),
        email:    email.trim(),
        phone:    phone.trim(),
        password,
      })
      if (!res.success) {
        toast.error(res.message || 'Signup failed. Please try again.')
        return
      }
      const session = {
        username:        res.username || username.trim(),
        email:           res.email    || email.trim(),
        phone:           res.phone    || phone.trim(),
        role:            res.role     || 'student',
        tier:            res.tier     || 'free',
        onboardingStage: res.onboardingStage || 'profile',
        token:           res.token || '',
      }
      setSession(session)
      setGlobalSession(session)
      toast.success('Account created! Welcome to GlobalPath 🌍🎉')
      navigate('/dashboard', { replace: true })
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-72 h-72 bg-brand-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-violet-700/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            Global<span className="text-brand-400">Path</span>
          </span>
        </Link>

        <div className="glass-heavy p-8 rounded-2xl">
          <div className="h-1 -mx-8 -mt-8 mb-8 bg-gradient-to-r from-brand-600 via-violet-400 to-brand-600 rounded-t-2xl" />
          <h1 className="text-2xl font-bold mb-1">Start Your Global Journey</h1>
          <p className="text-sm text-white/50 mb-6">Create your free account and access expert study abroad counseling.</p>

          <ul className="flex flex-col gap-1.5 mb-6">
            {BENEFITS.map(b => (
              <li key={b} className="flex items-center gap-2 text-xs text-white/60">
                <CheckCircle className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Username *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => set('username', e.target.value)}
                  placeholder="john_doe"
                  className="np-input pl-10"
                  autoComplete="username"
                  required
                />
              </div>
              <p className="text-[11px] text-white/25 mt-1">3–30 chars, letters/numbers/underscores</p>
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="john@email.com"
                  className="np-input pl-10"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">Phone (WhatsApp)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="np-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="Min. 8 characters"
                  className="np-input pl-10 pr-10"
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShow(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-brand py-3.5 text-base mt-2">
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating account…</>
                : <><UserPlus className="w-5 h-5" /> Create Free Account</>
              }
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
          </p>
          <p className="text-center text-xs text-white/20 mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <Link to="/" className="flex items-center justify-center gap-1.5 mt-6 text-sm text-white/30 hover:text-white/60 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>
      </motion.div>
    </div>
  )
}
