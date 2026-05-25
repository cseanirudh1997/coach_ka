import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Tag, CheckCircle, Loader2, CreditCard, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { getPaymentLinks, getCoupons, createBooking } from '../api.js'
import { formatCurrency, openPayment } from '../utils.js'

export default function BookingModal({ program, session, onClose }) {
  const [payLinks,   setPayLinks]   = useState([])
  const [coupon,     setCoupon]     = useState('')
  const [couponRes,  setCouponRes]  = useState(null)   // { valid, discount, type, message }
  const [couponLoad, setCouponLoad] = useState(false)
  const [booking,    setBooking]    = useState(false)
  const [booked,     setBooked]     = useState(false)

  // Fetch payment links for this program
  useEffect(() => {
    getPaymentLinks({ programId: program.id })
      .then(r => { if (r.success) setPayLinks(r.links || []) })
      .catch(() => {})
  }, [program.id])

  // Computed price after discount
  const basePrice = program.price || 0
  const discount  = couponRes?.valid ? couponRes.discount : 0
  const finalPrice = couponRes?.valid && couponRes?.type === 'percent'
    ? Math.round(basePrice * (1 - discount / 100))
    : basePrice

  async function handleCoupon() {
    if (!coupon.trim()) return
    setCouponLoad(true)
    try {
      const res = await getCoupons({ code: coupon.trim(), programId: program.id })
      setCouponRes(res)
      if (res.valid)  toast.success(res.message || 'Coupon applied!')
      else            toast.error(res.message || 'Invalid coupon.')
    } catch {
      toast.error('Could not validate coupon.')
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
      // Create booking record first
      await createBooking({
        userId:    session.userId,
        programId: program.id,
        coupon:    couponRes?.valid ? coupon : undefined,
      })

      // Open payment
      openPayment({
        url:          link?.url,
        amount:       finalPrice,
        name:         program.title,
        description:  `Enrollment — ${program.title}`,
        prefillEmail: session.email  || '',
        prefillPhone: session.phone  || '',
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
          {/* Header */}
          <div className="h-1 bg-gradient-to-r from-brand-600 via-violet-400 to-brand-600" />
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold mb-1">Enroll in Program</h2>
                <p className="text-sm text-white/50">{program.title}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:border-red-500/40 hover:text-red-400 transition-all text-white/40">
                <X className="w-4 h-4" />
              </button>
            </div>

            {booked ? (
              // Success state
              <div className="text-center py-8 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-brand-600/20 border border-brand-500 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">You're Enrolled! 🎉</h3>
                  <p className="text-sm text-white/60">
                    Welcome to <strong className="text-white">{program.title}</strong>.
                    Check your email for onboarding instructions.
                  </p>
                </div>
                <button onClick={onClose} className="btn-brand mt-2 w-full justify-center">
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <>
                {/* Price summary */}
                <div className="glass p-4 rounded-xl mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/40 mb-1">Program Fee</div>
                    <div className="flex items-center gap-2">
                      {couponRes?.valid ? (
                        <>
                          <span className="text-xl font-bold gradient-text">{formatCurrency(finalPrice)}</span>
                          <span className="text-sm text-white/40 line-through">{formatCurrency(basePrice)}</span>
                          <span className="badge-green text-xs">{discount}% off</span>
                        </>
                      ) : (
                        <span className="text-xl font-bold gradient-text">{formatCurrency(basePrice)}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-white/30 text-right">
                    {program.duration}<br/>EMI available
                  </div>
                </div>

                {/* Coupon */}
                <div className="mb-5">
                  <label className="block text-xs text-white/50 mb-1.5">Have a coupon code?</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="text"
                        value={coupon}
                        onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponRes(null) }}
                        placeholder="LAUNCH25"
                        className="np-input pl-10"
                        onKeyDown={e => e.key === 'Enter' && handleCoupon()}
                      />
                    </div>
                    <button
                      onClick={handleCoupon}
                      disabled={couponLoad || !coupon.trim()}
                      className="btn-ghost px-4 py-2 text-sm"
                    >
                      {couponLoad ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                  {couponRes && !couponRes.valid && (
                    <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> {couponRes.message}
                    </p>
                  )}
                  {couponRes?.valid && (
                    <p className="flex items-center gap-1 text-xs text-emerald-400 mt-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> {couponRes.message}
                    </p>
                  )}
                </div>

                {/* Payment buttons */}
                <div className="flex flex-col gap-3">
                  {payLinks.length > 0 ? (
                    payLinks.map(link => (
                      <button
                        key={link.label}
                        onClick={() => handlePay(link)}
                        disabled={booking}
                        className={link.type === 'full' ? 'btn-brand py-3.5 w-full justify-center' : 'btn-ghost py-3.5 w-full justify-center'}
                      >
                        {booking
                          ? <Loader2 className="w-5 h-5 animate-spin" />
                          : <><CreditCard className="w-5 h-5" /> {link.label}</>
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

                {/* Trust note */}
                <p className="text-center text-xs text-white/30 mt-4">
                  🔒 Secure payment via Razorpay · 7-day money-back guarantee
                </p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
