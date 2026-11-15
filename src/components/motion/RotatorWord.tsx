interface RotatorWordProps {
  words: string[]
}

export default function RotatorWord({ words }: RotatorWordProps) {
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '')

  return (
    <span className="rotator text-accent">
      <span className="rot-sizer" aria-hidden="true">
        {longest}
      </span>
      {words.map((word, index) => (
        <span key={word} className="rot-word" style={{ animationDelay: `${index * 3}s` }}>
          {word}
        </span>
      ))}
    </span>
  )
}
