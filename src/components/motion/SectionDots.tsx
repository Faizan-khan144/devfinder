import { useEffect, useState } from 'react'

interface SectionDotsProps {
  sections: string[]
}

export default function SectionDots({ sections }: SectionDotsProps) {
  const [active, setActive] = useState('')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActive(visible.target.id)
      },
      { threshold: 0.35, rootMargin: '-10% 0px -50% 0px' },
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [sections])

  return (
    <div className="section-dots" aria-hidden="true">
      {sections.map((id) => (
        <button
          key={id}
          type="button"
          data-label={id}
          className={active === id ? 'active' : ''}
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
          aria-label={`Go to ${id}`}
        />
      ))}
    </div>
  )
}
