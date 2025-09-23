'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../../lib/auth-context'
import { supabase } from '../../../lib/supabase-client'
import { ArrowLeft } from 'lucide-react'

type Message = {
  id: number
  created_at: string
  body: string | null
  message_author_id: string | null
}

export default function ChatThreadPage() {
  const params = useParams<{ chat_id: string }>()
  const chatId = params?.chat_id as string
  const { user, loading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [need, setNeed] = useState<{ id: string, body: string | null, created_at: string | null, user_id: string | null, sharing_code: string | null } | null>(null)

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push('/auth/login?redirect=' + encodeURIComponent(`/chat/${chatId}`))
      return
    }

    const load = async () => {
      setBusy(true)
      try {
        const [resMsgs, resChat] = await Promise.all([
          fetch(`/api/chat/${chatId}/messages`),
          fetch(`/api/chat/${chatId}`),
        ])
        if (resMsgs.ok) {
          const data = await resMsgs.json()
          setMessages(data || [])
        }
        if (resChat.ok) {
          const detail = await resChat.json()
          setNeed(detail?.need || null)
        }
      } finally {
        setBusy(false)
      }
    }
    load()

    // Realtime subscription to new messages (INSERT)
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `chat_id=eq.${chatId}`
      }, (payload: {new: Message}) => {
        const row = payload.new as Message
        setMessages(prev => {
          if (prev.some(m => m.id === row.id)) return prev
          return [...prev, row]
        })
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, loading, chatId, router])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || !user) return
    setInput('')
    const res = await fetch(`/api/chat/${chatId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: text })
    })
    try {
      if (res.ok) {
        const data = await res.json()
        const insertedId = data?.id as number | undefined
        if (insertedId) {
          const optimistic: Message = {
            id: insertedId,
            created_at: new Date().toISOString(),
            body: text,
            message_author_id: user.id,
          }
          setMessages(prev => {
            if (prev.some(m => m.id === insertedId)) return prev
            return [...prev, optimistic]
          })
        }
      }
    } catch {}
  }

  return (
    <div className="chat-thread-scroll bg-black text-white">

      {/* Main Content */}
      <div className="px-4 md:px-8 max-w-2xl mx-auto pt-2 pb-20">
      <div className="mt-2 mb-3">
            <button
              onClick={() => router.push('/chat')}
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to chats</span>
            </button>
          </div>
        <div className="space-y-3">
          {need && (
            <div className="p-3 border border-gray-800 rounded-lg bg-black">
              {need.created_at && (
                <div className="text-gray-500 text-xs mb-2">
                  {new Date(need.created_at).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' }).replace('/', '/')}
                </div>
              )}
              <div className="text-gray-200 whitespace-pre-wrap">{need.body}</div>
            </div>
          )}
          {busy && <div className="text-gray-400">Loading…</div>}
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.message_author_id === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-3 py-2 rounded-lg border max-w-xs sm:max-w-md ${m.message_author_id === user?.id ? 'bg-gray-800 border-gray-700' : 'bg-black border-gray-800'}`}>
                <div className="text-sm whitespace-pre-wrap">{m.body}</div>
                <div className="text-[10px] text-gray-400 mt-1">{new Date(m.created_at).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom input bar */}
      <div className="fixed left-0 right-0 bottom-0 bg-black/95 backdrop-blur border-t border-gray-800 z-50">
        <div className="px-4 md:px-8 max-w-2xl mx-auto py-3">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage()
              }}
              className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 outline-none focus:border-gray-600"
              placeholder="write here.."
            />
            <button onClick={sendMessage} className="bg-gray-800 hover:bg-gray-700 px-4 rounded transition-colors">send</button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        /* Custom scrollbar for the entire page */
        html::-webkit-scrollbar { width: 8px; }
        html::-webkit-scrollbar-track { background: transparent; }
        html::-webkit-scrollbar-thumb { background-color: rgba(107,114,128,0.5); border-radius: 9999px; }
        html { scrollbar-width: thin; scrollbar-color: rgba(107,114,128,0.5) transparent; }
        
        /* Smooth scrolling */
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  )
}


