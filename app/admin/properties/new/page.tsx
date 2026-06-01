"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import VillaForm from "@/app/admin/components/VillaForm"

const ALLOWED_TYPES = ["villa", "residence", "apartment", "penthouse", "suite", "yacht", "luxury_boat"]

function getInitialType(value: string | null) {
  if (value && ALLOWED_TYPES.includes(value)) return value
  return "villa"
}

function titleForType(type: string) {
  if (type === "villa") return "Create Villa"
  if (type === "apartment") return "Create Luxury Apartment"
  if (type === "residence") return "Create Residence"
  if (type === "penthouse") return "Create Penthouse"
  if (type === "suite") return "Create Signature Suite"
  if (type === "yacht") return "Create Yacht"
  if (type === "luxury_boat") return "Create Luxury Boat"
  return "Create Property"
}

export default function NewVillaPage() {
  const router = useRouter()
  const [initialType, setInitialType] = useState("villa")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setInitialType(getInitialType(params.get("type")))
  }, [])

  async function handleSave(data: any) {
    const { error } = await supabase
      .from("villas")
      .insert({
        title: data.title,
        slug: data.slug,
        location: data.location || null,
        property_type: data.property_type || initialType,
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
        rent_url: data.rent_url || null,
        social_url: data.social_url || null,
        sale_interest_enabled: data.sale_interest_enabled ?? false,
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

    if (error) {
      alert(error.message)
      return
    }

    router.push(initialType === "villa" ? "/admin/properties?filter=villa" : initialType === "yacht" || initialType === "luxury_boat" ? "/admin/properties?filter=yachting" : "/admin/properties?filter=stays")
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/properties" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to properties
        </Link>

        <div className="mb-10">
          <p className="text-[#c9a962] uppercase tracking-[0.35em] text-xs mb-3">Admin</p>
          <h1 className="text-4xl font-light">{titleForType(initialType)}</h1>
        </div>

        <VillaForm initialData={{ property_type: initialType }} onSave={handleSave} submitLabel={titleForType(initialType)} />
      </div>
    </div>
  )
}
