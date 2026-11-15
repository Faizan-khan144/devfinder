import { GitFork, Star, ArrowUpRight, Clock, Scale } from 'lucide-react'
import type { GithubRepo } from '../../lib/github'
import { languageColor, relativeTime } from '../../lib/derive'

export default function RepoCard({ repo }: { repo: GithubRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="app-card hoverable group flex h-full flex-col p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-mono text-[14.5px] font-semibold text-fg group-hover:text-accent">
            {repo.name}
          </h3>
          {repo.fork && <span className="mt-0.5 inline-block text-[10.5px] text-faint">fork</span>}
          {repo.archived && <span className="mt-0.5 inline-block text-[10.5px] text-warn">archived</span>}
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
      </div>

      <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-[13px] leading-relaxed text-muted">
        {repo.description || 'No description given.'}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {repo.topics.slice(0, 3).map((topic) => (
          <span key={topic} className="rounded-full border border-line bg-raised px-2 py-0.5 text-[10.5px] text-muted">
            {topic}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-3.5 pt-4 text-[11.5px] text-faint">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: languageColor(repo.language) }} />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5" /> {repo.stargazers_count}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="h-3.5 w-3.5" /> {repo.forks_count}
        </span>
        {repo.license?.spdx_id && (
          <span className="flex items-center gap-1">
            <Scale className="h-3.5 w-3.5" /> {repo.license.spdx_id}
          </span>
        )}
        <span className="ml-auto flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {relativeTime(repo.pushed_at)}
        </span>
      </div>
    </a>
  )
}
