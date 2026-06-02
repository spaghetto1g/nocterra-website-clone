"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useRole } from "@/lib/useRole"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { role, loading: roleLoading } = useRole()
  const [checkingSession, setCheckingSession] = useState(true)

  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/signup"

  useEffect(() => {
    const supabase = createClient()

    async function checkUser() {
      if (isAuthPage) {
        setCheckingSession(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/admin/login")
        return
      }

      setCheckingSession(false)
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isAuthPage && !session?.user) {
        router.replace("/admin/login")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [isAuthPage, router])

  useEffect(() => {
    if (isAuthPage || checkingSession || roleLoading) return

    if (role === null) {
      router.replace("/admin/login")
    }
  }, [role, roleLoading, checkingSession, isAuthPage, router])

  if (!isAuthPage && (checkingSession || roleLoading)) {
    return <div className="min-h-screen bg-black text-white p-10">Loading...</div>
  }

  return <div>{children}</div>
}
