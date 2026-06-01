import Link from "next/link"
import Image from "next/image"
import { getAllVillas } from "@/lib/villas"

export default async function FeaturedProperties() {
  const villas = await getAllVillas()

  return (
    <section className="py-32 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER (fixed rhythm) */}
        <div className="mb-20">
          <p className="text-[#c9a962] uppercase tracking-[0.35em] text-xs mb-5">
            Featured Villas
          </p>

          <h2 className="text-5xl md:text-6xl font-light text-white leading-tight">
            Curated Luxury Villas
          </h2>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-12 gap-10 items-stretch">

          {/* LEFT GRID */}
          <div className="col-span-12 lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-8">

            {villas?.map((villa: any) => (
              <Link
                key={villa.id}
                href={`/villas/${villa.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-[#111] h-[480px]"
              >

                <Image
                  src={
                    villa.heroImage && villa.heroImage !== ""
                      ? villa.heroImage
                      : "/placeholder.jpg"
                  }
                  alt={villa.title || "Villa"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                <div className="absolute bottom-0 p-7">
                  <p className="text-white/60 text-xs uppercase tracking-[0.25em] mb-2">
                    {villa.location || "Luxury Destination"}
                  </p>

                  <h3 className="text-2xl font-light text-white mb-3">
                    {villa.title || "Untitled Villa"}
                  </h3>

                  <div className="flex gap-5 text-white/50 text-sm">
                    <span>{villa.bedrooms || 0} beds</span>
                    <span>{villa.bathrooms || 0} baths</span>
                    <span>{villa.guests || 0} guests</span>
                  </div>
                </div>

              </Link>
            ))}

          </div>

          {/* RIGHT 360 (FIXED VISUAL WEIGHT) */}
          <div className="col-span-12 lg:col-span-3">
            <div className="sticky top-24 h-[480px] rounded-3xl border border-white/10 bg-[#0f0f0f] overflow-hidden flex flex-col">

              {/* TOP IMAGE (larger + cinematic) */}
              <div className="relative h-[55%]">
                <Image
                  src="/villa/placeholder.jpg"
                  alt="360 Experience"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>

              {/* CONTENT */}
              <div className="p-6 flex flex-col justify-between flex-1">

                <div>
                  <p className="text-xs tracking-[0.35em] text-white/50 uppercase mb-4">
                    360 Experience
                  </p>

                  <h3 className="text-xl font-light text-white mb-3">
                    Cinematic Virtual Tours
                  </h3>

                  <p className="text-white/60 text-sm leading-relaxed">
                    Explore immersive villa walkthroughs and luxury spaces in real-time.
                  </p>
                </div>

                <div className="mt-6 h-16 border border-white/10 rounded-xl flex items-center justify-center text-white/30 text-xs">
                  EXPLORE 360 →
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}