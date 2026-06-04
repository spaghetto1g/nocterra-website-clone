import { supabase } from "@/lib/supabase"
import type { Villa } from "@/lib/villas"

export const CONCIERGE_CATEGORIES = [
  "Restaurants",
  "VIP Transport",
  "Yacht Charter",
  "Private Chef",
  "Wellness",
  "Massage",
  "Helicopter",
  "Security",
  "Custom Experiences",
] as const

export type ConciergeCategory = (typeof CONCIERGE_CATEGORIES)[number]

export type ConciergeItem = {
  id: number
  title: string
  category: string
  description?: string | null
  location?: string | null
  image_url?: string | null
  website_url?: string | null
  phone?: string | null
  email?: string | null
  priority?: number | null
  is_active?: boolean | null
  villa_ids?: number[] | null
  property_types?: string[] | null
}

function normalizeStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean)
    : []
}

function normalizeNumberArray(value: unknown): number[] {
  return Array.isArray(value)
    ? value
        .map((item) => Number(item))
        .filter((item) => Number.isFinite(item) && item > 0)
    : []
}

function normalizeConciergeItem(row: any): ConciergeItem {
  return {
    id: Number(row?.id),
    title: row?.title ?? "Untitled recommendation",
    category: row?.category ?? "Custom Experiences",
    description: row?.description ?? "",
    location: row?.location ?? "",
    image_url: row?.image_url ?? "",
    website_url: row?.website_url ?? "",
    phone: row?.phone ?? "",
    email: row?.email ?? "",
    priority: Number(row?.priority) || 0,
    is_active: row?.is_active !== false,
    villa_ids: normalizeNumberArray(row?.villa_ids),
    property_types: normalizeStringArray(row?.property_types),
  }
}

export async function getConciergeForVilla(villa: Villa | null): Promise<ConciergeItem[]> {
  if (!villa?.id) return []

  const { data, error } = await supabase
    .from("concierge_items")
    .select("*")
    .eq("is_active", true)
    .order("priority", { ascending: true })
    .order("id", { ascending: false })

  if (error) {
    console.error("Failed to load concierge items", error)
    return []
  }

  const villaId = Number(villa.id)
  const propertyType = (villa.property_type ?? "villa").toLowerCase().trim()

  return (data ?? [])
    .map(normalizeConciergeItem)
    .filter((item) => {
      const itemVillaIds = normalizeNumberArray(item.villa_ids)
      const itemPropertyTypes = normalizeStringArray(item.property_types)
      const matchesVilla = itemVillaIds.length === 0 || itemVillaIds.includes(villaId)
      const matchesType = itemPropertyTypes.length === 0 || itemPropertyTypes.includes(propertyType)

      return matchesVilla && matchesType
    })
}
