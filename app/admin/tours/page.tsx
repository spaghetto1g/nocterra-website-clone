import { createClient } from "@/lib/supabase/server"
import { Video, ExternalLink, Plus } from "lucide-react"
import Link from "next/link"

export default async function AdminToursPage() {
  const supabase = await createClient()
  
  const { data: properties } = await supabase
    .from("villas")
    .select("*")
    .not("tour_link", "is", null)
    .order("id", { ascending: false })

  const toursCount = properties?.length || 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-white mb-2">360° Tours</h1>
          <p className="text-white/40 text-sm">Manage immersive virtual experiences</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-light text-[#c9a962]">{toursCount}</p>
          <p className="text-white/40 text-xs uppercase tracking-wider">Active Tours</p>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties?.map((property) => (
          <div
            key={property.id}
            className="bg-[#0f0f0f] border border-white/5 rounded-xl overflow-hidden hover:border-[#c9a962]/20 transition-all duration-500 group"
          >
            {/* Image */}
            <div className="relative aspect-video bg-[#1a1a1a]">
              {property.hero_image && (
                <img
                  src={property.hero_image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                  href={property.tour_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-full bg-[#c9a962] flex items-center justify-center"
                >
                  <Video className="w-6 h-6 text-black" />
                </a>
              </div>
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-xs">360°</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <span className="text-[#c9a962] text-[10px] tracking-[0.2em] uppercase">
                {property.location}
              </span>
              <h3 className="text-white text-lg font-light mt-1 mb-3">{property.title}</h3>
              
              <div className="flex items-center gap-3">
                <a
                  href={property.tour_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#c9a962]/10 text-[#c9a962] text-xs rounded hover:bg-[#c9a962]/20 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Tour
                </a>
                <Link
                  href={`/admin/properties/edit/${property.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 text-white/60 text-xs rounded hover:border-white/30 hover:text-white transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Tour Card */}
        <Link
          href="/admin/properties/new"
          className="bg-[#0f0f0f] border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center py-16 hover:border-[#c9a962]/30 transition-colors group"
        >
          <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-4 group-hover:border-[#c9a962]/50 transition-colors">
            <Plus className="w-6 h-6 text-white/40 group-hover:text-[#c9a962] transition-colors" />
          </div>
          <span className="text-white/40 text-sm group-hover:text-white transition-colors">Add Property with Tour</span>
        </Link>
      </div>

      {toursCount === 0 && (
        <div className="text-center py-12">
          <Video className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/30 mb-2">No 360° tours yet</p>
          <p className="text-white/20 text-sm">Add a tour link to your properties to see them here</p>
        </div>
      )}
    </div>
  )
}
