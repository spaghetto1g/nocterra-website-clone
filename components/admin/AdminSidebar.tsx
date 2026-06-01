"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Building2, 
  Video, 
  Image as ImageIcon,
  Settings,
  LogOut
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Properties", href: "/admin/properties", icon: Building2 },
  { name: "360° Tours", href: "/admin/tours", icon: Video },
  { name: "Media Library", href: "/admin/media", icon: ImageIcon },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-[#0f0f0f] border-r border-white/5 hidden lg:flex lg:flex-col">
      {/* Logo */}
      <div className="h-20 flex items-center px-8 border-b border-white/5">
        <Link href="/admin" className="flex items-center">
          <span className="text-lg tracking-[0.3em] font-light">
            <span className="text-[#c9a962]">N</span>
            <span className="text-white">OCTERRA</span>
          </span>
          <span className="ml-4 text-[10px] text-white/30 tracking-wider uppercase">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/admin" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
                isActive
                  ? "bg-[#c9a962]/10 text-[#c9a962] border border-[#c9a962]/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="tracking-wide">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-6 border-t border-white/5">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-4 px-4 py-3 w-full text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="tracking-wide">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
