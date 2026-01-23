'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateLeagueForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/leagues/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })

      if (!res.ok) throw new Error('Error al crear liga')

      const data = await res.json()
      router.push(`/leagues/${data.league.id}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al crear la liga')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Nombre de la liga (ej: Amigos del Barrio)"
        className="flex-1 bg-gray-900/80 border border-gray-700 rounded-xl px-6 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors whitespace-nowrap"
      >
        {loading ? 'Creando...' : 'Crear'}
      </button>
      {error && (
        <div className="col-span-full bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}
    </form>
  )
}
