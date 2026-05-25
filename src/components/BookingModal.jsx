import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Tag, CheckCircle, Loader2, CreditCard, AlertCircle, Shield, LayoutDashboard } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getPaymentLinks, getCoupons, createBooking } from '../api.js'
import { formatCurrency, openPayment } from '../utils.js'

export default function BookingModal({ program, session, onClose }) {
  const [payLinks,   setPayLinks]   = useState([])
  const [coupon,     setCoupon]     = useState('')
  const [couponRes,  setCouponRes]  = useState(null)   // { valid, discountPercent, type, message }
  const [couponLoad, setCouponLoad] = useState(false)
  const [booking,    setBooking]    = useState(false)
  const [booked,     setBooked]     = useState(false)

  // Use canonical programId field with id fallback
  const programId = program.programId || program.id

  // Fetch payment links for this program
  useEffect(() => {
    getPaymentLinks({ programId })
      .then(r => { if (r.success) setPayLinks((r.links || []).filter(l => l.active !== false)) })
      .catch(() => {})
  }, [programId])

  // Computed price after discount
  // Backend returns discountPercent (canonical); support legacy discount field as fallback
  const basePrice      = program.price || 0
  const discountPct    = couponRes?.valid ? (couponRes.discountPercent ?? couponRes.discount ?? 0) : 0
  const finalPrice     = couponRes?.valid && couponRes?.type === 'percent'
    ? Math.round(basePrice * (1 - discountPct / 100))
    : basePrice
  const savingAmount   = basePrice - finalPrice

  async function handleCoupon() {
    if (!coupon.trim()) return
    setCouponLoad(true)
    try {
      const res = await getCoupons({ code: coupon.trim(), programId })
      setCouponRes(res)
      if (res.valid)  toast.success(res.message || `Coupon applied! ${res.discountPercent ?? res.discount ?? 0}% off`)
      else            toast.error(res.message || 'Invalid or expired coupon.')
    } catch {
      toast.error('Could not validate coupon. Please try again.')
    } finally {
      setCouponLoad(false)
    }
  }

  async function handlePay(link) {
    if (!session) {
      toast.error('Please log in to enroll.')
      return
    }
    setBooking(true)
    try {
      // Create booking record first — writes to Bookings sheet via GAS backend
      const bookingRes = await createBooking({
        userId:    session.userId,
        username:  session.username,
        programId,
        coupon:    couponRes?.valid ? coupon : undefined,
      })
      if (!bookingRes?.success) {
        toast.error(bookingRes?.message || 'Booking could not be saved. Please try again.')
        return
      }

      // Use paymentUrl (canonical backend field); fallback to url for compatibility
      openPayment({
        url:          link?.paymentUrl || link?.url,
        amount:       finalPrice,
        name:         program.title,
        description:  `Enrollment — ${program.title}`,
        prefillEmail: session.email || '',
        prefillPhone: session.phone || '',
        onSuccess: () => {
          setBooked(true)
          toast.success('Payment successful! Welcome to NeuralPath 🎉')
        },
        onFailure: (msg) => {
          toast.error(msg || 'Payment was not completed.')
        },
      })
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="booking-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="glass-heavy w-full max-w-md rounded-2xl overflow-hidden"
        >
          {/* Gradient bar */}
          <div className="h-1 bg-gradient-to-r from-brand-600 via-violet-400 to-brand-600" />

          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold mb-1">Enroll in Program</h2>
                <p className="text-sm text-white/50">{program.title}</p>
                {program.category && (
                  <span className="inline-flex mt-1.5 text-xs px-2 py-0.5 rounded-full bg-brand-600/20 text-brand-300 border border-brand-600/30">
                    {program.category}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:border-red-500/40 hover:text-red-400 transition-all text-white/40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {booked ? (
              /* ── Success state ── */
              <div className="text-center py-8 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-brand-600/20 border border-brand-500 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">You're Enrolled! 🎉</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Welcome to <strong className="text-white">{program.title}</strong>.
                    Check your email for onboarding details and your first mentor session slot.
                  </p>
                </div>
                <div className="flex flex-col gap-2.5 w-full mt-1">
                  <Link to="/dashboard" onClick={onClose} className="btn-brand w-full justify-center">
                    <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                  </Link>
                  <button onClick={onClose} className="btn-ghost w-full justify-center text-sm">
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* ── Price summary ── */}
                <div className="glass p-4 rounded-xl mb-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-white/40 mb-1">Program Fee</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {couponRes?.valid ? (
                          <>
                            <span className="text-2xl font-bold gradient-text">{formatCurrency(finalPrice)}</span>
                            <span className="text-sm text-white/40 line-through">{formatCurrency(basePrice)}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                              {discountPct}% off
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold gradient-text">{formatCurrency(basePrice)}</span>
                        )}
                      </div>
                      {couponRes?.valid && savingAmount > 0 && (
                        <div className="text-xs text-emerald-400 mt-1">
                          You save {formatCurrency(savingAmount)} 🎉
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-white/30 text-right shrink-0">
                      {program.duration && <div className="font-medium text-white/50">{program.duration}</div>}
                      <div>EMI available</div>
                    </div>
                  </div>
                </div>

                {/* ── Coupon ── */}
                <div className="mb-5">
                  <label className="block text-xs text-white/50 mb-1.5">
                    Have a coupon code?{' '}
                    <span className="text-brand-400">Try LAUNCH25 or FAANG50</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="text"
                        value={coupon}
                        onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponRes(null) }}
                        placeholder="Enter code…"
                        className="np-input pl-10"
                        onKeyDown={e => e.key === 'Enter' && handleCoupon()}
                      />
                    </div>
                    <button
                      onClick={handleCoupon}
                      disabled={couponLoad || !coupon.trim()}
                      className="btn-ghost px-4 py-2 text-sm whitespace-nowrap"
                    >
                      {couponLoad ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                  {couponRes && !couponRes.valid && (
                    <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {couponRes.message}
                    </p>
                  )}
                  {couponRes?.valid && (
                    <p className="flex items-center gap-1 text-xs text-emerald-400 mt-1.5">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> {couponRes.message}
                    </p>
                  )}
                </div>

                {/* ── Payment buttons ── */}
                <div className="flex flex-col gap-3">
                  {payLinks.length > 0 ? (
                    payLinks.map(link => (
                      <button
                        key={link.paymentId || link.title}
                        onClick={() => handlePay(link)}
                        disabled={booking}
                        className={link.type === 'full'
                          ? 'btn-brand py-3.5 w-full justify-center'
                          : 'btn-ghost py-3.5 w-full justify-center'}
                      >
                        {booking
                          ? <Loader2 className="w-5 h-5 animate-spin" />
                          : (
                            <>
                              <CreditCard className="w-5 h-5" />
                              {link.title || link.label}
                              {link.amount ? ` — ${formatCurrency(link.amount)}` : ''}
                            </>
                          )
                        }
                      </button>
                    ))
                  ) : (
                    <button
                      onClick={() => handlePay({})}
                      disabled={booking}
                      className="btn-brand py-3.5 w-full justify-center"
                    >
                      {booking
                        ? <Loader2 className="w-5 h-5 animate-spin" />
                        : <><CreditCard className="w-5 h-5" /> Pay {formatCurrency(finalPrice)}</>
                      }
                    </button>
                  )}
                </div>

                {/* ── Trust note ── */}
                <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-white/30">
                  <Shield className="w-3.5 h-3.5" />
                  Secure payment via Razorpay · 7-day money-back guarantee
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
