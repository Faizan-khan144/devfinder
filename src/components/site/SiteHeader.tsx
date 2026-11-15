import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Github, Menu, X } from 'lucide-react'
import Logo from './Logo'

const NAV = [
  { label: 'Features', href: '#features' },
  { label: 'Views', href: '#views' },
  { label: 'Modules', href: '#modules' },
  { label: 'Compare', href: '#compare' },
  { label: 'FAQ', href: '#faq' },
]

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const ids = NAV.map((item) => item.href.slice(1))
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <div className="mx-auto max-w-6xl">
        <div
          className={`nav-pill relative flex h-14 items-center justify-between overflow-hidden rounded-2xl border border-line/80 bg-bg/70 px-4 ring-1 ring-white/5 backdrop-blur-xl ${
            scrolled ? 'scrolled' : ''
          }`}
        >
          <span className="nav-hairline" />
          <Link to="/" className="group relative z-10 flex items-center" aria-label="DevFinder home">
            <span className="transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-110">
              <Logo size={28} />
            </span>
          </Link>

          <nav className="relative z-10 hidden items-center gap-6 text-[13.5px] font-medium text-muted lg:flex">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`nav-link transition-colors ${active === item.href.slice(1) ? 'on font-semibold text-fg' : 'hover:text-fg'}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="relative z-10 flex items-center gap-1.5">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden h-9 w-9 items-center justify-center rounded-xl border border-line text-muted transition-colors hover:bg-raised hover:text-fg sm:flex"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <Link
              to="/explore"
              className="btn-shine hidden items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-fg shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5 hover:bg-accent-hover sm:flex"
            >
              Open app <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMenu((value) => !value)}
              aria-label="Menu"
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-surface transition-colors hover:bg-raised lg:hidden"
            >
              {menu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {menu && (
          <div className="nav-menu mt-2 flex flex-col gap-1 rounded-2xl border border-line bg-surface/95 p-3 shadow-2xl backdrop-blur-xl lg:hidden">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenu(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-accent/10 hover:text-accent"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/explore"
              onClick={() => setMenu(false)}
              className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg"
            >
              Open app <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
