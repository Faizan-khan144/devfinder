import { useEffect, useRef, useState } from 'react'

interface ScrollScrubProps {
  text: string
  className?: string
  highlight?: string[]
}

export default function ScrollScrub({ text, className = '', highlight = [] }: ScrollScrubProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let last = -1

    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const start = window.innerHeight * 0.9
      const distance = window.innerHeight * 0.55 + rect.height * 0.25
      const next = Math.min(1, Math.max(0, (start - rect.top) / distance))
      if (Math.abs(next - last) < 0.008) return
      last = next
      setProgress(next)
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
  }, [])

  const words = text.split(' ')
  const active = progress * (words.length + 2)

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => {
        const lit = Math.min(1, Math.max(0, active - index))
        const isHighlight = highlight.includes(word.replace(/[^a-zA-Z]/g, '').toLowerCase())
        return (
          <span
            key={`${word}-${index}`}
            style={{
              opacity: lit * 0.82 + 0.18,
              color: isHighlight ? `rgba(182, 243, 107, ${0.35 + lit * 0.65})` : undefined,
              transition: 'opacity .3s linear, color .3s linear',
            }}
          >
            {word}
            {index < words.length - 1 ? ' ' : ''}
          </span>
        )
      })}
    </p>
  )
}
