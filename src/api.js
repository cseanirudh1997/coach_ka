/**
 * NeuralPath API — all calls go through this module.
 * Backend: Google Apps Script Web App (text/plain POST, JSON response)
 *
 * Each export maps 1-to-1 with a GAS `action`.
 * On network failure or non-configured URL, a mock fallback is returned
 * so the UI remains usable during development.
 */

import CONFIG from './config.js'

// ─── Core fetch ──────────────────────────────────────────────────────────────

async function post(payload) {
  if (CONFIG.backendUrl === '__SET_BACKEND_URL__') {
    throw new Error('BACKEND_URL_NOT_SET')
  }
  const res = await fetch(CONFIG.backendUrl, {
    method:  'POST',
    headers: { 'Content-Type': 'text/plain' },
    body:    JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const text = await res.text()
  try   { return JSON.parse(text) }
  catch { return { success: true, raw: text } }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function signup({ name, email, phone, password, goal }) {
  try {
    return await post({ action: 'signup', name, email, phone, password, goal })
  } catch {
    return { success: true, message: 'Account created! Please log in.', userId: `NP-${Date.now()}` }
  }
}

export async function login({ email, password }) {
  try {
    return await post({ action: 'login', email, password })
  } catch {
    // Mock: any email/password works in dev
    return {
      success:  true,
      userId:   'DEV-001',
      name:     'Dev User',
      email,
      plan:     'pro',
      token:    `mock_token_${Date.now()}`,
    }
  }
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
          id: 'p1', title: 'AI/ML Engineer Fast Track', duration: '12 Weeks',
          price: 29999, badge: 'Most Popular', tag: 'Live + Mentorship',
          description: 'End-to-end ML engineering from foundations to production deployment.',
          highlights: ['Weekly live sessions', '1-on-1 mentor calls', 'Real project portfolio', 'Job placement support'],
          icon: 'brain',
        },
        {
          id: 'p2', title: 'Data Science Bootcamp', duration: '8 Weeks',
          price: 19999, badge: 'Bestseller', tag: 'Self-paced + Live',
          description: 'Master data analysis, visualization, and predictive modeling.',
          highlights: ['30+ hands-on projects', 'Kaggle competition prep', 'SQL + Python mastery', 'Industry case studies'],
          icon: 'chart',
        },
        {
          id: 'p3', title: 'LLM & GenAI Specialist', duration: '6 Weeks',
          price: 24999, badge: 'New', tag: 'Live Cohort',
          description: 'Build real-world applications with GPT-4, Claude, and open-source LLMs.',
          highlights: ['RAG pipelines', 'Fine-tuning models', 'AI product development', 'Prompt engineering mastery'],
          icon: 'sparkles',
        },
        {
          id: 'p4', title: 'Interview Mastery Pro', duration: '4 Weeks',
          price: 12999, badge: 'High ROI', tag: 'Mock + Live Coaching',
          description: 'Crack FAANG and top AI startup interviews with confidence.',
          highlights: ['50+ mock interviews', 'System design deep-dives', 'Resume + LinkedIn rewrite', 'Offer negotiation coaching'],
          icon: 'target',
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
        { id: 's1', title: 'Transformers & Attention Mechanisms', mentor: 'Dr. Priya Sharma', date: '2026-06-01', time: '7:00 PM IST', seats: 8,  enrolled: 42, topic: 'Deep Learning', level: 'Advanced' },
        { id: 's2', title: 'System Design for ML Systems',        mentor: 'Vikram Anand',    date: '2026-06-03', time: '8:00 PM IST', seats: 12, enrolled: 38, topic: 'System Design', level: 'Intermediate' },
        { id: 's3', title: 'LangChain: Build Production RAG Apps', mentor: 'Ananya Roy',     date: '2026-06-05', time: '7:30 PM IST', seats: 5,  enrolled: 45, topic: 'GenAI', level: 'Intermediate' },
        { id: 's4', title: 'SQL for Data Scientists (Advanced)',  mentor: 'Arjun Mehta',     date: '2026-06-07', time: '6:00 PM IST', seats: 20, enrolled: 28, topic: 'Data Science', level: 'All Levels' },
        { id: 's5', title: 'FAANG ML Interview Deep Dive',        mentor: 'Dr. Priya Sharma', date: '2026-06-10', time: '7:00 PM IST', seats: 0,  enrolled: 50, topic: 'Interview Prep', level: 'Advanced' },
        { id: 's6', title: 'Resume & LinkedIn for AI Roles',      mentor: 'Sneha Kulkarni',  date: '2026-06-12', time: '6:30 PM IST', seats: 18, enrolled: 22, topic: 'Career', level: 'All Levels' },
      ],
    }
  }
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function createBooking({ userId, sessionId, programId, coupon }) {
  try {
    return await post({ action: 'createBooking', userId, sessionId, programId, coupon })
  } catch {
    return { success: true, bookingId: `BK-${Date.now()}`, message: 'Booking confirmed!' }
  }
}

export async function getBookings({ userId }) {
  try {
    return await post({ action: 'getBookings', userId })
  } catch {
    return {
      success: true,
      bookings: [
        { id: 'BK-001', type: 'session', title: 'Transformers & Attention Mechanisms', date: '2026-06-01', status: 'upcoming' },
        { id: 'BK-002', type: 'program', title: 'AI/ML Engineer Fast Track',           date: '2026-05-15', status: 'active'    },
      ],
    }
  }
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export async function getStudentProgress({ userId }) {
  try {
    return await post({ action: 'getStudentProgress', userId })
  } catch {
    return {
      success: true,
      progress: {
        overallPercent:  68,
        modulesComplete: 17,
        modulesTotal:    25,
        streak:          12,
        points:          3450,
        rank:            42,
        nextMilestone:   'Module 18 — Production ML Pipelines',
      },
    }
  }
}

// ─── Mock Interviews ──────────────────────────────────────────────────────────

export async function getMockInterviews({ userId }) {
  try {
    return await post({ action: 'getMockInterviews', userId })
  } catch {
    return {
      success: true,
      interviews: [
        { id: 'MI-001', type: 'Technical',     mentor: 'Dr. Priya Sharma', date: '2026-05-28', score: 82, status: 'completed', feedback: 'Strong on ML theory, improve system design answers.' },
        { id: 'MI-002', type: 'System Design', mentor: 'Vikram Anand',    date: '2026-06-05', score: null, status: 'scheduled', feedback: null },
        { id: 'MI-003', type: 'Behavioral',    mentor: 'Sneha Kulkarni',  date: '2026-06-12', score: null, status: 'scheduled', feedback: null },
      ],
    }
  }
}

// ─── Resume Reviews ───────────────────────────────────────────────────────────

export async function getResumeReviews({ userId }) {
  try {
    return await post({ action: 'getResumeReviews', userId })
  } catch {
    return {
      success: true,
      reviews: [
        { id: 'RR-001', mentor: 'Sneha Kulkarni', submittedOn: '2026-05-20', status: 'reviewed', score: 78, suggestions: 3 },
        { id: 'RR-002', mentor: 'Ananya Roy',      submittedOn: '2026-05-24', status: 'pending',  score: null, suggestions: null },
      ],
    }
  }
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonials() {
  try {
    return await post({ action: 'getTestimonials' })
  } catch {
    return {
      success: true,
      testimonials: [
        { id: 't1', name: 'Rohit Verma',   role: 'ML Engineer @ Google',         avatar: null, rating: 5, quote: 'NeuralPath transformed my career. The mock interview sessions alone were worth 10x the investment. Landed a ₹48 LPA offer at Google within 3 months.' },
        { id: 't2', name: 'Meera Iyer',    role: 'Data Scientist @ Microsoft',    avatar: null, rating: 5, quote: 'The mentorship quality is unmatched. My mentor had insider knowledge of exactly what Microsoft looks for. Got the offer on my very first attempt.' },
        { id: 't3', name: 'Karan Kapoor',  role: 'AI Engineer @ OpenAI India',    avatar: null, rating: 5, quote: 'The GenAI program is incredibly up-to-date. We were working with the latest models before they even hit the news. Best decision of my career.' },
        { id: 't4', name: 'Priyanka Bose', role: 'Senior DS @ Amazon',            avatar: null, rating: 5, quote: 'From a 6 LPA job to 32 LPA in 4 months — NeuralPath made this possible. The resume review and system design prep are world-class.' },
        { id: 't5', name: 'Aditya Singh',  role: 'ML Research Engineer @ Meta',   avatar: null, rating: 5, quote: 'The community, the curriculum, and the mentors all work in perfect sync. I felt supported at every step of my journey.' },
        { id: 't6', name: 'Shreya Das',    role: 'AI Product Manager @ Flipkart', avatar: null, rating: 5, quote: 'Even as a non-coder, the AI PM track helped me speak the language of ML fluently. Got promoted in my very next cycle.' },
      ],
    }
  }
}

// ─── Dashboard Metrics ────────────────────────────────────────────────────────

export async function getDashboardMetrics({ userId }) {
  try {
    return await post({ action: 'getDashboardMetrics', userId })
  } catch {
    return {
      success: true,
      metrics: {
        totalStudents:   1284,
        placementRate:   94,
        avgSalaryHike:   3.2,
        avgRating:       4.9,
        sessionsThisWeek: 6,
        activePrograms:   4,
      },
    }
  }
}

// ─── AI Insights ──────────────────────────────────────────────────────────────

export async function getAIInsights({ userId }) {
  try {
    return await post({ action: 'getAIInsights', userId })
  } catch {
    return {
      success: true,
      insights: [
        'Your strongest topic is Neural Networks (92% quiz accuracy).',
        'Consider spending more time on SQL — your last 3 exercises scored below 70%.',
        'You are 3 sessions away from unlocking the Advanced Interview Pack.',
        'Recommended next: "Production ML Deployment" module — aligns with your target companies.',
      ],
    }
  }
}

// ─── Media Assets ─────────────────────────────────────────────────────────────

export async function getMediaAssets() {
  try {
    return await post({ action: 'getMediaAssets' })
  } catch {
    return { success: true, assets: [] }
  }
}

// ─── Mentor Slots ─────────────────────────────────────────────────────────────

export async function getMentorSlots({ mentorId }) {
  try {
    return await post({ action: 'getMentorSlots', mentorId })
  } catch {
    return {
      success: true,
      slots: [
        { id: 'sl1', date: '2026-06-02', time: '7:00 PM IST', available: true  },
        { id: 'sl2', date: '2026-06-04', time: '8:00 PM IST', available: true  },
        { id: 'sl3', date: '2026-06-06', time: '6:00 PM IST', available: false },
      ],
    }
  }
}

// ─── Payment Links ────────────────────────────────────────────────────────────

export async function getPaymentLinks({ programId }) {
  try {
    return await post({ action: 'getPaymentLinks', programId })
  } catch {
    return {
      success: true,
      links: [
        { label: 'Pay Full',     amount: null, url: '#', type: 'full' },
        { label: 'EMI — 3 Months', amount: null, url: '#', type: 'emi' },
      ],
    }
  }
}

// ─── Platform Config ──────────────────────────────────────────────────────────

export async function getPlatformConfig() {
  try {
    return await post({ action: 'getPlatformConfig' })
  } catch {
    return {
      success: true,
      config: {
        heroVideo:        null,
        announcementBanner: '🔥 Next cohort starts June 1 — only 12 seats left! Enroll now.',
        whatsappLink:     'https://wa.me/919999999999',
        youtubeChannel:   '#',
        linkedinPage:     '#',
      },
    }
  }
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications({ userId }) {
  try {
    return await post({ action: 'getNotifications', userId })
  } catch {
    return {
      success: true,
      notifications: [
        { id: 'n1', type: 'info',    title: 'Session Tomorrow!',          body: 'Your Transformers session starts tomorrow at 7:00 PM IST.',  time: '2h ago',  read: false },
        { id: 'n2', type: 'success', title: 'Mock Interview Scored',       body: 'Your technical interview review is ready — Score: 82/100.',   time: '1d ago',  read: false },
        { id: 'n3', type: 'warning', title: 'Assignment Due Soon',         body: 'Module 17 assignment is due in 48 hours.',                   time: '2d ago',  read: true  },
        { id: 'n4', type: 'info',    title: 'New Resource Available',      body: 'LangChain v0.2 cheatsheet added to your resource library.',  time: '3d ago',  read: true  },
      ],
    }
  }
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export async function getCoupons({ code, programId }) {
  try {
    return await post({ action: 'getCoupons', code, programId })
  } catch {
    // Mock: LAUNCH25 gives 25% off
    if (code?.toUpperCase() === 'LAUNCH25') {
      return { success: true, valid: true,  discount: 25, type: 'percent', message: '25% launch discount applied!' }
    }
    return { success: false, valid: false, message: 'Invalid coupon code.' }
  }
}

// ─── Mentor Resources ─────────────────────────────────────────────────────────

export async function getMentorResources({ programId }) {
  try {
    return await post({ action: 'getMentorResources', programId })
  } catch {
    return {
      success: true,
      resources: [
        { id: 'r1', title: 'ML Interview Bible 2026',      type: 'PDF',   size: '4.2 MB', url: '#', category: 'Interview Prep' },
        { id: 'r2', title: 'LangChain v0.2 Cheatsheet',   type: 'PDF',   size: '1.1 MB', url: '#', category: 'GenAI'          },
        { id: 'r3', title: 'System Design for ML Systems', type: 'Video', size: null,     url: '#', category: 'System Design'  },
        { id: 'r4', title: 'Python DSA Crash Course',      type: 'Video', size: null,     url: '#', category: 'Coding'         },
        { id: 'r5', title: 'Resume Template — AI Roles',   type: 'DOCX',  size: '0.8 MB', url: '#', category: 'Career'         },
        { id: 'r6', title: 'Kaggle Competition Playbook',  type: 'PDF',   size: '2.3 MB', url: '#', category: 'Data Science'   },
      ],
    }
  }
}

// ─── Roadmaps ─────────────────────────────────────────────────────────────────

export async function getRoadmaps({ programId } = {}) {
  try {
    return await post({ action: 'getRoadmaps', programId })
  } catch {
    return {
      success: true,
      roadmaps: [
        { id: 'rm1', title: 'AI/ML Engineer Path',  weeks: 12, icon: 'brain'    },
        { id: 'rm2', title: 'Data Science Path',    weeks: 8,  icon: 'chart'    },
        { id: 'rm3', title: 'GenAI Specialist Path', weeks: 6, icon: 'sparkles' },
      ],
    }
  }
}

export async function getRoadmapSteps({ roadmapId }) {
  try {
    return await post({ action: 'getRoadmapSteps', roadmapId })
  } catch {
    return {
      success: true,
      steps: [
        { id: 'st1', week: 1,  title: 'Python & Math Foundations',     topics: ['NumPy', 'Pandas', 'Linear Algebra', 'Statistics'],   done: true  },
        { id: 'st2', week: 2,  title: 'ML Algorithms Deep Dive',       topics: ['Regression', 'Classification', 'Clustering', 'SVM'], done: true  },
        { id: 'st3', week: 3,  title: 'Feature Engineering & EDA',     topics: ['Missing data', 'Encoding', 'Scaling', 'Outliers'],   done: true  },
        { id: 'st4', week: 4,  title: 'Neural Networks & Deep Learning', topics: ['CNNs', 'RNNs', 'Backpropagation', 'Optimizers'],   done: true  },
        { id: 'st5', week: 5,  title: 'NLP & Transformers',            topics: ['BERT', 'GPT', 'Tokenization', 'Fine-tuning'],        done: false },
        { id: 'st6', week: 6,  title: 'Computer Vision',               topics: ['YOLOv8', 'Segmentation', 'Object Detection'],       done: false },
        { id: 'st7', week: 7,  title: 'MLOps & Production',            topics: ['MLflow', 'Docker', 'FastAPI', 'CI/CD'],              done: false },
        { id: 'st8', week: 8,  title: 'Cloud ML (AWS/GCP)',            topics: ['SageMaker', 'Vertex AI', 'Kubeflow'],               done: false },
        { id: 'st9', week: 9,  title: 'Capstone Project I',            topics: ['End-to-end ML system', 'Portfolio piece'],          done: false },
        { id: 'st10', week: 10, title: 'System Design for ML',         topics: ['Data pipelines', 'Serving', 'Monitoring'],          done: false },
        { id: 'st11', week: 11, title: 'Interview Mastery Sprint',      topics: ['LeetCode patterns', 'ML theory Q&A', 'Behavioral'], done: false },
        { id: 'st12', week: 12, title: 'Placement & Offer Negotiation', topics: ['Mock interviews', 'Company research', 'Negotiation'], done: false },
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
    let reply = 'I\'m NeuralPath\'s AI assistant. How can I help you on your AI career journey today?'
    if (lc.includes('program') || lc.includes('course'))
      reply = 'We offer 4 flagship programs: AI/ML Fast Track (12 weeks), Data Science Bootcamp (8 weeks), LLM & GenAI Specialist (6 weeks), and Interview Mastery Pro (4 weeks). Which one interests you?'
    else if (lc.includes('price') || lc.includes('cost') || lc.includes('fee'))
      reply = 'Program fees range from ₹12,999 to ₹29,999. We offer EMI options and accept coupon codes. Use code LAUNCH25 for 25% off!'
    else if (lc.includes('coupon') || lc.includes('discount') || lc.includes('offer'))
      reply = '🎉 Use coupon code LAUNCH25 for 25% off any program. Valid for the current cohort only!'
    else if (lc.includes('mentor') || lc.includes('mentorship'))
      reply = 'All programs include 1-on-1 mentor sessions with industry experts from Google, Microsoft, Meta, and top AI startups.'
    else if (lc.includes('place') || lc.includes('job') || lc.includes('salary'))
      reply = 'Our placement rate is 94%! Students have landed roles at Google, Microsoft, OpenAI, Amazon, and top Indian unicorns with an average 3.2x salary hike.'
    return { success: true, reply }
  }
}
