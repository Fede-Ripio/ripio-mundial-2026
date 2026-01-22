'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LeaguesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [myLeagues, setMyLeagues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [joining, setJoining] = useState(false)
  const [newLeagueName, setNewLeagueName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    setUser(user)

    const { data: memberships } = await supabase
      .from('league_members')
      .select('league_id, leagues(*)')
      .eq('user_id', user.id)

    setMyLeagues(memberships?.map(m => m.leagues).filter(Boolean) || [])
    setLoading(false)
  }

  const handleCreateLeague = async () => {
    if (!newLeagueName.trim()) {
      setMessage('❌ Ingresá un nombre para la liga')
      return
    }

    setCreating(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase()

      console.log('Creating league with:', {
        name: newLeagueName,
        is_public: false,
        owner_id: user.id,
        invite_code: inviteCode
      })

      // Insertar liga
      const { data: league, error: leagueError } = await supabase
        .from('leagues')
        .insert({
          name: newLeagueName.trim(),
          is_public: false,
          owner_id: user.id,
          invite_code: inviteCode
        })
        .select()
        .single()

      if (leagueError) {
        console.error('League creation error:', leagueError)
        throw new Error(leagueError.message || 'Error al crear la liga')
      }

      console.log('League created:', league)

      // Unirse como owner
      const { error: memberError } = await supabase
        .from('league_members')
        .insert({
          league_id: league.id,
          user_id: user.id,
          role: 'owner'
        })

      if (memberError) {
        console.error('Member join error:', memberError)
        throw new Error('Liga creada pero error al unirse: ' + memberError.message)
      }

      setMessage('✅ Liga creada! Código: ' + inviteCode)
      setNewLeagueName('')
      setTimeout(() => {
        loadData()
      }, 1000)
    } catch (error: any) {
      console.error('Full error:', error)
      setMessage('❌ ' + error.message)
    } finally {
      setCreating(false)
    }
  }

  const handleJoinLeague = async () => {
    if (!joinCode.trim()) {
      setMessage('❌ Ingresá un código de invitación')
      return
    }

    setJoining(true)
    setMessage(null)

    try {
      const supabase = createClient()

      // Buscar liga por código
      const { data: league, error: leagueError } = await supabase
        .from('leagues')
        .select('*')
        .eq('invite_code', joinCode.toUpperCase())
        .maybeSingle()

      if (leagueError) {
        console.error('Search error:', leagueError)
        throw new Error('Error buscando la liga')
      }

      if (!league) {
        throw new Error('Código inválido o liga no encontrada')
      }

      // Unirse
      const { error: joinError } = await supabase
        .from('league_members')
        .insert({
          league_id: league.id,
          user_id: user.id,
          role: 'member'
        })

      if (joinError) {
        if (joinError.code === '23505') {
          throw new Error('Ya estás en esta liga')
        }
        throw joinError
      }

      setMessage('✅ Te uniste a la liga!')
      setJoinCode('')
      loadData()
    } catch (error: any) {
      setMessage('❌ ' + error.message)
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-4xl font-bold mb-2">🏅 Mis Ligas</h1>
        <p className="text-gray-400 mb-8">Competí con tus amigos en ligas privadas</p>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">➕ Crear Liga Privada</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newLeagueName}
              onChange={(e) => setNewLeagueName(e.target.value)}
              placeholder="Nombre de la liga (ej: Amigos del Barrio)"
              className="flex-1 bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleCreateLeague}
              disabled={creating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {creating ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🔗 Unirse a Liga</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Código de invitación (ej: ABC123)"
              className="flex-1 bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 uppercase"
              maxLength={6}
            />
            <button
              onClick={handleJoinLeague}
              disabled={joining}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {joining ? 'Uniéndose...' : 'Unirse'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.startsWith('✅') ? 'bg-green-600/20 text-green-400 border border-green-500/50' : 'bg-red-600/20 text-red-400 border border-red-500/50'}`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Tus Ligas</h2>
          
          {myLeagues.length === 0 ? (
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-8 text-center">
              <p className="text-gray-400">No estás en ninguna liga todavía</p>
              <p className="text-sm text-gray-500 mt-2">Creá una o unite con un código</p>
            </div>
          ) : (
            myLeagues.map(league => (
              <Link
                key={league.id}
                href={`/leagues/${league.id}`}
                className="block bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 rounded-xl p-6 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{league.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {league.is_public ? '🌍 Liga Pública' : '🔒 Liga Privada'}
                    </p>
                  </div>
                  <div className="text-right">
                    {!league.is_public && league.invite_code && (
                      <div className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded font-mono text-sm">
                        {league.invite_code}
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mt-1">Ver ranking →</div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
