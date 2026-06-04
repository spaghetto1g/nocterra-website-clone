"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { CONCIERGE_CATEGORIES } from "@/lib/concierge"

const PROPERTY_TYPE_OPTIONS = [
  { value: "villa", label: "Villas" },
  { value: "residence", label: "Residences" },
  { value: "apartment", label: "Apartments" },
  { value: "penthouse", label: "Penthouses" },
  { value: "suite", label: "Suites" },
  { value: "yacht", label: "Yachts" },
  { value: "luxury_boat", label: "Luxury Boats" },
]

type VillaOption = {
  id: number
  title: string
  property_type?: string | null
}

type ConciergeForm = {
  id?: number
  title: string
  category: string
  description: string
  location: string
  image_url: string
  website_url: string
  phone: string
  email: string
  priority: number
  is_active: boolean
  villa_ids: number[]
  property_types: string[]
}

const emptyForm: ConciergeForm = {
  title: "",
  category: "Restaurants",
  description: "",
  location: "",
  image_url: "",
  website_url: "",
  phone: "",
  email: "",
  priority: 100,
  is_active: true,
  villa_ids: [],
  property_types: [],
}

function normalizeNumberArray(value: unknown): number[] {
  return Array.isArray(value)
    ? value.map((item) => Number(item)).filter((item) => Number.isFinite(item) && item > 0)
    : []
}

function normalizeStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean)
    : []
}

function toForm(row: any): ConciergeForm {
  return {
    id: Number(row?.id),
    title: row?.title ?? "",
    category: row?.category ?? "Restaurants",
    description: row?.description ?? "",
    location: row?.location ?? "",
    image_url: row?.image_url ?? "",
    website_url: row?.website_url ?? "",
    phone: row?.phone ?? "",
    email: row?.email ?? "",
    priority: Number(row?.priority) || 100,
    is_active: row?.is_active !== false,
    villa_ids: normalizeNumberArray(row?.villa_ids),
    property_types: normalizeStringArray(row?.property_types),
  }
}

export default function AdminConciergePage() {
  const [items, setItems] = useState<ConciergeForm[]>([])
  const [villas, setVillas] = useState<VillaOption[]>([])
  const [form, setForm] = useState<ConciergeForm>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState("all")

  async function loadData() {
    setLoading(true)

    const [{ data: conciergeData, error: conciergeError }, { data: villaData, error: villaError }] = await Promise.all([
      supabase.from("concierge_items").select("*").order("priority", { ascending: true }).order("id", { ascending: false }),
      supabase.from("villas").select("id,title,property_type").order("title", { ascending: true }),
    ])

    if (conciergeError) {
      console.error(conciergeError)
      alert(conciergeError.message)
    } else {
      setItems((conciergeData ?? []).map(toForm))
    }

    if (villaError) {
      console.error(villaError)
    } else {
      setVillas((villaData ?? []).map((villa: any) => ({ id: Number(villa.id), title: villa.title ?? `Property ${villa.id}`, property_type: villa.property_type ?? "villa" })))
    }

    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredItems = useMemo(() => {
    if (filter === "all") return items
    return items.filter((item) => item.category === filter)
  }, [filter, items])

  function updateField<K extends keyof ConciergeForm>(field: K, value: ConciergeForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleVilla(id: number) {
    setForm((prev) => ({
      ...prev,
      villa_ids: prev.villa_ids.includes(id) ? prev.villa_ids.filter((item) => item !== id) : [...prev.villa_ids, id],
    }))
  }

  function togglePropertyType(type: string) {
    setForm((prev) => ({
      ...prev,
      property_types: prev.property_types.includes(type)
        ? prev.property_types.filter((item) => item !== type)
        : [...prev.property_types, type],
    }))
  }

  function editItem(item: ConciergeForm) {
    setForm({ ...item })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function resetForm() {
    setForm(emptyForm)
  }

  async function saveItem() {
    if (!form.title.trim()) {
      alert("Title is required.")
      return
    }

    setSaving(true)

    const payload = {
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      location: form.location.trim(),
      image_url: form.image_url.trim(),
      website_url: form.website_url.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      priority: Number(form.priority) || 100,
      is_active: form.is_active,
      villa_ids: form.villa_ids,
      property_types: form.property_types,
    }

    const request = form.id
      ? supabase.from("concierge_items").update(payload).eq("id", form.id)
      : supabase.from("concierge_items").insert(payload)

    const { error } = await request

    setSaving(false)

    if (error) {
      alert(error.message)
      return
    }

    await loadData()
    resetForm()
  }

  async function deleteItem(id?: number) {
    if (!id) return
    if (!confirm("Delete this concierge recommendation?")) return

    const { error } = await supabase.from("concierge_items").delete().eq("id", id)

    if (error) {
      alert(error.message)
      return
    }

    await loadData()
    if (form.id === id) resetForm()
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-white/45 hover:text-[#c9a962] text-xs uppercase tracking-[0.22em] mb-6">
              <ArrowLeft size={14} /> Admin
            </Link>
            <p className="text-[#c9a962] uppercase tracking-[0.35em] text-xs mb-3">NOCTERRA Concierge</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light">Curated Recommendations</h1>
            <p className="text-white/45 mt-4 max-w-2xl">
              Manage luxury concierge recommendations for villas, suites, yachts and private experiences. Empty villa/type targeting means the item can appear globally.
            </p>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center justify-center gap-2 border border-[#c9a962]/60 px-5 py-3 text-xs uppercase tracking-[0.2em] text-[#c9a962] hover:bg-[#c9a962] hover:text-black transition"
          >
            <Plus size={15} /> New Item
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-8">
          <section className="border border-white/10 bg-[#0b0b0b] p-5 sm:p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Title</label>
                <input value={form.title} onChange={(e) => updateField("title", e.target.value)} className="w-full bg-black border border-white/10 px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="e.g. Private Chef Tasting Menu" />
              </div>

              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Category</label>
                <select value={form.category} onChange={(e) => updateField("category", e.target.value)} className="w-full bg-black border border-white/10 px-4 py-3 text-white outline-none focus:border-[#c9a962]/60">
                  {CONCIERGE_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Priority</label>
                <input type="number" value={form.priority} onChange={(e) => updateField("priority", Number(e.target.value))} className="w-full bg-black border border-white/10 px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Description</label>
                <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={4} className="w-full bg-black border border-white/10 px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="Short curated description, not marketplace copy." />
              </div>

              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Location</label>
                <input value={form.location} onChange={(e) => updateField("location", e.target.value)} className="w-full bg-black border border-white/10 px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="Santorini / Mykonos / Athens" />
              </div>

              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Image URL</label>
                <input value={form.image_url} onChange={(e) => updateField("image_url", e.target.value)} className="w-full bg-black border border-white/10 px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="https://..." />
              </div>

              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Website URL</label>
                <input value={form.website_url} onChange={(e) => updateField("website_url", e.target.value)} className="w-full bg-black border border-white/10 px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="https://..." />
              </div>

              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Phone</label>
                <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full bg-black border border-white/10 px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" />
              </div>

              <div>
                <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Email</label>
                <input value={form.email} onChange={(e) => updateField("email", e.target.value)} className="w-full bg-black border border-white/10 px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" />
              </div>

              <label className="flex items-center gap-3 text-sm text-white/70 pt-8">
                <input type="checkbox" checked={form.is_active} onChange={(e) => updateField("is_active", e.target.checked)} />
                Active / visible
              </label>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Show for property types</p>
              <p className="text-white/35 text-xs mb-4">Leave empty to allow all property types.</p>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPE_OPTIONS.map((option) => (
                  <button key={option.value} type="button" onClick={() => togglePropertyType(option.value)} className={`border px-3 py-2 text-xs transition ${form.property_types.includes(option.value) ? "border-[#c9a962] text-[#c9a962]" : "border-white/15 text-white/50 hover:text-white"}`}>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Show for specific listings</p>
              <p className="text-white/35 text-xs mb-4">Leave empty to allow all matching listings.</p>
              <div className="max-h-56 overflow-auto border border-white/10 divide-y divide-white/10">
                {villas.map((villa) => (
                  <label key={villa.id} className="flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:bg-white/[0.03]">
                    <input type="checkbox" checked={form.villa_ids.includes(villa.id)} onChange={() => toggleVilla(villa.id)} />
                    <span>{villa.title}</span>
                    <span className="ml-auto text-white/30 text-xs uppercase">{villa.property_type ?? "villa"}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={saveItem} disabled={saving} className="inline-flex items-center justify-center gap-2 bg-[#c9a962] text-black px-6 py-4 text-xs uppercase tracking-[0.2em] disabled:opacity-60">
                <Save size={15} /> {saving ? "Saving..." : form.id ? "Update Item" : "Create Item"}
              </button>
              {form.id && (
                <button type="button" onClick={() => deleteItem(form.id)} className="inline-flex items-center justify-center gap-2 border border-red-400/40 text-red-200 px-6 py-4 text-xs uppercase tracking-[0.2em] hover:bg-red-500/10">
                  <Trash2 size={15} /> Delete
                </button>
              )}
            </div>
          </section>

          <section>
            <div className="flex flex-wrap gap-2 mb-5">
              <button type="button" onClick={() => setFilter("all")} className={`border px-3 py-2 text-xs ${filter === "all" ? "border-[#c9a962] text-[#c9a962]" : "border-white/15 text-white/45"}`}>All</button>
              {CONCIERGE_CATEGORIES.map((category) => (
                <button key={category} type="button" onClick={() => setFilter(category)} className={`border px-3 py-2 text-xs ${filter === category ? "border-[#c9a962] text-[#c9a962]" : "border-white/15 text-white/45"}`}>{category}</button>
              ))}
            </div>

            {loading ? (
              <div className="border border-white/10 bg-[#0b0b0b] p-8 text-white/45">Loading concierge items...</div>
            ) : filteredItems.length === 0 ? (
              <div className="border border-white/10 bg-[#0b0b0b] p-8 text-white/45">No concierge items yet.</div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <button key={item.id} type="button" onClick={() => editItem(item)} className="block w-full text-left border border-white/10 bg-[#0b0b0b] p-5 hover:border-[#c9a962]/50 transition">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <p className="text-[#c9a962] text-[10px] uppercase tracking-[0.25em] mb-2">{item.category}</p>
                        <h2 className="text-xl font-light text-white">{item.title}</h2>
                        {item.description && <p className="text-white/45 text-sm mt-3 leading-6 line-clamp-2">{item.description}</p>}
                      </div>
                      <div className="text-left sm:text-right text-xs text-white/35 space-y-1 shrink-0">
                        <p>{item.is_active ? "Active" : "Hidden"}</p>
                        <p>Priority {item.priority}</p>
                        <p>{item.villa_ids.length ? `${item.villa_ids.length} listings` : "All listings"}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
