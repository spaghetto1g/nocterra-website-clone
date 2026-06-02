import { getAllVillas } from "@/lib/villas"
import FeaturedPropertiesCarousel from "@/components/featured/FeaturedPropertiesCarousel"

export default async function FeaturedProperties() {
  const villas = await getAllVillas()

  return (
    <section className="py-20 md:py-32 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 md:mb-16">
          <p className="text-[#c9a962] uppercase tracking-[0.4em] text-xs mb-5 opacity-80">
            Featured Properties
          </p>

          <h2 className="text-5xl md:text-6xl font-light text-white leading-tight">
            {" "}
          </h2>
        </div>

        <FeaturedPropertiesCarousel villas={villas} />
      </div>
    </section>
  )
}
