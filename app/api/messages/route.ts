import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { containsBadWords } from '@/lib/bad-words'

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient()

  // Verificar autenticación
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // Parsear body
  let content: string
  try {
    const body = await req.json()
    content = body?.content ?? ''
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  content = content.trim()

  // Validaciones básicas
  if (!content) {
    return NextResponse.json({ error: 'El mensaje no puede estar vacío' }, { status: 400 })
  }
  if (content.length > 500) {
    return NextResponse.json({ error: 'El mensaje supera los 500 caracteres' }, { status: 400 })
  }

  // Filtro de malas palabras (server-side — no bypasseable desde el cliente)
  if (containsBadWords(content)) {
    return NextResponse.json(
      { error: 'Tu mensaje contiene palabras no permitidas.' },
      { status: 422 }
    )
  }

  // Insertar en DB
  const { error } = await supabase
    .from('messages')
    .insert({ user_id: user.id, content })

  if (error) {
    console.error('[messages/route] insert error:', error)
    return NextResponse.json({ error: 'Error al enviar el mensaje' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}

export async function DELETE(req: Request) {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // Solo el admin puede borrar
  if (user.email !== 'federico.cortina@ripio.com') {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  let id: string
  try {
    const body = await req.json()
    id = body?.id ?? ''
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!id) {
    return NextResponse.json({ error: 'id requerido' }, { status: 400 })
  }

  const { error } = await supabase.from('messages').delete().eq('id', id)
  if (error) {
    return NextResponse.json({ error: 'Error al borrar el mensaje' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
