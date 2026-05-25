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
  backendUrl:   BACKEND_URL,
  platformName: 'NeuralPath',
  tagline:      'Land Your Dream AI Role',
  supportEmail: 'support@neuralpath.ai',
  razorpayKey:  import.meta.env.VITE_RAZORPAY_KEY || '',
  sessionKey:   'np_session',
}

export default CONFIG
