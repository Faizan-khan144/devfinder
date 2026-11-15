const BASE = 'https://api.github.com'
const TTL = 1000 * 60 * 5

export interface GithubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  email: string | null
  bio: string | null
  twitter_username: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export interface GithubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  fork: boolean
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  archived: boolean
  updated_at: string
  pushed_at: string
  size: number
  open_issues_count: number
  license: { spdx_id: string | null } | null
  homepage: string | null
}

export interface GithubEvent {
  id: string
  type: string
  created_at: string
  repo: { name: string; url: string }
  payload: {
    size?: number
    ref_type?: string
    action?: string
    ref?: string | null
    commits?: { message: string }[]
    pull_request?: { title: string }
    issue?: { title: string }
  }
}

export interface ProfileBundle {
  user: GithubUser
  repos: GithubRepo[]
  events: GithubEvent[]
}

export class GithubError extends Error {
  status: number
  rateLimited: boolean
  resetAt?: number

  constructor(message: string, status: number, rateLimited = false, resetAt?: number) {
    super(message)
    this.name = 'GithubError'
    this.status = status
    this.rateLimited = rateLimited
    this.resetAt = resetAt
  }
}

interface CacheRecord {
  at: number
  data: unknown
}

const CACHE_KEY = 'devfinder:cache:v1'
const CACHE_LIMIT = 80
const cache = new Map<string, CacheRecord>()
let cacheReady = false
let flushTimer: number | undefined

function readCache() {
  if (cacheReady) return
  cacheReady = true
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as Record<string, CacheRecord>
    for (const [key, record] of Object.entries(parsed)) {
      if (record && typeof record.at === 'number') cache.set(key, record)
    }
  } catch {
    return
  }
}

function writeCache() {
  window.clearTimeout(flushTimer)
  flushTimer = window.setTimeout(() => {
    try {
      const newest = [...cache.entries()].sort((a, b) => b[1].at - a[1].at).slice(0, CACHE_LIMIT)
      localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(newest)))
    } catch {
      return
    }
  }, 300)
}

async function gh<T>(path: string): Promise<T> {
  readCache()
  const hit = cache.get(path)
  if (hit && Date.now() - hit.at < TTL) return hit.data as T

  let res: Response
  try {
    res = await fetch(BASE + path, { headers: { Accept: 'application/vnd.github+json' } })
  } catch {
    throw new GithubError('Network unreachable. Check your connection and try again.', 0)
  }

  if (!res.ok) {
    const remaining = res.headers.get('x-ratelimit-remaining')
    const resetSeconds = Number(res.headers.get('x-ratelimit-reset'))
    const resetAt = Number.isFinite(resetSeconds) && resetSeconds > 0 ? resetSeconds * 1000 : undefined
    const rateLimited = res.status === 403 || res.status === 429 || remaining === '0'
    if (res.status === 404) throw new GithubError('That username does not exist on GitHub.', 404)
    if (rateLimited) {
      if (hit) return hit.data as T
      const when = resetAt
        ? new Date(resetAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
        : null
      throw new GithubError(
        when
          ? `GitHub's anonymous limit of 60 requests an hour is used up. It resets around ${when}.`
          : "GitHub's anonymous limit is used up for now. Give it a few minutes.",
        res.status,
        true,
        resetAt,
      )
    }
    throw new GithubError('GitHub could not answer right now. Try again in a moment.', res.status)
  }

  const data = (await res.json()) as T
  cache.set(path, { at: Date.now(), data })
  writeCache()
  return data
}

export async function getProfile(login: string): Promise<ProfileBundle> {
  const user = encodeURIComponent(login.trim())
  if (!user) throw new GithubError('Type a GitHub username first.', 400)

  const [profile, repos, events] = await Promise.all([
    gh<GithubUser>(`/users/${user}`),
    gh<GithubRepo[]>(`/users/${user}/repos?per_page=100&sort=updated`),
    gh<GithubEvent[]>(`/users/${user}/events/public?per_page=40`).catch<GithubEvent[]>(() => []),
  ])

  return { user: profile, repos, events }
}

export interface RateLimitInfo {
  remaining: number
  limit: number
  reset: number
}

export async function getRateLimit(): Promise<RateLimitInfo> {
  const res = await fetch(`${BASE}/rate_limit`, { headers: { Accept: 'application/vnd.github+json' } })
  if (!res.ok) throw new GithubError('Rate limit info unavailable.', res.status)
  const data = (await res.json()) as { resources: { core: { remaining: number; limit: number; reset: number } } }
  return data.resources.core
}

export const FEATURED_DEVELOPERS = [
  { login: 'Faizan-khan144', tagline: 'The developer behind DevFinder.' },
  { login: 'torvalds', tagline: 'The kernel, and nothing else.' },
  { login: 'gaearon', tagline: 'React, in public.' },
  { login: 'sindresorhus', tagline: 'Ten thousand small utilities.' },
  { login: 'yyx990803', tagline: 'The person behind Vue.' },
  { login: 'rich-harris', tagline: 'Svelte, compilers, and bikes.' },
  { login: 'tj', tagline: 'A decade of frameworks.' },
  { login: 'antfu', tagline: 'Vite, tooling, and speed.' },
  { login: 'addyosmani', tagline: 'Performance as a craft.' },
]

export const avatarFor = (login: string, size = 160) => `https://github.com/${login}.png?size=${size}`
