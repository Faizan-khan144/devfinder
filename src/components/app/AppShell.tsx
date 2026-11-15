import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Bookmark, Compass, Scale, Github, Home, Menu, X, Radio } from 'lucide-react'
import Logo from '../site/Logo'
import SearchBar from './SearchBar'

const NAV = [
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { to: '/compare', label: 'Compare', icon: Scale },
]

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all ${
              isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-raised hover:text-fg'
            }`
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function AppShell() {
  const [drawer, setDrawer] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-bg">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-surface px-4 py-5 lg:flex">
        <Link to="/" aria-label="DevFinder home">
          <Logo size={28} />
        </Link>

        <div className="mt-8">
          <div className="mb-2 px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-faint">
            Workspace
          </div>
          <NavItems />
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <div className="rounded-xl border border-line bg-bg p-3">
            <div className="flex items-center gap-2 text-[11.5px] font-medium text-fg">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping-ring absolute inline-flex h-full w-full rounded-full bg-ok" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ok" />
              </span>
              Live GitHub data
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-faint">
              Public API · 60 req/hour · cached 5 min
            </p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-[12.5px] text-muted transition-colors hover:bg-raised hover:text-fg"
          >
            <Home className="h-3.5 w-3.5" /> Marketing site
          </Link>
          <a
            href="https://docs.github.com/en/rest"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-[12.5px] text-muted transition-colors hover:bg-raised hover:text-fg"
          >
            <Github className="h-3.5 w-3.5" /> API docs
          </a>
        </div>
      </aside>

      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="scrim-in absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <div className="modal-in absolute inset-y-0 left-0 flex w-72 flex-col border-r border-line bg-surface px-4 py-5">
            <div className="flex items-center justify-between">
              <Logo size={26} />
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-8">
              <NavItems onNavigate={() => setDrawer(false)} />
            </div>
            <div className="mt-auto flex items-center gap-2 rounded-xl border border-line bg-bg px-3 py-2.5 text-[11.5px] text-muted">
              <Radio className="h-3.5 w-3.5 text-ok" /> Live public GitHub data
            </div>
          </div>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-muted lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <Link to="/" className="lg:hidden" aria-label="DevFinder home">
              <Logo size={24} withWord={false} />
            </Link>
            <div className="max-w-md flex-1">
              <SearchBar />
            </div>
            <Link
              to="/"
              className="ml-auto hidden items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-2 text-[12.5px] font-medium text-muted transition-colors hover:border-line-strong hover:text-fg sm:flex"
            >
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
          </div>
        </header>

        <main key={location.pathname} className="app-fade pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
