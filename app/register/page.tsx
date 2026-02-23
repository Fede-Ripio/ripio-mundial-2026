'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import EmailInput from '@/components/EmailInput'

export default function RegisterPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingUsername, setCheckingUsername] = useState(false)

  const checkUsernameAvailable = async (username: string) => {
    if (!username || username.length < 3) return

    setCheckingUsername(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .ilike('display_name', username)
      .single()

    setCheckingUsername(false)

    if (data) {
      setError(`El nombre de usuario "${username}" ya está en uso`)
      return false
    }

    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      // Verificar si el email ya existe
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

      if (existingUser) {
        throw new Error('Este email ya está registrado. Intentá iniciar sesión.')
      }

      // Verificar username si lo ingresó
      if (displayName && displayName.trim()) {
        const isAvailable = await checkUsernameAvailable(displayName.trim())
        if (!isAvailable) {
          setLoading(false)
          return
        }
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/matches`,
          data: {
            display_name: displayName.trim() || email.split('@')[0],
          },
        },
      })

      if (error) throw error

      router.push('/auth/check-email')
    } catch (err: any) {
      setError(err.message || 'Error al crear cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold">
              <span className="text-purple-400">Ripio</span> Mundial 2026
            </h1>
          </Link>
          <h2 className="text-2xl font-bold mb-2">Crear cuenta</h2>
          <p className="text-gray-400 text-sm">
            Gratis • Solo lleva 30 segundos
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Nombre de usuario
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onBlur={(e) => e.target.value.trim() && checkUsernameAvailable(e.target.value.trim())}
              placeholder="Ej: Lionel"
              minLength={3}
              maxLength={20}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Aparecerá en el ranking público • Mínimo 3 caracteres
            </p>
            {checkingUsername && (
              <p className="text-xs text-blue-400 mt-1">⏳ Verificando disponibilidad...</p>
            )}
          </div>

          <EmailInput
            value={email}
            onChange={setEmail}
            required
            placeholder="tu@email.com"
            label="Email"
          />

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || checkingUsername}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <>⏳ Creando cuenta...</> : <>🚀 Crear cuenta</>}
          </button>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-300">
              💡 Te enviamos un link de acceso por email. Sin contraseñas.
            </p>
          </div>

        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-400">¿Ya tenés cuenta? </span>
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
            Iniciar sesión
          </Link>
        </div>

      </div>
    </div>
  )
}
