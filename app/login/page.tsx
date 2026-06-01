"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    router.push("/admin/properties")
  }

  return (
    <div className="flex items-center justify-center h-screen text-white">

      <div className="w-80 space-y-4">

        <h1 className="text-2xl">Admin Login</h1>

        <input
          className="w-full p-2 bg-black border"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 bg-black border"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-[#c9a86a] text-black py-2"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>

    </div>
  )
}