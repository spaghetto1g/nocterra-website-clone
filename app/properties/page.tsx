import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Anchor } from "lucide-react"
import { getActiveVillas, type Villa } from "@/lib/villas"
import { getSiteSettings } from "@/lib/site-settings"
import MobilePropertyCarousel from "@/components/mobile-property-carousel"

export const dynamic = "force-dynamic"
export const revalidate = 0

const STAY_TYPES = ["residence", "apartment", "penthouse", "suite"]
const YACHT_TYPES = ["yacht", "luxury_boat"]

function getType(value?: string | null) {
  return typeof value === "string" && value.trim() ? value.trim().toLowerCase() : "villa"
}

function getTypeLabel(value?: string | null) {
  const type = getType(value)

  if (type === "villa") return "Villa"
  if (type === "residence") return "Residence"
  if (type === "apartment") return "Luxury Apartment"
  if (type === "penthouse") return "Penthouse"
  if (type === "suite") return "Signature Suite"
  if (type === "yacht") return "Yacht"
  if (type === "luxury_boat") return "Luxury Boat"

  return type.replace(/_/g, " ")
}

function PropertyCard({ property }: { property: Villa }) {
  return (
    <Link
      href={`/villas/${property.slug}`}
      className="group relative overflow-hidden rounded-2xl bg-[#0f0f0f] h-[360px] sm:h-[430px] md:h-[480px] border border-white/10 transition-all duration-500 hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
    >
      <Image
        src={property.heroImage || property.hero_image || "/placeholder.jpg"}
        alt={property.title || "NOCTERRA property"}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <div className="absolute bottom-0 p-5 sm:p-7 w-full">
        <p className="text-white/60 text-xs uppercase tracking-[0.3em] mb-2">
          {getTypeLabel(property.property_type)} · {property.location || "NOCTERRA"}
        </p>
        <h2 className="text-xl sm:text-2xl font-light text-white mb-3">{property.title}</h2>
        <div className="flex flex-wrap gap-5 text-white/50 text-sm mb-5">
          <span>{property.bedrooms || 0} beds</span>
          <span>{property.bathrooms || 0} baths</span>
          <span>{property.guests || 0} guests</span>
        </div>
        <span className="inline-flex items-center gap-2 text-[#c9a962] text-xs uppercase tracking-[0.2em]">
          View Property <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  )
}

function Section({
  id,
  eyebrow,
  title,
  description,
  items,
}: {
  id: string
  eyebrow: string
  title: string
  description: string
  items: Villa[]
}) {
  return (
    <section id={id} className="mb-16 md:mb-24 scroll-mt-28">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8 border-b border-white/10 pb-6 mb-10">
        <div>
          <p className="text-[#c9a962] uppercase tracking-[0.35em] text-xs mb-4 opacity-80">{eyebrow}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light">{title}</h2>
          <p className="text-white/45 mt-4 max-w-2xl leading-relaxed">{description}</p>
        </div>
        <span className="hidden md:block text-white/25 text-sm">{items.length} active</span>
      </div>

      {items.length > 0 ? (
        <>
          <div className="md:hidden">
            <MobilePropertyCarousel items={items} />
          </div>

          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] px-8 py-12 text-white/35">
          No active properties in this category yet.
        </div>
      )}
    </section>
  )
}

function DisabledYachtSection({ description }: { description: string }) {
  return (
    <section id="yachts" className="mb-24 scroll-mt-28 opacity-75">
      <div className="rounded-3xl border border-[#c9a962]/20 bg-[#0f0f0f] p-6 sm:p-10 md:p-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c9a962]/10 via-transparent to-transparent" />
        <div className="relative z-10 max-w-3xl">
          <div className="h-12 w-12 rounded-full border border-[#c9a962]/30 flex items-center justify-center text-[#c9a962] mb-8">
            <Anchor size={20} />
          </div>
          <p className="text-[#c9a962] uppercase tracking-[0.35em] text-xs mb-4">Coming soon</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light">Yachts & Luxury Boats</h2>
          <p className="text-white/45 mt-5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}

function CollectionNav({
  villasCount,
  staysCount,
  yachtsCount,
  description,
}: {
  villasCount: number
  staysCount: number
  yachtsCount: number
  description: string
}) {
  const items = [
    { label: "Villas", href: "#villas", count: villasCount, enabled: villasCount > 0 },
    { label: "Apartments & Suites", href: "#stays", count: staysCount, enabled: staysCount > 0 },
    { label: "Yachts & Luxury Boats", href: "#yachts", count: yachtsCount, enabled: yachtsCount > 0 },
  ]

  return (
    <section className="pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl border border-white/10 bg-[#0f0f0f] px-4 py-5 sm:px-5 md:px-7 md:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[#c9a962] uppercase tracking-[0.35em] text-[10px] mb-2 opacity-80">Explore by collection</p>
              <p className="text-white/45 text-sm leading-relaxed max-w-xl">{description}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              {items.map((item) =>
                item.enabled ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="inline-flex items-center justify-center gap-3 rounded-full border border-[#c9a962]/50 px-4 sm:px-5 py-3 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#c9a962] transition-all duration-300 hover:bg-[#c9a962] hover:text-black"
                  >
                    {item.label}
                    <span className="text-[10px] opacity-70">{item.count}</span>
                  </a>
                ) : (
                  <span
                    key={item.label}
                    className="inline-flex cursor-not-allowed items-center justify-center gap-3 rounded-full border border-white/10 px-4 sm:px-5 py-3 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-white/25"
                    aria-disabled="true"
                  >
                    {item.label}
                    <span className="text-[10px]">Coming soon</span>
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default async function PropertiesPage() {
  const settings = await getSiteSettings()
  const properties = await getActiveVillas()
  const villas = properties.filter((property) => getType(property.property_type) === "villa")
  const stays = properties.filter((property) => STAY_TYPES.includes(getType(property.property_type)))
  const yachts = properties.filter((property) => YACHT_TYPES.includes(getType(property.property_type)))

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <section className="pt-32 sm:pt-40 pb-16 md:pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#c9a962] uppercase tracking-[0.4em] text-xs mb-5 opacity-80">
            {settings.properties_eyebrow}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-light leading-tight max-w-4xl">
            {settings.properties_title}
          </h1>
          <p className="text-white/50 mt-6 max-w-2xl leading-relaxed">
            {settings.properties_description}
          </p>
        </div>
      </section>

      <CollectionNav villasCount={villas.length} staysCount={stays.length} yachtsCount={yachts.length} description={settings.properties_nav_description} />

      <section className="pb-24 md:pb-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <Section
            id="villas"
            eyebrow="Collection 01"
            title="Villas"
            description={settings.villas_collection_description}
            items={villas}
          />

          <Section
            id="stays"
            eyebrow="Collection 02"
            title="Apartments & Suites"
            description={settings.stays_collection_description}
            items={stays}
          />

          {yachts.length > 0 ? (
            <Section
              id="yachts"
              eyebrow="Collection 03"
              title="Yachts & Luxury Boats"
              description={settings.yachts_collection_description}
              items={yachts}
            />
          ) : (
            <DisabledYachtSection description={settings.yachts_coming_soon_description} />
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
