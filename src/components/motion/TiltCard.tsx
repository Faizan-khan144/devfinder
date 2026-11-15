import { useRef } from 'react'
import type { ReactNode } from 'react'

interface TiltCardProps {
  children: ReactNode
  className?: string
  max?: number
}

export default function TiltCard({ children, className = '', max = 7 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(1200px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(-2px)`
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: 'transform .5s cubic-bezier(.16,1,.3,1)', transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}
