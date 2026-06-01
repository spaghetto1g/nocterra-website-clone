"use client"

import Image from "next/image"

interface VillaExperienceProps {
  experience: {
    title: string
    description: string
    image?: string
  }
}

export default function VillaExperience({
  experience,
}: VillaExperienceProps) {
  const imageSrc =
    experience?.image && experience.image !== ""
      ? experience.image
      : "/villa/placeholder.jpg"

  return (
    <section className="bg-[#0a0a0a] py-28 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* IMAGE */}
          <div className="relative h-[600px] overflow-hidden rounded-sm bg-black">
            <Image
              src={imageSrc}
              alt={experience.title}
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* CONTENT */}
          <div className="max-w-xl">
            <span className="text-[#c9a962] text-[11px] tracking-[0.3em] uppercase block mb-6">
              The Experience
            </span>

            <h2 className="text-4xl md:text-5xl font-light text-white leading-tight mb-8">
              {experience.title}
            </h2>

            <p className="text-white/60 text-lg leading-relaxed">
              {experience.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}