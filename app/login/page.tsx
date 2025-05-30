'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleLogin = async () => {
    setLoading(true)
    setErrorMsg(null)

    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setErrorMsg(error.message)
    } else {
      setSent(true)
    }

    setLoading(false)
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Log in</h1>

      {sent ? (
        <div className="text-green-700 bg-green-100 p-4 rounded">
          ✅ Check your email for the login link!
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Enter your email"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white w-full p-2 rounded disabled:opacity-50"
            disabled={loading || !email}
          >
            {loading ? 'Sending link...' : 'Send Magic Link'}
          </button>

          {errorMsg && (
            <div className="text-red-600 bg-red-100 p-2 rounded">
              ⚠️ {errorMsg}
            </div>
          )}
        </div>
      )}
    </div>
  )
}