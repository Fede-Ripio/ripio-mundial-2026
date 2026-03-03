function SkeletonBlock({ className }: { className: string }) {
  return <div className={`bg-gray-800 rounded animate-pulse ${className}`} />
}

function MatchCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">

        {/* Equipo local */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <SkeletonBlock className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0" />
          <SkeletonBlock className="h-4 w-20 sm:w-28" />
        </div>

        {/* Inputs de marcador */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <SkeletonBlock className="w-10 h-10 rounded-lg" />
          <SkeletonBlock className="w-3 h-3" />
          <SkeletonBlock className="w-10 h-10 rounded-lg" />
        </div>

        {/* Equipo visitante */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 justify-end">
          <SkeletonBlock className="h-4 w-20 sm:w-28" />
          <SkeletonBlock className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0" />
        </div>

      </div>

      {/* Fecha */}
      <div className="mt-3 flex justify-center">
        <SkeletonBlock className="h-3 w-40" />
      </div>
    </div>
  )
}

export default function PronosticosLoading() {
  return (
    <div className="min-h-screen bg-black text-white py-10 sm:py-12">

      {/* Header */}
      <div className="px-4 sm:px-6 mb-8 text-center space-y-2">
        <SkeletonBlock className="h-3 w-32 mx-auto animate-pulse" />
        <SkeletonBlock className="h-9 w-44 mx-auto animate-pulse" />
        <SkeletonBlock className="h-4 w-56 mx-auto animate-pulse" />
      </div>

      {/* Grupos de partidos */}
      <div className="px-4 sm:px-6 space-y-8">
        {[6, 5, 5].map((count, g) => (
          <div key={g}>
            {/* Label de grupo */}
            <SkeletonBlock className="h-5 w-24 mb-3 animate-pulse" />
            <div className="space-y-2">
              {Array.from({ length: count }).map((_, i) => (
                <MatchCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
