import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Mail, Phone, Send, CheckCircle, Loader2, Calendar, Target, Zap, BookOpen, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import CONFIG from '../config.js'

const CONSULTATION_TYPES = [
  'Mock Interview — FAANG Technical',
  'Resume & LinkedIn Review',
  'FAANG Mentorship Program Inquiry',
  'ML System Design Prep Session',
  'GenAI Career Transition Coaching',
  'Career Roadmap & Goal Planning',
]

const EXPERIENCE_LEVELS = [
  '0–2 years (Fresher / Junior)',
  '2–5 years (Mid-level)',
  '5–8 years (Senior)',
  '8+ years (Staff / Principal)',
]

const TARGET_COMPANIES = [
  'Google / Alphabet', 'Meta', 'Amazon', 'Microsoft', 'Apple',
  'OpenAI / Anthropic', 'Airbnb', 'Uber', 'Adobe', 'Walmart Labs',
  'Other FAANG/MAANG', 'Top AI Startup',
]

export default function Contact() {
  const [form,    setForm]    = useState({ name: '', email: '', phone: '', consultationType: '', experience: '', targetCompany: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.consultationType) {
      toast.error('Please fill all required fields.')
      return
    }
    setLoading(true)
    try {
      if (CONFIG.backendUrl !== '__SET_BACKEND_URL__') {
        const res = await fetch(CONFIG.backendUrl, {
          method:   'POST',
          headers:  { 'Content-Type': 'text/plain' },
          body:     JSON.stringify({ action: 'contact', ...form }),
          redirect: 'follow',
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      }
      setSent(true)
      toast.success('Consultation booked! Our team will reach out within 24 hours.')
    } catch (err) {
      console.error('[NeuralPath] contact submission failed:', err.message)
      toast.error('Could not submit. Please email us directly or try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <section id="contact" className="py-24">
        <div className="max-w-xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-10 rounded-3xl flex flex-col items-center gap-5"
          >
            <div className="w-16 h-16 rounded-full bg-brand-600/20 border border-brand-500/40 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-brand-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Consultation Booked! 🎉</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                A NeuralPath FAANG mentor will contact you within{' '}
                <strong className="text-white">24 hours</strong> to schedule your session.
                Join our community for instant support and daily prep tips.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-1">
              <a
                href={CONFIG.whatsappLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand flex-1 justify-center"
              >
                <Phone className="w-4 h-4" /> Join WhatsApp Community
              </a>
              <a href="#programs" className="btn-ghost flex-1 justify-center" onClick={e => { e.preventDefault(); document.querySelector('#programs')?.scrollIntoView({ behavior: 'smooth' }) }}>
                View Programs
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* BG accent */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-brand-700/[0.08] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-tag mb-4">
              <MessageSquare className="w-3.5 h-3.5" /> Free FAANG Consultation
            </div>
            <h2 className="section-heading mb-4">
              Ready to Crack <br />
              <span className="gradient-text">Your Dream Company?</span>
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              Get a personalised 1:1 consultation with a NeuralPath FAANG mentor.
              We'll map your profile to the right program, roadmap, and timeline — no pressure, just results.
            </p>

            {/* Consultation highlights */}
            <div className="flex flex-col gap-3 mb-8">
              {[
                { icon: Target,    text: 'Profile gap analysis vs. your target company' },
                { icon: Calendar,  text: 'Custom 12-week FAANG prep roadmap'            },
                { icon: Star,      text: 'Mentor match based on your target role'       },
                { icon: Zap,       text: '100% free — no sales pressure'                },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-white/70">
                  <div className="w-7 h-7 rounded-lg bg-brand-600/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>

            {/* Contact cards */}
            <div className="flex flex-col gap-3">
              <a href={`mailto:${CONFIG.supportEmail}`} className="flex items-center gap-4 glass p-4 rounded-xl hover:border-brand-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <div className="text-xs text-white/40 mb-0.5">Email Support</div>
                  <div className="text-sm font-medium group-hover:text-brand-300 transition-colors">{CONFIG.supportEmail}</div>
                </div>
              </a>
              <a
                href={CONFIG.whatsappLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 glass p-4 rounded-xl hover:border-emerald-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-white/40 mb-0.5">WhatsApp Community</div>
                  <div className="text-sm font-medium group-hover:text-emerald-300 transition-colors">Mon–Sat, 10AM–7PM IST</div>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl flex flex-col gap-5">
              <div>
                <h3 className="text-xl font-bold mb-0.5">Book Your Free FAANG Consultation</h3>
                <p className="text-xs text-white/40">Takes 2 minutes · Response within 24 hours</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Rahul Verma"
                    className="np-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="rahul@company.com"
                    className="np-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1.5">Phone (WhatsApp preferred)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="np-input"
                />
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1.5">Consultation Type *</label>
                <select
                  value={form.consultationType}
                  onChange={e => set('consultationType', e.target.value)}
                  className="np-input"
                  required
                >
                  <option value="" disabled>Select what you need help with…</option>
                  {CONSULTATION_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Experience Level</label>
                  <select
                    value={form.experience}
                    onChange={e => set('experience', e.target.value)}
                    className="np-input"
                  >
                    <option value="">Select level…</option>
                    {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Target Company</label>
                  <select
                    value={form.targetCompany}
                    onChange={e => set('targetCompany', e.target.value)}
                    className="np-input"
                  >
                    <option value="">Select company…</option>
                    {TARGET_COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1.5">Tell us about your background (optional)</label>
                <textarea
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                  placeholder="Current role, years of experience, specific challenges, timeline for interviews…"
                  className="np-input resize-none"
                  rows={3}
                />
              </div>

              <button type="submit" disabled={loading} className="btn-brand py-3.5 text-base">
                {loading
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Booking…</>
                  : <><Send className="w-5 h-5" /> Book Free FAANG Consultation</>
                }
              </button>

              <p className="text-center text-xs text-white/30">
                🔒 No spam. We respect your privacy. A real mentor will contact you — not a bot.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
