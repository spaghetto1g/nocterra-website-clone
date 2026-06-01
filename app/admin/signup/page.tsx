"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function AdminSignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-[#c9a962]/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-[#c9a962] text-2xl">✓</span>
          </div>
          <h1 className="text-2xl font-light text-white mb-4">Check your email</h1>
          <p className="text-white/50 mb-8">
            We&apos;ve sent you a confirmation link to <span className="text-white">{email}</span>
          </p>
          <Link 
            href="/admin/login"
            className="text-[#c9a962] hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block">
            <span className="text-2xl tracking-[0.3em] font-light">
              <span className="text-[#c9a962]">N</span>
              <span className="text-white">OCTERRA</span>
            </span>
          </Link>
          <p className="text-white/30 text-sm mt-4 tracking-wider uppercase">Create Admin Account</p>
        </div>

        {/* Signup Form */}
        <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-8">
          <h1 className="text-2xl font-light text-white mb-2">Create an account</h1>
          <p className="text-white/40 text-sm mb-8">Get started managing your properties</p>

          <form onSubmit={handleSignup} className="space-y-6">
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

            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link href="/" className="text-white/40 text-sm hover:text-[#c9a962] transition-colors">
              ← Back to website
            </Link>
          </div>
        </div>

        {/* Login Link */}
        <p className="text-center text-white/30 text-sm mt-8">
          Already have an account?{" "}
          <Link href="/admin/login" className="text-[#c9a962] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
