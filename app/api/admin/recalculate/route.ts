import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim())

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Llamar a la función de recalculo
    const { data, error } = await supabase.rpc('force_recalculate_classification')

    if (error) throw error

    const result = data[0]

    return NextResponse.json({
      message: result.message,
      resolved_count: result.resolved_count
    })
  } catch (error: any) {
    console.error('Error recalculating:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
