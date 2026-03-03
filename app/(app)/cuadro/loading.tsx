function SkeletonBlock({ className }: { className: string }) {
  return <div className={`bg-gray-800 rounded animate-pulse ${className}`} />
}

function GroupSkeleton() {
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      {/* Header del grupo */}
      <div className="bg-gray-900/60 px-4 py-3">
        <SkeletonBlock className="h-4 w-20" />
      </div>
      {/* Filas de equipos */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 border-t border-gray-800/60">
          <SkeletonBlock className="w-4 h-4 flex-shrink-0" />
          <SkeletonBlock className="w-6 h-6 rounded-full flex-shrink-0" />
          <SkeletonBlock className="h-4 w-24 flex-1" />
          <div className="flex gap-3 ml-auto">
            <SkeletonBlock className="h-4 w-6" />
            <SkeletonBlock className="h-4 w-6" />
            <SkeletonBlock className="h-4 w-8" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CuadroLoading() {
  return (
    <div className="min-h-screen bg-black text-white py-10 sm:py-12">

      {/* Header */}
      <div className="px-4 sm:px-6 mb-8 text-center space-y-2">
        <SkeletonBlock className="h-3 w-32 mx-auto animate-pulse" />
        <SkeletonBlock className="h-9 w-28 mx-auto animate-pulse" />
        <SkeletonBlock className="h-4 w-72 mx-auto animate-pulse" />
      </div>

      <div className="px-4 sm:px-6">

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <SkeletonBlock className="h-9 w-24 rounded-lg animate-pulse" />
          <SkeletonBlock className="h-9 w-32 rounded-lg animate-pulse" />
        </div>

        {/* Grilla de grupos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <GroupSkeleton key={i} />
          ))}
        </div>

      </div>
    </div>
  )
}
