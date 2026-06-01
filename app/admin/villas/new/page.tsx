"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Page() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setLoading(true)

    const slug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    const { error } = await supabase.from("villas").insert([
      {
        title,
        location,
        slug,
        hero_image: "/villa/placeholder.jpg",
      },
    ])

    setLoading(false)

    if (error) {
      alert("Error creating villa")
      console.log(error)
      return
    }

    alert("Villa created!")

    // redirect στο admin list
    router.push("/admin/properties")
  }

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl mb-6">Create New Villa</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

        <input
          className="w-full p-3 bg-black border border-gray-700"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full p-3 bg-black border border-gray-700"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button
          disabled={loading}
          className="bg-yellow-500 text-black px-6 py-3"
        >
          {loading ? "Saving..." : "Create Villa"}
        </button>

      </form>
    </div>
  )
}