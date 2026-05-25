import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles } from 'lucide-react'
import { chat } from '../api.js'

const WELCOME = {
  id:   'welcome',
  role: 'bot',
  text: "Hi! I'm the GlobalPath AI Study Abroad Advisor 🌍\n\nAsk me about university admissions, visa processes, IELTS/GRE prep, SOPs, scholarships, or study costs for any country!",
}

const QUICK_PROMPTS = [
  'Which country is best for MS in Computer Science?',
  'Explain Canada student visa process',
  'IELTS vs TOEFL — which should I take?',
  'How to write a strong SOP?',
  'What scholarships are available in Germany?',
]

function Bubble({ msg }) {
  const isBot = msg.role === 'bot'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center flex-shrink-0 mb-1">
          <Bot className="w-4 h-4 text-brand-400" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isBot
            ? 'bg-white/5 border border-white/10 text-white/80 rounded-bl-sm'
            : 'bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-br-sm shadow-brand'
        }`}
      >
        {msg.text}
      </div>
      {!isBot && (
        <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 mb-1">
          <User className="w-4 h-4 text-white/60" />
        </div>
      )}
    </motion.div>
  )
}

export default function Chatbot({ session }) {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function sendMessage(text) {
    const userMsg = text || input.trim()
    if (!userMsg) return
    setInput('')

    const userBubble = { id: Date.now(), role: 'user', text: userMsg }
    setMessages(prev => [...prev, userBubble])
    setLoading(true)

    try {
      const history = messages.slice(-8).map(m => ({ role: m.role, text: m.text }))
      const res     = await chat({ message: userMsg, history })
      setMessages(prev => [...prev, {
        id:   Date.now() + 1,
        role: 'bot',
        text: res.reply || res.message || "I'm looking into that for you! For immediate help, book a free consultation with our counselors.",
      }])
    } catch {
      setMessages(prev => [...prev, {
        id:   Date.now() + 1,
        role: 'bot',
        text: "Sorry, I'm having trouble connecting right now. Please try again or email us at " + (window?.__GP_EMAIL__ || 'support@globalpath.in'),
      }])
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
                   bg-gradient-to-br from-brand-500 to-brand-700
                   flex items-center justify-center
                   shadow-brand-lg hover:shadow-[0_8px_50px_rgba(124,58,237,0.7)]
                   transition-all duration-300 active:scale-95"
        aria-label="Toggle GlobalPath advisor"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90,  opacity: 0 }} transition={{ duration: 0.15 }}>
                <X className="w-6 h-6 text-white" />
              </motion.div>
            : <motion.div key="chat" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <MessageCircle className="w-6 h-6 text-white" fill="currentColor" />
              </motion.div>
          }
        </AnimatePresence>

        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-brand-500 animate-ping opacity-30" />
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit={{   opacity: 0, scale: 0.9,  y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] flex flex-col glass-heavy rounded-2xl overflow-hidden"
          >
            {/* Gradient bar */}
            <div className="h-1 bg-gradient-to-r from-brand-600 via-violet-400 to-brand-600 flex-shrink-0" />

            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-brand-400" />
              </div>
              <div>
                <div className="text-sm font-semibold flex items-center gap-1.5">
                  GlobalPath AI Advisor
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Online · Study Abroad Expert
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 no-scrollbar">
              {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
              {loading && (
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-brand-400" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1.5">
                      {[0, 0.2, 0.4].map(delay => (
                        <span
                          key={delay}
                          className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce"
                          style={{ animationDelay: `${delay}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
                {QUICK_PROMPTS.map(p => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="text-xs px-3 py-1.5 rounded-full bg-brand-600/20 border border-brand-600/30 text-brand-300 hover:bg-brand-600/40 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 pb-3 flex-shrink-0">
              <div className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-xl p-2 focus-within:border-brand-500/40 transition-colors">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Ask about visas, universities, IELTS…"
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/30 resize-none focus:outline-none leading-relaxed max-h-24 no-scrollbar"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
