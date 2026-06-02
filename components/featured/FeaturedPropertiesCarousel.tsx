"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ThreeSixtyCard from "@/components/360/360-card"

const FALLBACK_IMAGE = "/placeholder.jpg"

function safeImage(src?: string | null) {
  return typeof src === "string" && src.trim().length > 0 ? src.trim() : FALLBACK_IMAGE
}

type FeaturedVilla = {
  id: string | number
  slug: string
  title?: string | null
  location?: string | null
  heroImage?: string | null
  hero_image?: string | null
  bedrooms?: number | null
  bathrooms?: number | null
  guests?: number | null
}

function chunkVillas(villas: FeaturedVilla[], size: number) {
  const chunks: FeaturedVilla[][] = []

  for (let index = 0; index < villas.length; index += size) {
    chunks.push(villas.slice(index, index + size))
  }

  return chunks
}

export default function FeaturedPropertiesCarousel({ villas }: { villas: FeaturedVilla[] }) {
  const pages = useMemo(() => chunkVillas(villas ?? [], 3), [villas])
  const [page, setPage] = useState(0)

  const currentVillas = pages[page] ?? []
  const hasMultiplePages = pages.length > 1

  function goPrevious() {
    setPage((current) => (current === 0 ? pages.length - 1 : current - 1))
  }

  function goNext() {
    setPage((current) => (current === pages.length - 1 ? 0 : current + 1))
  }

  return (
    <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start">
      <div className="col-span-12 lg:col-span-9">
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
            {currentVillas.map((villa) => (
              <Link
                key={villa.id}
                href={`/villas/${villa.slug}`}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  bg-[#0f0f0f]
                  h-[420px] sm:h-[430px] md:h-[480px]
                  border border-white/10
                  transition-all duration-500
                  hover:border-white/20
                  hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                "
              >
                <Image
                  src={safeImage(villa.heroImage || villa.hero_image)}
                  alt={villa.title || "Villa"}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute bottom-0 p-5 sm:p-7 w-full">
                  <p className="text-white/60 text-xs uppercase tracking-[0.3em] mb-2">
                    {villa.location || "Luxury Destination"}
                  </p>

                  <h3 className="text-xl sm:text-2xl font-light text-white mb-3">
                    {villa.title || "Untitled Villa"}
                  </h3>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-white/50 text-sm">
                    <span>{villa.bedrooms || 0} beds</span>
                    <span>{villa.bathrooms || 0} baths</span>
                    <span>{villa.guests || 0} guests</span>
                  </div>
                </div>
              </Link>
            ))}

            {currentVillas.length === 0 && (
              <div className="col-span-full h-[420px] sm:h-[430px] md:h-[480px] rounded-2xl border border-white/10 bg-[#0f0f0f] flex items-center justify-center text-white/40 text-sm tracking-[0.25em] uppercase">
                No featured villas yet
              </div>
            )}
          </div>

          {hasMultiplePages && (
            <div className="mt-6 sm:mt-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={goPrevious}
                  aria-label="Previous featured villas"
                  className="h-11 w-11 rounded-full border border-[#c9a962]/40 text-[#c9a962] flex items-center justify-center transition-all duration-300 hover:bg-[#c9a962] hover:text-black"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next featured villas"
                  className="h-11 w-11 rounded-full border border-[#c9a962]/40 text-[#c9a962] flex items-center justify-center transition-all duration-300 hover:bg-[#c9a962] hover:text-black"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <p className="text-white/35 text-xs tracking-[0.3em] uppercase">
                {String(page + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="col-span-12 lg:col-span-3">
        <div className="h-[360px] sm:h-[430px] lg:h-[480px] flex items-stretch">
          <ThreeSixtyCard />
        </div>
      </div>
    </div>
  )
}
