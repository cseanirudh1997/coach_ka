import React from 'react'
import Navbar       from './components/Navbar.jsx'
import Hero         from './components/Hero.jsx'
import Countries    from './components/Countries.jsx'
import Universities from './components/Universities.jsx'
import Exams        from './components/Exams.jsx'
import VisaGuides   from './components/VisaGuides.jsx'
import Sessions     from './components/Sessions.jsx'
import Programs     from './components/Programs.jsx'
import Roadmap      from './components/Roadmap.jsx'
import Webinars     from './components/Webinars.jsx'
import AIInsights   from './components/AIInsights.jsx'
import Testimonials from './components/Testimonials.jsx'
import Resources    from './components/Resources.jsx'
import Contact      from './components/Contact.jsx'
import Footer       from './components/Footer.jsx'
import Chatbot      from './components/Chatbot.jsx'

export default function Home({ session, setSession }) {
  return (
    <div className="min-h-screen bg-surface-950 text-white">
      <Navbar session={session} setSession={setSession} />
      <main>
        <Hero         session={session} />
        <Countries />
        <Universities />
        <Exams />
        <VisaGuides />
        <Sessions     session={session} />
        <Programs     session={session} />
        <Roadmap />
        <Webinars />
        <AIInsights   session={session} />
        <Testimonials />
        <Resources    session={session} />
        <Contact />
      </main>
      <Footer />
      <Chatbot session={session} />
    </div>
  )
}
