'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'

export default function SyncButton() {
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [showLogs, setShowLogs] = useState(false)

  const handleSync = async () => {
    setSyncing(true)
    setLogs(['🔄 Iniciando sincronización...'])
    setShowLogs(true)

    try {
      const response = await fetch('/api/cron/sync-results', {
        method: 'GET',
      })

      const data = await response.json()

      if (data.success) {
        setLogs(data.logs || ['✅ Sincronización completada'])
        router.refresh()
      } else {
        setLogs(data.logs || ['❌ Error en la sincronización'])
      }
    } catch (error: any) {
      setLogs(['❌ Error: ' + error.message])
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleSync}
        disabled={syncing}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
      >
        <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
        {syncing ? 'Sincronizando...' : 'Sincronizar Resultados'}
      </button>

      {showLogs && logs.length > 0 && (
        <div className="mt-4 bg-gray-900 border border-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">📋 Log de Sincronización</h3>
            <button
              onClick={() => setShowLogs(false)}
              className="text-gray-500 hover:text-white text-xs"
            >
              Cerrar
            </button>
          </div>
          <div className="space-y-1 text-xs font-mono">
            {logs.map((log, i) => (
              <div key={i} className="text-gray-300">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
