import { useEffect, useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import SplitHeading from './SplitHeading'

export interface TourCard {
  icon: LucideIcon
  tag: string
  title: string
  text: string
  body: ReactNode
}

interface HScrollProps {
  eyebrow: string
  title: string
  note: string
  cards: TourCard[]
}

export default function HScroll({ eyebrow, title, note, cards }: HScrollProps) {
  const wrapRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!wrap || !track) return
    let raf = 0

    const update = () => {
      raf = 0
      const rect = wrap.getBoundingClientRect()
      const total = wrap.offsetHeight - window.innerHeight
      if (total <= 0) return
      const progress = Math.min(Math.max(-rect.top / total, 0), 1)
      const max = Math.max(track.scrollWidth - window.innerWidth + 64, 0)
      track.style.transform = `translate3d(${(-progress * max).toFixed(2)}px, 0, 0)`
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
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
    <section ref={wrapRef} id="tour" className="relative border-t border-line bg-surface" style={{ height: '340vh' }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.24em] text-accent">{eyebrow}</div>
              <SplitHeading text={title} className="font-display text-4xl font-semibold tracking-tight md:text-5xl" />
            </div>
            <p className="max-w-sm text-[15px] text-muted md:text-right">{note}</p>
          </div>
        </div>

        <div className="overflow-visible">
          <div
            ref={trackRef}
            className="flex w-max gap-6 pl-[max(1.5rem,calc((100vw-72rem)/2))] pr-24 will-change-transform"
          >
            {cards.map(({ icon: Icon, tag, title: cardTitle, text, body }) => (
              <article
                key={tag}
                className="group w-[min(84vw,26rem)] shrink-0 rounded-3xl border border-line bg-bg p-7 transition-all duration-300 hover:-translate-y-2 hover:border-accent/40 hover:shadow-2xl hover:shadow-black/50"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-accent group-hover:text-accent-fg">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                  {tag}
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight">{cardTitle}</h3>
                <p className="mb-5 mt-2 text-[14.5px] leading-relaxed text-muted">{text}</p>
                <div className="animate-float">{body}</div>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 w-full max-w-6xl px-6">
          <div className="h-1 overflow-hidden rounded-full bg-line">
            <div
              ref={barRef}
              className="h-full origin-left rounded-full bg-gradient-to-r from-accent to-accent-2"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
