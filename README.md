# NeuralPath — AI & ML Career Accelerator Platform

> **The premium platform for engineers who want to crack FAANG AI/ML roles.**  
> Mentorship · Mock Interviews · Structured Roadmaps · GenAI Coaching

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.3-646cff?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff4785)](https://www.framer.com/motion/)

---

## Overview

NeuralPath is a full-featured career accelerator web app built for AI/ML engineers targeting top-tier companies (Google, Meta, Amazon, Microsoft, OpenAI, and more). It combines a CMS-driven marketing homepage with a personalised student dashboard, dynamic booking flow, and an AI mentor chatbot — all powered by a Google Apps Script (Google Sheets) backend.

**Live backend:**  
`https://script.google.com/macros/s/AKfycbzQ6ONQ0km56MOsHaFbNzYXWZcb40So_BNSTEz0j9DMTvjCzgDic6Q_FaYvNpjY93E/exec`

---

## Key Features

| Feature | Description |
|---|---|
| **Programs** | Dynamically loaded from backend — FAANG prep tracks with featured/category badges |
| **Live Sessions** | Bookable mentorship, mock interviews, and workshops with seat counts and pricing |
| **Career Roadmaps** | Role-specific roadmaps (Applied Scientist, ML Engineer, GenAI) with phase-grouped steps |
| **AI Insights** | Real-time AI hiring trends, salary benchmarks, GenAI demand metrics |
| **Testimonials** | Success stories carousel with aggregate rating stats |
| **Resources Library** | Tier-gated (free/premium) PDFs, videos, templates — locked for non-premium users |
| **Student Dashboard** | Progress tracking (DSA / ML / System Design), mock interview results, resume reviews, notifications |
| **AI Mentor Chatbot** | Context-aware career chatbot with quick prompts and conversation history |
| **Booking & Payments** | Coupon system (LAUNCH25 / FAANG50), Razorpay payment links, EMI support |
| **Auth** | Signup/Login with tier-based session (free/premium), onboarding stage tracking |
| **Contact / Consultation** | FAANG consultation request form with service type, experience level, and target company |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **UI Framework** | React 18 + Vite 5 |
| **Styling** | Tailwind CSS 3 (custom `glass`, `btn-brand`, `section-heading` utilities) |
| **Animations** | Framer Motion 11 (scroll-triggered, spring physics, AnimatePresence) |
| **Routing** | React Router DOM 6 |
| **Charts** | Recharts (AreaChart + RadarChart in Dashboard) |
| **Icons** | Lucide React |
| **Toasts** | React Hot Toast |
| **Payments** | Razorpay JS SDK (lazy-loaded) |
| **Backend** | Google Apps Script Web App (REST-style POST, JSON response) |
| **Data Storage** | Google Sheets (one sheet per entity type) |

---

## Project Structure

```
neural-path/
├── src/
│   ├── api.js              # All backend calls — single source of truth for API actions
│   ├── config.js           # Platform config (backend URL, Razorpay key, social links)
│   ├── utils.js            # Session helpers, formatCurrency, openPayment (Razorpay), initials
│   ├── main.jsx            # App entry point
│   ├── App.jsx             # Router setup
│   ├── Home.jsx            # Landing page composition
│   ├── Dashboard.jsx       # Authenticated student dashboard
│   ├── Login.jsx           # Login page
│   ├── Signup.jsx          # Signup page with goal + target company selection
│   └── components/
│       ├── Navbar.jsx          # Fixed top nav, mobile hamburger, session-aware CTAs
│       ├── Hero.jsx            # Hero section — rotating roles, metrics, announcement banner
│       ├── Programs.jsx        # Programs grid with BookingModal integration
│       ├── Sessions.jsx        # Live sessions cards with booking flow
│       ├── Roadmap.jsx         # Role selector + phase-grouped roadmap steps
│       ├── AIInsights.jsx      # AI market insights with severity badges + stats bar
│       ├── Testimonials.jsx    # Scrollable testimonials carousel
│       ├── Resources.jsx       # Tier-gated resource library
│       ├── Contact.jsx         # FAANG consultation booking form
│       ├── Footer.jsx          # Footer with nav columns, social links, trust stats
│       ├── Chatbot.jsx         # Floating AI mentor chatbot
│       └── BookingModal.jsx    # Program enrollment modal with coupon + Razorpay
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example            # Environment variable template
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+ (or Bun)
- A Google Apps Script Web App deployment (see [Backend Setup](#backend-setup))

### Install & Run

```bash
# Clone the repo
git clone <your-repo-url>
cd neural-path

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# → Edit .env and fill in your values (Razorpay key, social links, etc.)

# Start development server (opens at http://localhost:5174)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Environment Variables

All `VITE_*` variables are exposed to the browser bundle. Store secrets server-side.

| Variable | Required | Description |
|---|---|---|
| `VITE_BACKEND_URL` | Optional | Google Apps Script Web App URL. Defaults to the bundled GAS endpoint. |
| `VITE_RAZORPAY_KEY` | For payments | Razorpay Key ID (`rzp_test_...` or `rzp_live_...`) |
| `VITE_WHATSAPP_LINK` | Optional | WhatsApp community/support link |
| `VITE_LINKEDIN_PAGE` | Optional | LinkedIn company page URL |
| `VITE_YOUTUBE_CHANNEL` | Optional | YouTube channel URL |

> **Note:** If `VITE_BACKEND_URL` is not set, the app automatically uses the production GAS endpoint defined in `src/config.js`.

---

## Backend Setup

The backend is a **Google Apps Script (GAS) Web App** that reads from and writes to Google Sheets. Each entity type maps to a separate sheet tab.

### Sheet Schema

| Sheet | Columns |
|---|---|
| `Programs` | `programId \| title \| category \| duration \| price \| featured` |
| `Sessions` | `sessionId \| title \| mentor \| duration \| type \| price` |
| `StudentProgress` | `username \| targetCompany \| dsaProgress \| mlProgress \| systemDesignProgress \| status` |
| `MockInterviews` | `interviewId \| username \| role \| score \| feedback \| nextSteps` |
| `ResumeReviews` | `reviewId \| username \| targetRole \| status \| reviewerNotes` |
| `Testimonials` | `name \| company \| review \| rating` |
| `Roadmaps` | `roadmapId \| role \| title \| duration` |
| `RoadmapSteps` | `stepId \| roadmapId \| phase \| title \| completed` |
| `MediaAssets` | `assetId \| entityType \| entityId \| assetUrl \| assetType \| featured` |
| `MentorSlots` | `slotId \| mentor \| date \| startTime \| endTime \| available` |
| `PaymentLinks` | `paymentId \| title \| amount \| paymentUrl \| active` |
| `PlatformConfig` | `key \| value` |
| `MentorResources` | `resourceId \| title \| category \| resourceUrl \| tier` |
| `Coupons` | `couponCode \| discountPercent \| active \| expiry` |
| `Bookings` | `bookingId \| username \| userId \| sessionId \| programId \| preferredDate \| preferredTime \| notes \| coupon \| status` |
| `Notifications` | `notificationId \| username \| title \| message \| read` |
| `AIInsights` | `timestamp \| insight \| severity` |
| `Users` | `userId \| username \| name \| email \| phone \| role \| tier \| onboardingStage` |

### GAS API Actions

All requests are HTTP POST with `Content-Type: text/plain` and a JSON body containing an `action` field.

```js
// Example request shape
POST https://script.google.com/macros/s/.../exec
Content-Type: text/plain

{
  "action": "getPrograms"
}
```

| Action | Payload | Returns |
|---|---|---|
| `signup` | `username, name, email, phone, password, goal, role, tier` | `{ success, userId, username, role, tier, onboardingStage }` |
| `login` | `email, password` | `{ success, userId, username, name, email, role, tier, onboardingStage, token }` |
| `getPrograms` | — | `{ success, programs[] }` |
| `getSessions` | — | `{ success, sessions[] }` |
| `createBooking` | `username, userId, sessionId?, programId?, coupon?` | `{ success, bookingId }` |
| `getBookings` | `userId, username` | `{ success, bookings[] }` |
| `getStudentProgress` | `userId, username` | `{ success, progress{} }` |
| `getMockInterviews` | `userId, username` | `{ success, interviews[] }` |
| `getResumeReviews` | `userId, username` | `{ success, reviews[] }` |
| `getTestimonials` | — | `{ success, testimonials[] }` |
| `getDashboardMetrics` | `userId?` | `{ success, metrics{} }` |
| `getAIInsights` | `userId?` | `{ success, insights[] }` |
| `getMediaAssets` | `entityType?, entityId?` | `{ success, assets[] }` |
| `getMentorSlots` | `mentorId?` | `{ success, slots[] }` |
| `getPaymentLinks` | `programId` | `{ success, links[] }` |
| `getPlatformConfig` | — | `{ success, config{} }` |
| `getNotifications` | `userId, username` | `{ success, notifications[] }` |
| `getCoupons` | `code, programId` | `{ success, valid, discountPercent, type, message }` |
| `getMentorResources` | `programId?` | `{ success, resources[] }` |
| `getRoadmaps` | `programId?` | `{ success, roadmaps[] }` |
| `getRoadmapSteps` | `roadmapId` | `{ success, steps[] }` |
| `chat` | `userId, message, history[]` | `{ success, reply }` |
| `contact` | `name, email, phone, consultationType, experience, targetCompany, message` | `{ success }` |

### GAS Fallback Behaviour

Every API function in `src/api.js` wraps the real GAS call in a try/catch. If the backend is unreachable or returns an error, **richly structured mock data** is returned automatically — field names exactly match the backend column spec so switching to a real backend requires zero frontend changes.

---

## PlatformConfig Keys

The `PlatformConfig` sheet drives conditional UI behaviour. Add these rows:

| key | example value | effect |
|---|---|---|
| `paymentsEnabled` | `true` | Shows/hides payment flow |
| `mentorshipEnabled` | `true` | Shows/hides mentorship CTAs |
| `featuredProgram` | `p1` | Highlights a specific program |
| `announcementBanner` | `🔥 Next cohort June 1 — 12 seats left!` | Shown in Hero section |
| `whatsappLink` | `https://wa.me/91XXXXXXXXXX` | Used in Contact & Footer |
| `youtubeChannel` | `https://youtube.com/@neuralpath` | Footer social link |
| `linkedinPage` | `https://linkedin.com/company/neuralpath` | Footer social link |
| `newsletterEnabled` | `true` | Shows newsletter opt-in |
| `bookingMode` | `live` / `waitlist` / `closed` | Controls session registration |
| `supportEmail` | `support@neuralpath.ai` | Contact email |

---

## Session Object

After login/signup the session is stored in `localStorage` under the key `np_session`:

```json
{
  "userId":          "NP-123456",
  "username":        "rahulv",
  "name":            "Rahul Verma",
  "email":           "rahul@gmail.com",
  "phone":           "+91 98765 43210",
  "role":            "student",
  "tier":            "free",
  "onboardingStage": "active",
  "token":           "..."
}
```

**Tier values:** `free` | `premium` | `enterprise`  
**Role values:** `student` | `mentor` | `admin`

---

## Coupon Codes

Built-in dev/demo coupons (override in the GAS `Coupons` sheet):

| Code | Discount | Notes |
|---|---|---|
| `LAUNCH25` | 25% off | Launch promo |
| `FAANG50` | 50% off | Limited seats promo |

---

## Payments (Razorpay)

The payment flow is fully abstracted in `src/utils.js → openPayment()`:

1. If a `paymentUrl` is returned from the backend (`PaymentLinks` sheet), the user is redirected to that URL (Razorpay Payment Page link).
2. If a Razorpay Key ID is configured (`VITE_RAZORPAY_KEY`), the Razorpay JS SDK is **lazy-loaded** and a checkout modal is opened inline.
3. If neither is configured, a warning is logged and no payment is attempted.

EMI options are surfaced by adding a second row to `PaymentLinks` with `type = emi`.

---

## Architecture

```
Browser
  └── React SPA (Vite)
        ├── React Router (/, /login, /signup, /dashboard)
        ├── src/api.js  ──── POST ──→  Google Apps Script Web App
        │     └── (try/catch mock fallback if GAS unreachable)
        ├── src/config.js   (env vars + GAS URL)
        ├── src/utils.js    (session, Razorpay, formatters)
        └── components/
              ├── Home page  (Navbar + 9 sections + Chatbot)
              └── Dashboard  (sidebar + 6 panels)
```

Data flow for a typical page load:

1. `App.jsx` reads `localStorage` → restores session state
2. `Home.jsx` renders all sections; each section fetches its own data via `src/api.js`
3. API calls POST to the GAS Web App → GAS reads the relevant Sheet tab → returns JSON
4. If GAS is unreachable → mock data with identical schema is returned transparently

---

## Deployment

### Vercel / Netlify (recommended)

```bash
npm run build
# dist/ folder is the deployable artifact
```

Set environment variables in your hosting dashboard. `VITE_BACKEND_URL` is optional — the app ships with the GAS endpoint baked in.

### GitHub Pages

```bash
npm run build
# Deploy the dist/ folder to gh-pages branch
```

Add `base: '/your-repo-name/'` to `vite.config.js` if serving from a sub-path.

### GAS Backend Deployment

1. Open [script.google.com](https://script.google.com) and create a new project
2. Paste your GAS handler code (handles the `action` routing from the table above)
3. **Deploy → New Deployment → Web App**
   - Execute as: **Me**
   - Who has access: **Anyone** (required for unauthenticated frontend calls)
4. Copy the deployment URL → set as `VITE_BACKEND_URL` (or it's already the bundled default)

> **Re-deploying:** Each code change requires a new GAS deployment version. The URL remains the same if you select **"Manage Deployments → Edit"** rather than creating a new deployment.

---

## Customisation Guide

### Change platform name / tagline

Edit `src/config.js`:
```js
export const CONFIG = {
  platformName: 'YourBrand',
  tagline:      'Your tagline here',
  supportEmail: 'hello@yourdomain.com',
  // ...
}
```

### Add a new Program

Add a row to the `Programs` Google Sheet:
```
programId | title                     | category      | duration | price | featured
p5        | Interview Crash Course     | Interview Prep | 2 Weeks  | 4999  | false
```

No frontend code changes needed — the Programs component reads dynamically from the API.

### Change brand colour

Edit `tailwind.config.js` → `theme.extend.colors.brand`:
```js
brand: {
  400: '#a78bfa', // violet-400 by default
  500: '#8b5cf6',
  600: '#7c3aed',
  700: '#6d28d9',
}
```

### Add a nav section

1. Add the section component to `src/Home.jsx`
2. Add the anchor to `NAV_LINKS` in `src/components/Navbar.jsx`
3. Add the link to `LINKS.Platform` in `src/components/Footer.jsx`

---

## Contributing

```bash
# Create a feature branch
git checkout -b feature/your-feature

# Make changes, then
git add src/components/YourFile.jsx
git commit -m "feat: add your feature"
git push origin feature/your-feature
# → Open a PR
```

**Code style:**
- Prefer functional components and hooks
- Keep API calls in `src/api.js` only — never fetch directly from components
- Use `||` fallbacks for all backend field names (e.g. `s.sessionId || s.id`) to maintain graceful degradation
- Tailwind utility classes only — no inline styles or separate CSS files
- All currency via `formatCurrency()` from `src/utils.js`

---

## License

Private · All rights reserved · NeuralPath Technologies Pvt. Ltd.
