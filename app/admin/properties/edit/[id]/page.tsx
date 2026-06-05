"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import VillaForm from "@/app/admin/components/VillaForm"

type EditVillaPageProps = {
  params: Promise<{ id: string }>
}

export default function EditVillaPage({ params }: EditVillaPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [villa, setVilla] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    let mounted = true

    async function loadVilla() {
      setLoading(true)
      setErrorMessage("")

      const { data, error } = await supabase
        .from("villas")
        .select("*")
        .eq("id", id)
        .maybeSingle()

      if (!mounted) return

      if (error) {
        setErrorMessage(error.message)
        setVilla(null)
      } else {
        setVilla(data)
      }

      setLoading(false)
    }

    loadVilla()

    return () => {
      mounted = false
    }
  }, [id])

  async function handleSave(data: any) {
    const { error } = await supabase
      .from("villas")
      .update({
        title: data.title,
        slug: data.slug,
        custom_subdomain: data.custom_subdomain || null,
        location: data.location || "",
        property_type: data.property_type || "villa",
        description: data.description || null,
        hero_image: data.hero_image || null,
        hero_images: data.hero_images ?? [],
        gallery: data.gallery ?? [],
        bedrooms: data.bedrooms ?? 0,
        bathrooms: data.bathrooms ?? 0,
        guests: data.guests ?? 0,
        sqft: data.sqft ?? 0,
        pool: data.pool ?? false,
        amenities: data.amenities ?? [],
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        tour_link: data.tour_link || null,
        video_embed: data.video_embed || null,
        rent_url: data.rent_url || null,
        social_url: data.social_url || null,
        sale_interest_enabled: data.sale_interest_enabled ?? false,
        special_request_enabled: data.special_request_enabled ?? false,
        special_request_label: data.special_request_label || null,
        special_request_email: data.special_request_email || null,
        yacht_route: data.yacht_route || null,
        departure_port: data.departure_port || null,
        max_passengers: data.max_passengers ?? 0,
        crew: data.crew ?? 0,
        cabins: data.cabins ?? 0,
        yacht_length: data.yacht_length || null,
        charter_price: data.charter_price || null,
        status: data.status || "active",
        featured: data.featured ?? false,
      })
      .eq("id", id)

    if (error) {
      throw new Error(error.message)
    }

    router.push("/admin/properties")
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/properties" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to villas
        </Link>

        <div className="mb-10">
          <p className="text-[#c9a962] uppercase tracking-[0.35em] text-xs mb-3">Admin</p>
          <h1 className="text-4xl font-light">Edit Villa</h1>
        </div>

        {loading && <p className="text-white/60">Loading villa...</p>}

        {!loading && errorMessage && (
          <div className="border border-red-500/40 bg-red-500/10 text-red-200 rounded-xl p-4">
            {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && !villa && (
          <div className="border border-white/10 bg-[#0f0f0f] rounded-xl p-6 text-white/60">
            Villa not found.
          </div>
        )}

        {!loading && villa && <VillaForm initialData={villa} onSave={handleSave} submitLabel="Update Villa" />}
      </div>
    </div>
  )
}
