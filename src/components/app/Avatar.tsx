import { avatarFor } from '../../lib/github'

interface AvatarProps {
  login: string
  name?: string | null
  size?: number
  className?: string
  ring?: boolean
}

export default function Avatar({ login, name, size = 44, className = '', ring = false }: AvatarProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-raised font-display font-semibold text-muted ${
        ring ? 'ring-2 ring-accent/40 ring-offset-2 ring-offset-bg' : ''
      } ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.36) }}
    >
      <img
        src={avatarFor(login, Math.min(460, size * 3))}
        alt={name || login}
        loading="lazy"
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.style.display = 'none'
        }}
      />
      <span className="absolute uppercase">{(name || login).slice(0, 1)}</span>
    </span>
  )
}
