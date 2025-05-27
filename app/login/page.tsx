'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleLogin = async () => {
    await supabase.auth.signInWithOtp({ email })
    setSent(true)
  }

  return (
    <div className="p-6">
      {sent ? (
        <p>Check your email for the login link!</p>
      ) : (
        <>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2"
            placeholder="Your email"
          />
          <button onClick={handleLogin} className="ml-2 bg-blue-500 text-white p-2">
            Login
          </button>
        </>
      )}
    </div>
  )
}