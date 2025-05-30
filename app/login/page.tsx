'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup' | 'magic'>('login')
  const [message, setMessage] = useState('')

  const handleAuth = async () => {
    setMessage('')

    if (!email) return setMessage('Please enter your email.')
    if ((mode === 'login' || mode === 'signup') && !password) {
      return setMessage('Please enter your password.')
    }

    let result

    if (mode === 'signup') {
      result = await supabase.auth.signUp({ email, password })
    } else if (mode === 'login') {
      result = await supabase.auth.signInWithPassword({ email, password })
    } else if (mode === 'magic') {
      result = await supabase.auth.signInWithOtp({ email })
      setMessage('Check your email for the login link.')
      return
    }

    if (result?.error) {
      setMessage('❌ ${result.error.message}')
    } else {
      setMessage('✅ Logged in! Redirecting...')
      window.location.href = '/'
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Welcome to Notion Clone</h1>

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {(mode === 'login' || mode === 'signup') && (
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        <button onClick={handleAuth} className="w-full bg-blue-600 text-white py-2 rounded">
          {mode === 'login' && 'Login with Email & Password'}
          {mode === 'signup' && 'Sign Up with Email & Password'}
          {mode === 'magic' && 'Send Magic Link'}
        </button>

        {message && <p className="text-sm text-center mt-2">{message}</p>}

        <div className="text-center mt-4 text-sm space-y-2">
          <button onClick={() => setMode('login')} className="text-blue-500 block">
            Use Email + Password Login
          </button>
          <button onClick={() => setMode('signup')} className="text-blue-500 block">
            Create an Account
          </button>
          <button onClick={() => setMode('magic')} className="text-blue-500 block">
            Use Magic Link
          </button>
        </div>
      </div>
    </div>
  )
}