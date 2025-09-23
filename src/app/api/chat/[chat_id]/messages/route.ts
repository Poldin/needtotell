import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getServerClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    },
  )
}

async function authorize(supabase: ReturnType<typeof createServerClient>, chatId: string, userId: string) {
  const { data: chat, error: chatErr } = await supabase
    .from('chat')
    .select('id, need_post_id, chat_initiator_id')
    .eq('id', chatId)
    .maybeSingle()
  if (chatErr || !chat) return false
  if (chat.chat_initiator_id === userId) return true
  if (!chat.need_post_id) return false
  const { data: need } = await supabase
    .from('needs')
    .select('user_id')
    .eq('id', chat.need_post_id)
    .maybeSingle()
  return need?.user_id === userId
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ chat_id: string }> }) {
  try {
    const supabase = await getServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { chat_id } = await params
    const chatId = chat_id
    const allowed = await authorize(supabase, chatId, user.id)
    if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, created_at, body, message_author_id')
      .eq('chat_id', chatId)
      .order('id', { ascending: true })
    if (error) return NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ chat_id: string }> }) {
  try {
    const supabase = await getServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { chat_id } = await params
    const chatId = chat_id
    const allowed = await authorize(supabase, chatId, user.id)
    if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { body } = await req.json()
    if (!body || typeof body !== 'string') return NextResponse.json({ error: 'Body required' }, { status: 400 })

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ chat_id: chatId, body, message_author_id: user.id })
      .select('id')
      .single()
    if (error || !data) return NextResponse.json({ error: 'Insert failed' }, { status: 500 })
    return NextResponse.json({ id: data.id })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}


