function SkeletonBlock({ className }: { className: string }) {
  return <div className={`bg-gray-800 rounded animate-pulse ${className}`} />
}

export default function LigasLoading() {
  return (
    <div className="min-h-screen bg-black text-white py-10 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center space-y-2">
          <SkeletonBlock className="h-3 w-32 mx-auto" />
          <SkeletonBlock className="h-9 w-48 mx-auto" />
          <SkeletonBlock className="h-4 w-64 mx-auto" />
        </div>

        {/* Cards de acción: Crear + Unirse */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {[0, 1].map((i) => (
            <div key={i} className="border-2 border-gray-800 rounded-2xl p-6 space-y-4">
              <SkeletonBlock className="h-6 w-32" />
              <SkeletonBlock className="h-4 w-64" />
              <SkeletonBlock className="h-10 w-full rounded-xl" />
              <SkeletonBlock className="h-10 w-28 rounded-xl" />
            </div>
          ))}
        </div>

        {/* Mis ligas */}
        <div>
          <SkeletonBlock className="h-7 w-32 mb-5" />
          <div className="flex flex-col gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="border-2 border-gray-800 rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <SkeletonBlock className="h-7 w-48" />
                    <SkeletonBlock className="h-4 w-32" />
                    <div className="flex gap-6">
                      <div className="space-y-1">
                        <SkeletonBlock className="h-3 w-20" />
                        <SkeletonBlock className="h-6 w-16" />
                      </div>
                      <div className="space-y-1">
                        <SkeletonBlock className="h-3 w-12" />
                        <SkeletonBlock className="h-6 w-24 rounded" />
                      </div>
                    </div>
                  </div>
                  <SkeletonBlock className="h-12 w-full sm:w-32 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
