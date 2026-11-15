import type { LanguageSlice } from '../../lib/derive'
import { languageColor } from '../../lib/derive'

interface LanguageBarsProps {
  languages: LanguageSlice[]
  limit?: number
  animate?: boolean
}

export default function LanguageBars({ languages, limit = 6, animate = true }: LanguageBarsProps) {
  const slices = languages.slice(0, limit)
  const max = Math.max(...slices.map((slice) => slice.percent), 1)

  if (!slices.length) {
    return <p className="text-sm text-faint">No language data on the public repositories.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {slices.map((slice, index) => (
        <div key={slice.name}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[13px]">
            <span className="flex items-center gap-2 font-medium">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: languageColor(slice.name) }} />
              {slice.name}
            </span>
            <span className="font-mono text-[11.5px] text-faint">{slice.percent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-raised">
            <div
              className={`h-full rounded-full ${animate ? 'bar-anim' : ''} st-${Math.min(index + 1, 8)}`}
              style={{
                width: `${Math.max(2, (slice.percent / max) * 100)}%`,
                background: languageColor(slice.name),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
