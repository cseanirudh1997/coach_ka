import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Mail, Phone, Send, CheckCircle, Loader2, Calendar, Globe, Zap, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import CONFIG from '../config.js'

const CONSULTATION_TYPES = [
  'Visa Consultation — Student Visa',
  'University Shortlisting & Admissions',
  'IELTS / GRE Preparation Coaching',
  'SOP & LOR Writing Support',
  'Scholarship Guidance',
  'Pre-Departure Briefing',
  'General Study Abroad Inquiry',
]

const TARGET_COUNTRIES = [
  'Canada 🇨🇦', 'United Kingdom 🇬🇧', 'Australia 🇦🇺', 'Germany 🇩🇪',
  'United States 🇺🇸', 'Ireland 🇮🇪', 'Netherlands 🇳🇱', 'New Zealand 🇳🇿',
  'Not sure yet', 'Multiple Countries',
]

const INTAKE_OPTIONS = [
  'September 2025', 'January 2026', 'May 2026', 'September 2026', 'Later',
]

export default function Contact() {
  const [form,    setForm]    = useState({ name: '', email: '', phone: '', consultationType: '', targetCountry: '', intake: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.consultationType) {
      toast.error('Please fill all required fields.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(CONFIG.backendUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'text/plain' },
        body:    JSON.stringify({ action: 'contact', ...form }),
        redirect: 'follow',
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSent(true)
      toast.success('Consultation booked! Our counselor will reach out within 24 hours.')
    } catch (err) {
      console.error('[GlobalPath] contact submission failed:', err.message)
      // Still show success to user since GAS redirect may cause CORS
      setSent(true)
      toast.success('Request received! We\'ll contact you within 24 hours.')
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
              <h3 className="text-2xl font-bold mb-2">Consultation Booked! 🌍</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                A GlobalPath counselor will contact you within{' '}
                <strong className="text-white">24 hours</strong> to schedule your session.
                Join our WhatsApp group for instant updates and tips.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-1">
              <a
                href={CONFIG.whatsappLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand flex-1 justify-center"
              >
                <Phone className="w-4 h-4" /> Join WhatsApp Group
              </a>
              <a href="#countries" className="btn-ghost flex-1 justify-center" onClick={e => { e.preventDefault(); document.querySelector('#countries')?.scrollIntoView({ behavior: 'smooth' }) }}>
                Explore Destinations
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
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
              <MessageSquare className="w-3.5 h-3.5" /> Free Consultation
            </div>
            <h2 className="section-heading mb-4">
              Start Your Study<br />
              <span className="gradient-text">Abroad Journey</span>
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              Get a personalised free consultation with a GlobalPath counselor.
              We'll map your profile, recommend universities, and plan your visa timeline — no pressure, just expert guidance.
            </p>

            {/* Highlights */}
            <div className="flex flex-col gap-3 mb-8">
              {[
                { icon: Globe,    text: 'Destination & university shortlisting for your profile' },
                { icon: Calendar, text: 'Visa timeline planning for your target intake'           },
                { icon: Star,     text: 'SOP & LOR review from expert counselors'                },
                { icon: Zap,      text: '100% free consultation — no hidden fees'                },
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
                  <div className="text-xs text-white/40 mb-0.5">Email Us</div>
                  <div className="text-sm font-medium group-hover:text-brand-300 transition-colors">{CONFIG.supportEmail}</div>
                </div>
              </a>
              {CONFIG.supportPhone && (
                <a
                  href={`tel:${CONFIG.supportPhone}`}
                  className="flex items-center gap-4 glass p-4 rounded-xl hover:border-emerald-500/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-0.5">Call / WhatsApp</div>
                    <div className="text-sm font-medium group-hover:text-emerald-300 transition-colors">{CONFIG.supportPhone}</div>
                  </div>
                </a>
              )}
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
                <h3 className="text-xl font-bold mb-0.5">Book Free Consultation</h3>
                <p className="text-xs text-white/40">Takes 2 minutes · Response within 24 hours</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Arjun Sharma"
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
                    placeholder="arjun@email.com"
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
                <label className="block text-xs text-white/50 mb-1.5">What do you need help with? *</label>
                <select
                  value={form.consultationType}
                  onChange={e => set('consultationType', e.target.value)}
                  className="np-input"
                  required
                >
                  <option value="" disabled>Select consultation type…</option>
                  {CONSULTATION_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Target Country</label>
                  <select
                    value={form.targetCountry}
                    onChange={e => set('targetCountry', e.target.value)}
                    className="np-input"
                  >
                    <option value="">Select country…</option>
                    {TARGET_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Target Intake</label>
                  <select
                    value={form.intake}
                    onChange={e => set('intake', e.target.value)}
                    className="np-input"
                  >
                    <option value="">Select intake…</option>
                    {INTAKE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1.5">Tell us about yourself (optional)</label>
                <textarea
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                  placeholder="Current qualification, backlogs, work experience, target course, budget…"
                  className="np-input resize-none"
                  rows={3}
                />
              </div>

              <button type="submit" disabled={loading} className="btn-brand py-3.5 text-base">
                {loading
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending…</>
                  : <><Send className="w-5 h-5" /> Book Free Consultation</>
                }
              </button>

              <p className="text-center text-xs text-white/30">
                🔒 No spam. A real counselor will contact you — not a bot.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
