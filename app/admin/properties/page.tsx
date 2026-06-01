"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  villa: "Villa",
  residence: "Residence",
  apartment: "Luxury Apartment",
  penthouse: "Penthouse",
  suite: "Signature Suite",
  yacht: "Yacht",
  luxury_boat: "Luxury Boat",
}

const STAY_TYPES = ["residence", "apartment", "penthouse", "suite"]
const YACHT_TYPES = ["yacht", "luxury_boat"]
const FILTERS = ["all", "active", "archived", "featured", "villa", "stays", "yachting", "residence", "apartment", "penthouse", "suite", "yacht", "luxury_boat"]

function normalizeType(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim().toLowerCase() : "villa"
}

function typeLabel(value: unknown) {
  const type = normalizeType(value)
  return PROPERTY_TYPE_LABELS[type] ?? type
}

export default function AdminPropertiesPage() {
  const [villas, setVillas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlFilter = params.get("filter")

    if (urlFilter && FILTERS.includes(urlFilter)) {
      setFilter(urlFilter)
    }
  }, [])

  useEffect(() => {
    async function fetchVillas() {
      setLoading(true)

      const { data, error } = await supabase
        .from("villas")
        .select("*")
        .order("id", { ascending: false })

      if (error) {
        console.error(error)
        setVillas([])
      } else {
        setVillas(data ?? [])
      }

      setLoading(false)
    }

    fetchVillas()
  }, [])

  const searched = useMemo(() => {
    const searchText = search.toLowerCase().trim()

    return villas.filter((v) => {
      const title = v?.title?.toLowerCase() || ""
      const location = v?.location?.toLowerCase() || ""
      const propertyType = normalizeType(v?.property_type)

      if (!searchText) return true

      return title.includes(searchText) || location.includes(searchText) || propertyType.includes(searchText)
    })
  }, [villas, search])

  const filtered = searched.filter((v) => {
    const status = v?.status ?? "active"
    const propertyType = normalizeType(v?.property_type)

    if (filter === "active") return status === "active"
    if (filter === "archived") return status === "archived"
    if (filter === "featured") return v?.featured === true
    if (filter === "villa") return propertyType === "villa"
    if (filter === "stays") return STAY_TYPES.includes(propertyType)
    if (filter === "yachting") return YACHT_TYPES.includes(propertyType)
    if (STAY_TYPES.includes(filter) || YACHT_TYPES.includes(filter)) return propertyType === filter

    return true
  })

  const villaItems = filtered.filter((v) => normalizeType(v?.property_type) === "villa")
  const stayItems = filtered.filter((v) => STAY_TYPES.includes(normalizeType(v?.property_type)))
  const yachtItems = filtered.filter((v) => YACHT_TYPES.includes(normalizeType(v?.property_type)))
  const otherItems = filtered.filter((v) => {
    const propertyType = normalizeType(v?.property_type)
    return propertyType !== "villa" && !STAY_TYPES.includes(propertyType) && !YACHT_TYPES.includes(propertyType)
  })

  async function handleArchive(id: number, status?: string) {
    const currentStatus = status ?? "active"
    const newStatus = currentStatus === "archived" ? "active" : "archived"

    const { error } = await supabase
      .from("villas")
      .update({ status: newStatus })
      .eq("id", id)

    if (error) {
      alert(error.message)
      return
    }

    setVillas((prev) => prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v)))
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this property?")) return

    const { error } = await supabase
      .from("villas")
      .delete()
      .eq("id", id)

    if (error) {
      alert(error.message)
      return
    }

    setVillas((prev) => prev.filter((v) => v.id !== id))
  }

  function PropertyCard({ property }: { property: any }) {
    const status = property?.status ?? "active"
    const propertyType = normalizeType(property?.property_type)

    return (
      <div className="bg-[#111] p-4 border border-white/10">
        <h2 className="text-xl">{property?.title || "-"}</h2>
        <p className="text-gray-400">{property?.location || "-"}</p>

        <div className="flex flex-wrap gap-2 mt-2">
          <span className={`text-xs px-2 py-1 border ${status === "active" ? "text-green-400 border-green-400" : "text-red-400 border-red-400"}`}>
            {status}
          </span>

          <span className="text-[#c9a962] text-xs border border-[#c9a962]/60 px-2 py-1 uppercase">
            {typeLabel(propertyType)}
          </span>

          {property?.featured && (
            <span className="text-yellow-400 text-xs border border-yellow-400 px-2 py-1">FEATURED</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Link href={`/admin/properties/edit/${property.id}`} className="px-3 py-2 border border-white/20 hover:border-[#c9a962] transition-colors">
            Edit
          </Link>

          <Link href={property?.slug ? `/villas/${property.slug}` : "#"} className="px-3 py-2 border border-yellow-500 text-yellow-400">
            View
          </Link>

          <button onClick={() => handleArchive(property.id, property.status)} className="px-3 py-2 border border-white/20 hover:border-[#c9a962] transition-colors">
            {status === "archived" ? "Unarchive" : "Archive"}
          </button>

          <button onClick={() => handleDelete(property.id)} className="px-3 py-2 border border-red-500 text-red-400">
            Delete
          </button>
        </div>
      </div>
    )
  }

  function Section({ title, description, items }: { title: string; description: string; items: any[] }) {
    return (
      <section className="mb-12">
        <div className="border-b border-white/10 pb-4 mb-6">
          <h2 className="text-2xl font-light">{title}</h2>
          <p className="text-white/40 text-sm mt-2">{description}</p>
        </div>

        {items.length === 0 ? (
          <p className="text-white/35 text-sm">No properties in this section.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-white">
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <Link href="/admin" className="text-white/45 hover:text-[#c9a962] text-sm transition-colors">
            ← Admin menu
          </Link>
          <h1 className="text-3xl mt-3">Properties</h1>
          <p className="text-white/40 text-sm mt-2">Villas stay separate from apartments, residences, suites and yachting.</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-end">
          <Link href="/admin/properties/new?type=villa" className="px-4 py-2 bg-[#c9a86a] text-black">
            + New Villa
          </Link>
          <Link href="/admin/properties/new?type=apartment" className="px-4 py-2 border border-[#c9a86a] text-[#c9a86a]">
            + New Apartment / Stay
          </Link>
          <Link href="/admin/properties/new?type=yacht" className="px-4 py-2 border border-white/20 text-white/80 hover:border-[#c9a86a] hover:text-[#c9a86a] transition-colors">
            + New Yacht / Boat
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-8">
        <input
          placeholder="Search properties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 bg-black border border-white/20"
        />

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 border text-sm ${filter === f ? "border-yellow-500 text-yellow-400" : "border-white/20 text-white/70"}`}
            >
              {f === "stays" ? "apartments/stays" : f === "yachting" ? "yachts/boats" : f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filter === "villa" ? (
        <Section title="Villas" description="The core NOCTERRA villa collection." items={villaItems} />
      ) : filter === "stays" || STAY_TYPES.includes(filter) ? (
        <Section title="Luxury Apartments / Stays" description="Premium apartments, residences, penthouses and suites kept separate from villas." items={stayItems} />
      ) : filter === "yachting" || YACHT_TYPES.includes(filter) ? (
        <Section title="Yachts / Luxury Boats" description="Future-ready yacht and luxury boat collection with route, 360 tour and charter details." items={yachtItems} />
      ) : (
        <>
          <Section title="Villas" description="The core NOCTERRA villa collection." items={villaItems} />
          <Section title="Luxury Apartments / Stays" description="Premium apartments, residences, penthouses and suites." items={stayItems} />
          <Section title="Yachts / Luxury Boats" description="Prepared for future yacht charters and luxury boat experiences." items={yachtItems} />
          {otherItems.length > 0 && <Section title="Other Premium Properties" description="Properties with custom types." items={otherItems} />}
        </>
      )}
    </div>
  )
}
