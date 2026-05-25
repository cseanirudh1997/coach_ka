/**
 * NeuralPath — shared utility helpers
 */

import CONFIG from './config.js'

// ─── Session ──────────────────────────────────────────────────────────────────

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
  } catch { /* storage blocked */ }
}

export function clearSession() {
  try {
    localStorage.removeItem(CONFIG.sessionKey)
  } catch { /* storage blocked */ }
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

export function formatRelativeTime(timeStr) {
  return timeStr || '—'
}

// ─── Razorpay ─────────────────────────────────────────────────────────────────

/**
 * Open a Razorpay payment link fetched from the backend.
 * If a payment URL is provided, open it in a new tab.
 * If a key + order_id is provided, launch the Razorpay JS SDK.
 */
export function openPayment({ url, amount, name, description, prefillEmail, prefillPhone, onSuccess, onFailure }) {
  if (url && url !== '#') {
    window.open(url, '_blank', 'noopener,noreferrer')
    return
  }
  const key = CONFIG.razorpayKey
  if (!key) {
    console.warn('[NeuralPath] Razorpay key not configured. Set VITE_RAZORPAY_KEY.')
    onFailure?.('Payment gateway not configured.')
    return
  }
  if (!window.Razorpay) {
    // Load Razorpay SDK dynamically
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => openRazorpayModal({ key, amount, name, description, prefillEmail, prefillPhone, onSuccess, onFailure })
    document.body.appendChild(script)
  } else {
    openRazorpayModal({ key, amount, name, description, prefillEmail, prefillPhone, onSuccess, onFailure })
  }
}

function openRazorpayModal({ key, amount, name, description, prefillEmail, prefillPhone, onSuccess, onFailure }) {
  const options = {
    key,
    amount:      (amount || 0) * 100, // paise
    currency:    'INR',
    name:        CONFIG.platformName,
    description: description || 'Program Enrollment',
    prefill: {
      email: prefillEmail || '',
      contact: prefillPhone || '',
    },
    theme: { color: '#7c3aed' },
    handler: (response) => onSuccess?.(response),
    modal: { ondismiss: () => onFailure?.('Payment cancelled.') },
  }
  const rzp = new window.Razorpay(options)
  rzp.open()
}

// ─── Misc ──────────────────────────────────────────────────────────────────────

export function clsx(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function truncate(str, maxLen = 120) {
  if (!str) return ''
  return str.length > maxLen ? str.slice(0, maxLen).trimEnd() + '…' : str
}

export function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')
}

export function pluralize(n, singular, plural) {
  return `${n} ${n === 1 ? singular : (plural || singular + 's')}`
}

export const PROGRAM_ICONS = {
  brain:    '🧠',
  chart:    '📊',
  sparkles: '✨',
  target:   '🎯',
}
