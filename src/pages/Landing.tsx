import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Brain,
  Check,
  Clock,
  GitBranch,
  Github,
  Grid3x3,
  Languages,
  Layers,
  Lock,
  RefreshCw,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Users,
  X,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SiteHeader from '../components/site/SiteHeader'
import SiteFooter from '../components/site/SiteFooter'
import Reveal from '../components/motion/Reveal'
import Parallax from '../components/motion/Parallax'
import ScrollScrub from '../components/motion/ScrollScrub'
import SplitHeading from '../components/motion/SplitHeading'
import Counter from '../components/motion/Counter'
import Magnetic from '../components/motion/Magnetic'
import TiltCard from '../components/motion/TiltCard'
import RotatorWord from '../components/motion/RotatorWord'
import ScrollProgress from '../components/motion/ScrollProgress'
import SectionDots from '../components/motion/SectionDots'
import Cursor from '../components/motion/Cursor'
import BackToTop from '../components/motion/BackToTop'
import HScroll from '../components/motion/HScroll'
import type { TourCard } from '../components/motion/HScroll'
import SearchBar from '../components/app/SearchBar'
import Avatar from '../components/app/Avatar'
import { languageColor } from '../lib/derive'

const MOCK_LANGUAGES = [
  { name: 'TypeScript', percent: 46 },
  { name: 'JavaScript', percent: 31 },
  { name: 'Swift', percent: 12 },
  { name: 'Shell', percent: 6 },
]

const LANGUAGES = [
  'TypeScript',
  'JavaScript',
  'Python',
  'Rust',
  'Go',
  'Swift',
  'Kotlin',
  'Ruby',
  'Java',
  'C++',
  'Elixir',
  'Haskell',
  'Zig',
  'Lua',
  'Astro',
  'Nix',
]

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Languages,
    title: 'Language fingerprint',
    text: 'Repository size grouped by language, so a stack reads as a shape instead of a tag list.',
  },
  {
    icon: Star,
    title: 'Star-weighted top work',
    text: 'The repositories carrying the most signal rise to the top — forks included, archived labelled.',
  },
  {
    icon: Activity,
    title: 'Momentum, not noise',
    text: 'Public events per day for the last two weeks, plus a readable trail of what actually happened.',
  },
  {
    icon: Scale,
    title: 'Side-by-side compare',
    text: 'Two usernames, one honest table. Followers, stars, repositories, language share and account age.',
  },
  {
    icon: Bookmark,
    title: 'Bookmarks that persist',
    text: 'Keep a shortlist on this device. No account, no email, no server-side copy of your list.',
  },
  {
    icon: Lock,
    title: 'Zero-friction privacy',
    text: 'Read-only public data, cached for five minutes. Nothing is posted, stored remotely or sold.',
  },
]

const VIEWS = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'languages', label: 'Languages', icon: Languages },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'compare', label: 'Compare', icon: Scale },
]

const MODULES: { icon: LucideIcon; name: string; text: string; status: 'Live' | 'Soon' }[] = [
  { icon: Search, name: 'Explore', text: 'Search any username and suggested profiles to start from.', status: 'Live' },
  { icon: UserRound, name: 'Profile', text: 'Identity, bio, links and account age on one readable card.', status: 'Live' },
  { icon: Languages, name: 'Languages', text: 'Byte-weighted language split with a donut and bars.', status: 'Live' },
  { icon: Activity, name: 'Activity', text: 'Fourteen-day momentum chart and the latest public events.', status: 'Live' },
  { icon: Star, name: 'Stars', text: 'Top repositories ranked by stars, forks and recency.', status: 'Live' },
  { icon: Scale, name: 'Compare', text: 'Sharable head-to-head table with live numbers.', status: 'Live' },
  { icon: Bookmark, name: 'Bookmarks', text: 'A local shortlist that survives a refresh.', status: 'Live' },
  { icon: Grid3x3, name: 'Contribution graph', text: 'Full-year contribution heatmap from the GraphQL API.', status: 'Soon' },
  { icon: Brain, name: 'AI summary', text: 'A short, sourced summary of what a developer ships.', status: 'Soon' },
]

const SIGNAL = [
  { name: 'TypeScript', value: 38 },
  { name: 'JavaScript', value: 27 },
  { name: 'Python', value: 14 },
  { name: 'Rust', value: 9 },
  { name: 'Go', value: 7 },
  { name: 'Shell', value: 5 },
]

const FAQS: [string, string][] = [
  [
    'Do I need a GitHub account?',
    'No. DevFinder only reads public endpoints, so a username is enough. There is no sign-in, token or OAuth screen anywhere.',
  ],
  [
    'Where does the data come from?',
    'The public GitHub REST API: the user endpoint, up to 100 public repositories and the latest public events. Responses are cached in memory for five minutes.',
  ],
  [
    'What happens when the rate limit hits?',
    'Unauthenticated requests get 60 per hour. DevFinder shows a clear message instead of an empty page, and cached profiles keep working.',
  ],
  [
    'Is my bookmark list uploaded?',
    'Never. Bookmarks and recent searches live in this browser via localStorage. Clearing site data clears them.',
  ],
  [
    'Why do some numbers look different from GitHub?',
    'Language share is computed from public repository size in kilobytes, not exact code bytes. Stars are summed across public repositories only.',
  ],
]

const TOUR: TourCard[] = [
  {
    icon: UserRound,
    tag: 'Profile',
    title: 'The person, first',
    text: 'Name, handle, bio and the links they chose to publish — before any metric starts shouting.',
    body: (
      <div className="rounded-xl border border-line bg-surface p-4 text-left">
        <div className="flex items-center gap-3">
          <Avatar login="sindresorhus" name="Sindre Sorhus" size={40} />
          <div>
            <div className="text-[13px] font-semibold">Sindre Sorhus</div>
            <div className="font-mono text-[10.5px] text-faint">@sindresorhus</div>
          </div>
          <span className="ml-auto chip border border-line bg-raised text-[10px] text-ok">live</span>
        </div>
        <p className="mt-3 text-[11.5px] leading-relaxed text-muted">
          Full-time open-sourcerer. Unicorns &amp; rainbows. TypeScript, Swift and too many CLIs.
        </p>
      </div>
    ),
  },
  {
    icon: Languages,
    tag: 'Languages',
    title: 'A stack as a shape',
    text: 'Bytes grouped by language, with a donut for the headline and bars for the detail.',
    body: (
      <div className="rounded-xl border border-line bg-surface p-4 text-left">
        {MOCK_LANGUAGES.slice(0, 3).map((language) => (
          <div key={language.name} className="mb-2.5 last:mb-0">
            <div className="mb-1 flex justify-between text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm" style={{ background: languageColor(language.name) }} />
                {language.name}
              </span>
              <span className="font-mono text-faint">{language.percent}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-raised">
              <div className="h-full rounded-full" style={{ width: `${language.percent}%`, background: languageColor(language.name) }} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Star,
    tag: 'Top work',
    title: 'What earned the stars',
    text: 'Repositories ranked by signal, with forks, licence and last push visible without a click.',
    body: (
      <div className="rounded-xl border border-line bg-surface p-4 text-left">
        {[
          ['vite', '46.2k'],
          ['svelte', '29.1k'],
          ['prettier', '24.7k'],
        ].map(([name, stars], index) => (
          <div key={name} className="flex items-center gap-2 border-b border-line/70 py-2 last:border-b-0">
            <span className="font-mono text-[10px] text-faint">{String(index + 1).padStart(2, '0')}</span>
            <span className="font-mono text-[12px]">{name}</span>
            <span className="ml-auto flex items-center gap-1 text-[10.5px] text-faint">
              <Star className="h-3 w-3" /> {stars}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Activity,
    tag: 'Momentum',
    title: 'The last two weeks',
    text: 'A small chart that answers the only question worth asking: are they still building?',
    body: (
      <div className="rounded-xl border border-line bg-surface p-4">
        <div className="flex h-16 items-end gap-1.5">
          {[3, 5, 2, 7, 4, 8, 6, 3, 9, 5, 7, 4, 8, 6].map((value, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-sm bg-accent/80"
              style={{ height: `${(value / 9) * 100}%` }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[9.5px] text-faint">
          <span>14 days ago</span>
          <span>today</span>
        </div>
      </div>
    ),
  },
  {
    icon: Scale,
    tag: 'Compare',
    title: 'Two profiles, one table',
    text: 'No scores, no verdicts. The numbers line up and you decide what matters.',
    body: (
      <div className="rounded-xl border border-line bg-surface p-4">
        {[
          ['Followers', '230k', '92k'],
          ['Stars', '182k', '104k'],
          ['Repos', '38', '214'],
        ].map(([label, left, right]) => (
          <div key={label} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-line/70 py-1.5 text-[11px] last:border-b-0">
            <span className="text-right font-medium">{left}</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-faint">{label}</span>
            <span className="font-medium">{right}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Bookmark,
    tag: 'Bookmarks',
    title: 'A shortlist that stays',
    text: 'Save the people worth a second look. It lives in your browser, not on someone’s server.',
    body: (
      <div className="rounded-xl border border-line bg-surface p-4 text-left">
        {['torvalds', 'gaearon', 'antfu'].map((login) => (
          <div key={login} className="flex items-center gap-2.5 border-b border-line/70 py-2 last:border-b-0">
            <Avatar login={login} size={24} />
            <span className="font-mono text-[11.5px]">{login}</span>
            <Bookmark className="ml-auto h-3.5 w-3.5 text-accent" />
          </div>
        ))}
      </div>
    ),
  },
]

function MockProfileWindow() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface text-left shadow-2xl shadow-black/60">
      <div className="flex items-center gap-1.5 border-b border-line bg-raised/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[10.5px] text-faint">devfinder.app/u/sindresorhus</span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-widest text-ok">
          <span className="h-1.5 w-1.5 rounded-full bg-ok" /> live
        </span>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Avatar login="sindresorhus" name="Sindre Sorhus" size={52} ring />
          <div className="min-w-0">
            <div className="font-display text-[15.5px] font-semibold">Sindre Sorhus</div>
            <div className="font-mono text-[11px] text-faint">@sindresorhus</div>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="chip border border-accent/35 bg-accent/10 text-accent">
              <Bookmark className="h-3 w-3" /> Saved
            </span>
            <span className="chip border border-line bg-raised text-muted">
              <Scale className="h-3 w-3" /> Compare
            </span>
          </div>
        </div>

        <p className="mt-3 max-w-md text-[12px] leading-relaxed text-muted">
          Full-time open-sourcerer. Unicorns &amp; rainbows. TypeScript, Swift and an unreasonable number of CLIs.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ['1.4k', 'repos'],
            ['68.4k', 'followers'],
            ['182k', 'stars'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-lg border border-line bg-bg py-2 text-center">
              <div className="font-display text-[14px] font-semibold">{value}</div>
              <div className="text-[9.5px] uppercase tracking-wider text-faint">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-[10.5px] uppercase tracking-widest text-faint">
              <Languages className="h-3 w-3 text-accent" /> languages
            </div>
            {MOCK_LANGUAGES.slice(0, 3).map((language) => (
              <div key={language.name} className="mb-2 last:mb-0">
                <div className="mb-1 flex justify-between text-[10.5px]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm" style={{ background: languageColor(language.name) }} />
                    {language.name}
                  </span>
                  <span className="font-mono text-faint">{language.percent}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-raised">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${language.percent}%`, background: languageColor(language.name) }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-2 flex items-center gap-1.5 text-[10.5px] uppercase tracking-widest text-faint">
              <Star className="h-3 w-3 text-accent" /> top work
            </div>
            {[
              ['vite', '46.2k'],
              ['prettier', '24.7k'],
            ].map(([name, stars]) => (
              <div key={name} className="flex items-center gap-2 border-b border-line/70 py-1.5 text-[11px] last:border-b-0">
                <span className="font-mono">{name}</span>
                <span className="ml-auto flex items-center gap-1 text-faint">
                  <Star className="h-3 w-3" /> {stars}
                </span>
              </div>
            ))}
            <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-line bg-bg px-2 py-1.5 text-[10px] text-faint">
              <Activity className="h-3 w-3 text-accent" /> 12 events in the last 14 days
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ViewsTabs() {
  const [active, setActive] = useState(VIEWS[0].id)

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {VIEWS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-all ${
              active === id
                ? 'border-accent/40 bg-accent/10 text-accent'
                : 'border-line bg-surface text-muted hover:border-line-strong hover:text-fg'
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex items-center gap-1.5 border-b border-line bg-raised/50 px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="ml-2 font-mono text-[10px] text-faint">devfinder.app/u/sindresorhus · {active}</span>
        </div>

        <div key={active} className="animate-fade-up p-6">
          {active === 'profile' && (
            <div className="grid gap-5 sm:grid-cols-[auto_1fr]">
              <Avatar login="sindresorhus" name="Sindre Sorhus" size={64} />
              <div>
                <div className="font-display text-lg font-semibold">Sindre Sorhus</div>
                <div className="font-mono text-[11.5px] text-faint">@sindresorhus · joined Dec 2009</div>
                <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-muted">
                  Full-time open-sourcerer. Unicorns &amp; rainbows. 1,400 public repositories and counting.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {['TypeScript', 'Swift', 'CLI', 'macOS', 'Node.js'].map((tag) => (
                    <span key={tag} className="chip border border-line bg-raised text-[10.5px] text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {active === 'languages' && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-faint">share by bytes</div>
                <div className="flex h-4 overflow-hidden rounded-full">
                  {MOCK_LANGUAGES.map((language) => (
                    <div
                      key={language.name}
                      style={{ width: `${language.percent}%`, background: languageColor(language.name) }}
                    />
                  ))}
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  {MOCK_LANGUAGES.map((language) => (
                    <div key={language.name} className="flex items-center gap-2 text-[12px]">
                      <span className="h-2 w-2 rounded-sm" style={{ background: languageColor(language.name) }} />
                      {language.name}
                      <span className="ml-auto font-mono text-[11px] text-faint">{language.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-line bg-bg p-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-faint">reading it</div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                  TypeScript dominates the footprint, but the Swift slice is where the desktop work lives. Language
                  share is a starting point, never the whole story.
                </p>
              </div>
            </div>
          )}

          {active === 'activity' && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-faint">14 day momentum</span>
                  <span className="text-[11px] text-faint">12 events</span>
                </div>
                <div className="flex h-24 items-end gap-1.5">
                  {[3, 5, 2, 7, 4, 8, 6, 3, 9, 5, 7, 4, 8, 6].map((value, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t-sm bg-accent/80"
                      style={{ height: `${(value / 9) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-faint">latest events</div>
                {[
                  ['Pushed commits', 'sindresorhus/ky', '2h ago'],
                  ['Released v12.0.0', 'sindresorhus/got', '1d ago'],
                  ['Starred', 'oven-sh/bun', '2d ago'],
                ].map(([label, repo, time]) => (
                  <div key={repo} className="flex items-center gap-2 border-b border-line/70 py-2 text-[11.5px] last:border-b-0">
                    <GitBranch className="h-3.5 w-3.5 text-accent" />
                    <span className="text-muted">{label}</span>
                    <span className="truncate font-mono text-[10.5px] text-faint">{repo}</span>
                    <span className="ml-auto shrink-0 text-[10px] text-faint">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === 'compare' && (
            <div>
              <div className="mb-4 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2 font-mono">
                  <Avatar login="torvalds" size={22} /> torvalds
                </span>
                <span className="font-mono text-[9.5px] uppercase tracking-widest text-faint">head to head</span>
                <span className="flex items-center gap-2 font-mono">
                  gaearon <Avatar login="gaearon" size={22} />
                </span>
              </div>
              {(
                [
                  ['Followers', 230, 92],
                  ['Stars', 182, 104],
                  ['Repositories', 38, 214],
                ] as [string, number, number][]
              ).map(([label, left, right]) => (
                <div key={label} className="border-t border-line/70 py-3">
                  <div className="mb-1.5 flex items-center justify-between text-[11px]">
                    <span className={left >= right ? 'font-semibold text-accent' : 'text-muted'}>{left}k</span>
                    <span className="font-mono text-[9.5px] uppercase tracking-widest text-faint">{label}</span>
                    <span className={right >= left ? 'font-semibold text-accent' : 'text-muted'}>{right}k</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex justify-end">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-raised">
                        <div className="ml-auto h-full rounded-full bg-accent/70" style={{ width: `${(left / 230) * 100}%` }} />
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-raised">
                      <div className="h-full rounded-full bg-accent/70" style={{ width: `${(right / 230) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SignalBars() {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const next = Math.min(1, Math.max(0, (window.innerHeight * 0.88 - rect.top) / (window.innerHeight * 0.7)))
      setProgress(next)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="signal" className="relative overflow-hidden border-t border-line bg-bg py-24 md:py-32">
      <Parallax speed={0.1} className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
      <div ref={ref} className="relative mx-auto max-w-5xl px-6">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Signal</div>
          <SplitHeading text="The shape of a stack" className="font-display text-4xl font-semibold tracking-tight md:text-5xl" />
          <p className="mt-5 text-[15.5px] text-muted">
            Keep scrolling — these bars fill as the section moves. Real profiles compute the same split from
            repository size.
          </p>
        </Reveal>

        <div className="mx-auto max-w-2xl">
          {SIGNAL.map((language, index) => {
            const fill = Math.min(1, Math.max(0, progress * 1.7 - index * 0.1))
            return (
              <div key={language.name} className="mb-5 last:mb-0">
                <div className="mb-2 flex items-baseline justify-between text-[13.5px]">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: languageColor(language.name) }} />
                    {language.name}
                  </span>
                  <span className="font-mono text-[12px] text-faint">{Math.round(language.value * fill)}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-raised">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${fill * language.value * 2.4}%`,
                      background: languageColor(language.name),
                      transition: 'width .25s linear',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-10 text-center font-mono text-[10.5px] uppercase tracking-[0.2em] text-faint">
          scroll-driven · not a video
        </p>
      </div>
    </section>
  )
}

function ComparePreview() {
  return (
    <section id="compare" className="relative overflow-hidden border-t border-line bg-surface py-24 md:py-32">
      <Parallax speed={0.09} className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-accent-2/5 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
        <Reveal variant="left">
          <div className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Compare</div>
          <SplitHeading text="Less judgement. Better numbers." className="font-display text-4xl font-semibold tracking-tight md:text-5xl" />
          <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-muted">
            Two usernames go into the same table: followers, stars, repositories, language share and account age.
            No composite score, no “better developer” badge — just the facts, lined up.
          </p>
          <div className="mt-7 flex flex-col gap-3">
            {['Shareable link — the comparison lives in the URL', 'Live numbers, cached for five minutes', 'Works for any public GitHub account'].map(
              (item) => (
                <span key={item} className="flex items-start gap-2.5 text-[14px] text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {item}
                </span>
              ),
            )}
          </div>
          <Magnetic strength={0.15} className="mt-8 w-max">
            <Link
              to="/compare"
              className="btn-shine inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-[14px] font-semibold text-accent-fg shadow-xl shadow-accent/20 transition-all hover:-translate-y-0.5 hover:bg-accent-hover"
            >
              <Scale className="h-4 w-4" /> Open compare
            </Link>
          </Magnetic>
        </Reveal>

        <Reveal variant="right" delay={120}>
          <div className="app-card relative p-5">
            <div className="absolute -right-3 -top-3 rounded-full border border-accent/30 bg-bg px-3 py-1 font-mono text-[9.5px] uppercase tracking-widest text-accent">
              preview
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Avatar login="torvalds" name="Linus Torvalds" size={40} />
                <div>
                  <div className="text-[13px] font-semibold">Linus Torvalds</div>
                  <div className="font-mono text-[10.5px] text-faint">@torvalds</div>
                </div>
              </div>
              <span className="font-mono text-[9.5px] uppercase tracking-widest text-faint">vs</span>
              <div className="flex items-center gap-2.5">
                <div className="text-right">
                  <div className="text-[13px] font-semibold">Dan Abramov</div>
                  <div className="font-mono text-[10.5px] text-faint">@gaearon</div>
                </div>
                <Avatar login="gaearon" name="Dan Abramov" size={40} />
              </div>
            </div>

            <div className="mt-5">
              {[
                ['Followers', '230k', '92k', true],
                ['Stars', '182k', '104k', true],
                ['Repositories', '38', '214', false],
                ['Top language', 'C · 71%', 'JavaScript · 63%', false],
              ].map(([label, left, right, leftWins]) => (
                <div key={label as string} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-t border-line/70 py-2.5">
                  <span className={`text-right text-[12.5px] ${leftWins ? 'font-semibold text-accent' : 'text-muted'}`}>
                    {left}
                  </span>
                  <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-widest text-faint">
                    {label}
                  </span>
                  <span className={`text-[12.5px] ${!leftWins ? 'font-semibold text-accent' : 'text-muted'}`}>
                    {right}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-bg px-3 py-2 text-[10.5px] text-faint">
              <ArrowUpRight className="h-3.5 w-3.5 text-accent" /> Every row links back to the live profile.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default function Landing() {
  return (
    <div className="noise relative min-h-screen bg-bg">
      <Cursor />
      <BackToTop />
      <ScrollProgress />
      <SectionDots sections={['features', 'views', 'modules', 'tour', 'how', 'signal', 'compare', 'roadmap', 'faq']} />
      <SiteHeader />

      <section
        className="relative overflow-hidden"
        onMouseMove={(event) => {
          const el = event.currentTarget
          const rect = el.getBoundingClientRect()
          el.style.setProperty('--mx', `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(2)}%`)
          el.style.setProperty('--my', `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(2)}%`)
        }}
      >
        <div className="hero-grid pointer-events-none absolute inset-0" />
        <div className="hero-spot pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[30rem] w-[64rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-accent/10 via-accent-2/5 to-transparent blur-3xl" />
        <div className="animate-drift-a pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="animate-drift-b pointer-events-none absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-accent-2/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-20 text-center md:pt-28">
          <Reveal className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1.5 text-[12.5px] text-muted shadow-sm backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping-ring absolute inline-flex h-full w-full rounded-full bg-ok" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ok" />
            </span>
            Live · public GitHub API · no login, ever
          </Reveal>

          <Reveal delay={70}>
            <h1 className="mx-auto max-w-5xl text-balance font-display text-[46px] font-semibold leading-[1.03] tracking-tight md:text-[82px]">
              One search.
              <br />
              Their whole <RotatorWord words={['stack', 'story', 'streak', 'signal']} />.
            </h1>
          </Reveal>

          <Reveal delay={150}>
            <p className="mx-auto mt-7 max-w-2xl text-pretty text-[16px] leading-relaxed text-muted md:text-[18px]">
              DevFinder turns a GitHub profile into a page you can actually read: the languages someone leans on,
              the projects that earned stars, and the momentum behind the commits.
            </p>
          </Reveal>

          <Reveal delay={220} className="mx-auto mt-8 max-w-xl">
            <SearchBar size="lg" placeholder="Search a GitHub username…" />
          </Reveal>

          <Reveal delay={280} className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12.5px] text-faint">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-accent" /> No account
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-accent" /> Public data only
            </span>
            <Link to="/u/torvalds" className="flex items-center gap-1 font-medium text-accent hover:underline">
              or read a sample profile <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>

          <div className="mt-10 flex justify-center">
            <span className="scroll-cue flex h-10 w-6 items-start justify-center rounded-full border border-line-strong p-1">
              <span className="scroll-cue-dot h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
          </div>

          <div className="relative mx-auto mt-14 max-w-4xl">
            <div className="pointer-events-none absolute -left-8 top-16 z-10 hidden animate-bob items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-left shadow-xl shadow-black/50 md:flex">
              <Star className="h-3.5 w-3.5 text-accent" />
              <div>
                <div className="text-[11.5px] font-medium">1.8k stars</div>
                <div className="text-[10px] text-faint">earned this week</div>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-6 bottom-24 z-10 hidden animate-bob-delay items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-left shadow-xl shadow-black/50 md:flex">
              <Languages className="h-3.5 w-3.5 text-accent-2" />
              <div>
                <div className="text-[11.5px] font-medium">TypeScript · 46%</div>
                <div className="text-[10px] text-faint">of public bytes</div>
              </div>
            </div>
            <div className="pointer-events-none absolute -bottom-5 left-1/4 z-10 hidden animate-bob rounded-full border border-line bg-surface px-3 py-1.5 text-[11.5px] text-muted shadow-xl shadow-black/50 md:flex md:items-center md:gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" /> cached for 5 minutes
            </div>

            <Reveal delay={120}>
              <TiltCard>
                <MockProfileWindow />
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface py-7">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.24em] text-faint">
            Built on open infrastructure you can check
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-9 gap-y-3 text-[13px] text-muted">
            {[
              { icon: Github, label: 'GitHub REST API' },
              { icon: Layers, label: 'React 19' },
              { icon: Grid3x3, label: 'TypeScript' },
              { icon: Zap, label: 'Vite' },
              { icon: Sparkles, label: 'Tailwind CSS 4' },
              { icon: RefreshCw, label: 'Vercel' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-faint" /> {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-bg py-6">
        <div className="marquee-mask grp overflow-hidden">
          <div className="flex w-max animate-marquee" style={{ ['--marquee-duration' as string]: '36s' }}>
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {LANGUAGES.map((language) => (
                  <span key={`${copy}-${language}`} className="mx-5 flex items-center gap-2 text-[13px] font-medium text-faint">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: languageColor(language) }} />
                    {language}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 py-16 md:grid-cols-4">
          {[
            { to: 0, suffix: '', label: 'logins required' },
            { to: 100, suffix: '%', label: 'public data' },
            { to: 60, suffix: '', label: 'requests per hour' },
            { to: 5, suffix: ' min', label: 'in-memory cache' },
          ].map((stat, index) => (
            <Reveal key={stat.label} delay={index * 90} className="text-center">
              <div className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                <Counter to={stat.to} suffix={stat.suffix} />
              </div>
              <div className="mt-2 text-[12.5px] text-muted">{stat.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="features" className="relative overflow-hidden bg-bg py-24 md:py-32">
        <Parallax speed={0.12} className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <div className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Features</div>
            <SplitHeading
              text="Everything you need. Nothing pretend."
              className="font-display text-4xl font-semibold tracking-tight md:text-5xl"
            />
            <p className="mt-5 text-[15.5px] text-muted">
              Six things that work today, on live data. Anything unfinished is labelled as such further down.
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} delay={(index % 3) * 90}>
                <div className="lift-glow sheen-sweep group h-full rounded-2xl border border-line bg-surface p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-accent group-hover:text-accent-fg">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="chip border border-ok/30 bg-ok/10 text-[10px] font-semibold uppercase tracking-wider text-ok">
                      Live
                    </span>
                  </div>
                  <h3 className="font-display text-[17px] font-semibold">{title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="views" className="relative border-t border-line bg-surface py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Views</div>
            <SplitHeading
              text="Every view answers one question"
              className="font-display text-4xl font-semibold tracking-tight md:text-5xl"
            />
            <p className="mt-5 text-[15.5px] text-muted">
              Who are they? What do they build with? Are they still shipping? How do they line up against someone
              else? Four tabs, four answers.
            </p>
          </Reveal>
          <Reveal>
            <ViewsTabs />
          </Reveal>
        </div>
      </section>

      <section id="modules" className="relative border-t border-line bg-bg py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <div className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Modules</div>
            <SplitHeading
              text="One system. Every part of a profile."
              className="font-display text-4xl font-semibold tracking-tight md:text-5xl"
            />
            <p className="mt-5 text-[15.5px] text-muted">Seven modules are live. Two are honestly marked as soon.</p>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map(({ icon: Icon, name, text, status }, index) => (
              <Reveal key={name} delay={(index % 3) * 70} variant="zoom">
                <div className="group h-full rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent/30">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-raised text-accent">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-display text-[15px] font-semibold">{name}</span>
                    <span
                      className={`ml-auto chip border text-[9.5px] font-semibold uppercase tracking-wider ${
                        status === 'Live'
                          ? 'border-ok/30 bg-ok/10 text-ok'
                          : 'border-warn/30 bg-warn/10 text-warn'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  <p className="mt-3 text-[12.5px] leading-relaxed text-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <HScroll
        eyebrow="A closer look"
        title="Scroll through the product"
        note="Keep scrolling — the panel slides sideways while the section stays pinned."
        cards={TOUR}
      />

      <section className="relative overflow-hidden border-t border-line bg-surface py-28 md:py-36">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
        <div className="pointer-events-none absolute left-10 top-16 h-40 w-40 animate-spin-slow rounded-2xl border border-accent/15" />
        <div className="pointer-events-none absolute bottom-16 right-10 h-32 w-32 animate-spin-rev rounded-full border border-accent-2/15" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <Sparkles className="mx-auto mb-6 h-8 w-8 text-accent" />
            <ScrollScrub
              text="A profile is not a résumé. It is a record of what someone chose to build — and what they kept building."
              highlight={['chose', 'kept', 'building']}
              className="mx-auto max-w-3xl text-balance font-display text-3xl font-semibold leading-tight tracking-tight md:text-[44px]"
            />
          </Reveal>
          <Reveal delay={140} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: Search, label: 'Any username' },
              { icon: RefreshCw, label: 'Fresh in 5 min' },
              { icon: GitBranch, label: 'Repo-level detail' },
              { icon: Layers, label: 'Read-only' },
              { icon: Lock, label: 'No tracking' },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-2 rounded-full border border-line bg-bg px-4 py-2 text-[12.5px] text-muted transition-all hover:-translate-y-1 hover:border-accent/40 hover:text-fg"
              >
                <Icon className="h-3.5 w-3.5 text-accent" /> {label}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="how" className="relative border-t border-line bg-bg py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">How it works</div>
            <SplitHeading
              text="From username to a decision"
              className="font-display text-4xl font-semibold tracking-tight md:text-5xl"
            />
            <p className="mt-5 text-[15.5px] text-muted">No setup project, no sales call. Three moves, all live today.</p>
          </Reveal>

          <div className="relative grid gap-12 md:grid-cols-3">
            <div className="pointer-events-none absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-accent/10 via-accent/50 to-accent/10 md:block" />
            {[
              { step: '01', icon: Search, title: 'Search', text: 'Type a handle. We pull the profile, up to 100 public repositories and the recent event feed.' },
              { step: '02', icon: UserRound, title: 'Read', text: 'Languages, stars, momentum and account age land on one page, without a single extra click.' },
              { step: '03', icon: Scale, title: 'Compare or save', text: 'Bookmark them for later, or drop two names into the compare table and share the link.' },
            ].map(({ step, icon: Icon, title, text }, index) => (
              <Reveal key={step} delay={index * 150} className="relative text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-surface text-accent shadow-lg shadow-black/40 transition-transform hover:scale-110">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent/70">
                  Step {step}
                </div>
                <h3 className="mb-3 font-display text-2xl font-semibold tracking-tight">{title}</h3>
                <p className="mx-auto max-w-xs text-[13.5px] leading-relaxed text-muted">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SignalBars />

      <ComparePreview />

      <section id="roadmap" className="relative border-t border-line bg-bg py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <div className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Roadmap</div>
            <SplitHeading
              text="Less software. More shipped."
              className="font-display text-4xl font-semibold tracking-tight md:text-5xl"
            />
            <p className="mt-5 text-[15.5px] text-muted">
              Here is exactly what works today, and the honest list of what does not exist yet.
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2">
            <Reveal variant="left">
              <div className="conic-border relative h-full rounded-3xl bg-surface p-7">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-semibold">Working today</span>
                  <span className="rounded-full bg-ok/15 px-3 py-1 text-[11.5px] font-semibold text-ok">Live</span>
                </div>
                <div className="mt-6 flex flex-col gap-3.5">
                  {[
                    'Username search with recent history',
                    'Profile, bio and public links',
                    'Language split by repository size',
                    'Fourteen-day activity momentum',
                    'Star-weighted top repositories',
                    'Two-profile comparison with share links',
                    'Local bookmarks that survive refresh',
                  ].map((label, index) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 text-[13.5px] text-fg opacity-0"
                      style={{ animation: `row-in .5s cubic-bezier(.16,1,.3,1) ${index * 80}ms forwards` }}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ok/15">
                        <Check className="h-3.5 w-3.5 text-ok" />
                      </span>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal variant="right" delay={100}>
              <div className="h-full rounded-3xl border border-line bg-surface p-7">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-semibold text-muted">Honestly not here yet</span>
                  <span className="rounded-full bg-raised px-3 py-1 text-[11.5px] font-semibold text-faint">Backlog</span>
                </div>
                <div className="mt-6 flex flex-col gap-3.5">
                  {[
                    'Full-year contribution heatmap',
                    'Organization and team browsing',
                    'AI-written summaries of a profile',
                    'Private repository insights',
                    'Saved comparisons and notes',
                    'Email or RSS digests',
                    'Accounts and sync across devices',
                  ].map((label, index) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 text-[13.5px] text-faint opacity-0"
                      style={{ animation: `row-in .5s cubic-bezier(.16,1,.3,1) ${index * 80}ms forwards` }}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-raised">
                        <X className="h-3.5 w-3.5" />
                      </span>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="faq" className="relative border-t border-line bg-surface py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal className="mb-12 text-center">
            <div className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">FAQ</div>
            <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Questions, answered</h2>
          </Reveal>
          <div className="flex flex-col gap-3">
            {FAQS.map(([question, answer], index) => (
              <Reveal key={question} delay={index * 70}>
                <details className="group rounded-xl border border-line bg-bg px-5 py-4 transition-colors hover:border-accent/40">
                  <summary className="cursor-pointer list-none font-display text-[15.5px] font-medium marker:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {question}
                      <span className="text-xl font-light text-accent transition-transform duration-300 group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden border-t border-line bg-bg py-32"
        onMouseMove={(event) => {
          const el = event.currentTarget
          const rect = el.getBoundingClientRect()
          el.style.setProperty('--mx', `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(2)}%`)
          el.style.setProperty('--my', `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(2)}%`)
        }}
      >
        <div className="hero-spot pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-10 left-1/2 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <div className="mx-auto mb-8 w-max animate-bob">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-accent-fg shadow-2xl shadow-accent/20">
                <Github className="h-7 w-7" />
              </span>
            </div>
            <h2 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
              Start with a <span className="sheen">username</span>.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[16px] text-muted">
              No login, no token, no trial countdown. The first profile is one search away.
            </p>
            <div className="mx-auto mt-9 max-w-lg">
              <SearchBar size="lg" placeholder="e.g. torvalds" />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-faint">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Reads public data only
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-accent" /> Cached 5 minutes
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-accent" /> Works for any public account
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
