/**
 * GlobalPath — Study Abroad & Visa Consulting Platform
 * Central configuration
 */

const GAS_BACKEND =
  'https://script.google.com/macros/s/AKfycbxMoR1PyeL1xYj102l1G-RApeZ2QAlGzFISMFvl6a8hSa0_q9Nk6ry-wjdy_5LgW5P2/exec'

const CONFIG = {
  backendUrl:    import.meta.env.VITE_BACKEND_URL || GAS_BACKEND,
  platformName:  'GlobalPath',
  tagline:       'Your Global Education Journey Starts Here',
  sessionKey:    'gp_session',
  razorpayKey:   import.meta.env.VITE_RAZORPAY_KEY || '',
  supportEmail:  'support@globalpath.in',
  supportPhone:  '+91 98765 43210',
  socialLinks: {
    twitter:   'https://twitter.com/globalpath',
    linkedin:  'https://linkedin.com/company/globalpath',
    youtube:   'https://youtube.com/@globalpath',
    instagram: 'https://instagram.com/globalpath',
  },
}

export default CONFIG
