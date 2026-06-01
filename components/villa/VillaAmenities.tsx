"use client"

import {
  Waves,
  Wine,
  Dumbbell,
  Sparkles,
  UtensilsCrossed,
  MonitorPlay,
  Car,
  ShieldCheck,
} from "lucide-react"

interface VillaAmenitiesProps {
  amenities: string[]
}

const iconMap: Record<string, any> = {
  "Infinity Pool": Waves,
  "Private Chef": UtensilsCrossed,
  "Spa & Wellness": Sparkles,
  "Wine Cellar": Wine,
  "Gym": Dumbbell,
  "Home Cinema": MonitorPlay,
  "Private Parking": Car,
  "24/7 Security": ShieldCheck,
}

export default function VillaAmenities({
  amenities,
}: VillaAmenitiesProps) {
  if (!amenities?.length) return null

  return (
    <section className="bg-[#0a0a0a] py-32 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-16">
          <span className="text-[#c9a962] text-[11px] tracking-[0.3em] uppercase block mb-6">
            Luxury Features
          </span>

          <h2 className="text-4xl md:text-6xl font-light text-white">
            Amenities & Services
          </h2>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {amenities.map((item, index) => {
            const Icon =
              iconMap[item] || Sparkles

            return (
              <div
                key={index}
                className="border border-white/10 bg-white/[0.02] p-8 hover:border-[#c9a962]/40 transition-all duration-500 group"
              >
                <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center mb-6 group-hover:border-[#c9a962]/40 transition-all duration-500">
                  <Icon className="w-6 h-6 text-[#c9a962]" />
                </div>

                <h3 className="text-white text-lg font-light leading-relaxed">
                  {item}
                </h3>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}