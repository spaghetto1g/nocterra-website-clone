"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function useRole() {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const supabase = createClient()

    async function loadRole() {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!isMounted) return

      if (!user) {
        setRole(null)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle()

      if (!isMounted) return

      if (error) {
        console.warn("Unable to load admin role. Falling back to editor.", error.message)
      }

      setRole(data?.role || "editor")
      setLoading(false)
    }

    loadRole()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadRole()
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { role, loading }
}
