/**
 * NeuralPath API — all calls go through this module.
 * Backend: Google Apps Script Web App (text/plain POST, JSON response)
 *
 * Each export maps 1-to-1 with a GAS `action`.
 * Mock fallbacks use EXACT backend column names from the spec so that
 * switching to a real backend requires zero frontend changes.
 *
 * Backend column specs:
 *   Programs:       programId | title | category | duration | price | featured
 *   Sessions:       sessionId | title | mentor | duration | type | price
 *   StudentProgress: username | targetCompany | dsaProgress | mlProgress | systemDesignProgress | status
 *   MockInterviews: interviewId | username | role | score | feedback | nextSteps
 *   ResumeReviews:  reviewId | username | targetRole | status | reviewerNotes
 *   Testimonials:   name | company | review | rating
 *   Roadmaps:       roadmapId | role | title | duration
 *   RoadmapSteps:   stepId | roadmapId | phase | title | completed
 *   MediaAssets:    assetId | entityType | entityId | assetUrl | assetType | featured
 *   MentorSlots:    slotId | mentor | date | startTime | endTime | available
 *   PlatformConfig: key | value  (returned as flat object)
 *   MentorResources: resourceId | title | category | resourceUrl | tier
 */

import CONFIG from './config.js'

// ─── Core fetch ──────────────────────────────────────────────────────────────

async function post(payload) {
  if (CONFIG.backendUrl === '__SET_BACKEND_URL__') {
    throw new Error('BACKEND_URL_NOT_SET')
  }
  try {
    const res = await fetch(CONFIG.backendUrl, {
      method:   'POST',
      headers:  { 'Content-Type': 'text/plain' },
      body:     JSON.stringify(payload),
      redirect: 'follow',
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const text = await res.text()
    try   { return JSON.parse(text) }
    catch { return { success: true, raw: text } }
  } catch (err) {
    console.error(`[NeuralPath] ${payload.action} failed:`, err.message)
    throw err
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function signup({ username, name, email, phone, password, goal, role, tier }) {
  return await post({ action: 'signup', username, name, email, phone, password, goal, role, tier })
}

export async function login({ email, password }) {
  return await post({ action: 'login', email, password })
}

// ─── Programs ────────────────────────────────────────────────────────────────

export async function getPrograms() {
  try {
    return await post({ action: 'getPrograms' })
  } catch {
    return {
      success: true,
      programs: [
        {
          programId:   'p1',
          title:       'FAANG Applied Scientist Track',
          category:    'Interview Prep',
          duration:    '12 Weeks',
          price:       29999,
          featured:    true,
          badge:       'Most Popular',
          tag:         'Live + Mentorship',
          description: 'End-to-end preparation for Applied Scientist roles at Google, Meta, Amazon. ML theory, coding, system design, and behavioral rounds.',
          highlights:  ['Weekly 1:1 mentor sessions', 'Mock interviews with FAANG engineers', 'ML theory deep-dives', 'Offer negotiation coaching'],
          icon:        'brain',
        },
        {
          programId:   'p2',
          title:       'GenAI Engineering Accelerator',
          category:    'GenAI',
          duration:    '6 Weeks',
          price:       24999,
          featured:    true,
          badge:       'Trending',
          tag:         'Live Cohort',
          description: 'Build production-grade GenAI systems with LLMs, RAG pipelines, and agentic architectures.',
          highlights:  ['RAG & fine-tuning projects', 'LangChain + LlamaIndex', 'AI product development', 'Prompt engineering mastery'],
          icon:        'sparkles',
        },
        {
          programId:   'p3',
          title:       'ML System Design Mastery',
          category:    'System Design',
          duration:    '8 Weeks',
          price:       19999,
          featured:    false,
          badge:       'Bestseller',
          tag:         'Self-paced + Live',
          description: 'Master ML system design interviews with real-world case studies from recommendation engines to real-time prediction platforms.',
          highlights:  ['30+ ML design templates', 'Real FAANG case studies', 'Scalability patterns', 'Design document reviews'],
          icon:        'chart',
        },
        {
          programId:   'p4',
          title:       'Senior DS Leadership Program',
          category:    'Leadership',
          duration:    '4 Weeks',
          price:       12999,
          featured:    false,
          badge:       'High ROI',
          tag:         'Mock + Coaching',
          description: 'Transition to senior IC and leadership roles. Resume overhaul, mock interviews, and executive presence coaching.',
          highlights:  ['50+ mock interviews', 'Resume + LinkedIn rewrite', 'Behavioral coaching', 'Salary negotiation workshop'],
          icon:        'target',
        },
      ],
    }
  }
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export async function getSessions() {
  try {
    return await post({ action: 'getSessions' })
  } catch {
    return {
      success: true,
      sessions: [
        { sessionId: 's1', title: 'FAANG ML Interview Deep Dive',       mentor: 'Dr. Priya Sharma', duration: '90 min', type: 'Mock Interview',   price: 2999, seats: 8,  enrolled: 42, topic: 'Interview Prep', level: 'Advanced'     },
        { sessionId: 's2', title: 'ML System Design — Live Workshop',    mentor: 'Vikram Anand',    duration: '2 hrs',  type: 'Workshop',          price: 1499, seats: 12, enrolled: 38, topic: 'System Design', level: 'Intermediate'  },
        { sessionId: 's3', title: 'LangChain: Build Production RAG',     mentor: 'Ananya Roy',      duration: '90 min', type: 'Technical Session',  price: 0,    seats: 5,  enrolled: 45, topic: 'GenAI',         level: 'Intermediate'  },
        { sessionId: 's4', title: 'AI Resume & LinkedIn Overhaul',       mentor: 'Sneha Kulkarni',  duration: '60 min', type: 'Resume Review',     price: 999,  seats: 20, enrolled: 28, topic: 'Career',        level: 'All Levels'   },
        { sessionId: 's5', title: 'Applied Scientist Behavioral Rounds', mentor: 'Dr. Priya Sharma', duration: '60 min', type: 'Mock Interview',   price: 1999, seats: 0,  enrolled: 50, topic: 'Behavioral',    level: 'Advanced'     },
        { sessionId: 's6', title: 'Transformers & Attention Mechanisms',  mentor: 'Arjun Mehta',     duration: '2 hrs',  type: 'Technical Session', price: 0,    seats: 18, enrolled: 22, topic: 'Deep Learning', level: 'Advanced'     },
      ],
    }
  }
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function createBooking({ username, userId, sessionId, programId, preferredDate, preferredTime, notes, coupon }) {
  try {
    return await post({ action: 'createBooking', username, userId, sessionId, programId, preferredDate, preferredTime, notes, coupon })
  } catch {
    return { success: true, bookingId: `BK-${Date.now()}`, message: 'Booking confirmed!' }
  }
}

export async function getBookings({ userId, username }) {
  try {
    return await post({ action: 'getBookings', userId, username })
  } catch {
    return {
      success: true,
      bookings: [
        { bookingId: 'BK-001', username: username || userId, sessionId: 's1', title: 'FAANG ML Interview Deep Dive',    preferredDate: '2026-06-01', preferredTime: '7:00 PM IST', status: 'upcoming' },
        { bookingId: 'BK-002', username: username || userId, sessionId: null,  title: 'FAANG Applied Scientist Track',  preferredDate: '2026-05-15', preferredTime: null,          status: 'active',   programId: 'p1' },
      ],
    }
  }
}

// ─── Student Progress ─────────────────────────────────────────────────────────
// Backend columns: username | targetCompany | dsaProgress | mlProgress | systemDesignProgress | status

export async function getStudentProgress({ userId, username }) {
  try {
    return await post({ action: 'getStudentProgress', userId, username })
  } catch {
    return {
      success: true,
      progress: {
        username:              username || userId || 'student',
        targetCompany:         'Google',
        dsaProgress:           72,
        mlProgress:            65,
        systemDesignProgress:  48,
        status:                'active',
      },
    }
  }
}

// ─── Mock Interviews ──────────────────────────────────────────────────────────
// Backend columns: interviewId | username | role | score | feedback | nextSteps

export async function getMockInterviews({ userId, username }) {
  try {
    return await post({ action: 'getMockInterviews', userId, username })
  } catch {
    return {
      success: true,
      interviews: [
        {
          interviewId: 'MI-001',
          username:    username || userId,
          role:        'Applied Scientist',
          score:       82,
          feedback:    'Strong on ML theory and probabilistic reasoning. Improve time complexity discussions in coding rounds.',
          nextSteps:   'Focus on dynamic programming patterns. Review distributed ML systems for system design.',
          mentor:      'Dr. Priya Sharma',
          date:        '2026-05-28',
          type:        'Technical',
          status:      'completed',
        },
        {
          interviewId: 'MI-002',
          username:    username || userId,
          role:        'ML Engineer',
          score:       null,
          feedback:    null,
          nextSteps:   null,
          mentor:      'Vikram Anand',
          date:        '2026-06-05',
          type:        'System Design',
          status:      'scheduled',
        },
        {
          interviewId: 'MI-003',
          username:    username || userId,
          role:        'Senior Data Scientist',
          score:       null,
          feedback:    null,
          nextSteps:   null,
          mentor:      'Sneha Kulkarni',
          date:        '2026-06-12',
          type:        'Behavioral',
          status:      'scheduled',
        },
      ],
    }
  }
}

// ─── Resume Reviews ───────────────────────────────────────────────────────────
// Backend columns: reviewId | username | targetRole | status | reviewerNotes

export async function getResumeReviews({ userId, username }) {
  try {
    return await post({ action: 'getResumeReviews', userId, username })
  } catch {
    return {
      success: true,
      reviews: [
        {
          reviewId:      'RR-001',
          username:      username || userId,
          targetRole:    'Applied Scientist @ Google',
          status:        'reviewed',
          reviewerNotes: 'Strong publications section. Quantify impact metrics on 3 bullet points. Remove outdated skills (Hadoop). Add GenAI project to top.',
          reviewer:      'Sneha Kulkarni',
          submittedOn:   '2026-05-20',
          score:         78,
        },
        {
          reviewId:      'RR-002',
          username:      username || userId,
          targetRole:    'Staff ML Engineer @ Meta',
          status:        'pending',
          reviewerNotes: null,
          reviewer:      'Ananya Roy',
          submittedOn:   '2026-05-24',
          score:         null,
        },
      ],
    }
  }
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
// Backend columns: name | company | review | rating

export async function getTestimonials() {
  try {
    return await post({ action: 'getTestimonials' })
  } catch {
    return {
      success: true,
      testimonials: [
        { id: 't1', name: 'Rohit Verma',   company: 'ML Engineer @ Google',         rating: 5, review: 'NeuralPath transformed my career. The mock interview sessions alone were worth 10x the investment. Landed a ₹48 LPA offer at Google within 3 months.' },
        { id: 't2', name: 'Meera Iyer',    company: 'Applied Scientist @ Microsoft', rating: 5, review: 'The mentorship quality is unmatched. My mentor had insider knowledge of exactly what Microsoft looks for. Got the offer on my very first attempt.' },
        { id: 't3', name: 'Karan Kapoor',  company: 'AI Engineer @ OpenAI India',   rating: 5, review: 'The GenAI program is incredibly up-to-date. We were working with the latest models before they even hit the news. Best decision of my career.' },
        { id: 't4', name: 'Priyanka Bose', company: 'Senior DS @ Amazon',           rating: 5, review: 'From a 6 LPA job to 32 LPA in 4 months — NeuralPath made this possible. The resume review and system design prep are world-class.' },
        { id: 't5', name: 'Aditya Singh',  company: 'ML Research Engineer @ Meta',  rating: 5, review: 'The community, the curriculum, and the mentors all work in perfect sync. I felt supported at every step of my FAANG preparation journey.' },
        { id: 't6', name: 'Shreya Das',    company: 'GenAI Lead @ Flipkart',        rating: 5, review: 'The GenAI accelerator took me from zero to production-grade LLM deployments in 6 weeks. Got promoted and doubled my compensation package.' },
      ],
    }
  }
}

// ─── Dashboard Metrics ────────────────────────────────────────────────────────

export async function getDashboardMetrics({ userId } = {}) {
  try {
    return await post({ action: 'getDashboardMetrics', userId })
  } catch {
    return {
      success: true,
      metrics: {
        totalStudents:    1284,
        placementRate:    94,
        avgSalaryHike:    3.2,
        avgRating:        4.9,
        sessionsThisWeek: 6,
        activePrograms:   4,
        mockInterviews:   3840,
        mentorshipCalls:  9120,
        placements:       1207,
      },
    }
  }
}

// ─── AI Insights ──────────────────────────────────────────────────────────────
// Backend columns: timestamp | insight | severity

export async function getAIInsights({ userId } = {}) {
  try {
    return await post({ action: 'getAIInsights', userId })
  } catch {
    return {
      success: true,
      insights: [
        { timestamp: '2026-05-25', insight: 'Google is actively hiring Applied Scientists with strong GenAI experience — 3x more postings than Q1 2026.', severity: 'high' },
        { timestamp: '2026-05-24', insight: 'ML System Design is the #1 gap in FAANG interviews — candidates with structured prep are 4x more likely to pass.', severity: 'high' },
        { timestamp: '2026-05-23', insight: 'Median compensation for Senior Applied Scientists at top AI labs crossed ₹60 LPA in 2026.', severity: 'medium' },
        { timestamp: '2026-05-22', insight: 'LLM fine-tuning and RAG architecture skills are now required in 67% of AI/ML job descriptions.', severity: 'medium' },
        { timestamp: '2026-05-21', insight: 'Meta and Amazon are running faster interview cycles — average time-to-offer is now 3 weeks.', severity: 'low' },
        { timestamp: '2026-05-20', insight: 'Causal inference and experimentation skills are increasingly valued at product-led companies like Airbnb and Uber.', severity: 'low' },
      ],
    }
  }
}

// ─── Media Assets ─────────────────────────────────────────────────────────────
// Backend columns: assetId | entityType | entityId | assetUrl | assetType | featured

export async function getMediaAssets({ entityType, entityId } = {}) {
  try {
    return await post({ action: 'getMediaAssets', entityType, entityId })
  } catch {
    return {
      success: true,
      assets: [
        // Placeholder assets — replace assetUrl values with real CDN URLs
        { assetId: 'a1', entityType: 'hero',    entityId: 'hero',  assetUrl: null, assetType: 'image', featured: true  },
        { assetId: 'a2', entityType: 'program', entityId: 'p1',    assetUrl: null, assetType: 'image', featured: true  },
        { assetId: 'a3', entityType: 'program', entityId: 'p2',    assetUrl: null, assetType: 'image', featured: false },
        { assetId: 'a4', entityType: 'program', entityId: 'p3',    assetUrl: null, assetType: 'image', featured: false },
        { assetId: 'a5', entityType: 'program', entityId: 'p4',    assetUrl: null, assetType: 'image', featured: false },
      ],
    }
  }
}

// Helper: find asset URL by entity type and ID from an assets array
export function resolveAsset(assets = [], entityType, entityId) {
  const match = assets.find(a => a.entityType === entityType && (entityId ? a.entityId === entityId : true) && a.assetUrl)
  return match?.assetUrl || null
}

// ─── Mentor Slots ─────────────────────────────────────────────────────────────
// Backend columns: slotId | mentor | date | startTime | endTime | available

export async function getMentorSlots({ mentorId } = {}) {
  try {
    return await post({ action: 'getMentorSlots', mentorId })
  } catch {
    return {
      success: true,
      slots: [
        { slotId: 'sl1', mentor: 'Dr. Priya Sharma', date: '2026-06-02', startTime: '7:00 PM',  endTime: '8:00 PM',  available: true  },
        { slotId: 'sl2', mentor: 'Vikram Anand',      date: '2026-06-04', startTime: '8:00 PM',  endTime: '9:00 PM',  available: true  },
        { slotId: 'sl3', mentor: 'Ananya Roy',         date: '2026-06-06', startTime: '6:00 PM',  endTime: '7:00 PM',  available: false },
        { slotId: 'sl4', mentor: 'Sneha Kulkarni',    date: '2026-06-08', startTime: '10:00 AM', endTime: '11:00 AM', available: true  },
      ],
    }
  }
}

// ─── Payment Links ────────────────────────────────────────────────────────────
// Backend columns: paymentId | title | amount | paymentUrl | active

export async function getPaymentLinks({ programId } = {}) {
  try {
    return await post({ action: 'getPaymentLinks', programId })
  } catch {
    return {
      success: true,
      links: [
        { paymentId: 'pl1', title: 'Pay Full',       amount: null, paymentUrl: '#', active: true, type: 'full' },
        { paymentId: 'pl2', title: 'EMI — 3 Months', amount: null, paymentUrl: '#', active: true, type: 'emi'  },
      ],
    }
  }
}

// ─── Platform Config ──────────────────────────────────────────────────────────
// Backend format: key | value table — returned as flat object

export async function getPlatformConfig() {
  try {
    return await post({ action: 'getPlatformConfig' })
  } catch {
    return {
      success: true,
      config: {
        // Spec-required keys (drive UI behavior)
        paymentsEnabled:    true,
        mentorshipEnabled:  true,
        featuredProgram:    'p1',
        supportEmail:       'support@neuralpath.ai',
        newsletterEnabled:  true,
        bookingMode:        'live',        // 'live' | 'waitlist' | 'closed'

        // Extended config
        announcementBanner: '🔥 Next FAANG cohort starts June 1 — only 12 seats left! Enroll now.',
        whatsappLink:        'https://wa.me/919999999999',
        youtubeChannel:      '#',
        linkedinPage:        '#',
      },
    }
  }
}

// ─── Notifications ────────────────────────────────────────────────────────────
// Backend columns: notificationId | username | title | message | read

export async function getNotifications({ userId, username } = {}) {
  try {
    return await post({ action: 'getNotifications', userId, username })
  } catch {
    return {
      success: true,
      notifications: [
        { notificationId: 'n1', username: username || userId, title: 'Mock Interview Tomorrow!',    message: 'Your Applied Scientist mock interview with Dr. Priya Sharma starts tomorrow at 7:00 PM IST.',  time: '2h ago',  read: false, type: 'info'    },
        { notificationId: 'n2', username: username || userId, title: 'Interview Feedback Ready',    message: 'Your technical interview review is ready — Score: 82/100. Check detailed feedback now.',        time: '1d ago',  read: false, type: 'success' },
        { notificationId: 'n3', username: username || userId, title: 'DSA Practice Reminder',      message: 'You haven\'t practiced DSA in 2 days. Maintain your streak — 5 LeetCode problems recommended.', time: '2d ago',  read: true,  type: 'warning' },
        { notificationId: 'n4', username: username || userId, title: 'New Resource: LLM Interview Guide', message: 'LLM Interview Guide 2026 added to your resource library. Covers top LLM interview patterns.', time: '3d ago', read: true, type: 'info' },
      ],
    }
  }
}

// ─── Coupons ──────────────────────────────────────────────────────────────────
// Backend columns: couponCode | discountPercent | active | expiry

export async function getCoupons({ code, programId } = {}) {
  try {
    return await post({ action: 'getCoupons', code, programId })
  } catch {
    if (code?.toUpperCase() === 'LAUNCH25') {
      return { success: true, valid: true,  couponCode: 'LAUNCH25', discountPercent: 25, active: true, type: 'percent', message: '25% launch discount applied!' }
    }
    if (code?.toUpperCase() === 'FAANG50') {
      return { success: true, valid: true,  couponCode: 'FAANG50',  discountPercent: 50, active: true, type: 'percent', message: '50% FAANG prep discount applied!' }
    }
    return { success: false, valid: false, message: 'Invalid or expired coupon code.' }
  }
}

// ─── Mentor Resources ─────────────────────────────────────────────────────────
// Backend columns: resourceId | title | category | resourceUrl | tier

export async function getMentorResources({ programId } = {}) {
  try {
    return await post({ action: 'getMentorResources', programId })
  } catch {
    return {
      success: true,
      resources: [
        { resourceId: 'r1', title: 'ML Interview Bible 2026',           category: 'Interview Prep', resourceUrl: '#', tier: 'free',    type: 'PDF',   size: '4.2 MB' },
        { resourceId: 'r2', title: 'FAANG System Design Patterns',      category: 'System Design',  resourceUrl: '#', tier: 'free',    type: 'PDF',   size: '3.1 MB' },
        { resourceId: 'r3', title: 'LangChain v0.2 Cheatsheet',         category: 'GenAI',          resourceUrl: '#', tier: 'free',    type: 'PDF',   size: '1.1 MB' },
        { resourceId: 'r4', title: 'LLM Fine-Tuning Masterclass',       category: 'GenAI',          resourceUrl: '#', tier: 'premium', type: 'Video', size: null     },
        { resourceId: 'r5', title: 'ML System Design — Live Recording',  category: 'System Design',  resourceUrl: '#', tier: 'premium', type: 'Video', size: null     },
        { resourceId: 'r6', title: 'AI Resume Template (FAANG Optimized)', category: 'Career',      resourceUrl: '#', tier: 'free',    type: 'DOCX',  size: '0.8 MB' },
        { resourceId: 'r7', title: 'Python DSA Crash Course',           category: 'Coding',         resourceUrl: '#', tier: 'free',    type: 'Video', size: null     },
        { resourceId: 'r8', title: 'Behavioral Interview Playbook',     category: 'Interview Prep', resourceUrl: '#', tier: 'premium', type: 'PDF',   size: '2.3 MB' },
      ],
    }
  }
}

// ─── Roadmaps ─────────────────────────────────────────────────────────────────
// Backend columns: roadmapId | role | title | duration

export async function getRoadmaps({ programId } = {}) {
  try {
    return await post({ action: 'getRoadmaps', programId })
  } catch {
    return {
      success: true,
      roadmaps: [
        { roadmapId: 'rm1', role: 'Applied Scientist',  title: 'Applied Scientist Roadmap', duration: '12 Weeks' },
        { roadmapId: 'rm2', role: 'ML Engineer',        title: 'ML Engineer Roadmap',       duration: '8 Weeks'  },
        { roadmapId: 'rm3', role: 'GenAI Engineer',     title: 'GenAI Engineer Roadmap',    duration: '6 Weeks'  },
      ],
    }
  }
}

// ─── Roadmap Steps ────────────────────────────────────────────────────────────
// Backend columns: stepId | roadmapId | phase | title | completed

export async function getRoadmapSteps({ roadmapId }) {
  try {
    return await post({ action: 'getRoadmapSteps', roadmapId })
  } catch {
    return {
      success: true,
      steps: [
        { stepId: 'st1',  roadmapId, phase: 'Phase 1 — Foundations',       title: 'Python & Math Foundations',        topics: ['NumPy', 'Pandas', 'Linear Algebra', 'Statistics'],           completed: true  },
        { stepId: 'st2',  roadmapId, phase: 'Phase 1 — Foundations',       title: 'ML Algorithms Deep Dive',          topics: ['Regression', 'Classification', 'Clustering', 'SVM'],          completed: true  },
        { stepId: 'st3',  roadmapId, phase: 'Phase 1 — Foundations',       title: 'Feature Engineering & EDA',        topics: ['Missing data', 'Encoding', 'Scaling', 'Outliers'],             completed: true  },
        { stepId: 'st4',  roadmapId, phase: 'Phase 2 — Core ML',           title: 'Neural Networks & Deep Learning',  topics: ['CNNs', 'RNNs', 'Backpropagation', 'Optimizers'],               completed: true  },
        { stepId: 'st5',  roadmapId, phase: 'Phase 2 — Core ML',           title: 'NLP & Transformers',               topics: ['BERT', 'GPT', 'Tokenization', 'Fine-tuning'],                  completed: false },
        { stepId: 'st6',  roadmapId, phase: 'Phase 2 — Core ML',           title: 'Probabilistic ML & Causal AI',     topics: ['Bayesian', 'A/B Testing', 'Causal Inference', 'DoWhy'],       completed: false },
        { stepId: 'st7',  roadmapId, phase: 'Phase 3 — Production & MLOps', title: 'MLOps & Production ML',           topics: ['MLflow', 'Docker', 'FastAPI', 'CI/CD'],                        completed: false },
        { stepId: 'st8',  roadmapId, phase: 'Phase 3 — Production & MLOps', title: 'Cloud ML (AWS/GCP)',              topics: ['SageMaker', 'Vertex AI', 'Kubeflow', 'Feature Stores'],        completed: false },
        { stepId: 'st9',  roadmapId, phase: 'Phase 4 — Interview Mastery', title: 'ML System Design Mastery',         topics: ['Rec systems', 'Ranking', 'Real-time serving', 'Monitoring'],   completed: false },
        { stepId: 'st10', roadmapId, phase: 'Phase 4 — Interview Mastery', title: 'Coding Interview Sprint',           topics: ['LeetCode patterns', 'DP', 'Graphs', 'Time complexity'],        completed: false },
        { stepId: 'st11', roadmapId, phase: 'Phase 4 — Interview Mastery', title: 'Behavioral & Leadership Rounds',   topics: ['STAR framework', 'Leadership principles', 'Conflict stories'], completed: false },
        { stepId: 'st12', roadmapId, phase: 'Phase 5 — Offer & Beyond',    title: 'Placement & Offer Negotiation',    topics: ['Mock interviews', 'Company research', 'Negotiation tactics'], completed: false },
      ],
    }
  }
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export async function chat({ userId, message, history = [] }) {
  try {
    return await post({ action: 'chat', userId, message, history })
  } catch {
    const lc = message.toLowerCase()
    let reply = "I'm NeuralPath's AI mentor assistant 🤖\n\nAsk me about FAANG prep, mentorship programs, mock interviews, or AI career guidance!"

    if (lc.includes('mock interview') || lc.includes('mock'))
      reply = 'Our mock interviews are conducted by FAANG engineers and senior AI leaders. Sessions are 60–90 minutes with detailed written feedback, score, and next steps. We cover technical, system design, and behavioral rounds.\n\nBook a session from the Live Sessions section!'
    else if (lc.includes('faang') || lc.includes('google') || lc.includes('meta') || lc.includes('amazon'))
      reply = 'Our FAANG Applied Scientist Track (12 weeks) is specifically designed for top-tier AI/ML interviews. Includes ML theory, coding, system design, and behavioral prep.\n\n94% of our students who complete the program receive at least one FAANG offer. Use code LAUNCH25 for 25% off!'
    else if (lc.includes('genai') || lc.includes('llm') || lc.includes('langchain'))
      reply = 'Our GenAI Engineering Accelerator (6 weeks) covers RAG pipelines, LLM fine-tuning, agentic systems, LangChain, LlamaIndex, and production deployment.\n\nBuilt for engineers who want to transition into or accelerate in GenAI roles.'
    else if (lc.includes('mentorship') || lc.includes('mentor'))
      reply = 'All programs include 1:1 mentorship with engineers from Google, Microsoft, Meta, OpenAI, and top AI startups. Mentors provide personalized guidance, resume reviews, and mock interviews.\n\nMentorship sessions can also be booked à la carte from our Live Sessions section.'
    else if (lc.includes('price') || lc.includes('cost') || lc.includes('fee') || lc.includes('pay'))
      reply = 'Program fees range from ₹12,999 to ₹29,999. All programs include EMI options.\n\n🎉 Use code LAUNCH25 for 25% off, or FAANG50 for 50% off any program!'
    else if (lc.includes('coupon') || lc.includes('discount') || lc.includes('offer'))
      reply = '🎉 Active coupons:\n• LAUNCH25 — 25% off any program\n• FAANG50 — 50% off (limited seats)\n\nApply at checkout in the program enrollment modal!'
    else if (lc.includes('roadmap') || lc.includes('path') || lc.includes('journey'))
      reply = 'We have structured roadmaps for:\n• Applied Scientist (12 weeks)\n• ML Engineer (8 weeks)\n• GenAI Engineer (6 weeks)\n\nEach roadmap has phases covering foundations, core ML, production, interview mastery, and offer negotiation.'
    else if (lc.includes('place') || lc.includes('job') || lc.includes('salary') || lc.includes('hike'))
      reply = 'Our placement rate is 94%! Students have landed roles at Google, Microsoft, Meta, OpenAI, Amazon, Airbnb, and top AI unicorns.\n\nAverage salary hike: 3.2x. Median offer for Applied Scientist roles: ₹52 LPA.'

    return { success: true, reply }
  }
}
