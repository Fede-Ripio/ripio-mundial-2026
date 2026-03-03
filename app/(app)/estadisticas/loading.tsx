function SkeletonCard() {
  return (
    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">

      {/* Header: fase + fecha */}
      <div className="px-5 py-3 border-b border-gray-800/60 flex items-center justify-between">
        <div className="h-3 w-24 bg-gray-800 rounded" />
        <div className="h-3 w-32 bg-gray-800 rounded" />
      </div>

      {/* Teams */}
      <div className="px-5 py-4 border-b border-gray-800/60">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 w-10 bg-gray-800 rounded" />
            <div className="h-5 w-28 bg-gray-700 rounded" />
          </div>
          <div className="h-3 w-4 bg-gray-800 rounded" />
          <div className="flex-1 space-y-1.5 flex flex-col items-end">
            <div className="h-2.5 w-14 bg-gray-800 rounded" />
            <div className="h-5 w-28 bg-gray-700 rounded" />
          </div>
        </div>

        {/* Consensus bar */}
        <div className="h-7 bg-gray-800 rounded-full mb-2" />
        <div className="flex justify-between">
          <div className="h-2.5 w-16 bg-gray-800 rounded" />
          <div className="h-2.5 w-14 bg-gray-800 rounded" />
          <div className="h-2.5 w-16 bg-gray-800 rounded" />
        </div>
      </div>

      {/* Score distribution */}
      <div className="px-5 py-4 border-b border-gray-800/60 space-y-2.5">
        <div className="h-2.5 w-40 bg-gray-800 rounded mb-3" />
        {[85, 35, 30, 30, 30].map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-3 w-6 bg-gray-800 rounded flex-shrink-0" />
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gray-700 rounded-full" style={{ width: `${w}%` }} />
            </div>
            <div className="h-2.5 w-6 bg-gray-800 rounded flex-shrink-0" />
          </div>
        ))}
      </div>

      {/* H2H */}
      <div className="px-5 py-3 border-b border-gray-800/60">
        <div className="h-2.5 w-36 bg-gray-800 rounded mb-3" />
        <div className="h-5 bg-gray-800 rounded-full mb-1.5" />
        <div className="flex justify-between">
          <div className="h-2.5 w-20 bg-gray-800 rounded" />
          <div className="h-2.5 w-14 bg-gray-800 rounded" />
          <div className="h-2.5 w-20 bg-gray-800 rounded" />
        </div>
      </div>

      {/* Country + crypto cards */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-gray-800/40 rounded-xl p-4 space-y-2">
          <div className="h-2.5 w-20 bg-gray-700 rounded" />
          <div className="h-3 w-28 bg-gray-700 rounded" />
          <div className="h-2 w-full bg-gray-800 rounded" />
          <div className="h-2 w-3/4 bg-gray-800 rounded" />
        </div>
        <div className="bg-gray-800/40 rounded-xl p-4 space-y-2">
          <div className="h-2.5 w-20 bg-gray-700 rounded" />
          <div className="h-3 w-28 bg-gray-700 rounded" />
          <div className="h-2 w-full bg-gray-800 rounded" />
          <div className="h-2 w-3/4 bg-gray-800 rounded" />
        </div>
      </div>

    </div>
  )
}

export default function EstadisticasLoading() {
  return (
    <div className="min-h-screen bg-black text-white py-10 sm:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header skeleton */}
        <div className="mb-8 text-center space-y-2">
          <div className="h-3 w-32 bg-gray-800 rounded mx-auto animate-pulse" />
          <div className="h-9 w-24 bg-gray-800 rounded mx-auto animate-pulse" />
          <div className="h-4 w-32 bg-gray-800/60 rounded mx-auto animate-pulse" />
        </div>

        {/* Date label skeleton */}
        <div className="h-3 w-40 bg-gray-800 rounded animate-pulse mb-4" />

        {/* Cards */}
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>

      </div>
    </div>
  )
}
