import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'

interface SearchBarProps {
  size?: 'md' | 'lg'
  initial?: string
  placeholder?: string
  autoFocus?: boolean
}

export default function SearchBar({
  size = 'md',
  initial = '',
  placeholder = 'Search a GitHub username…',
  autoFocus = false,
}: SearchBarProps) {
  const [value, setValue] = useState(initial)
  const navigate = useNavigate()

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const login = value.trim().replace(/^@/, '').replace(/^https?:\/\/github\.com\//i, '').replace(/\/.*$/, '')
    if (!login) return
    navigate(`/u/${encodeURIComponent(login)}`)
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div
        className={`group relative flex items-center gap-3 rounded-2xl border border-line bg-surface pr-2 shadow-lg shadow-black/20 transition-all focus-within:border-accent/50 focus-within:shadow-accent/10 ${
          size === 'lg' ? 'h-16 pl-5' : 'h-12 pl-4'
        }`}
      >
        <Search className={`shrink-0 text-faint transition-colors group-focus-within:text-accent ${size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          spellCheck={false}
          autoCapitalize="off"
          className={`h-full w-full bg-transparent text-fg outline-none placeholder:text-faint ${
            size === 'lg' ? 'text-base' : 'text-sm'
          }`}
          aria-label="GitHub username"
        />
        <button
          type="submit"
          className={`btn-shine flex shrink-0 items-center gap-1.5 rounded-xl bg-accent font-semibold text-accent-fg transition-all hover:bg-accent-hover ${
            size === 'lg' ? 'h-12 px-5 text-sm' : 'h-8 px-3 text-[13px]'
          }`}
        >
          {size === 'lg' ? 'Find' : <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </form>
  )
}
