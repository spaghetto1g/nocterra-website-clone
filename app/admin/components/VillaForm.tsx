"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const STATUS_OPTIONS = ["active", "archived", "draft"] as const
const PROPERTY_TYPE_OPTIONS = [
  { value: "villa", label: "Villa" },
  { value: "residence", label: "Residence" },
  { value: "apartment", label: "Luxury Apartment" },
  { value: "penthouse", label: "Penthouse" },
  { value: "suite", label: "Signature Suite" },
  { value: "yacht", label: "Yacht" },
  { value: "luxury_boat", label: "Luxury Boat" },
] as const
const STORAGE_BUCKET = "villa-images"
const MAX_IMAGE_SIZE_MB = 10

const IMAGE_INPUT_ACCEPT = "image/jpeg,image/png,image/webp"

type VillaFormData = {
  title: string
  slug: string
  location: string
  property_type: string
  description: string
  hero_image: string
  hero_images: string[]
  gallery: string[]
  bedrooms: number | ""
  bathrooms: number | ""
  guests: number | ""
  sqft: number | ""
  pool: boolean
  amenities: string[]
  latitude: number | "" | null
  longitude: number | "" | null
  tour_link: string
  rent_url: string
  social_url: string
  sale_interest_enabled: boolean
  yacht_route: string
  departure_port: string
  max_passengers: number | ""
  crew: number | ""
  cabins: number | ""
  yacht_length: string
  charter_price: string
  status: string
  featured: boolean
}

type VillaFormProps = {
  initialData?: Partial<VillaFormData> | null
  onSave: (data: VillaFormData) => Promise<void> | void
  submitLabel?: string
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

function uniqueImages(images: string[]) {
  return images.map((item) => item.trim()).filter(Boolean).filter((image, index, array) => array.indexOf(image) === index)
}

function toNumberOrEmpty(value: unknown): number | "" {
  if (value === null || value === undefined || value === "") return ""
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : ""
}

function toCoordinate(value: unknown): number | "" | null {
  if (value === null || value === undefined || value === "") return null
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

function getFileExtension(file: File) {
  const fallback = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg"
  const extension = file.name.split(".").pop()?.toLowerCase()
  return extension && ["jpg", "jpeg", "png", "webp"].includes(extension) ? extension : fallback
}

function safeFolderName(value: string) {
  return slugify(value) || "villa"
}

const emptyForm: VillaFormData = {
  title: "",
  slug: "",
  location: "",
  property_type: "villa",
  description: "",
  hero_image: "",
  hero_images: [],
  gallery: [],
  bedrooms: "",
  bathrooms: "",
  guests: "",
  sqft: "",
  pool: false,
  amenities: [],
  latitude: null,
  longitude: null,
  tour_link: "",
  rent_url: "",
  social_url: "",
  sale_interest_enabled: false,
  yacht_route: "",
  departure_port: "",
  max_passengers: "",
  crew: "",
  cabins: "",
  yacht_length: "",
  charter_price: "",
  status: "active",
  featured: false,
}

export default function VillaForm({ initialData, onSave, submitLabel = "Save Villa" }: VillaFormProps) {
  const supabase = useMemo(() => createClient(), [])
  const [form, setForm] = useState<VillaFormData>(emptyForm)
  const [heroInput, setHeroInput] = useState("")
  const [galleryInput, setGalleryInput] = useState("")
  const [amenityInput, setAmenityInput] = useState("")
  const [saving, setSaving] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [uploadError, setUploadError] = useState("")

  useEffect(() => {
    if (!initialData) {
      setForm(emptyForm)
      return
    }

    const savedHeroImages = toStringArray(initialData.hero_images)
    const legacyHero = typeof initialData.hero_image === "string" ? initialData.hero_image.trim() : ""
    const heroImages = uniqueImages([...savedHeroImages, legacyHero])

    setForm({
      title: initialData.title ?? "",
      slug: initialData.slug ?? "",
      location: initialData.location ?? "",
      property_type: initialData.property_type ?? "villa",
      description: initialData.description ?? "",
      hero_image: legacyHero || heroImages[0] || "",
      hero_images: heroImages,
      gallery: toStringArray(initialData.gallery),
      bedrooms: toNumberOrEmpty(initialData.bedrooms),
      bathrooms: toNumberOrEmpty(initialData.bathrooms),
      guests: toNumberOrEmpty(initialData.guests),
      sqft: toNumberOrEmpty(initialData.sqft),
      pool: Boolean(initialData.pool),
      amenities: toStringArray(initialData.amenities),
      latitude: toCoordinate(initialData.latitude),
      longitude: toCoordinate(initialData.longitude),
      tour_link: initialData.tour_link ?? "",
      rent_url: initialData.rent_url ?? "",
      social_url: initialData.social_url ?? "",
      sale_interest_enabled: Boolean(initialData.sale_interest_enabled),
      yacht_route: (initialData as any).yacht_route ?? "",
      departure_port: (initialData as any).departure_port ?? "",
      max_passengers: toNumberOrEmpty((initialData as any).max_passengers),
      crew: toNumberOrEmpty((initialData as any).crew),
      cabins: toNumberOrEmpty((initialData as any).cabins),
      yacht_length: (initialData as any).yacht_length ?? "",
      charter_price: (initialData as any).charter_price ?? "",
      status: initialData.status ?? "active",
      featured: Boolean(initialData.featured),
    })
  }, [initialData])

  const suggestedSlug = useMemo(() => slugify(form.title), [form.title])

  function updateField<K extends keyof VillaFormData>(key: K, value: VillaFormData[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function syncHeroImages(images: string[]) {
    const cleanImages = uniqueImages(images)
    setForm((current) => ({
      ...current,
      hero_images: cleanImages,
      hero_image: cleanImages[0] || "",
    }))
  }

  function addHeroImageUrl() {
    const value = heroInput.trim()
    if (!value) return
    syncHeroImages([...form.hero_images, value])
    setHeroInput("")
  }

  function removeHeroImage(index: number) {
    syncHeroImages(form.hero_images.filter((_, itemIndex) => itemIndex !== index))
  }

  function moveHeroImage(index: number, direction: -1 | 1) {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= form.hero_images.length) return
    const copy = [...form.hero_images]
    const current = copy[index]
    copy[index] = copy[nextIndex]
    copy[nextIndex] = current
    syncHeroImages(copy)
  }

  function addGalleryImage() {
    const value = galleryInput.trim()
    if (!value) return

    setForm((current) => ({ ...current, gallery: uniqueImages([...current.gallery, value]) }))
    setGalleryInput("")
  }

  function removeGalleryImage(index: number) {
    setForm((current) => ({
      ...current,
      gallery: current.gallery.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  function moveGalleryImage(index: number, direction: -1 | 1) {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= form.gallery.length) return
    setForm((current) => {
      const copy = [...current.gallery]
      const item = copy[index]
      copy[index] = copy[nextIndex]
      copy[nextIndex] = item
      return { ...current, gallery: copy }
    })
  }

  function addAmenity() {
    const value = amenityInput.trim()
    if (!value) return

    setForm((current) => ({ ...current, amenities: [...current.amenities, value] }))
    setAmenityInput("")
  }

  function removeAmenity(index: number) {
    setForm((current) => ({
      ...current,
      amenities: current.amenities.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  async function uploadFiles(files: FileList | null, folder: "hero" | "gallery") {
    if (!files || files.length === 0) return

    setUploadError("")
    const fileArray = Array.from(files)
    const invalidFile = fileArray.find((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type))
    if (invalidFile) {
      setUploadError("Only JPG, PNG and WEBP images are supported.")
      return
    }

    const oversizedFile = fileArray.find((file) => file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024)
    if (oversizedFile) {
      setUploadError(`Each image must be smaller than ${MAX_IMAGE_SIZE_MB}MB.`)
      return
    }

    folder === "hero" ? setUploadingHero(true) : setUploadingGallery(true)

    try {
      const uploadedUrls: string[] = []
      const villaFolder = safeFolderName(form.slug || suggestedSlug || form.title)

      for (const file of fileArray) {
        const extension = getFileExtension(file)
        const randomId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
        const path = `${villaFolder}/${folder}/${Date.now()}-${randomId}.${extension}`

        const { error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(path, file, {
            cacheControl: "31536000",
            upsert: false,
            contentType: file.type,
          })

        if (error) throw error

        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
        if (data.publicUrl) uploadedUrls.push(data.publicUrl)
      }

      if (folder === "hero") {
        syncHeroImages([...form.hero_images, ...uploadedUrls])
      } else {
        setForm((current) => ({ ...current, gallery: uniqueImages([...current.gallery, ...uploadedUrls]) }))
      }
    } catch (error: any) {
      setUploadError(error?.message || "Upload failed. Please check your Supabase Storage policies.")
    } finally {
      folder === "hero" ? setUploadingHero(false) : setUploadingGallery(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)

    const cleanHeroImages = uniqueImages(form.hero_images)
    const payload: VillaFormData = {
      ...form,
      title: form.title.trim(),
      slug: (form.slug || suggestedSlug).trim(),
      location: form.location.trim(),
      property_type: form.property_type || "villa",
      description: form.description.trim(),
      hero_images: cleanHeroImages,
      hero_image: (cleanHeroImages[0] || form.hero_image).trim(),
      gallery: uniqueImages(form.gallery),
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      guests: Number(form.guests) || 0,
      sqft: Number(form.sqft) || 0,
      pool: Boolean(form.pool),
      amenities: form.amenities.map((item) => item.trim()).filter(Boolean),
      latitude: form.latitude === "" || form.latitude === null ? null : Number(form.latitude),
      longitude: form.longitude === "" || form.longitude === null ? null : Number(form.longitude),
      tour_link: form.tour_link.trim(),
      rent_url: form.rent_url.trim(),
      social_url: form.social_url.trim(),
      sale_interest_enabled: Boolean(form.sale_interest_enabled),
      yacht_route: form.yacht_route.trim(),
      departure_port: form.departure_port.trim(),
      max_passengers: Number(form.max_passengers) || 0,
      crew: Number(form.crew) || 0,
      cabins: Number(form.cabins) || 0,
      yacht_length: form.yacht_length.trim(),
      charter_price: form.charter_price.trim(),
      status: form.status || "active",
      featured: Boolean(form.featured),
    }

    try {
      await onSave(payload)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-white">
      <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Title</label>
          <input
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            className="w-full bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60"
            placeholder="Villa Nocterra"
            required
          />
        </div>

        <div>
          <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Slug</label>
          <input
            value={form.slug}
            onChange={(event) => updateField("slug", slugify(event.target.value))}
            className="w-full bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60"
            placeholder={suggestedSlug || "villa-nocterra"}
          />
          <p className="text-white/35 text-xs mt-2">Public URL: /villas/{form.slug || suggestedSlug || "villa-slug"}</p>
        </div>

        <div>
          <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Location</label>
          <input
            value={form.location}
            onChange={(event) => updateField("location", event.target.value)}
            className="w-full bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60"
            placeholder="Athens Riviera, Greece"
          />
        </div>


        <div>
          <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Property Type</label>
          <select
            value={form.property_type}
            onChange={(event) => updateField("property_type", event.target.value)}
            className="w-full bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60"
          >
            {PROPERTY_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-white/35 text-xs mt-2">Keeps the collection premium while allowing villas, residences, apartments, penthouses, suites, yachts and luxury boats.</p>
        </div>

        <div>
          <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Description / About</label>
          <textarea
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            rows={6}
            className="w-full bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60 resize-y"
            placeholder="Write the villa description..."
          />
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-lg font-light">Media</h2>
          <p className="text-white/40 text-sm mt-1">Upload images from your computer or paste public URLs. The first hero image is also used as the main fallback image.</p>
        </div>

        {uploadError && (
          <div className="border border-red-500/40 bg-red-500/10 text-red-200 rounded-lg px-4 py-3 text-sm">
            {uploadError}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Hero Carousel Images</label>
            <input
              type="file"
              accept={IMAGE_INPUT_ACCEPT}
              multiple
              onChange={(event) => uploadFiles(event.target.files, "hero")}
              className="block w-full text-sm text-white/70 file:mr-4 file:rounded-lg file:border-0 file:bg-[#c9a962] file:px-4 file:py-3 file:text-xs file:uppercase file:tracking-[0.2em] file:text-black hover:file:bg-[#d8b86d]"
            />
            <p className="text-white/35 text-xs mt-2">Upload 1, 2 or 3+ hero images. They will become the villa hero carousel.</p>
            {uploadingHero && <p className="text-[#c9a962] text-sm mt-2">Uploading hero images...</p>}
          </div>

          <div className="flex gap-2">
            <input
              value={heroInput}
              onChange={(event) => setHeroInput(event.target.value)}
              className="flex-1 bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60"
              placeholder="Optional hero image URL"
            />
            <button type="button" onClick={addHeroImageUrl} className="px-4 py-3 border border-[#c9a962]/50 text-[#c9a962] rounded-lg">
              Add
            </button>
          </div>

          {form.hero_images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {form.hero_images.map((image, index) => (
                <div key={`${image}-${index}`} className="relative border border-white/10 rounded-lg overflow-hidden bg-black">
                  <img src={image} alt={`Hero ${index + 1}`} className="h-32 w-full object-cover" />
                  <div className="absolute left-2 top-2 rounded bg-black/75 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/80">
                    {index === 0 ? "Main Hero" : `Hero ${index + 1}`}
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between gap-2">
                    <button type="button" onClick={() => moveHeroImage(index, -1)} disabled={index === 0} className="bg-black/80 text-white px-2 py-1 text-xs rounded disabled:opacity-30">←</button>
                    <button type="button" onClick={() => removeHeroImage(index)} className="bg-black/80 text-white px-2 py-1 text-xs rounded">Remove</button>
                    <button type="button" onClick={() => moveHeroImage(index, 1)} disabled={index === form.hero_images.length - 1} className="bg-black/80 text-white px-2 py-1 text-xs rounded disabled:opacity-30">→</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 border-t border-white/10 pt-6">
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Gallery Images</label>
            <input
              type="file"
              accept={IMAGE_INPUT_ACCEPT}
              multiple
              onChange={(event) => uploadFiles(event.target.files, "gallery")}
              className="block w-full text-sm text-white/70 file:mr-4 file:rounded-lg file:border-0 file:bg-[#c9a962] file:px-4 file:py-3 file:text-xs file:uppercase file:tracking-[0.2em] file:text-black hover:file:bg-[#d8b86d]"
            />
            <p className="text-white/35 text-xs mt-2">Upload all gallery photos. You can reorder them below.</p>
            {uploadingGallery && <p className="text-[#c9a962] text-sm mt-2">Uploading gallery images...</p>}
          </div>

          <div className="flex gap-2">
            <input
              value={galleryInput}
              onChange={(event) => setGalleryInput(event.target.value)}
              className="flex-1 bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60"
              placeholder="Optional gallery image URL"
            />
            <button type="button" onClick={addGalleryImage} className="px-4 py-3 border border-[#c9a962]/50 text-[#c9a962] rounded-lg">
              Add
            </button>
          </div>

          {form.gallery.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {form.gallery.map((image, index) => (
                <div key={`${image}-${index}`} className="relative group border border-white/10 rounded-lg overflow-hidden bg-black">
                  <img src={image} alt={`Gallery ${index + 1}`} className="h-24 w-full object-cover" />
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between gap-1">
                    <button type="button" onClick={() => moveGalleryImage(index, -1)} disabled={index === 0} className="bg-black/80 text-white px-2 py-1 text-xs rounded disabled:opacity-30">←</button>
                    <button type="button" onClick={() => removeGalleryImage(index)} className="bg-black/80 text-white px-2 py-1 text-xs rounded">Remove</button>
                    <button type="button" onClick={() => moveGalleryImage(index, 1)} disabled={index === form.gallery.length - 1} className="bg-black/80 text-white px-2 py-1 text-xs rounded disabled:opacity-30">→</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-light">Core Property Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="number" min="0" value={form.bedrooms} onChange={(event) => updateField("bedrooms", event.target.value === "" ? "" : Number(event.target.value))} className="bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="Bedrooms" />
          <input type="number" min="0" value={form.bathrooms} onChange={(event) => updateField("bathrooms", event.target.value === "" ? "" : Number(event.target.value))} className="bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="Bathrooms" />
          <input type="number" min="0" value={form.guests} onChange={(event) => updateField("guests", event.target.value === "" ? "" : Number(event.target.value))} className="bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="Guests" />
          <input type="number" min="0" value={form.sqft} onChange={(event) => updateField("sqft", event.target.value === "" ? "" : Number(event.target.value))} className="bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="Sqft / Size" />
        </div>

        <label className="flex items-center gap-3 text-white/80">
          <input type="checkbox" checked={form.pool} onChange={(event) => updateField("pool", event.target.checked)} className="h-4 w-4" />
          Pool available
        </label>
      </div>



      {(form.property_type === "yacht" || form.property_type === "luxury_boat") && (
        <div className="bg-[#0f0f0f] border border-[#c9a962]/20 rounded-xl p-6 space-y-5">
          <div>
            <h2 className="text-lg font-light">Yacht / Luxury Boat Details</h2>
            <p className="text-white/40 text-sm mt-1">Optional fields for future yacht charter pages. Empty fields stay hidden on the public page.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.departure_port} onChange={(event) => updateField("departure_port", event.target.value)} className="bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="Departure port / marina" />
            <input value={form.yacht_route} onChange={(event) => updateField("yacht_route", event.target.value)} className="bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="Route / itinerary, e.g. Athens Riviera → Hydra" />
            <input type="number" min="0" value={form.max_passengers} onChange={(event) => updateField("max_passengers", event.target.value === "" ? "" : Number(event.target.value))} className="bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="Max passengers" />
            <input type="number" min="0" value={form.crew} onChange={(event) => updateField("crew", event.target.value === "" ? "" : Number(event.target.value))} className="bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="Crew" />
            <input type="number" min="0" value={form.cabins} onChange={(event) => updateField("cabins", event.target.value === "" ? "" : Number(event.target.value))} className="bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="Cabins" />
            <input value={form.yacht_length} onChange={(event) => updateField("yacht_length", event.target.value)} className="bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="Length, e.g. 24m / 78ft" />
          </div>

          <input value={form.charter_price} onChange={(event) => updateField("charter_price", event.target.value)} className="w-full bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="Charter price text, e.g. From €4,500 / day" />
        </div>
      )}

      <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-light">Amenities</h2>
        <div className="flex gap-2">
          <input value={amenityInput} onChange={(event) => setAmenityInput(event.target.value)} className="flex-1 bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="Amenity" />
          <button type="button" onClick={addAmenity} className="px-4 py-3 border border-[#c9a962]/50 text-[#c9a962] rounded-lg">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.amenities.map((amenity, index) => (
            <button key={`${amenity}-${index}`} type="button" onClick={() => removeAmenity(index)} className="border border-white/15 rounded-full px-3 py-1 text-sm text-white/80">
              {amenity} ×
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-light">360 Tour & Location</h2>
        <input value={form.tour_link} onChange={(event) => updateField("tour_link", event.target.value)} className="w-full bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="360 tour embed URL / link" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="number" step="any" value={form.latitude ?? ""} onChange={(event) => updateField("latitude", event.target.value === "" ? null : Number(event.target.value))} className="bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="Latitude" />
          <input type="number" step="any" value={form.longitude ?? ""} onChange={(event) => updateField("longitude", event.target.value === "" ? null : Number(event.target.value))} className="bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60" placeholder="Longitude" />
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 space-y-5">
        <div>
          <h2 className="text-lg font-light">Booking / Social / Sale Interest</h2>
          <p className="text-white/40 text-sm mt-1">Optional buttons for the public property page. Empty fields stay hidden.</p>
        </div>

        <div>
          <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Rent URL</label>
          <input
            value={form.rent_url}
            onChange={(event) => updateField("rent_url", event.target.value)}
            className="w-full bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60"
            placeholder="https://www.booking.com/... or https://www.airbnb.com/..."
          />
          <p className="text-white/35 text-xs mt-2">Shows the Rent it now button only when filled.</p>
        </div>

        <div>
          <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Social URL</label>
          <input
            value={form.social_url}
            onChange={(event) => updateField("social_url", event.target.value)}
            className="w-full bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60"
            placeholder="https://www.instagram.com/... or property social link"
          />
          <p className="text-white/35 text-xs mt-2">Shows a social button for this specific property only when filled.</p>
        </div>

        <label className="flex items-center gap-3 text-white/80 border border-white/10 rounded-lg px-4 py-3">
          <input
            type="checkbox"
            checked={form.sale_interest_enabled}
            onChange={(event) => updateField("sale_interest_enabled", event.target.checked)}
            className="h-4 w-4 accent-[#c9a962]"
          />
          Enable Interested in buying this property button
        </label>
      </div>

      <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-light">Publishing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select value={form.status} onChange={(event) => updateField("status", event.target.value)} className="bg-black border border-white/15 rounded-lg px-4 py-3 text-white outline-none focus:border-[#c9a962]/60">
            {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <label className="flex items-center gap-3 text-white/80 border border-white/10 rounded-lg px-4 py-3">
            <input type="checkbox" checked={form.featured} onChange={(event) => updateField("featured", event.target.checked)} className="h-4 w-4" />
            Featured on homepage
          </label>
        </div>
      </div>

      <button disabled={saving || uploadingHero || uploadingGallery} className="w-full bg-[#c9a962] text-black py-4 rounded-lg uppercase tracking-[0.25em] text-xs disabled:opacity-60">
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  )
}
