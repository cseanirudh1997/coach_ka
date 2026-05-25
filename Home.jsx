import React from 'react'
import Navbar       from './components/Navbar.jsx'
import Hero         from './components/Hero.jsx'
import Programs     from './components/Programs.jsx'
import Sessions     from './components/Sessions.jsx'
import Roadmap      from './components/Roadmap.jsx'
import Testimonials from './components/Testimonials.jsx'
import AIInsights   from './components/AIInsights.jsx'
import Resources    from './components/Resources.jsx'
import Contact      from './components/Contact.jsx'
import Footer       from './components/Footer.jsx'
import Chatbot      from './components/Chatbot.jsx'

export default function Home({ session, setSession }) {
  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar session={session} setSession={setSession} />

      <main>
        <Hero        session={session} />
        <Programs    session={session} />
        <Sessions    session={session} />
        <Roadmap     />
        <AIInsights  />
        <Testimonials />
        <Resources   session={session} />
        <Contact     />
      </main>

      <Footer />
      <Chatbot session={session} />
    </div>
  )
}
