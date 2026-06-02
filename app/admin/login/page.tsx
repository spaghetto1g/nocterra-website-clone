"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.replace("/admin")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="inline-block">
            <span className="text-2xl tracking-[0.3em] font-light">
              <span className="text-[#c9a962]">N</span>
              <span className="text-white">OCTERRA</span>
            </span>
          </Link>
          <p className="text-white/30 text-sm mt-4 tracking-wider uppercase">Admin Portal</p>
        </div>

        <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-8">
          <h1 className="text-2xl font-light text-white mb-2">Welcome back</h1>
          <p className="text-white/40 text-sm mb-8">Sign in to manage your properties</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a962] text-black py-4 rounded-lg text-sm uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link href="/" className="text-white/40 text-sm hover:text-[#c9a962] transition-colors">
              ← Back to website
            </Link>
          </div>
        </div>

        <p className="text-center text-white/30 text-sm mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/admin/signup" className="text-[#c9a962] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
