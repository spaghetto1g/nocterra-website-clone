"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function AdminDashboard() {
  const [villas, setVillas] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("villas").select("*")
      setVillas(data || [])
    }

    load()
  }, [])

  const total = villas.length
  const active = villas.filter(v => v.status === "active").length
  const archived = villas.filter(v => v.status === "archived").length
  const featured = villas.filter(v => v.featured).length

  return (
    <div className="max-w-6xl mx-auto p-6 text-white space-y-6">

      <h1 className="text-3xl">Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">

        <div className="p-4 border border-white/10">
          Total Villas
          <div className="text-2xl">{total}</div>
        </div>

        <div className="p-4 border border-white/10">
          Active
          <div className="text-2xl text-green-400">{active}</div>
        </div>

        <div className="p-4 border border-white/10">
          Archived
          <div className="text-2xl text-red-400">{archived}</div>
        </div>

        <div className="p-4 border border-white/10">
          Featured
          <div className="text-2xl text-yellow-400">{featured}</div>
        </div>

      </div>

      {/* QUICK ACTION */}
      <Link
        href="/admin/properties"
        className="inline-block px-6 py-3 bg-[#c9a86a] text-black"
      >
        Manage Villas
      </Link>

    </div>
  )
}