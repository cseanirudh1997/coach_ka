import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, User, Mail, Phone, Lock, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { signup } from './api.js'
import { setSession } from './utils.js'

const GOALS = [
  'Break into AI/ML',
  'Switch to Data Science',
  'Prepare for FAANG interviews',
  'Learn GenAI & LLMs',
  'Get a promotion / salary hike',
  'Other',
]

export default function Signup({ setSession: setGlobalSession }) {
  const [form,    setForm]    = useState({ name: '', email: '', phone: '', password: '', goal: '' })
  const [show,    setShow]    = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.password || !form.goal) {
      toast.error('Please fill all required fields.')
      return
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      const res = await signup({ ...form, name: form.name.trim(), email: form.email.trim() })
      if (!res.success) {
        toast.error(res.message || 'Signup failed. Please try again.')
        return
      }
      // Auto-login with returned session or construct one
      const session = {
        userId: res.userId || `NP-${Date.now()}`,
        name:   form.name.trim(),
        email:  form.email.trim(),
        phone:  form.phone.trim(),
        plan:   'free',
      }
      setSession(session)
      setGlobalSession(session)
      toast.success('Account created! Welcome to NeuralPath 🎉')
      navigate('/dashboard', { replace: true })
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 mesh-gradient pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand">
            <Zap className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            Neural<span className="text-brand-400">Path</span>
          </span>
        </Link>

        <div className="glass-heavy p-8 rounded-2xl">
          <div className="h-1 -mx-8 -mt-8 mb-8 bg-gradient-to-r from-brand-600 via-violet-400 to-brand-600 rounded-t-2xl" />
          <h1 className="text-2xl font-bold mb-1">Start Your Journey</h1>
          <p className="text-sm text-white/50 mb-8">Create your free account and explore the platform.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="Rahul Verma"
                  className="np-input pl-10"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="rahul@email.com"
                  className="np-input pl-10"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Phone */}
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

            {/* Goal */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Your Primary Goal *</label>
              <select
                value={form.goal}
                onChange={e => set('goal', e.target.value)}
                className="np-input"
                required
              >
                <option value="" disabled>Select your goal…</option>
                {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {/* Password */}
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
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-white/20 mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
