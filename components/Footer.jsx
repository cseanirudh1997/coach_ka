import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, Twitter, Linkedin, Youtube, Github, Mail } from 'lucide-react'
import CONFIG from '../config.js'

const LINKS = {
  Platform: [
    { label: 'Programs',   href: '#programs'      },
    { label: 'Sessions',   href: '#sessions'       },
    { label: 'Roadmap',    href: '#roadmap'        },
    { label: 'Resources',  href: '#resources'      },
  ],
  Company: [
    { label: 'About',      href: '#'               },
    { label: 'Blog',       href: '#'               },
    { label: 'Careers',    href: '#'               },
    { label: 'Contact',    href: '#contact'        },
  ],
  Legal: [
    { label: 'Privacy Policy',     href: '#' },
    { label: 'Terms of Service',   href: '#' },
    { label: 'Refund Policy',      href: '#' },
  ],
}

const SOCIAL = [
  { icon: Twitter,  href: '#', label: 'Twitter'  },
  { icon: Linkedin, href: '#', label: 'LinkedIn'  },
  { icon: Youtube,  href: '#', label: 'YouTube'   },
  { icon: Github,   href: '#', label: 'GitHub'    },
]

export default function Footer() {
  const year = new Date().getFullYear()

  function scrollTo(href) {
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="border-t border-white/10 bg-surface-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand col */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Neural<span className="text-brand-400">Path</span>
              </span>
            </Link>
            <p className="text-sm text-white/40 max-w-xs leading-relaxed mb-6">
              The premium AI & ML career accelerator. From foundations to FAANG — we guide you every step of the way.
            </p>
            <div className="flex items-center gap-3">
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
              <ul className="flex flex-col gap-2">
                {links.map(link => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="text-sm text-white/40 hover:text-brand-400 transition-colors"
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
            © {year} NeuralPath. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <Mail className="w-3.5 h-3.5" />
            <a href={`mailto:${CONFIG.supportEmail}`} className="hover:text-brand-400 transition-colors">
              {CONFIG.supportEmail}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
