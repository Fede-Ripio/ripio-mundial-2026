export default function ChatLoading() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header skeleton — centrado, sin borde */}
      <div className="pt-10 sm:pt-12 pb-6 px-4 text-center">
        <div className="h-3 w-32 bg-gray-800 rounded animate-pulse mb-3 mx-auto" />
        <div className="h-9 w-20 bg-gray-800 rounded animate-pulse mb-2 mx-auto" />
        <div className="h-4 w-64 bg-gray-800 rounded animate-pulse mx-auto" />
      </div>

      {/* Chat area skeleton */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-6">
        <div className="h-[calc(100vh-13rem)] md:h-[calc(100vh-10rem)] rounded-2xl border border-purple-500/10 flex flex-col overflow-hidden">

          {/* Messages skeleton */}
          <div className="flex-1 px-4 py-6 space-y-5 overflow-hidden">
            {[false, true, false, false, true, false].map((isRight, i) => (
              <div
                key={i}
                className={`flex gap-3 animate-pulse ${isRight ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {!isRight && <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0 mt-1" />}
                <div className={`flex flex-col gap-1 max-w-[70%] ${isRight ? 'items-end' : 'items-start'}`}>
                  {!isRight && <div className="h-3 w-20 bg-gray-800 rounded" />}
                  <div
                    className={`rounded-2xl ${isRight ? 'bg-purple-900/40' : 'bg-gray-800'}`}
                    style={{ width: `${[180, 240, 160, 200, 220, 150][i]}px`, height: '38px' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Input skeleton */}
          <div className="border-t border-purple-500/10 px-4 py-3 rounded-b-2xl">
            <div className="flex gap-2">
              <div className="flex-1 h-12 bg-gray-900 rounded-xl animate-pulse" />
              <div className="w-12 h-12 bg-gray-900 rounded-xl animate-pulse" />
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
