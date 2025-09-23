'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/auth-context'
import SidebarMenu from '../components/HamburgerMenu'

type ChatListItem = {
  id: string
  created_at: string
  need_post_id: string | null
  need?: { id: string, body: string | null } | null
}

export default function ChatListPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [chats, setChats] = useState<ChatListItem[]>([])
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent('/chat'))
      return
    }

    const load = async () => {
      setBusy(true)
      try {
        const res = await fetch('/api/chat')
        if (res.ok) {
          const data = await res.json()
          setChats(data || [])
        }
      } finally {
        setBusy(false)
      }
    }
    load()
  }, [user, loading, router])

  return (
    <div className="chat-scroll h-screen overflow-y-auto bg-black text-white">
      {/* Fixed Header */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-4 md:px-8">
          <div className="text-white font-bold">Need to tell</div>
          <div><SidebarMenu /></div>
        </div>
      </nav>

      {/* Content */}
      <div className="px-4 md:px-8 pt-20">
        {busy && <div className="text-gray-400">Loading…</div>}
        <div className="space-y-2 max-w-2xl mx-auto">
          {chats.map(c => (
            <button
              key={c.id}
              onClick={() => router.push(`/chat/${c.id}`)}
              className="w-full text-left bg-gray-950 border border-gray-800 rounded-lg p-4 hover:bg-gray-900"
            >
              <div className="text-sm text-gray-400">{new Date(c.created_at).toLocaleString()}</div>
              <div className="text-white whitespace-pre-wrap">{c.need?.body || `Chat #${c.id}`}</div>
            </button>
          ))}
          {(!busy && chats.length === 0) && (
            <div className="text-gray-400">No chats.</div>
          )}
        </div>
      </div>
      <style jsx>{`
        .chat-scroll::-webkit-scrollbar { width: 8px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background-color: rgba(107,114,128,0.5); border-radius: 9999px; }
        .chat-scroll { scrollbar-width: thin; scrollbar-color: rgba(107,114,128,0.5) transparent; }
      `}</style>
    </div>
  )
}


