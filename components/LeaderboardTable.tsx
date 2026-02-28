'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface LeaderboardEntry {
  id: string
  display_name: string | null
  points: number
  exactHits: number
  correctOutcomes: number
  position: number
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  currentUserId: string | null
  totalCount: number
}

const PAGE_SIZE = 50

export default function LeaderboardTable({ entries, currentUserId, totalCount }: LeaderboardTableProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [showSticky, setShowSticky] = useState(false)
  const [shouldScrollToUser, setShouldScrollToUser] = useState(false)

  const userRowRef = useRef<HTMLTableRowElement | null>(null)
  const stickyObserverRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLTableRowElement>(null)

  const currentUserEntry = currentUserId
    ? entries.find(e => e.id === currentUserId) ?? null
    : null

  const visibleEntries = entries.slice(0, visibleCount)

  // Callback ref: re-observa la fila del usuario cada vez que el nodo aparece en el DOM
  // (necesario porque con infinite scroll el nodo puede no existir al principio)
  const setUserRowRef = useCallback((node: HTMLTableRowElement | null) => {
    userRowRef.current = node

    if (stickyObserverRef.current) {
      stickyObserverRef.current.disconnect()
      stickyObserverRef.current = null
    }

    if (node) {
      stickyObserverRef.current = new IntersectionObserver(
        ([entry]) => setShowSticky(!entry.isIntersecting),
        { threshold: 0 }
      )
      stickyObserverRef.current.observe(node)
    }
  }, [])

  // Infinite scroll: cargar más cuando el sentinel llega al viewport
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCount < entries.length) {
          setVisibleCount(c => Math.min(c + PAGE_SIZE, entries.length))
        }
      },
      { threshold: 0, rootMargin: '200px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [visibleCount, entries.length])

  // Scroll a la fila del usuario después de que React la renderice
  useEffect(() => {
    if (!shouldScrollToUser) return
    const row = userRowRef.current
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setShouldScrollToUser(false)
    }
  }, [shouldScrollToUser, visibleCount])

  const handleJumpToUser = () => {
    if (!currentUserEntry) return
    // entries empieza en posición 4 (índice 0 = posición 4)
    // cargamos hasta la fila del usuario + 5 filas de contexto abajo
    const needed = Math.min(currentUserEntry.position - 3 + 5, entries.length)
    setVisibleCount(prev => Math.max(prev, needed))
    setShouldScrollToUser(true)
  }

  return (
    <>
      <div className="border border-purple-500/30 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-900/20">
              <tr>
                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-400">Pos</th>
                <th className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-gray-400">Usuario</th>
                <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-gray-400">Puntos</th>
                <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-gray-400 hidden sm:table-cell">Exactos</th>
                <th className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-gray-400 hidden sm:table-cell">Aciertos</th>
              </tr>
            </thead>
            <tbody>
              {visibleEntries.map((entry) => {
                const isCurrentUser = entry.id === currentUserId
                return (
                  <tr
                    key={entry.id}
                    ref={isCurrentUser ? setUserRowRef : undefined}
                    className={`border-t border-purple-500/20 transition-colors ${
                      isCurrentUser
                        ? 'bg-gradient-to-r from-purple-600/30 to-purple-500/20 border-l-4 border-l-purple-500'
                        : 'hover:bg-gray-900/30'
                    }`}
                  >
                    <td className="px-4 sm:px-6 py-4 font-semibold text-gray-400">
                      {entry.position}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">{entry.display_name || 'Anónimo'}</div>
                        {isCurrentUser && (
                          <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                            VOS
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span className="text-xl font-bold text-purple-400">{entry.points}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center text-green-400 font-semibold hidden sm:table-cell">
                      {entry.exactHits}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center text-yellow-400 font-semibold hidden sm:table-cell">
                      {entry.correctOutcomes}
                    </td>
                  </tr>
                )
              })}

              {/* Sentinel para el infinite scroll */}
              {visibleCount < entries.length && (
                <tr ref={sentinelRef}>
                  <td colSpan={5} className="px-6 py-6 text-center text-gray-600 text-sm">
                    Cargando más...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STICKY BAR — aparece cuando la fila del usuario sale de la pantalla */}
      {currentUserEntry && showSticky && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-t border-purple-500/40 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-purple-400 font-bold text-2xl flex-shrink-0">
                #{currentUserEntry.position}
              </span>
              <span className="text-gray-400 text-sm flex-shrink-0">de {totalCount}</span>
              <span className="text-white font-semibold truncate">
                {currentUserEntry.display_name || 'Anónimo'}
              </span>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0 text-sm">
              <div className="text-center">
                <div className="text-xl font-bold text-purple-400">{currentUserEntry.points}</div>
                <div className="text-xs text-gray-500">pts</div>
              </div>
              <div className="text-center hidden sm:block">
                <div className="text-lg font-bold text-green-400">{currentUserEntry.exactHits}</div>
                <div className="text-xs text-gray-500">exactos</div>
              </div>
              <div className="text-center hidden sm:block">
                <div className="text-lg font-bold text-yellow-400">{currentUserEntry.correctOutcomes}</div>
                <div className="text-xs text-gray-500">aciertos</div>
              </div>
              <button
                onClick={handleJumpToUser}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex-shrink-0"
              >
                Ver mi posición
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
