import { Bed, Bath, Users, Maximize } from "lucide-react"

interface VillaStatsProps {
  stats?: {
    bedrooms?: number
    bathrooms?: number
    guests?: number
    size?: number
  }
}

export default function VillaStats({ stats }: VillaStatsProps) {
  const items = [
    {
      icon: Bed,
      label: "Bedrooms",
      value: stats?.bedrooms ?? 0,
    },
    {
      icon: Bath,
      label: "Bathrooms",
      value: stats?.bathrooms ?? 0,
    },
    {
      icon: Users,
      label: "Guests",
      value: stats?.guests ?? 0,
    },
    {
      icon: Maximize,
      label: "Size",
      value: stats?.size ? `${stats.size}m²` : "—",
    },
  ]

  return (
    <section className="py-20 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, index) => {
            const Icon = item.icon

            return (
              <div
                key={index}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center"
              >
                <Icon className="w-6 h-6 mx-auto mb-4 text-[#d4af37]" />

                <div className="text-3xl font-light text-white mb-2">
                  {item.value}
                </div>

                <div className="text-sm uppercase tracking-[0.2em] text-white/50">
                  {item.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}