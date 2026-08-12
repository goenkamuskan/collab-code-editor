import { useState } from 'react'
import { supabase } from '../lib/supabase'

function Auth({ onAuth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }
    onAuth(data.user)
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#1e1e1e]">
      <form onSubmit={handleSubmit} className="bg-[#252526] p-8 rounded-lg w-80 flex flex-col gap-3">
        <h1 className="text-lg font-semibold text-white mb-2">
          {isSignUp ? 'Create an account' : 'Sign in to CollabCode'}
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#3e3e3e] text-white text-sm px-3 py-2 rounded outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[#3e3e3e] text-white text-sm px-3 py-2 rounded outline-none"
          required
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm py-2 rounded transition-colors"
        >
          {loading ? '...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-[#888] text-xs hover:text-white"
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </form>
    </div>
  )
}

export default Auth