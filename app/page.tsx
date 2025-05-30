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
    const { data, error } = await supabase
      .from('documents')
      .select('*')

    if (error) {
      console.error('Failed to fetch documents:', error.message)
    }

    setDocs(data || [])
  }

  const createDoc = async () => {
    // 🔐 Get the currently logged-in user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      alert('You must be signed in to create documents.')
      return
    }

    // 🧠 Interview talking point: Explicitly pass `created_by` to align with RLS
    const { data, error } = await supabase
      .from('documents')
      .insert({
        title: 'Untitled Document',
        content: '',
        created_by: user.id, // ✅ Must match RLS policy
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create document:', error.message)
      alert('Failed to create document.')
    } else if (data) {
      // 🌐 Navigate to the new document
      location.href = `/doc/${data.id}`
    }
  }

  return (
    <div className="p-6">
      <button
        onClick={createDoc}
        className="bg-green-600 text-white p-2 rounded mb-4"
      >
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