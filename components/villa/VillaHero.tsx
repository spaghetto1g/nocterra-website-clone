import Image from "next/image"

export default function VillaHero({
  title,
  location,
  heroImage,
  description,
}: any) {
  return (
    <section className="relative w-full h-[85vh] overflow-hidden">

      {/* HERO IMAGE */}
      <Image
        src={heroImage || "/villa/placeholder.jpg"}
        alt={title}
        fill
        priority
        className="object-cover"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* TEXT CONTENT */}
      <div className="absolute bottom-0 left-0 w-full p-10 md:p-20">

        <p className="text-white/60 uppercase tracking-[0.3em] text-xs mb-3">
          {location}
        </p>

        <h1 className="text-4xl md:text-6xl font-light text-white mb-4">
          {title}
        </h1>

        <p className="text-white/70 max-w-xl leading-relaxed">
          {description}
        </p>

      </div>

    </section>
  )
}