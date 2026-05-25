/**
 * GlobalPath — Study Abroad & Visa Consulting Platform
 * Shared utility helpers
 */

import CONFIG from './config.js'

// ─── Session management ───────────────────────────────────────────────────────

export function getSession() {
  try {
    const raw = localStorage.getItem(CONFIG.sessionKey)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setSession(user) {
  try {
    localStorage.setItem(CONFIG.sessionKey, JSON.stringify(user))
  } catch { /* ignore */ }
}

export function clearSession() {
  try {
    localStorage.removeItem(CONFIG.sessionKey)
  } catch { /* ignore */ }
}

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatCurrency(amount, currency = 'INR') {
  if (!amount && amount !== 0) return '—'
  return new Intl.NumberFormat('en-IN', {
    style:    'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric',
    })
  } catch { return dateStr }
}

export function formatShortDate(dateStr) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  } catch { return dateStr }
}

export function initials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('')
}

export function truncate(str, maxLen = 120) {
  if (!str) return ''
  return str.length > maxLen ? str.slice(0, maxLen).trimEnd() + '…' : str
}

export function clsx(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function pluralize(n, singular, plural) {
  return `${n} ${n === 1 ? singular : (plural || singular + 's')}`
}

// ─── Visa difficulty helper ───────────────────────────────────────────────────

export function visaDifficultyColor(difficulty = '') {
  const d = difficulty.toLowerCase()
  if (d === 'easy')     return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  if (d === 'moderate') return 'text-amber-400   bg-amber-500/10   border-amber-500/30'
  if (d === 'hard')     return 'text-rose-400    bg-rose-500/10    border-rose-500/30'
  return 'text-brand-400 bg-brand-500/10 border-brand-500/30'
}

// ─── Country flag emoji ───────────────────────────────────────────────────────

const COUNTRY_FLAGS = {
  canada:           '🇨🇦',
  usa:              '🇺🇸',
  'united states':  '🇺🇸',
  uk:               '🇬🇧',
  'united kingdom': '🇬🇧',
  australia:        '🇦🇺',
  germany:          '🇩🇪',
  ireland:          '🇮🇪',
  france:           '🇫🇷',
  netherlands:      '🇳🇱',
  sweden:           '🇸🇪',
  'new zealand':    '🇳🇿',
  singapore:        '🇸🇬',
  japan:            '🇯🇵',
  italy:            '🇮🇹',
  spain:            '🇪🇸',
}

export function countryFlag(country = '') {
  return COUNTRY_FLAGS[country.toLowerCase()] || '🌍'
}

// ─── Open payment helper (re-exported from api.js for legacy components) ─────

export function openPayment({ url, amount, name, description, prefillEmail, prefillPhone, onSuccess, onFailure }) {
  if (url && url !== '#') {
    window.open(url, '_blank', 'noopener,noreferrer')
    onSuccess?.()
    return
  }
  const key = CONFIG.razorpayKey
  if (!key) {
    console.warn('[GlobalPath] Razorpay key not configured.')
    onFailure?.('Payment gateway not configured.')
    return
  }
  const launchModal = () => {
    const rzp = new window.Razorpay({
      key,
      amount:      (amount || 0) * 100,
      currency:    'INR',
      name:        CONFIG.platformName,
      description: description || 'Study Abroad Package',
      prefill:     { email: prefillEmail || '', contact: prefillPhone || '' },
      theme:       { color: '#7c3aed' },
      handler:     (response) => onSuccess?.(response),
      modal:       { ondismiss: () => onFailure?.('Payment cancelled.') },
    })
    rzp.open()
  }
  if (!window.Razorpay) {
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = launchModal
    document.body.appendChild(s)
  } else {
    launchModal()
  }
}
