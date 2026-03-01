import { createServerSupabaseClient } from '@/lib/supabase-server'
import BracketView from '@/components/BracketView'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Bracket · Ripio Mundial 2026',
}

export default async function BracketPage() {
  const supabase = await createServerSupabaseClient()

  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .in('stage', ['ro32', 'ro16', 'quarterfinal', 'semifinal', 'third_place', 'final'])
    .order('match_number', { ascending: true })

  return (
    <div className="min-h-screen bg-black text-white py-6 sm:py-10">
      <div className="px-4 sm:px-6 max-w-2xl mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
          Ripio Mundial 2026
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold">Bracket</h1>
        <p className="text-gray-400 mt-2">Cuadro de eliminación directa · R32 → Final</p>
      </div>

      <BracketView matches={matches || []} />
    </div>
  )
}
