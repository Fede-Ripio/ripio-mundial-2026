export default function EstadisticasLoading() {
  return (
    <div className="min-h-screen bg-black text-white py-10 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header skeleton */}
        <div className="mb-8 text-center space-y-2">
          <div className="h-3 w-32 bg-gray-800 rounded mx-auto animate-pulse" />
          <div className="h-9 w-56 bg-gray-800 rounded mx-auto animate-pulse" />
          <div className="h-4 w-72 bg-gray-800/60 rounded mx-auto animate-pulse" />
        </div>

        {/* Tab buttons skeleton */}
        <div className="flex gap-2 mb-8 justify-center">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-9 w-28 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>

        {/* Content skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-900/60 border border-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>

      </div>
    </div>
  )
}
