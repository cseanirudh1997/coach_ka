/**
 * NeuralPath — platform configuration
 *
 * Replace BACKEND_URL with your Google Apps Script Web App URL once deployed.
 * Example: https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '__SET_BACKEND_URL__'

if (BACKEND_URL === '__SET_BACKEND_URL__') {
  console.warn(
    '[NeuralPath] ⚠️  Backend URL not configured.\n' +
    'Set VITE_BACKEND_URL in your .env file or replace the placeholder in src/config.js.\n' +
    'API calls will use mock fallback data until a real URL is provided.'
  )
}

export const CONFIG = {
  backendUrl:     BACKEND_URL,
  platformName:   'NeuralPath',
  tagline:        'Accelerate Your AI & ML Career Into FAANG-Level Roles',
  supportEmail:   'support@neuralpath.ai',
  razorpayKey:    import.meta.env.VITE_RAZORPAY_KEY    || '',
  sessionKey:     'np_session',
  whatsappLink:   import.meta.env.VITE_WHATSAPP_LINK   || 'https://wa.me/919999999999',
  linkedinPage:   import.meta.env.VITE_LINKEDIN_PAGE   || '',
  youtubeChannel: import.meta.env.VITE_YOUTUBE_CHANNEL || '',
}

export default CONFIG
