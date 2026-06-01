"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function useRole() {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRole() {
      const { data: userData } = await supabase.auth.getUser()

      const user = userData?.user

      if (!user) {
        setRole(null)
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      setRole(data?.role || "editor")
      setLoading(false)
    }

    loadRole()
  }, [])

  return { role, loading }
}