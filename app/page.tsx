'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function HomePage() {
  const [docs, setDocs] = useState<any[]>([])

  useEffect(() => {
    fetchDocs()

    const channel = supabase
      .channel('documents')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'documents' },
        () => fetchDocs()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchDocs = async () => {
    const { data } = await supabase.from('documents').select('*')
    setDocs(data || [])
  }

  const createDoc = async () => {
    const user = (await supabase.auth.getUser()).data.user
    const { data } = await supabase.from('documents').insert({
      title: 'Untitled Document',
      content: '',
      owner: user?.id,
    }).select().single()
    if (data) location.href = `/doc/${data.id}`
  }

  return (
    <div className="p-6">
      <button onClick={createDoc} className="bg-green-600 text-white p-2 rounded mb-4">
        + New Document
      </button>
      <ul>
        {docs.map((doc) => (
          <li key={doc.id}>
            <Link href={`/doc/${doc.id}`} className="text-blue-500 underline">
              {doc.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}