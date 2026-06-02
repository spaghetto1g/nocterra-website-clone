"use client"

import { useMemo, useState, TouchEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const FALLBACK_IMAGE = "/placeholder.jpg"

type MobileProperty = {
  id: string | number
  slug: string
  title?: string | null
  location?: string | null
  heroImage?: string | null
  hero_image?: string | null
  bedrooms?: number | null
  bathrooms?: number | null
  guests?: number | null
  property_type?: string | null
}

function safeImage(src?: string | null) {
  return typeof src === "string" && src.trim().length > 0 ? src.trim() : FALLBACK_IMAGE
}

function chunkItems(items: MobileProperty[], size: number) {
  const chunks: MobileProperty[][] = []
  for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size))
  return chunks.length ? chunks : [[]]
}

function typeLabel(value?: string | null) {
  const type = typeof value === "string" ? value.trim().toLowerCase() : ""
  if (type === "apartment") return "Apartment"
  if (type === "suite") return "Suite"
  if (type === "penthouse") return "Penthouse"
  if (type === "residence") return "Residence"
  if (type === "yacht") return "Yacht"
  if (type === "luxury_boat") return "Boat"
  return "Villa"
}

function EmptyCard() {
  return (
    <div className="min-h-[255px] rounded-2xl border border-[#c9a962]/20 bg-[#0b0b0b] flex flex-col items-center justify-center text-center px-4">
      <div className="text-[#c9a962]/50 text-4xl font-serif mb-3">N</div>
      <p className="text-white/25 text-[10px] uppercase tracking-[0.28em] leading-relaxed">Reserved Space</p>
    </div>
  )
}

function PropertyCard({ property }: { property: MobileProperty }) {
  return (
    <Link
      href={`/villas/${property.slug}`}
      className="group relative min-h-[255px] overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f]"
    >
      <div className="relative h-[145px] overflow-hidden">
        <Image
          src={safeImage(property.heroImage || property.hero_image)}
          alt={property.title || "NOCTERRA property"}
          fill
          sizes="50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
        <div className="absolute left-3 top-3 rounded-sm bg-black/70 px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-[#c9a962]">
          {typeLabel(property.property_type)}
        </div>
      </div>

      <div className="p-3.5">
        <h3 className="line-clamp-2 min-h-[34px] text-[13px] font-light leading-snug text-white">
          {property.title || "NOCTERRA Property"}
        </h3>
        <p className="mt-1 line-clamp-1 text-[11px] text-white/45">{property.location || "Greece"}</p>
        <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-[10px] text-[#c9a962]/85">
          <span>{property.bedrooms || 0} beds</span>
          <span>·</span>
          <span>{property.bathrooms || 0} baths</span>
        </div>
      </div>
    </Link>
  )
}

export default function MobilePropertyCarousel({
  items,
  className = "",
}: {
  items: MobileProperty[]
  className?: string
}) {
  const pages = useMemo(() => chunkItems(items ?? [], 2), [items])
  const [page, setPage] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const currentItems = pages[page] ?? []

  function previous() {
    setPage((current) => (current === 0 ? pages.length - 1 : current - 1))
  }

  function next() {
    setPage((current) => (current === pages.length - 1 ? 0 : current + 1))
  }

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    setTouchStart(event.touches[0]?.clientX ?? null)
  }

  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStart === null) return
    const end = event.changedTouches[0]?.clientX ?? touchStart
    const distance = touchStart - end
    if (Math.abs(distance) > 35) distance > 0 ? next() : previous()
    setTouchStart(null)
  }

  const showControls = pages.length > 1

  return (
    <div className={`relative ${className}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="grid grid-cols-2 gap-3.5">
        {currentItems.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
        {currentItems.length === 0 && <EmptyCard />}
        {currentItems.length < 2 && <EmptyCard />}
      </div>

      <div className="mt-5 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={previous}
          aria-label="Previous properties"
          className="h-9 w-9 rounded-full border border-[#c9a962]/45 text-[#c9a962] flex items-center justify-center disabled:opacity-30"
          disabled={!showControls && currentItems.length <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <p className="min-w-[54px] text-center text-xs tracking-[0.22em] text-white/70">
          {page + 1} / {pages.length}
        </p>

        <button
          type="button"
          onClick={next}
          aria-label="Next properties"
          className="h-9 w-9 rounded-full border border-[#c9a962]/45 text-[#c9a962] flex items-center justify-center disabled:opacity-30"
          disabled={!showControls && currentItems.length <= 1}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
