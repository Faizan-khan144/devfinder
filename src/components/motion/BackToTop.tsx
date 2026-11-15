import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const height = document.documentElement.scrollHeight - window.innerHeight
      const progress = height > 0 ? Math.min(1, window.scrollY / height) : 0
      setPct(progress * 100)
      setVisible(window.scrollY > 700)
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

  return (
    <button
      type="button"
      className={`totop-ring ${visible ? 'show' : ''}`}
      style={{ ['--pct' as string]: `${pct}%` }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <span>
        <ArrowUp className="h-4 w-4" />
      </span>
    </button>
  )
}
