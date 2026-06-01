"use client"

import Link from "next/link"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-lg tracking-[0.3em] font-light">
            <span className="text-[#c9a962]">N</span>
            <span className="text-white">OCTERRA</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          <Link
            href="/properties"
            className="text-white/80 hover:text-[#c9a962] text-xs tracking-[0.2em] uppercase transition-colors"
          >
            Properties
          </Link>

          <Link
            href="/services"
            className="text-white/80 hover:text-[#c9a962] text-xs tracking-[0.2em] uppercase transition-colors"
          >
            Services
          </Link>

          <Link
            href="/about"
            className="text-white/80 hover:text-[#c9a962] text-xs tracking-[0.2em] uppercase transition-colors"
          >
            About
          </Link>

          <Link
            href="/portfolio"
            className="text-white/80 hover:text-[#c9a962] text-xs tracking-[0.2em] uppercase transition-colors"
          >
            Portfolio
          </Link>

          <Link
            href="/contact"
            className="text-white/80 hover:text-[#c9a962] text-xs tracking-[0.2em] uppercase transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* CTA Button */}
        <Link href="/contact" className="hidden md:block border border-[#c9a962] text-[#c9a962] px-6 py-2.5 text-xs tracking-[0.15em] uppercase hover:bg-[#c9a962] hover:text-[#0a0a0a] transition-all duration-300">
          Book a Consultation
        </Link>
      </div>
    </header>
  )
}
