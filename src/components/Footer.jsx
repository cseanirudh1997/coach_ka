import React from 'react'
import { Link } from 'react-router-dom'
import { Globe, Twitter, Linkedin, Youtube, Mail, MessageCircle, Instagram } from 'lucide-react'
import CONFIG from '../config.js'

const LINKS = {
  Services: [
    { label: 'Visa Consulting',       href: '#visa'         },
    { label: 'University Admissions', href: '#universities' },
    { label: 'IELTS / GRE Prep',     href: '#exams'        },
    { label: 'SOP & LOR Support',    href: '#programs'     },
    { label: 'Scholarship Guidance', href: '#programs'     },
  ],
  Destinations: [
    { label: 'Canada',          href: '#countries' },
    { label: 'United Kingdom',  href: '#countries' },
    { label: 'Australia',       href: '#countries' },
    { label: 'Germany',         href: '#countries' },
    { label: 'United States',   href: '#countries' },
  ],
  Resources: [
    { label: 'SOP Templates',    href: '#resources'   },
    { label: 'Visa Checklists',  href: '#visa'        },
    { label: 'IELTS Guides',     href: '#resources'   },
    { label: 'Webinars',         href: '#webinars'    },
    { label: 'Contact Us',       href: '#contact'     },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()

  const SOCIAL = [
    { icon: Twitter,       href: CONFIG.socialLinks?.twitter   || '#', label: 'Twitter'   },
    { icon: Linkedin,      href: CONFIG.socialLinks?.linkedin  || '#', label: 'LinkedIn'  },
    { icon: Youtube,       href: CONFIG.socialLinks?.youtube   || '#', label: 'YouTube'   },
    { icon: Instagram,     href: CONFIG.socialLinks?.instagram || '#', label: 'Instagram' },
    { icon: MessageCircle, href: CONFIG.whatsappLink           || '#', label: 'WhatsApp'  },
  ]

  function scrollTo(href) {
    if (href.startsWith('#') && href.length > 1) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="border-t border-white/10 bg-surface-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand col */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-brand group-hover:shadow-brand-lg transition-shadow">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Global<span className="text-brand-400">Path</span>
              </span>
            </Link>
            <p className="text-sm text-white/40 max-w-xs leading-relaxed mb-3">
              Premium study abroad counseling, visa guidance, and IELTS/GRE preparation for ambitious students. Trusted by 15,000+ students across India.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-white/30 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block flex-shrink-0" />
              94% visa success rate · 15,000+ students guided · 4.9★ avg rating
            </div>
            <div className="flex items-center gap-2">
              {SOCIAL.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:border-brand-500/40 hover:text-brand-400 text-white/40 transition-all"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white/80 mb-4">{title}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="text-sm text-white/40 hover:text-brand-400 transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {year} GlobalPath Study Abroad Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <Mail className="w-3.5 h-3.5" />
              <a href={`mailto:${CONFIG.supportEmail}`} className="hover:text-brand-400 transition-colors">
                {CONFIG.supportEmail}
              </a>
            </div>
            {CONFIG.supportPhone && (
              <a
                href={`tel:${CONFIG.supportPhone}`}
                className="flex items-center gap-1.5 text-xs text-white/30 hover:text-emerald-400 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                {CONFIG.supportPhone}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
