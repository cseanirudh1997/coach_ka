import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'

import { getSession } from './utils.js'
import Home      from './Home.jsx'
import Login     from './Login.jsx'
import Signup    from './Signup.jsx'
import Dashboard from './Dashboard.jsx'

// ─── Auth Guard ───────────────────────────────────────────────────────────────
function RequireAuth({ children }) {
  const session = getSession()
  const location = useLocation()
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(getSession)

  // Keep session state in sync when localStorage changes (other tabs)
  useEffect(() => {
    const onStorage = () => setSession(getSession())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#18181b',
            color:      '#fff',
            border:     '1px solid rgba(124,58,237,0.3)',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#8b5cf6', secondary: '#fff' } },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/"          element={<Home    session={session} setSession={setSession} />} />
          <Route path="/login"     element={<Login   setSession={setSession} />} />
          <Route path="/signup"    element={<Signup  setSession={setSession} />} />
          <Route path="/dashboard" element={
            <RequireAuth>
              <Dashboard session={session} setSession={setSession} />
            </RequireAuth>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}
