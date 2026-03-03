function SkeletonBlock({ className }: { className: string }) {
  return <div className={`bg-gray-800 rounded animate-pulse ${className}`} />
}

export default function RankingLoading() {
  return (
    <div className="min-h-screen bg-black text-white py-10 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center space-y-2">
          <SkeletonBlock className="h-3 w-32 mx-auto" />
          <SkeletonBlock className="h-9 w-52 mx-auto" />
          <SkeletonBlock className="h-4 w-44 mx-auto" />
        </div>

        {/* Podio top 3 */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`rounded-2xl p-8 text-center border border-gray-800 ${i === 2 ? 'sm:col-span-2 md:col-span-1' : ''}`}
            >
              <SkeletonBlock className="w-12 h-12 rounded-full mx-auto mb-4" />
              <SkeletonBlock className="h-8 w-28 mx-auto mb-2" />
              <SkeletonBlock className="h-4 w-24 mx-auto mb-4" />
              <div className="pt-4 border-t border-gray-800 space-y-2">
                <SkeletonBlock className="h-5 w-36 mx-auto" />
                <SkeletonBlock className="h-8 w-20 mx-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Tabla de posiciones */}
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/40">
              <SkeletonBlock className="w-6 h-4 flex-shrink-0" />
              <SkeletonBlock className="w-8 h-8 rounded-full flex-shrink-0" />
              <SkeletonBlock className="h-4 w-36" />
              <div className="ml-auto flex items-center gap-4">
                <SkeletonBlock className="h-4 w-10 hidden sm:block" />
                <SkeletonBlock className="h-4 w-10 hidden sm:block" />
                <SkeletonBlock className="h-5 w-14" />
              </div>
            </div>
          ))}
        </div>

        {/* Info box */}
        <div className="border border-gray-800 rounded-xl p-6 mt-8 space-y-3">
          <SkeletonBlock className="h-3 w-36" />
          <SkeletonBlock className="h-4 w-64" />
          <SkeletonBlock className="h-4 w-48" />
          <SkeletonBlock className="h-4 w-80" />
        </div>

      </div>
    </div>
  )
}
