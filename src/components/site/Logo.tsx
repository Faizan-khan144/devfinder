interface LogoProps {
  size?: number
  withWord?: boolean
  className?: string
}

export default function Logo({ size = 30, withWord = true, className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="#b6f36b" />
        <path
          d="M9.5 11.5l4.3 4-4.3 5"
          stroke="#0a1108"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="16.6" y="18" width="6.4" height="2.4" rx="1.2" fill="#0a1108" />
      </svg>
      {withWord && (
        <span className="font-display text-[17px] font-semibold tracking-tight text-fg">
          devfinder<span className="text-accent">.</span>
        </span>
      )}
    </span>
  )
}
