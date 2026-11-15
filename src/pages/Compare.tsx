import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Check, Copy, Scale, Sparkles, Swords } from 'lucide-react'
import Avatar from '../components/app/Avatar'
import { GithubError, getProfile } from '../lib/github'
import type { ProfileBundle } from '../lib/github'
import { accountAge, accountAgeYears, languageStats, totalStars } from '../lib/derive'
import { CardSkeleton } from '../components/app/Skeletons'

const PRESETS = [
  ['torvalds', 'gaearon'],
  ['sindresorhus', 'antfu'],
  ['yyx990803', 'rich-harris'],
]

interface Side {
  bundle: ProfileBundle | null
  error: string | null
}

interface Row {
  label: string
  a: number
  b: number
  format: (value: number) => string
  neutral?: boolean
}

export default function Compare() {
  const [params, setParams] = useSearchParams()
  const a = params.get('a') ?? ''
  const b = params.get('b') ?? ''
  const [inputA, setInputA] = useState(a)
  const [inputB, setInputB] = useState(b)
  const [loading, setLoading] = useState(false)
  const [left, setLeft] = useState<Side>({ bundle: null, error: null })
  const [right, setRight] = useState<Side>({ bundle: null, error: null })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setInputA(a)
    setInputB(b)
  }, [a, b])

  useEffect(() => {
    if (!a && !b) {
      setLeft({ bundle: null, error: null })
      setRight({ bundle: null, error: null })
      return
    }
    let alive = true
    setLoading(true)

    const load = (login: string) =>
      login ? getProfile(login).then((bundle) => ({ bundle, error: null as string | null })) : Promise.resolve(null)

    Promise.allSettled([load(a), load(b)]).then((results) => {
      if (!alive) return
      const [resultA, resultB] = results
      setLeft(
        resultA.status === 'fulfilled' && resultA.value
          ? resultA.value
          : {
              bundle: null,
              error:
                resultA.status === 'rejected'
                  ? resultA.reason instanceof GithubError
                    ? resultA.reason.message
                    : 'Could not load this profile.'
                  : null,
            },
      )
      setRight(
        resultB.status === 'fulfilled' && resultB.value
          ? resultB.value
          : {
              bundle: null,
              error:
                resultB.status === 'rejected'
                  ? resultB.reason instanceof GithubError
                    ? resultB.reason.message
                    : 'Could not load this profile.'
                  : null,
            },
      )
      setLoading(false)
    })

    return () => {
      alive = false
    }
  }, [a, b])

  const rows = useMemo<Row[]>(() => {
    if (!left.bundle || !right.bundle) return []
    const starsA = totalStars(left.bundle.repos)
    const starsB = totalStars(right.bundle.repos)
    const languagesA = languageStats(left.bundle.repos)
    const languagesB = languageStats(right.bundle.repos)
    return [
      {
        label: 'Followers',
        a: left.bundle.user.followers,
        b: right.bundle.user.followers,
        format: (value) => value.toLocaleString(),
      },
      {
        label: 'Stars earned',
        a: starsA,
        b: starsB,
        format: (value) => value.toLocaleString(),
      },
      {
        label: 'Public repositories',
        a: left.bundle.user.public_repos,
        b: right.bundle.user.public_repos,
        format: (value) => value.toLocaleString(),
      },
      {
        label: 'Following',
        a: left.bundle.user.following,
        b: right.bundle.user.following,
        format: (value) => value.toLocaleString(),
      },
      {
        label: 'Account age',
        a: accountAgeYears(left.bundle.user.created_at),
        b: accountAgeYears(right.bundle.user.created_at),
        format: () => '',
        neutral: true,
      },
      {
        label: 'Top language',
        a: languagesA[0]?.percent ?? 0,
        b: languagesB[0]?.percent ?? 0,
        format: (value) => `${Math.round(value)}%`,
        neutral: true,
      },
    ]
  }, [left.bundle, right.bundle])

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const nextA = inputA.trim().replace(/^@/, '')
    const nextB = inputB.trim().replace(/^@/, '')
    if (!nextA || !nextB) return
    setParams({ a: nextA, b: nextB })
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6">
      <div className="text-center">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
          <Scale className="h-3 w-3 text-accent" /> two profiles · one table
        </div>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Put two developers side by side.</h1>
        <p className="mx-auto mt-3 max-w-lg text-[14.5px] leading-relaxed text-muted">
          Followers, stars, repositories, language share and time on GitHub. Numbers are read live — no opinions
          attached.
        </p>
      </div>

      <form onSubmit={submit} className="mx-auto mt-8 max-w-2xl">
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <input
            value={inputA}
            onChange={(event) => setInputA(event.target.value)}
            placeholder="first username"
            className="app-input h-12 flex-1 px-4 text-sm"
            aria-label="First username"
          />
          <span className="mx-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-mono text-[10px] font-semibold text-accent">
            VS
          </span>
          <input
            value={inputB}
            onChange={(event) => setInputB(event.target.value)}
            placeholder="second username"
            className="app-input h-12 flex-1 px-4 text-sm"
            aria-label="Second username"
          />
          <button type="submit" className="app-btn app-btn-primary h-12 shrink-0 px-5">
            <Swords className="h-4 w-4" /> Compare
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="font-mono text-[10.5px] uppercase tracking-widest text-faint">try</span>
        {PRESETS.map(([first, second]) => (
          <button
            key={`${first}-${second}`}
            type="button"
            onClick={() => {
              setInputA(first)
              setInputB(second)
              setParams({ a: first, b: second })
            }}
            className="rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent/40 hover:text-accent"
          >
            {first} vs {second}
          </button>
        ))}
        {a && b && (
          <button
            type="button"
            onClick={copyLink}
            className="flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] text-muted transition-colors hover:text-accent"
          >
            {copied ? <Check className="h-3 w-3 text-ok" /> : <Copy className="h-3 w-3" />}
            {copied ? 'copied' : 'share link'}
          </button>
        )}
      </div>

      {loading && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <CardSkeleton className="h-64" />
          <CardSkeleton className="h-64" />
        </div>
      )}

      {!loading && !a && !b && (
        <div className="mt-10 rounded-2xl border border-line bg-surface p-8 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-accent" />
          <p className="mt-3 text-[14px] text-muted">
            Pick two usernames above, or start from a preset. The comparison stays in the URL, so you can share it.
          </p>
        </div>
      )}

      {!loading && (a || b) && (
        <div className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { side: left, login: a },
              { side: right, login: b },
            ].map(({ side, login }) => (
              <div key={login || 'empty'} className="app-card p-5">
                {side.bundle ? (
                  <div>
                    <div className="flex items-center gap-3">
                      <Avatar login={side.bundle.user.login} name={side.bundle.user.name} size={52} />
                      <div className="min-w-0">
                        <div className="truncate font-display text-[16px] font-semibold">
                          {side.bundle.user.name || side.bundle.user.login}
                        </div>
                        <div className="truncate font-mono text-[11.5px] text-faint">
                          @{side.bundle.user.login}
                        </div>
                      </div>
                      <Link
                        to={`/u/${side.bundle.user.login}`}
                        className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-accent/40 hover:text-accent"
                        aria-label={`Open ${side.bundle.user.login}`}
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                    <p className="mt-3 line-clamp-2 min-h-[2.4rem] text-[12.5px] leading-relaxed text-muted">
                      {side.bundle.user.bio || 'No bio on the public profile.'}
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      {[
                        ['followers', side.bundle.user.followers.toLocaleString()],
                        ['repos', side.bundle.user.public_repos.toLocaleString()],
                        ['age', accountAge(side.bundle.user.created_at)],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-lg border border-line bg-bg py-2">
                          <div className="font-display text-[14px] font-semibold">{value}</div>
                          <div className="text-[10px] text-faint">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full min-h-[9rem] flex-col items-center justify-center text-center">
                    <p className="text-[13px] text-muted">{side.error ?? (login ? 'Not loaded.' : 'Waiting for a username.')}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {left.bundle && right.bundle && (
            <div className="app-card mt-4 overflow-hidden">
              {rows.map((row, index) => {
                const leftWins = !row.neutral && row.a > row.b
                const rightWins = !row.neutral && row.b > row.a
                const max = Math.max(row.a, row.b, 1)
                const leftWidth = (row.a / max) * 100
                const rightWidth = (row.b / max) * 100
                const leftValue =
                  row.label === 'Account age'
                    ? accountAge(left.bundle!.user.created_at)
                    : row.label === 'Top language'
                      ? `${languageStats(left.bundle!.repos)[0]?.name ?? '—'} · ${row.format(row.a)}`
                      : row.format(row.a)
                const rightValue =
                  row.label === 'Account age'
                    ? accountAge(right.bundle!.user.created_at)
                    : row.label === 'Top language'
                      ? `${languageStats(right.bundle!.repos)[0]?.name ?? '—'} · ${row.format(row.b)}`
                      : row.format(row.b)

                return (
                  <div key={row.label} className={`px-4 py-3 sm:px-6 ${index % 2 ? 'bg-raised/30' : ''}`}>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div className="text-right">
                        <span className={`text-[13px] ${leftWins ? 'font-semibold text-accent' : 'text-muted'}`}>
                          {leftValue}
                        </span>
                        <div className="mt-1 flex justify-end">
                          <div className="h-1.5 w-full max-w-[9rem] overflow-hidden rounded-full bg-raised">
                            <div className="bar-anim ml-auto h-full rounded-full bg-accent/70" style={{ width: `${leftWidth}%` }} />
                          </div>
                        </div>
                      </div>
                      <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-faint">
                        {row.label}
                      </span>
                      <div>
                        <span className={`text-[13px] ${rightWins ? 'font-semibold text-accent' : 'text-muted'}`}>
                          {rightValue}
                        </span>
                        <div className="mt-1">
                          <div className="h-1.5 w-full max-w-[9rem] overflow-hidden rounded-full bg-raised">
                            <div className="bar-anim h-full rounded-full bg-accent/70" style={{ width: `${rightWidth}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
