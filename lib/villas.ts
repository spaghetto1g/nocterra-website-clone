import { supabase } from "@/lib/supabase"

export type Villa = {
  id: string | number
  slug: string
  custom_subdomain?: string | null
  title: string
  location?: string | null
  property_type?: string | null
  description?: string | null
  heroImage?: string | null
  hero_image?: string | null
  gallery?: string[]
  hero_images?: string[]
  hero_media_mode?: string | null
  hero_video_url?: string | null
  hero_video_poster?: string | null
  amenities?: string[]
  bedrooms?: number | null
  bathrooms?: number | null
  guests?: number | null
  sqft?: number | null
  pool?: boolean | null
  status?: string | null
  featured?: boolean | null
  tourLink?: string | null
  tour_link?: string | null
  video_embed?: string | null
  rent_url?: string | null
  social_url?: string | null
  sale_interest_enabled?: boolean | null
  yacht_route?: string | null
  departure_port?: string | null
  max_passengers?: number | null
  crew?: number | null
  cabins?: number | null
  yacht_length?: string | null
  charter_price?: string | null
  latitude?: number | null
  longitude?: number | null
  stats?: {
    bedrooms?: number | null
    bathrooms?: number | null
    guests?: number | null
  }
}

function normalizeArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : []
}

function normalizeImage(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : "/placeholder.jpg"
}

function normalizeVilla(row: any): Villa {
  const heroImage = normalizeImage(row?.hero_image || row?.heroImage)

  return {
    ...row,
    id: row?.id,
    slug: row?.slug ?? "",
    custom_subdomain: row?.custom_subdomain ?? "",
    title: row?.title ?? "Untitled villa",
    location: row?.location ?? "",
    property_type: row?.property_type ?? "villa",
    description: row?.description ?? "",
    heroImage,
    hero_image: heroImage,
    hero_images: normalizeArray(row?.hero_images),
    hero_media_mode: ["cover", "fit", "video"].includes(row?.hero_media_mode) ? row?.hero_media_mode : "cover",
    hero_video_url: row?.hero_video_url ?? "",
    hero_video_poster: row?.hero_video_poster ?? "",
    gallery: normalizeArray(row?.gallery),
    amenities: normalizeArray(row?.amenities),
    bedrooms: Number(row?.bedrooms) || 0,
    bathrooms: Number(row?.bathrooms) || 0,
    guests: Number(row?.guests) || 0,
    sqft: Number(row?.sqft) || 0,
    pool: Boolean(row?.pool),
    status: row?.status ?? "active",
    featured: Boolean(row?.featured),
    tourLink: row?.tour_link ?? "",
    tour_link: row?.tour_link ?? "",
    video_embed: row?.video_embed ?? "",
    rent_url: row?.rent_url ?? "",
    social_url: row?.social_url ?? "",
    sale_interest_enabled: Boolean(row?.sale_interest_enabled),
    yacht_route: row?.yacht_route ?? "",
    departure_port: row?.departure_port ?? "",
    max_passengers: Number(row?.max_passengers) || 0,
    crew: Number(row?.crew) || 0,
    cabins: Number(row?.cabins) || 0,
    yacht_length: row?.yacht_length ?? "",
    charter_price: row?.charter_price ?? "",
    latitude: row?.latitude ?? null,
    longitude: row?.longitude ?? null,
    stats: {
      bedrooms: Number(row?.bedrooms) || 0,
      bathrooms: Number(row?.bathrooms) || 0,
      guests: Number(row?.guests) || 0,
    },
  }
}

export async function getAllVillas(): Promise<Villa[]> {
  const { data, error } = await supabase
    .from("villas")
    .select("*")
    .eq("status", "active")
    .eq("featured", true)
    .order("id", { ascending: false })

  if (error) {
    console.error("Failed to load villas", error)
    return []
  }

  return (data ?? []).map(normalizeVilla)
}

export async function getActiveVillas(): Promise<Villa[]> {
  const { data, error } = await supabase
    .from("villas")
    .select("*")
    .eq("status", "active")
    .order("id", { ascending: false })

  if (error) {
    console.error("Failed to load active villas", error)
    return []
  }

  return (data ?? []).map(normalizeVilla)
}

export async function getVillaBySlug(slug: string): Promise<Villa | null> {
  const { data, error } = await supabase
    .from("villas")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle()

  if (error || !data) {
    if (error) console.error("Failed to load villa", error)
    return null
  }

  return normalizeVilla(data)
}

export async function getVillaByCustomSubdomain(customSubdomain: string): Promise<Villa | null> {
  const cleanSubdomain = customSubdomain.toLowerCase().trim()

  if (!cleanSubdomain) return null

  const { data, error } = await supabase
    .from("villas")
    .select("*")
    .eq("custom_subdomain", cleanSubdomain)
    .eq("status", "active")
    .maybeSingle()

  if (error || !data) {
    if (error) console.error("Failed to load villa by custom subdomain", error)
    return null
  }

  return normalizeVilla(data)
}

export async function getAllVillaSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("villas")
    .select("slug")
    .eq("status", "active")

  if (error) return []

  return (data ?? [])
    .map((villa) => villa.slug)
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0)
}
