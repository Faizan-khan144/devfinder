import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

interface ParallaxProps {
  speed?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export default function Parallax({ speed = 0.18, className = '', style, children }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0

    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return
      const centerOffset = window.innerHeight / 2 - (rect.top + rect.height / 2)
      el.style.transform = `translate3d(0, ${(centerOffset * speed).toFixed(2)}px, 0)`
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
