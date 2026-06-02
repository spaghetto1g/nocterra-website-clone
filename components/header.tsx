"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"

const navItems = [
  { href: "/properties", label: "Properties" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [homeHref, setHomeHref] = useState("/")

  useEffect(() => {
    const hostname = window.location.hostname.toLowerCase()
    const isNocterraSubdomain =
      hostname.endsWith(".nocterra.gr") && hostname !== "nocterra.gr" && hostname !== "www.nocterra.gr"

    setHomeHref(isNocterraSubdomain ? "https://nocterra.gr/" : "/")
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href={homeHref} className="flex items-center shrink-0" onClick={() => setOpen(false)}>
          <span className="text-base sm:text-lg tracking-[0.24em] sm:tracking-[0.3em] font-light">
            <span className="text-[#c9a962]">N</span>
            <span className="text-white">OCTERRA</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/80 hover:text-[#c9a962] text-xs tracking-[0.2em] uppercase transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/contact" className="hidden md:block border border-[#c9a962] text-[#c9a962] px-6 py-2.5 text-xs tracking-[0.15em] uppercase hover:bg-[#c9a962] hover:text-[#0a0a0a] transition-all duration-300">
          Book a Consultation
        </Link>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="md:hidden h-10 w-10 border border-white/15 text-white/80 flex items-center justify-center"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0a0a]/98">
          <nav className="px-4 py-5 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-[#c9a962] text-xs tracking-[0.22em] uppercase transition-colors py-2"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 border border-[#c9a962] text-[#c9a962] px-5 py-3 text-center text-[11px] tracking-[0.18em] uppercase hover:bg-[#c9a962] hover:text-[#0a0a0a] transition-all duration-300"
            >
              Book a Consultation
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
