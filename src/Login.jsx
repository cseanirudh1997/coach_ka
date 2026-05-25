import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, User, Lock, Eye, EyeOff, Loader2, LogIn, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { login } from './api.js'
import { setSession } from './utils.js'

export default function Login({ setSession: setGlobalSession }) {
  const [form,    setForm]    = useState({ username: '', password: '' })
  const [show,    setShow]    = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/dashboard'

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.username.trim() || !form.password) {
      toast.error('Please enter your username and password.')
      return
    }
    setLoading(true)
    try {
      const res = await login({ username: form.username.trim(), password: form.password })
      if (!res.success) {
        toast.error(res.message || 'Login failed. Please check your credentials.')
        return
      }
      const session = {
        username:        res.username || form.username.trim(),
        email:           res.email || '',
        phone:           res.phone || '',
        role:            res.role  || 'student',
        tier:            res.tier  || 'free',
        onboardingStage: res.onboardingStage || 'active',
        token:           res.token || '',
      }
      setSession(session)
      setGlobalSession(session)
      toast.success(`Welcome back, ${session.username}! 🌍`)
      navigate(from, { replace: true })
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-72 h-72 bg-brand-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-64 h-64 bg-violet-700/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">
            Global<span className="text-brand-400">Path</span>
          </span>
        </Link>

        <div className="glass-heavy p-8 rounded-2xl">
          <div className="h-1 -mx-8 -mt-8 mb-8 bg-gradient-to-r from-brand-600 via-violet-400 to-brand-600 rounded-t-2xl" />
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-white/50 mb-8">Continue your global education journey.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => set('username', e.target.value)}
                  placeholder="your_username"
                  className="np-input pl-10"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/50 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="••••••••"
                  className="np-input pl-10 pr-10"
                  autoComplete="current-password"
                  required
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

            <button type="submit" disabled={loading} className="btn-brand py-3.5 text-base mt-1">
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing in…</>
                : <><LogIn className="w-5 h-5" /> Sign In</>
              }
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>

        <Link to="/" className="flex items-center justify-center gap-1.5 mt-6 text-sm text-white/30 hover:text-white/60 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>
      </motion.div>
    </div>
  )
}
