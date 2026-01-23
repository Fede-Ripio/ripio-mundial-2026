'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      
      // Registrar usuario
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName
          }
        }
      })

      if (authError) throw authError

      // Actualizar perfil
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ display_name: displayName })
          .eq('id', authData.user.id)

        if (profileError) console.error('Error updating profile:', profileError)
      }

      router.push('/matches')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Crear cuenta
          </h1>
          <p className="text-gray-400">
            Unite a Ripio Mundial 2026 y competí por 1.75M wARS
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre de usuario</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              placeholder="Tu nombre"
              className="w-full bg-gray-900 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="w-full bg-gray-900 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              className="w-full bg-gray-900 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-2">Debe tener al menos 6 caracteres</p>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold px-6 py-4 rounded-xl transition-colors text-lg"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
              Ingresá acá
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-400">
            ← Volver al inicio
          </Link>
        </div>

        {/* Beneficios */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <h3 className="text-sm font-semibold text-gray-400 mb-4">Al registrarte obtenés:</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Acceso a la Liga General con premios</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Crear y unirse a ligas privadas</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Pronosticar los 104 partidos del Mundial</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Ranking y estadísticas en tiempo real</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}
