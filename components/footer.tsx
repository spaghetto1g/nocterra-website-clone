import Link from "next/link"
import { ArrowRight } from "lucide-react"

const defaultPartners = [
  "◎ Insta360",
  "dji",
  "◎ KUULA",
  "◎ ClearPano",
  "Canon",
  "A Adobe",
]

type FooterProps = {
  partners?: string[]
  tagline?: string
}

function splitPartner(value: string) {
  const trimmed = value.trim()
  const first = trimmed.charAt(0)
  if (["◎", "A"].includes(first) && trimmed.length > 2) {
    return { prefix: first, name: trimmed.slice(1).trim() }
  }
  return { prefix: "", name: trimmed }
}

export default function Footer({ partners, tagline }: FooterProps) {
  const activePartners = partners?.filter(Boolean).length ? partners.filter(Boolean) : defaultPartners

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 py-6 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-8 flex-wrap justify-center">
          {activePartners.map((partner, index) => {
            const item = splitPartner(partner)
            return (
              <span key={`${partner}-${index}`} className="text-white/40 text-xs tracking-wider flex items-center gap-1">
                {item.prefix && <span className="text-sm">{item.prefix}</span>}
                {item.name}
              </span>
            )
          })}
        </div>

        <div className="flex items-center gap-6">
          <span className="text-white/60 text-xs tracking-[0.1em] uppercase">
            {tagline || "Let's create something timeless."}
          </span>
          <Link
            href="/contact"
            className="border border-white/30 text-white px-6 py-3 text-xs tracking-[0.15em] uppercase flex items-center gap-2 hover:border-[#c9a962] hover:text-[#c9a962] transition-colors"
          >
            Get in Touch
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </footer>
  )
}
