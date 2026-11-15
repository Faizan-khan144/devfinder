import type { DayPoint } from '../../lib/derive'

interface SparklineProps {
  points: DayPoint[]
  height?: number
}

export default function Sparkline({ points, height = 64 }: SparklineProps) {
  const width = 260
  const max = Math.max(...points.map((point) => point.count), 1)
  const gap = 4
  const barWidth = (width - gap * (points.length - 1)) / points.length
  const hasData = points.some((point) => point.count > 0)

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Activity over the last 14 days">
        {points.map((point, index) => {
          const barHeight = point.count === 0 ? 2 : Math.max(4, (point.count / max) * (height - 6))
          return (
            <rect
              key={point.key}
              x={index * (barWidth + gap)}
              y={height - barHeight}
              width={barWidth}
              height={barHeight}
              rx={Math.min(3, barWidth / 2)}
              fill={point.count === 0 ? '#22322b' : '#b6f36b'}
              opacity={point.count === 0 ? 1 : 0.9}
              className="col-anim"
              style={{ animationDelay: `${index * 35}ms` }}
            />
          )
        })}
      </svg>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-faint">
        <span>14 days ago</span>
        <span>{hasData ? `${points.reduce((sum, point) => sum + point.count, 0)} events` : 'quiet'}</span>
        <span>today</span>
      </div>
    </div>
  )
}
