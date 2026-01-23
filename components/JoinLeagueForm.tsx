'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function JoinLeagueForm() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/leagues/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invite_code: code.toUpperCase() })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al unirse')
      }

      const data = await res.json()
      router.push(`/leagues/${data.league.id}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Código inválido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        required
        placeholder="CÓDIGO DE INVITACIÓN (EJ: ABC123)"
        maxLength={6}
        className="flex-1 bg-gray-900/80 border border-gray-700 rounded-xl px-6 py-4 text-white uppercase font-mono placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors whitespace-nowrap"
      >
        {loading ? 'Uniéndose...' : 'Unirse'}
      </button>
      {error && (
        <div className="col-span-full bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}
    </form>
  )
}
