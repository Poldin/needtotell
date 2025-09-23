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

export async function GET() {
  try {
    const supabase = await getServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: initiated, error: errInitiated } = await supabase
      .from('chat')
      .select('id, created_at, need_post_id')
      .eq('chat_initiator_id', user.id)

    if (errInitiated) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })

    const { data: ownedPosts, error: errNeeds } = await supabase
      .from('needs')
      .select('id')
      .eq('user_id', user.id)

    if (errNeeds) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })

    let ownerChats: Array<{id: string, created_at: string, need_post_id: string}> = []
    if (ownedPosts && ownedPosts.length > 0) {
      const postIds = ownedPosts.map(p => p.id)
      const { data: chatsForOwned, error: errOwnerChats } = await supabase
        .from('chat')
        .select('id, created_at, need_post_id')
        .in('need_post_id', postIds)
      if (errOwnerChats) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
      ownerChats = chatsForOwned || []
    }

    const merged = [...(initiated || []), ...ownerChats]
    const byId: Record<string, {id: string, created_at: string, need_post_id: string}> = {}
    for (const c of merged) byId[c.id] = c
    const unique = Object.values(byId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    // Fetch related needs content
    const needIds = Array.from(new Set(unique.map((c) => c.need_post_id).filter(Boolean))) as string[]
    const needsMap: Record<string, {id: string, body: string, created_at: string, user_id: string, sharing_code: string}> = {}
    if (needIds.length > 0) {
      const { data: needsData } = await supabase
        .from('needs')
        .select('id, body, created_at, user_id, sharing_code')
        .in('id', needIds)
      for (const n of (needsData || [])) {
        needsMap[n.id] = n
      }
    }

    const withNeed = unique.map((c) => ({
      id: c.id,
      created_at: c.created_at,
      need_post_id: c.need_post_id,
      need: c.need_post_id ? needsMap[c.need_post_id] || null : null,
    }))

    return NextResponse.json(withNeed)
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await getServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { need_post_id } = await request.json()
    if (!need_post_id) return NextResponse.json({ error: 'need_post_id required' }, { status: 400 })

    // Find post owner
    const { data: need, error: needErr } = await supabase
      .from('needs')
      .select('user_id')
      .eq('id', need_post_id)
      .single()

    if (needErr || !need) return NextResponse.json({ error: 'Need not found' }, { status: 404 })

    if (need.user_id === user.id) {
      return NextResponse.json({ error: 'Cannot start chat with yourself' }, { status: 400 })
    }

    // Check existing chat
    const { data: existing } = await supabase
      .from('chat')
      .select('id')
      .eq('need_post_id', need_post_id)
      .eq('chat_initiator_id', user.id)
      .maybeSingle()

    if (existing?.id) {
      return NextResponse.json({ id: existing.id })
    }

    const { data: created, error: insertErr } = await supabase
      .from('chat')
      .insert({ need_post_id, chat_initiator_id: user.id })
      .select('id')
      .single()

    if (insertErr || !created) return NextResponse.json({ error: 'Creation failed' }, { status: 500 })
    return NextResponse.json({ id: created.id })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}


