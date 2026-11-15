import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Github, History, ShieldCheck, X, Zap } from 'lucide-react'
import SearchBar from '../components/app/SearchBar'
import Avatar from '../components/app/Avatar'
import { FEATURED_DEVELOPERS, getRateLimit } from '../lib/github'
import { useBookmarks } from '../store/bookmarks'

export default function Explore() {
  const recent = useBookmarks((state) => state.recent)
  const clearRecent = useBookmarks((state) => state.clearRecent)
  const [rate, setRate] = useState<{ remaining: number; limit: number } | null>(null)

  useEffect(() => {
    let alive = true
    getRateLimit()
      .then((info) => {
        if (alive) setRate({ remaining: info.remaining, limit: info.limit })
      })
      .catch(() => undefined)
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping-ring absolute inline-flex h-full w-full rounded-full bg-ok" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ok" />
          </span>
          live · public API
          {rate && (
            <span className="text-faint">
              · {rate.remaining}/{rate.limit} left
            </span>
          )}
        </div>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Start with a username.</h1>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
          Type any GitHub handle — yours, a teammate's, someone whose commit you just read. DevFinder turns the
          profile into a page you can actually scan.
        </p>
        <div className="mx-auto mt-7 max-w-xl">
          <SearchBar size="lg" autoFocus placeholder="e.g. sindresorhus" />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-faint">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" /> No login
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-accent" /> Cached 5 minutes
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-accent" /> Rate-limit aware
          </span>
        </div>
      </div>

      {recent.length > 0 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <span className="flex items-center gap-1.5 text-[12px] text-faint">
            <History className="h-3.5 w-3.5" /> Recent
          </span>
          {recent.map((login) => (
            <Link
              key={login}
              to={`/u/${login}`}
              className="group flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2.5 text-[12.5px] text-muted transition-colors hover:border-accent/40 hover:text-fg"
            >
              <Avatar login={login} size={20} />
              {login}
            </Link>
          ))}
          <button
            type="button"
            onClick={clearRecent}
            className="flex items-center gap-1 rounded-full px-2 py-1 text-[11.5px] text-faint transition-colors hover:text-bad"
          >
            <X className="h-3 w-3" /> clear
          </button>
        </div>
      )}

      <section className="mt-14">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] text-accent">
              Suggested
            </div>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">Good places to start</h2>
          </div>
          <span className="hidden text-[12px] text-faint sm:block">Profiles open instantly — no key needed</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_DEVELOPERS.map(({ login, tagline }) => (
            <Link key={login} to={`/u/${login}`} className="app-card hoverable group flex flex-col p-4">
              <div className="flex items-center gap-3">
                <Avatar login={login} size={38} />
                <div className="min-w-0">
                  <div className="truncate font-mono text-[13px] font-semibold group-hover:text-accent">
                    {login}
                  </div>
                  <div className="truncate text-[11px] text-faint">github.com/{login}</div>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-[12.5px] leading-relaxed text-muted">{tagline}</p>
              <span className="mt-3 flex items-center gap-1 text-[11.5px] font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                Open profile <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-3">
        {[
          {
            step: '01',
            title: 'Search',
            text: 'One username. We pull the profile, up to 100 public repositories and the latest public events.',
          },
          {
            step: '02',
            title: 'Read',
            text: 'Language fingerprint, star-weighted top work, activity momentum and account age — all on one page.',
          },
          {
            step: '03',
            title: 'Compare',
            text: 'Save people to bookmarks, or put two developers side by side and let the numbers speak.',
          },
        ].map((item) => (
          <div key={item.step} className="app-card p-5">
            <div className="font-mono text-[11px] font-semibold text-accent">{item.step}</div>
            <h3 className="mt-2 font-display text-lg font-semibold">{item.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{item.text}</p>
          </div>
        ))}
      </section>

      <div className="mt-10 flex flex-col items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-5 py-4 text-[12.5px] text-muted sm:flex-row">
        <span className="flex items-center gap-2">
          <Github className="h-4 w-4 text-accent" /> Data is read live from the public GitHub REST API.
        </span>
        <a
          href="https://docs.github.com/en/rest"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 font-medium text-accent hover:underline"
        >
          Read the API docs <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  )
}
