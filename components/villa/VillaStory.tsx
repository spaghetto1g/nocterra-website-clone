"use client"

import Image from "next/image"

interface VillaStoryProps {
  story?: {
    title?: string
    description?: string
  }

  gallery?: string[]
}

export default function VillaStory({
  story,
  gallery = [],
}: VillaStoryProps) {
  const firstImage =
    gallery.length > 0
      ? gallery[0]
      : "/villa/placeholder.jpg"

  return (
    <section className="py-32 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT CONTENT */}
          <div>
            <div className="text-sm tracking-[0.3em] uppercase text-white/40 mb-6">
              The Story
            </div>

            <h2 className="text-5xl md:text-6xl font-light text-white leading-tight mb-8">
              {story?.title || "Luxury Without Limits"}
            </h2>

            <p className="text-lg text-white/60 leading-relaxed max-w-xl">
              {story?.description ||
                "An immersive hospitality experience crafted for elegance, privacy and cinematic living."}
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative h-[600px] overflow-hidden rounded-3xl border border-white/10">
            <Image
              src={firstImage}
              alt="Villa"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}