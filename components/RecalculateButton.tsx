'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RecalculateButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleRecalculate = async () => {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/admin/recalculate', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Error')

      setResult(`✅ ${data.message} (${data.resolved_count} matches resueltos)`)
      
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (err: any) {
      setResult(`❌ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleRecalculate}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap"
      >
        {loading ? (
          <>⏳ Recalculando...</>
        ) : (
          <>🔄 Forzar Recalculo</>
        )}
      </button>
      {result && (
        <p className={`text-sm font-medium ${result.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>
          {result}
        </p>
      )}
    </div>
  )
}
