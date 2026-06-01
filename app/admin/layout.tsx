"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useRole } from "@/lib/useRole"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { role, loading } = useRole()

  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/signup"

  useEffect(() => {
    if (isAuthPage) return

    async function checkUser() {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push("/admin/login")
      }
    }

    checkUser()
  }, [isAuthPage, router])

  useEffect(() => {
    if (isAuthPage || loading) return

    if (role === null) {
      router.push("/admin/login")
    }
  }, [role, loading, isAuthPage, router])

  if (!isAuthPage && loading) {
    return <div className="min-h-screen bg-black text-white p-10">Loading...</div>
  }

  return <div>{children}</div>
}
