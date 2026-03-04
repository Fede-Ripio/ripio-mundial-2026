export default function ChatLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto">

        {/* Header skeleton */}
        <div className="border-b border-gray-800 px-4 py-4">
          <div className="h-3 w-32 bg-gray-800 rounded animate-pulse mb-2" />
          <div className="h-7 w-16 bg-gray-800 rounded animate-pulse mb-1" />
          <div className="h-4 w-56 bg-gray-800 rounded animate-pulse" />
        </div>

        {/* Messages skeleton */}
        <div className="px-4 py-6 space-y-5">
          {[false, true, false, false, true, false].map((isRight, i) => (
            <div
              key={i}
              className={`flex gap-3 animate-pulse ${isRight ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0 mt-1" />
              {/* Bubble */}
              <div className={`flex flex-col gap-1 max-w-[70%] ${isRight ? 'items-end' : 'items-start'}`}>
                <div className="h-3 w-20 bg-gray-800 rounded" />
                <div className={`rounded-2xl px-4 py-2 bg-gray-800 ${
                  [48, 80, 64, 72, 56, 88][i] ? '' : ''
                }`} style={{ width: `${[180, 240, 160, 200, 220, 150][i]}px`, height: '38px' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Input skeleton */}
        <div className="border-t border-gray-800 px-4 py-4">
          <div className="flex gap-3">
            <div className="flex-1 h-12 bg-gray-800 rounded-xl animate-pulse" />
            <div className="w-16 h-12 bg-gray-800 rounded-xl animate-pulse" />
          </div>
        </div>

      </div>
    </div>
  )
}
