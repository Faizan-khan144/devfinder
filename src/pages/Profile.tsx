import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  AtSign,
  Bookmark,
  Building2,
  CalendarClock,
  CalendarDays,
  FolderGit2,
  Github,
  Link2,
  MapPin,
  Scale,
  Search,
  Star,
  Users,
} from 'lucide-react'
import Avatar from '../components/app/Avatar'
import StatCard from '../components/app/StatCard'
import LanguageBars from '../components/app/LanguageBars'
import Sparkline from '../components/app/Sparkline'
import RepoCard from '../components/app/RepoCard'
import EventRow from '../components/app/EventRow'
import ErrorState from '../components/app/ErrorState'
import { ProfileSkeleton } from '../components/app/Skeletons'
import { GithubError, getProfile } from '../lib/github'
import type { ProfileBundle } from '../lib/github'
import {
  accountAge,
  activityByDay,
  languageColor,
  languageStats,
  relativeTime,
  topRepos,
  totalForks,
  totalStars,
} from '../lib/derive'
import type { LanguageSlice } from '../lib/derive'
import { useBookmarks } from '../store/bookmarks'

function LanguageDonut({ slices }: { slices: LanguageSlice[] }) {
  const top = slices.slice(0, 5)
  const totalPercent = top.reduce((sum, slice) => sum + slice.percent, 0) || 1
  const radius = 40
  const circumference = 2 * Math.PI * radius

  const segments = top.reduce<{ name: string; length: number; offset: number }[]>((acc, slice) => {
    const length = (slice.percent / totalPercent) * circumference
    const offset = acc.length ? acc[acc.length - 1].offset + acc[acc.length - 1].length : 0
    acc.push({ name: slice.name, length, offset })
    return acc
  }, [])

  return (
    <div className="relative mx-auto h-36 w-36">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#1e2a25" strokeWidth="12" />
        {segments.map((segment) => (
          <circle
            key={segment.name}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={languageColor(segment.name)}
            strokeWidth="12"
            strokeDasharray={`${segment.length} ${circumference - segment.length}`}
            strokeDashoffset={-segment.offset}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-xl font-semibold">{top[0]?.percent ?? 0}%</span>
        <span className="max-w-[5.5rem] truncate text-[10.5px] text-faint">{top[0]?.name ?? '—'}</span>
      </div>
    </div>
  )
}

export default function Profile() {
  const { username = '' } = useParams()
  const [data, setData] = useState<ProfileBundle | null>(null)
  const [error, setError] = useState<GithubError | null>(null)
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(0)
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('all')
  const [sort, setSort] = useState<'stars' | 'recent' | 'name'>('stars')
  const [showForks, setShowForks] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const saved = useBookmarks((state) => state.saved)
  const toggle = useBookmarks((state) => state.toggle)
  const addRecent = useBookmarks((state) => state.addRecent)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    setData(null)
    setQuery('')
    setLanguage('all')
    setShowAll(false)

    getProfile(username)
      .then((bundle) => {
        if (!alive) return
        setData(bundle)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (!alive) return
        setError(err instanceof GithubError ? err : new GithubError('Something went wrong while reading GitHub.', 0))
        setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [username, reload])

  useEffect(() => {
    if (data) addRecent(data.user.login)
  }, [data, addRecent])

  const stats = useMemo(() => {
    if (!data) return null
    return {
      stars: totalStars(data.repos),
      forks: totalForks(data.repos),
      languages: languageStats(data.repos),
      top: topRepos(data.repos, 6),
      days: activityByDay(data.events, 14),
    }
  }, [data])

  const repos = useMemo(() => {
    if (!data) return []
    let list = data.repos.filter((repo) => showForks || !repo.fork)
    if (language !== 'all') list = list.filter((repo) => repo.language === language)
    const text = query.trim().toLowerCase()
    if (text) {
      list = list.filter((repo) =>
        `${repo.name} ${repo.description ?? ''} ${repo.topics.join(' ')}`.toLowerCase().includes(text),
      )
    }
    const sorted = [...list]
    if (sort === 'stars') sorted.sort((a, b) => b.stargazers_count - a.stargazers_count)
    else if (sort === 'recent') sorted.sort((a, b) => +new Date(b.pushed_at) - +new Date(a.pushed_at))
    else sorted.sort((a, b) => a.name.localeCompare(b.name))
    return sorted
  }, [data, language, query, showForks, sort])

  if (loading) return <ProfileSkeleton />

  if (error || !data || !stats) {
    return (
      <ErrorState
        message={error?.message ?? 'That profile could not be loaded.'}
        rateLimited={error?.rateLimited}
        resetAt={error?.resetAt}
        onRetry={() => setReload((value) => value + 1)}
      />
    )
  }

  const { user, events } = data
  const isSaved = saved.some((item) => item.login.toLowerCase() === user.login.toLowerCase())
  const languages = stats.languages
  const blogHref = user.blog ? (user.blog.startsWith('http') ? user.blog : `https://${user.blog}`) : null
  const visibleRepos = showAll ? repos : repos.slice(0, 9)

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <Link
          to="/explore"
          className="flex items-center gap-1.5 text-[12.5px] font-medium text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Explore
        </Link>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-faint">profile · live</span>
      </div>

      <section className="app-card relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_15%_0%,rgba(182,243,107,0.1),transparent_60%)]" />
        <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-start">
          <Avatar login={user.login} name={user.name} size={92} ring />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {user.name || user.login}
              </h1>
              <span className="font-mono text-[13px] text-faint">@{user.login}</span>
            </div>
            {user.bio && <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted">{user.bio}</p>}

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-faint">
              {user.company && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" /> {user.company}
                </span>
              )}
              {user.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {user.location}
                </span>
              )}
              {blogHref && (
                <a
                  href={blogHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 transition-colors hover:text-accent"
                >
                  <Link2 className="h-3.5 w-3.5" /> {user.blog?.replace(/^https?:\/\//, '')}
                </a>
              )}
              {user.twitter_username && (
                <a
                  href={`https://twitter.com/${user.twitter_username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 transition-colors hover:text-accent"
                >
                  <AtSign className="h-3.5 w-3.5" /> {user.twitter_username}
                </a>
              )}
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" /> joined{' '}
                {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5" /> updated {relativeTime(user.updated_at)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
            <button
              type="button"
              onClick={() =>
                toggle({
                  login: user.login,
                  name: user.name,
                  bio: user.bio,
                  followers: user.followers,
                  repos: user.public_repos,
                  stars: stats.stars,
                  savedAt: Date.now(),
                })
              }
              className={`app-btn h-9 px-3 ${
                isSaved ? 'border border-accent/40 bg-accent/10 text-accent' : 'app-btn-ghost'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <Link to={`/compare?a=${user.login}`} className="app-btn app-btn-ghost h-9 px-3">
              <Scale className="h-3.5 w-3.5" /> Compare
            </Link>
            <a href={user.html_url} target="_blank" rel="noreferrer" className="app-btn app-btn-primary h-9 px-3">
              <Github className="h-3.5 w-3.5" /> GitHub
            </a>
          </div>
        </div>
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FolderGit2} label="Public repositories" value={user.public_repos.toLocaleString()} hint={`${user.public_gists} public gists`} />
        <StatCard icon={Users} label="Followers" value={user.followers.toLocaleString()} hint={`following ${user.following.toLocaleString()}`} />
        <StatCard icon={Star} label="Stars earned" value={stats.stars.toLocaleString()} hint={`${stats.forks.toLocaleString()} forks collected`} />
        <StatCard icon={CalendarClock} label="On GitHub for" value={accountAge(user.created_at)} hint={`since ${new Date(user.created_at).getFullYear()}`} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="app-card p-5 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[17px] font-semibold">Language fingerprint</h2>
            <span className="chip border border-line bg-raised text-faint">bytes</span>
          </div>
          <p className="mt-1 text-[12px] text-faint">Share of public repository size, by language.</p>
          <div className="mt-4">
            <LanguageDonut slices={languages} />
          </div>
          <div className="mt-5">
            <LanguageBars languages={languages} limit={5} />
          </div>
          <Link
            to={`/compare?a=${user.login}`}
            className="mt-5 flex items-center gap-1 text-[12px] font-medium text-accent hover:underline"
          >
            Compare this stack <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </section>

        <section className="app-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[17px] font-semibold">Activity momentum</h2>
            <span className="flex items-center gap-1.5 text-[11.5px] text-faint">
              <Activity className="h-3.5 w-3.5 text-accent" /> last 14 days
            </span>
          </div>
          <p className="mt-1 text-[12px] text-faint">Public events per day, straight from the events feed.</p>
          <div className="mt-4">
            <Sparkline points={stats.days} />
          </div>
          <div className="mt-2">
            {events.length ? (
              events.slice(0, 6).map((event) => <EventRow key={event.id} event={event} />)
            ) : (
              <p className="rounded-xl border border-line bg-bg px-4 py-6 text-center text-[13px] text-faint">
                No public events in the feed right now.
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="mt-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] text-accent">
              Repositories
            </div>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
              {repos.length} to read{showForks ? '' : ' · forks hidden'}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter repos…"
                className="app-input h-9 w-44 pl-8 pr-3 text-[12.5px]"
              />
            </div>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as 'stars' | 'recent' | 'name')}
              className="app-input h-9 px-2.5 text-[12.5px] text-muted"
              aria-label="Sort repositories"
            >
              <option value="stars">Most stars</option>
              <option value="recent">Recently pushed</option>
              <option value="name">Name A–Z</option>
            </select>
            <button
              type="button"
              onClick={() => setShowForks((value) => !value)}
              className={`app-btn h-9 px-3 text-[12.5px] ${
                showForks ? 'border border-accent/40 bg-accent/10 text-accent' : 'app-btn-ghost'
              }`}
            >
              Forks
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setLanguage('all')}
            className={`rounded-full border px-2.5 py-1 text-[11.5px] transition-colors ${
              language === 'all'
                ? 'border-accent/40 bg-accent/10 text-accent'
                : 'border-line bg-surface text-muted hover:text-fg'
            }`}
          >
            All languages
          </button>
          {languages.slice(0, 7).map((slice) => (
            <button
              key={slice.name}
              type="button"
              onClick={() => setLanguage(slice.name)}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] transition-colors ${
                language === slice.name
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-line bg-surface text-muted hover:text-fg'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: languageColor(slice.name) }} />
              {slice.name}
            </button>
          ))}
        </div>

        {visibleRepos.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visibleRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-line bg-surface px-6 py-12 text-center">
            <p className="text-[14px] text-muted">No repositories match those filters.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setLanguage('all')
              }}
              className="app-btn app-btn-ghost mt-4 h-9 px-3"
            >
              Reset filters
            </button>
          </div>
        )}

        {repos.length > 9 && (
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="app-btn app-btn-ghost h-10 px-4"
            >
              {showAll ? 'Show fewer' : `Show all ${repos.length}`}
            </button>
          </div>
        )}
      </section>

      {stats.top.length > 0 && (
        <section className="mt-10 rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-display text-[17px] font-semibold">Star-weighted top work</h2>
          <p className="mt-1 text-[12px] text-faint">The repositories carrying the most signal, forks included in ranking.</p>
          <div className="mt-3 divide-y divide-line/70">
            {stats.top.map((repo, index) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 py-2.5 transition-colors hover:text-accent"
              >
                <span className="w-5 font-mono text-[11px] text-faint">{String(index + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1 truncate font-mono text-[12.5px]">{repo.name}</span>
                <span className="flex items-center gap-1 text-[11.5px] text-faint">
                  <Star className="h-3.5 w-3.5" /> {repo.stargazers_count.toLocaleString()}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-faint" />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
