import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  hint?: string
}

export default function StatCard({ icon: Icon, label, value, hint }: StatCardProps) {
  return (
    <div className="app-card hoverable p-5">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-medium text-muted">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-2 font-display text-3xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-[11.5px] text-faint">{hint}</div>}
    </div>
  )
}
