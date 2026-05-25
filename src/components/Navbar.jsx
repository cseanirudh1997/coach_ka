import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Menu, X, ChevronRight, LogOut, LayoutDashboard, Route } from 'lucide-react'
import { clearSession } from '../utils.js'

const NAV_LINKS = [
  { label: 'Programs',       href: '#programs'     },
  { label: 'Sessions',       href: '#sessions'     },
  { label: 'Roadmaps',       href: '#roadmap'      },
  { label: 'AI Insights',    href: '#insights'     },
  { label: 'Success Stories', href: '#testimonials' },
  { label: 'Resources',      href: '#resources'    },
]

export default function Navbar({ session, setSession }) {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleLogout() {
    clearSession()
    setSession?.(null)
    navigate('/', { replace: true })
  }

  function scrollTo(href) {
    setMobileOpen(false)
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-surface-950/90 backdrop-blur-xl border-b border-white/10 shadow-xl shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand group-hover:shadow-brand-lg transition-shadow">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Neural<span className="text-brand-400">Path</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="px-4 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {session ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white/50 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="btn-brand text-sm px-5 py-2.5">
                  Book Mentorship <ChevronRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{   opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-surface-900/95 backdrop-blur-xl border-b border-white/10 px-4 py-6 flex flex-col gap-2 lg:hidden"
          >
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-left px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                {link.label}
              </button>
            ))}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
              {session ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="btn-ghost text-center justify-center">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition-colors py-2">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login"  onClick={() => setMobileOpen(false)} className="btn-ghost text-center justify-center">Login</Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-brand text-center justify-center">
                    Book Mentorship <ChevronRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
