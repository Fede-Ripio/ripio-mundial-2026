'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function EditDisplayName({ currentName }: { currentName: string }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(currentName)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    const trimmed = value.trim()
    if (!trimmed || trimmed.length < 3) {
      setError('Mínimo 3 caracteres')
      return
    }
    if (trimmed.length > 20) {
      setError('Máximo 20 caracteres')
      return
    }

    setSaving(true)
    setError('')

    const supabase = createClient()

    // Verificar unicidad (excluyendo el propio usuario)
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .ilike('display_name', trimmed)
      .single()

    if (existing) {
      setError(`"${trimmed}" ya está en uso`)
      setSaving(false)
      return
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ display_name: trimmed })
      .eq('id', (await supabase.auth.getUser()).data.user?.id ?? '')

    if (updateError) {
      setError('Error al guardar')
    } else {
      setSuccess(true)
      setEditing(false)
      setTimeout(() => {
        setSuccess(false)
        router.refresh()
      }, 1500)
    }

    setSaving(false)
  }

  if (!editing) {
    return (
      <div className="flex items-center justify-between py-3 border-b border-purple-500/20">
        <span className="text-gray-500">Nombre:</span>
        <div className="flex items-center gap-3">
          <span className="font-semibold">{currentName}</span>
          {success ? (
            <span className="text-green-400 text-xs font-medium">Guardado</span>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              Editar
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="py-3 border-b border-purple-500/20 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-gray-500">Nombre:</span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError('') }}
            maxLength={20}
            autoFocus
            className="bg-gray-900 border border-purple-500/50 rounded-lg px-3 py-1.5 text-sm font-semibold text-white focus:outline-none focus:border-purple-400 w-36"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            {saving ? '...' : 'Guardar'}
          </button>
          <button
            onClick={() => { setEditing(false); setValue(currentName); setError('') }}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-red-400 text-right">{error}</p>}
      <p className="text-xs text-gray-600 text-right">3–20 caracteres · único en el ranking</p>
    </div>
  )
}
