import { Github, Heart, Shield, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

const COLUMNS = [
  {
    head: 'Product',
    links: [
      { label: 'Explore', to: '/explore' },
      { label: 'Compare', to: '/compare' },
      { label: 'Bookmarks', to: '/bookmarks' },
    ],
  },
  {
    head: 'On this page',
    links: [
      { label: 'Features', to: '/#features' },
      { label: 'Views', to: '/#views' },
      { label: 'Modules', to: '/#modules' },
      { label: 'FAQ', to: '/#faq' },
    ],
  },
  {
    head: 'Data',
    links: [
      { label: 'GitHub REST API', to: '/#roadmap' },
      { label: 'Rate limits', to: '/#faq' },
      { label: 'Privacy', to: '/#faq' },
    ],
  },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-bg py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo size={30} />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            A reader for GitHub profiles. Languages, momentum, top work and honest comparisons — straight from the
            public API.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 font-mono text-[11px] text-faint">
            <span className="chip border border-line bg-surface px-2.5 py-1">
              <Shield className="h-3 w-3 text-accent" /> no login
            </span>
            <span className="chip border border-line bg-surface px-2.5 py-1">
              <Zap className="h-3 w-3 text-accent" /> 5 min cache
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.head}>
              <div className="mb-3 font-semibold">{column.head}</div>
              <div className="flex flex-col gap-2.5 text-muted">
                {column.links.map((link) => (
                  <Link key={link.label} to={link.to} className="transition-colors hover:text-accent">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-line px-6 pt-6 text-[13px] text-faint sm:flex-row">
        <span>© {new Date().getFullYear()} DevFinder — public data, read carefully.</span>
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-accent" /> built with React + Vite
          </span>
          <a
            href="https://docs.github.com/en/rest"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-accent"
          >
            <Github className="h-3.5 w-3.5" /> API docs
          </a>
        </span>
      </div>
    </footer>
  )
}
