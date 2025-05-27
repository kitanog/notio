'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DocumentEditor() {
  const { id } = useParams()
  const [doc, setDoc] = useState<any>(null)

  useEffect(() => {
    const fetchDoc = async () => {
      const { data } = await supabase.from('documents').select('*').eq('id', id).single()
      setDoc(data)
    }

    fetchDoc()

    const channel = supabase
      .channel('realtime:doc')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'documents', filter: `id=eq.${id}` },
        (payload) => {
          setDoc((prev) => ({ ...prev, content: payload.new.content }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])

  const updateContent = async (value: string) => {
    setDoc({ ...doc, content: value })
    await supabase.from('documents').update({ content: value }).eq('id', id)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-2">{doc?.title}</h1>
      <textarea
        className="w-full h-96 border p-4"
        value={doc?.content || ''}
        onChange={(e) => updateContent(e.target.value)}
      />
    </div>
  )
}