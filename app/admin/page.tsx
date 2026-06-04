import Link from "next/link"
import { Building2, Eye, ImageIcon, Settings, Sparkles, Plus, ArrowRight, Hotel, Home, Ship } from "lucide-react"

const menuItems = [
  {
    title: "Villas",
    description: "Manage the dedicated villa collection only.",
    href: "/admin/properties?filter=villa",
    icon: Building2,
  },
  {
    title: "Apartments / Residences",
    description: "Manage luxury apartments, residences, penthouses and suites separately from villas.",
    href: "/admin/properties?filter=stays",
    icon: Hotel,
  },

  {
    title: "Yachts / Luxury Boats",
    description: "Manage yacht charters and luxury boat experiences when this collection goes live.",
    href: "/admin/properties?filter=yachting",
    icon: Ship,
  },
  {
    title: "Add Villa",
    description: "Create a new luxury villa with hero carousel, gallery, stats and tour.",
    href: "/admin/properties/new?type=villa",
    icon: Plus,
  },
  {
    title: "Add Apartment / Stay",
    description: "Create a premium apartment, residence, penthouse or signature suite.",
    href: "/admin/properties/new?type=apartment",
    icon: Home,
  },

  {
    title: "Add Yacht / Boat",
    description: "Prepare a yacht or luxury boat listing with route, port, guests, crew, gallery and 360 tour.",
    href: "/admin/properties/new?type=yacht",
    icon: Ship,
  },
  {
    title: "Concierge",
    description: "Manage curated restaurants, VIP transport, chefs, wellness, yachts and private experiences.",
    href: "/admin/concierge",
    icon: Sparkles,
  },
  {
    title: "360 Tours",
    description: "Manage tour links and embeds used inside property pages.",
    href: "/admin/tours",
    icon: Eye,
  },
  {
    title: "Media",
    description: "Review image storage and media workflow.",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    title: "Featured Homepage",
    description: "Use the properties list to mark active properties as featured.",
    href: "/admin/properties?filter=featured",
    icon: Sparkles,
  },
  {
    title: "Settings",
    description: "Admin settings and configuration area.",
    href: "/admin/settings",
    icon: Settings,
  },
]

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <p className="text-[#c9a962] uppercase tracking-[0.35em] text-xs mb-3">NOCTERRA Admin</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light">Control Panel</h1>
            <p className="text-white/45 mt-4 max-w-2xl">
              Manage villas, luxury stays, yachts, media, 360 tours and homepage visibility from one protected dashboard.
            </p>
          </div>

          <Link href="/" className="hidden md:inline-flex border border-white/15 px-5 py-3 text-xs uppercase tracking-[0.2em] text-white/70 hover:text-[#c9a962] hover:border-[#c9a962]/50 transition-colors">
            View Website
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group min-h-[190px] sm:min-h-[220px] rounded-2xl border border-white/10 bg-[#0f0f0f] p-7 hover:border-[#c9a962]/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="h-12 w-12 rounded-full border border-[#c9a962]/30 flex items-center justify-center text-[#c9a962]">
                    <Icon size={20} />
                  </div>
                  <ArrowRight size={18} className="text-white/30 group-hover:text-[#c9a962] transition-colors" />
                </div>

                <h2 className="text-2xl font-light mt-8 mb-3">{item.title}</h2>
                <p className="text-white/45 text-sm leading-relaxed">{item.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
