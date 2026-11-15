import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type Variant = 'up' | 'big' | 'zoom' | 'left' | 'right'

const VARIANTS: Record<Variant, { x: number; y: number; s: number }> = {
  up: { x: 0, y: 34, s: 1 },
  big: { x: 0, y: 60, s: 0.97 },
  zoom: { x: 0, y: 0, s: 0.94 },
  left: { x: -48, y: 0, s: 1 },
  right: { x: 48, y: 0, s: 1 },
}

interface RevealProps {
  children: ReactNode
  delay?: number
  variant?: Variant
  duration?: number
  className?: string
}

export default function Reveal({
  children,
  delay = 0,
  variant = 'up',
  duration = 700,
  className = '',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const v = VARIANTS[variant]

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translate3d(${v.x}px, ${v.y}px, 0) scale(${v.s})`,
        transition: `opacity ${duration}ms cubic-bezier(.16,1,.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(.16,1,.3,1) ${delay}ms`,
        willChange: shown ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}
