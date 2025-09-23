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

export async function GET(req: NextRequest, { params }: { params: Promise<{ chat_id: string }> }) {
  try {
    const supabase = await getServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { chat_id } = await params
    const chatId = chat_id

    const { data: chat } = await supabase
      .from('chat')
      .select('id, need_post_id, chat_initiator_id, created_at')
      .eq('id', chatId)
      .maybeSingle()

    if (!chat) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    let need: {id: string, body: string, created_at: string, user_id: string, sharing_code: string, answers: unknown} | null = null
    if (chat.need_post_id) {
      const { data } = await supabase
        .from('needs')
        .select('id, body, created_at, user_id, sharing_code, answers')
        .eq('id', chat.need_post_id)
        .maybeSingle()
      need = data
    }

    return NextResponse.json({ chat, need })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}


