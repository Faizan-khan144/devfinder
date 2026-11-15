import { useRef } from 'react'
import type { ReactNode } from 'react'

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

export default function Magnetic({ children, strength = 0.2, className = '' }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left - rect.width / 2) * strength
    const y = (event.clientY - rect.top - rect.height / 2) * strength
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate3d(0, 0, 0)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: 'transform .35s cubic-bezier(.16,1,.3,1)' }}
    >
      {children}
    </div>
  )
}
