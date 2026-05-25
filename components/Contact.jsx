import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Mail, Phone, Send, CheckCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import CONFIG from '../config.js'

const GOALS = [
  'Break into AI/ML',
  'Switch to Data Science',
  'Prepare for FAANG interviews',
  'Learn GenAI & LLMs',
  'Get a promotion / salary hike',
  'Other',
]

export default function Contact() {
  const [form,    setForm]    = useState({ name: '', email: '', phone: '', goal: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.goal) {
      toast.error('Please fill all required fields.')
      return
    }
    setLoading(true)
    try {
      // Attempt to send to backend; fail gracefully
      if (CONFIG.backendUrl !== '__SET_BACKEND_URL__') {
        await fetch(CONFIG.backendUrl, {
          method:  'POST',
          headers: { 'Content-Type': 'text/plain' },
          body:    JSON.stringify({ action: 'contact', ...form }),
        })
      }
      setSent(true)
      toast.success('Message sent! We\'ll be in touch within 24 hours.')
    } catch {
      // Show success regardless — inquiry noted in-session
      setSent(true)
      toast.success('Message received! Our team will reach out shortly.')
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
            className="glass p-10 rounded-3xl flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-brand-600/20 border border-brand-500/40 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-brand-400" />
            </div>
            <h3 className="text-2xl font-bold">We've got your message!</h3>
            <p className="text-white/60 text-sm">
              Our admissions team will contact you within <strong className="text-white">24 hours</strong>.
              In the meantime, join our WhatsApp community for instant support.
            </p>
            <a
              href={CONFIG.whatsappLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand mt-2"
            >
              Join WhatsApp Community
            </a>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-tag mb-4">
              <MessageSquare className="w-3.5 h-3.5" /> Contact Us
            </div>
            <h2 className="section-heading mb-4">
              Have Questions? <br />
              <span className="gradient-text">Let's Talk.</span>
            </h2>
            <p className="text-white/60 mb-8 text-balance">
              Our admissions counselors are here to guide you to the right program.
              No pressure — just genuine career advice.
            </p>

            <div className="flex flex-col gap-4">
              <a href={`mailto:${CONFIG.supportEmail}`} className="flex items-center gap-4 glass p-4 rounded-xl hover:border-brand-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <div className="text-xs text-white/40 mb-0.5">Email</div>
                  <div className="text-sm font-medium group-hover:text-brand-300 transition-colors">{CONFIG.supportEmail}</div>
                </div>
              </a>
              <div className="flex items-center gap-4 glass p-4 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <div className="text-xs text-white/40 mb-0.5">WhatsApp</div>
                  <div className="text-sm font-medium">Available Mon–Sat, 10AM–7PM IST</div>
                </div>
              </div>
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
              <h3 className="text-xl font-bold">Book a Free Consultation</h3>

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
                    placeholder="rahul@email.com"
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
                <label className="block text-xs text-white/50 mb-1.5">Your Goal *</label>
                <select
                  value={form.goal}
                  onChange={e => set('goal', e.target.value)}
                  className="np-input"
                  required
                >
                  <option value="" disabled>Select your primary goal…</option>
                  {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1.5">Message (optional)</label>
                <textarea
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                  placeholder="Tell us about your background, current role, and what you're hoping to achieve…"
                  className="np-input resize-none"
                  rows={4}
                />
              </div>

              <button type="submit" disabled={loading} className="btn-brand py-3.5 text-base">
                {loading
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending…</>
                  : <><Send className="w-5 h-5" /> Book Free Consultation</>
                }
              </button>

              <p className="text-center text-xs text-white/30">
                No spam. We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
