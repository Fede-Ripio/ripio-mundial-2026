import { createServerSupabaseClient } from '@/lib/supabase-server'
import CuadroClient from '@/components/CuadroClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Fixture · Ripio Mundial 2026',
}

export default async function CuadroPage() {
  const supabase = await createServerSupabaseClient()

  const [{ data: standings }, { data: knockoutMatches }] = await Promise.all([
    supabase
      .from('group_standings')
      .select('*')
      .order('group_code', { ascending: true })
      .order('position', { ascending: true }),
    supabase
      .from('matches')
      .select('*')
      .in('stage', ['ro32', 'ro16', 'quarterfinal', 'semifinal', 'third_place', 'final'])
      .order('match_number', { ascending: true }),
  ])

  return (
    <div className="min-h-screen bg-black text-white py-10 sm:py-12">
      <div className="px-4 sm:px-6 mb-8 text-center">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
          Ripio Mundial 2026
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold">Fixture</h1>
        <p className="text-gray-400 mt-2">Posiciones de grupos y eliminación directa</p>
      </div>

      <CuadroClient
        standings={standings || []}
        knockoutMatches={knockoutMatches || []}
      />
    </div>
  )
}
