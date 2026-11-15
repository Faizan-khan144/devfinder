export function CardSkeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-2xl ${className}`} />
}

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="app-card flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        <div className="skeleton h-24 w-24 rounded-full" />
        <div className="flex-1 space-y-3">
          <div className="skeleton h-5 w-44 rounded-md" />
          <div className="skeleton h-4 w-28 rounded-md" />
          <div className="skeleton h-3 w-full max-w-md rounded-md" />
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((key) => (
          <CardSkeleton key={key} className="h-28" />
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <CardSkeleton className="h-72 lg:col-span-2" />
        <CardSkeleton className="h-72" />
      </div>
    </div>
  )
}
