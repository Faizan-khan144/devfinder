import { GitBranch, GitCommitHorizontal, GitFork, GitPullRequest, Star, Tag, Trash2, MessageSquare, FileText, Users } from 'lucide-react'
import type { GithubEvent } from '../../lib/github'
import { eventLabel, relativeTime } from '../../lib/derive'

const ICONS = {
  PushEvent: GitCommitHorizontal,
  CreateEvent: GitBranch,
  DeleteEvent: Trash2,
  WatchEvent: Star,
  ForkEvent: GitFork,
  IssuesEvent: MessageSquare,
  IssueCommentEvent: MessageSquare,
  PullRequestEvent: GitPullRequest,
  PullRequestReviewEvent: GitPullRequest,
  ReleaseEvent: Tag,
  PublicEvent: Users,
  GollumEvent: FileText,
}

export default function EventRow({ event }: { event: GithubEvent }) {
  const Icon = ICONS[event.type as keyof typeof ICONS] ?? GitCommitHorizontal
  const detail =
    event.type === 'PushEvent'
      ? `${event.payload.size ?? event.payload.commits?.length ?? 0} commit${(event.payload.size ?? 1) === 1 ? '' : 's'}`
      : event.type === 'CreateEvent'
        ? `${event.payload.ref_type ?? 'item'}${event.payload.ref ? ` · ${event.payload.ref}` : ''}`
        : event.type === 'WatchEvent'
          ? 'starred'
          : event.type === 'ForkEvent'
            ? 'forked'
            : event.payload.action ?? ''

  return (
    <div className="flex items-start gap-3 border-b border-line/70 py-3 last:border-b-0">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-raised text-muted">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-1.5 text-[13px]">
          <span className="font-medium">{eventLabel(event.type)}</span>
          <a
            href={`https://github.com/${event.repo.name}`}
            target="_blank"
            rel="noreferrer"
            className="truncate font-mono text-[12px] text-accent hover:underline"
          >
            {event.repo.name}
          </a>
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-faint">
          <span>{relativeTime(event.created_at)}</span>
          {detail && (
            <>
              <span className="h-1 w-1 rounded-full bg-line-strong" />
              <span className="truncate">{detail}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
