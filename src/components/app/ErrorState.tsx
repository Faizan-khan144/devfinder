import { AlertTriangle, RotateCcw, TimerReset } from 'lucide-react'

interface ErrorStateProps {
  message: string
  rateLimited?: boolean
  onRetry?: () => void
}

export default function ErrorState({ message, rateLimited = false, onRetry }: ErrorStateProps) {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-surface text-warn">
        {rateLimited ? <TimerReset className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
      </div>
      <h2 className="mt-5 font-display text-2xl font-semibold">Nothing to read here yet</h2>
      <p className="mx-auto mt-2 max-w-sm text-[14.5px] leading-relaxed text-muted">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="app-btn app-btn-ghost mt-6 h-10 px-4">
          <RotateCcw className="h-4 w-4" /> Try again
        </button>
      )}
      {rateLimited && (
        <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-faint">
          public API · 60 requests / hour
        </p>
      )}
    </div>
  )
}
