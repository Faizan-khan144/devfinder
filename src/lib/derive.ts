import type { GithubEvent, GithubRepo } from './github'

export interface LanguageSlice {
  name: string
  bytes: number
  repos: number
  percent: number
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572a5',
  Rust: '#dea584',
  Go: '#00add8',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Shell: '#89e051',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#777777',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4f5d95',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Dart: '#00b4ab',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Lua: '#4a6a8a',
  Makefile: '#427819',
  Nix: '#7e7eff',
  Haskell: '#5e5086',
  Elixir: '#6e4a7e',
  Zig: '#ec915c',
  Astro: '#ff5a03',
  MDX: '#1b1f24',
  Dockerfile: '#384d54',
}

export const languageColor = (name: string | null | undefined) =>
  (name && LANGUAGE_COLORS[name]) || '#7f8f87'

export const totalStars = (repos: GithubRepo[]) =>
  repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)

export const totalForks = (repos: GithubRepo[]) => repos.reduce((sum, repo) => sum + repo.forks_count, 0)

export const ownRepos = (repos: GithubRepo[]) => repos.filter((repo) => !repo.fork)

export function languageStats(repos: GithubRepo[]): LanguageSlice[] {
  const map = new Map<string, { bytes: number; repos: number }>()
  for (const repo of repos) {
    if (!repo.language) continue
    const current = map.get(repo.language) ?? { bytes: 0, repos: 0 }
    current.bytes += Math.max(repo.size, 1)
    current.repos += 1
    map.set(repo.language, current)
  }
  const total = [...map.values()].reduce((sum, value) => sum + value.bytes, 0) || 1
  return [...map.entries()]
    .map(([name, value]) => ({
      name,
      bytes: value.bytes,
      repos: value.repos,
      percent: Math.round((value.bytes / total) * 1000) / 10,
    }))
    .sort((a, b) => b.bytes - a.bytes)
}

export const topRepos = (repos: GithubRepo[], limit = 6) =>
  ownRepos(repos)
    .slice()
    .sort((a, b) => b.stargazers_count - a.stargazers_count || +new Date(b.pushed_at) - +new Date(a.pushed_at))
    .slice(0, limit)

export interface DayPoint {
  key: string
  label: string
  count: number
}

export function activityByDay(events: GithubEvent[], days = 14): DayPoint[] {
  const points: DayPoint[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    points.push({
      key,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1),
      count: 0,
    })
  }
  const index = new Map(points.map((point) => [point.key, point]))
  for (const event of events) {
    const d = new Date(event.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const point = index.get(key)
    if (point) point.count += 1
  }
  return points
}

export function accountAge(createdAt: string): string {
  const start = new Date(createdAt)
  const months = (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  const years = Math.floor(months / 12)
  const rest = Math.floor(months % 12)
  if (years <= 0) return `${Math.max(1, Math.floor(months))} mo`
  return rest > 0 ? `${years}y ${rest}m` : `${years}y`
}

export function accountAgeYears(createdAt: string): number {
  return (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.round(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.round(months / 12)}y ago`
}

export function compactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

export function eventLabel(type: string): string {
  const map: Record<string, string> = {
    PushEvent: 'Pushed commits',
    CreateEvent: 'Created',
    DeleteEvent: 'Deleted',
    WatchEvent: 'Starred',
    ForkEvent: 'Forked',
    IssuesEvent: 'Issue',
    IssueCommentEvent: 'Commented on',
    PullRequestEvent: 'Pull request',
    PullRequestReviewEvent: 'Reviewed',
    ReleaseEvent: 'Released',
    PublicEvent: 'Made public',
    MemberEvent: 'Added a collaborator to',
    GollumEvent: 'Updated the wiki of',
  }
  return map[type] ?? type.replace('Event', '')
}
