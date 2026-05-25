/**
 * GlobalPath — Study Abroad & Visa Consulting Platform
 * Centralized API utility — all requests via POST to Google Apps Script backend
 */

import CONFIG from './config.js'

const API_URL = CONFIG.backendUrl

// ─── Lightweight in-memory cache ───────────────────────────────────────────
const _cache = new Map()
const CACHE_TTL = 2 * 60 * 1000 // 2 minutes

function cacheGet(key) {
  const entry = _cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.ts > CACHE_TTL) { _cache.delete(key); return null }
  return entry.data
}
function cacheSet(key, data) {
  _cache.set(key, { data, ts: Date.now() })
}

// ─── Core POST wrapper ──────────────────────────────────────────────────────
async function post(payload, { cache = false } = {}) {
  const cacheKey = JSON.stringify(payload)
  if (cache) {
    const hit = cacheGet(cacheKey)
    if (hit) return hit
  }
  try {
    const res = await fetch(API_URL, {
      method:  'POST',
      body:    JSON.stringify(payload),
      headers: { 'Content-Type': 'text/plain' }, // GAS requires text/plain for CORS
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    if (cache && json.success) cacheSet(cacheKey, json)
    return json
  } catch (err) {
    console.error('[GlobalPath API]', payload.action, err)
    return { success: false, message: err.message || 'Network error' }
  }
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function signup({ username, email, phone, password }) {
  return post({ action: 'signup', username, email, phone, password, role: 'student', tier: 'free' })
}

export async function login({ username, password }) {
  return post({ action: 'login', username, password })
}

// ─── Public Content ─────────────────────────────────────────────────────────

export async function getPrograms() {
  return post({ action: 'getPrograms' }, { cache: true })
}

export async function getSessions() {
  return post({ action: 'getSessions' }, { cache: true })
}

export async function getTestimonials() {
  return post({ action: 'getTestimonials' }, { cache: true })
}

export async function getDashboardMetrics() {
  return post({ action: 'getDashboardMetrics' }, { cache: true })
}

export async function getAIInsights() {
  return post({ action: 'getAIInsights' }, { cache: true })
}

export async function getMediaAssets({ entityType, entityId } = {}) {
  return post({ action: 'getMediaAssets', entityType, entityId })
}

export async function getPlatformConfig() {
  return post({ action: 'getPlatformConfig' }, { cache: true })
}

export async function getMentorResources() {
  return post({ action: 'getMentorResources' }, { cache: true })
}

export async function getRoadmaps() {
  return post({ action: 'getRoadmaps' }, { cache: true })
}

export async function getRoadmapSteps({ roadmapId }) {
  return post({ action: 'getRoadmapSteps', roadmapId }, { cache: true })
}

export async function getPaymentLinks() {
  return post({ action: 'getPaymentLinks' }, { cache: true })
}

export async function getMentorSlots({ mentor } = {}) {
  return post({ action: 'getMentorSlots', mentor })
}

export async function getCoupons({ code } = {}) {
  return post({ action: 'getCoupons', code })
}

// ─── Study Abroad Specific ──────────────────────────────────────────────────

export async function getUniversities() {
  return post({ action: 'getUniversities' }, { cache: true })
}

export async function getCountries() {
  return post({ action: 'getCountries' }, { cache: true })
}

export async function getExams() {
  return post({ action: 'getExams' }, { cache: true })
}

export async function getVisaGuides() {
  return post({ action: 'getVisaGuides' }, { cache: true })
}

export async function getWebinars() {
  return post({ action: 'getWebinars' }, { cache: true })
}

// ─── User-Scoped ─────────────────────────────────────────────────────────────

export async function createBooking({ username, sessionId, preferredDate, preferredTime, notes }) {
  return post({ action: 'createBooking', username, sessionId, preferredDate, preferredTime, notes: notes || '' })
}

export async function getBookings({ username }) {
  return post({ action: 'getBookings', username })
}

export async function getStudentProgress({ username }) {
  return post({ action: 'getStudentProgress', username })
}

export async function getMockInterviews({ username }) {
  return post({ action: 'getMockInterviews', username })
}

export async function getResumeReviews({ username }) {
  return post({ action: 'getResumeReviews', username })
}

export async function getNotifications({ username }) {
  return post({ action: 'getNotifications', username })
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export async function chat({ message, history = [] }) {
  return post({ action: 'chat', message, history })
}

// ─── Media Asset Helper ───────────────────────────────────────────────────────

/**
 * Find first matching asset by entityType + optional entityId
 */
export function resolveAsset(assets = [], entityType, entityId) {
  if (!Array.isArray(assets)) return null
  return assets.find(a =>
    a.entityType === entityType &&
    (!entityId || String(a.entityId) === String(entityId))
  ) || null
}

/**
 * Open Razorpay payment URL or trigger SDK checkout
 */
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
      description: description || 'Counseling Package',
      prefill: { email: prefillEmail || '', contact: prefillPhone || '' },
      theme: { color: '#7c3aed' },
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
