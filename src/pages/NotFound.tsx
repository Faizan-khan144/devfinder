import { Link } from 'react-router-dom'
import { ArrowLeft, Ghost } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-bg px-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-surface text-accent">
          <Ghost className="h-7 w-7" />
        </div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">404 · not found</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          This route never got pushed.
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[14.5px] leading-relaxed text-muted">
          The page you asked for does not exist. The search bar still works, though.
        </p>
        <Link to="/explore" className="app-btn app-btn-primary mt-7 h-10 px-4">
          <ArrowLeft className="h-4 w-4" /> Back to explore
        </Link>
      </div>
    </div>
  )
}
