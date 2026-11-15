import { useEffect, useState } from 'react'
import { AlertTriangle, RotateCcw, TimerReset } from 'lucide-react'

interface ErrorStateProps {
  message: string
  rateLimited?: boolean
  resetAt?: number
  onRetry?: () => void
}

export default function ErrorState({ message, rateLimited = false, resetAt, onRetry }: ErrorStateProps) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!resetAt) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [resetAt])

  const waiting = Boolean(resetAt && resetAt > now)
  const minutes = resetAt ? Math.max(0, Math.ceil((resetAt - now) / 60000)) : 0

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-surface text-warn">
        {rateLimited ? <TimerReset className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
      </div>
      <h2 className="mt-5 font-display text-2xl font-semibold">
        {rateLimited ? (waiting ? 'The public API needs a breather' : 'The limit has reset') : 'Nothing to read here yet'}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-[14.5px] leading-relaxed text-muted">{message}</p>

      {rateLimited && resetAt && (
        <div className="mx-auto mt-5 max-w-xs rounded-xl border border-line bg-surface px-4 py-3">
          <div className="font-mono text-[10px] uppercase tracking-widest text-faint">Rate limit resets in</div>
          <div className="mt-1 font-display text-2xl font-semibold text-fg">
            {waiting ? `${minutes} min` : 'now'}
          </div>
          <div className="mt-1 text-[11.5px] text-faint">
            {new Date(resetAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
          </div>
        </div>
      )}

      {onRetry && (
        <button type="button" onClick={onRetry} className="app-btn app-btn-ghost mt-6 h-10 px-4">
          <RotateCcw className="h-4 w-4" /> {rateLimited && waiting ? 'Try anyway' : 'Try again'}
        </button>
      )}

      {rateLimited && (
        <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-faint">
          public API · 60 requests / hour · cached profiles still open
        </p>
      )}
    </div>
  )
}
