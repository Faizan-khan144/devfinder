import { Link } from 'react-router-dom'
import { ArrowRight, Bookmark, Search, Star, Users } from 'lucide-react'
import Avatar from '../components/app/Avatar'
import { useBookmarks } from '../store/bookmarks'

export default function Bookmarks() {
  const saved = useBookmarks((state) => state.saved)
  const remove = useBookmarks((state) => state.remove)

  if (!saved.length) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-surface text-accent">
          <Bookmark className="h-6 w-6" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">No one saved yet</h1>
        <p className="mx-auto mt-2 max-w-sm text-[14.5px] leading-relaxed text-muted">
          Bookmark a developer from their profile and they will land here — stored on this device, never on a server.
        </p>
        <Link to="/explore" className="app-btn app-btn-primary mt-6 h-10 px-4">
          <Search className="h-4 w-4" /> Find a developer
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] text-accent">Saved</div>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
            {saved.length} developer{saved.length === 1 ? '' : 's'} on your list
          </h1>
        </div>
        <span className="hidden text-[12px] text-faint sm:block">Stored locally · no account</span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {saved.map((dev) => (
          <div key={dev.login} className="app-card hoverable group flex flex-col p-5">
            <div className="flex items-start gap-3">
              <Avatar login={dev.login} name={dev.name} size={46} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-[15.5px] font-semibold">{dev.name || dev.login}</div>
                <div className="truncate font-mono text-[12px] text-faint">@{dev.login}</div>
              </div>
              <button
                type="button"
                onClick={() => remove(dev.login)}
                className="rounded-lg border border-line px-2 py-1 text-[10.5px] text-faint opacity-0 transition-all hover:border-bad/40 hover:text-bad group-hover:opacity-100"
              >
                remove
              </button>
            </div>

            <p className="mt-3 line-clamp-2 min-h-[2.4rem] text-[12.5px] leading-relaxed text-muted">
              {dev.bio || 'No bio on the public profile.'}
            </p>

            <div className="mt-3 flex items-center gap-4 text-[11.5px] text-faint">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {dev.followers.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Bookmark className="h-3.5 w-3.5" /> {dev.repos} repos
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5" /> {dev.stars.toLocaleString()}
              </span>
            </div>

            <Link
              to={`/u/${dev.login}`}
              className="mt-4 flex items-center gap-1 text-[12.5px] font-medium text-accent opacity-70 transition-opacity group-hover:opacity-100"
            >
              Open profile <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
