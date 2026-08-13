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
    <div className="flex items-center justify-center h-screen bg-[#111111]">
      <div className="flex w-[820px] h-[480px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-2xl">

        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-center w-[340px] bg-[#1c1c1c] border-r border-[#2a2a2a] px-10">
          <p className="text-[#e8a33d] font-mono text-base">$ collabcode</p>
          <p className="text-[#666] font-mono text-sm mt-1 mb-6">&gt; real-time editor</p>
          <pre className="text-[#4a4a4a] font-mono text-xs leading-relaxed bg-[#151515] border border-[#2a2a2a] rounded p-4">
{`def sync():
    while room.open:
        yield delta
        await push()`}
          </pre>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex items-center justify-center px-6">
          <form onSubmit={handleSubmit} className="w-64 flex flex-col gap-3">
            <h1 className="text-white text-base font-medium mb-1">
              {isSignUp ? 'Create an account' : 'Sign in'}
            </h1>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#232323] border border-[#333] text-white text-sm px-3 py-2 rounded outline-none focus:border-[#e8a33d]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#232323] border border-[#333] text-white text-sm px-3 py-2 rounded outline-none focus:border-[#e8a33d]"
              required
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#e8a33d] hover:bg-[#d4922f] disabled:opacity-50 text-[#161616] text-sm font-medium py-2 rounded transition-colors"
            >
              {loading ? '...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#666] text-xs hover:text-white text-left"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default Auth