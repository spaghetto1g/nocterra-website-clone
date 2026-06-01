"use client"

import Image from "next/image"
import { Play } from "lucide-react"

interface VillaTourProps {
  title: string
  gallery?: string[]
  virtualTour?: string
}

export default function VillaTour({
  title,
  gallery = [],
  virtualTour,
}: VillaTourProps) {
  if (!gallery.length) return null

  return (
    <section className="bg-[#0a0a0a] py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-[#c9a962] text-[11px] tracking-[0.3em] uppercase block mb-4">
              Cinematic Tour
            </span>

            <h2 className="text-4xl md:text-5xl font-light text-white">
              Explore The Estate
            </h2>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Large Image */}
          <div className="lg:col-span-2 relative aspect-[16/9] overflow-hidden rounded-2xl group cursor-pointer">
            <Image
              src={gallery[0]}
              alt={title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />

            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
          </div>

          {/* Side Gallery */}
          <div className="grid grid-cols-2 gap-6">

            {gallery.slice(1).map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer"
              >
                <Image
                  src={image}
                  alt={`${title} ${index + 2}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
              </div>
            ))}

          </div>
        </div>

        {/* 360 Tour */}
        {virtualTour && (
          <div className="mt-20">
            <div className="mb-6">
              <span className="text-[#c9a962] text-[11px] tracking-[0.3em] uppercase block mb-4">
                Immersive Experience
              </span>

              <h3 className="text-3xl md:text-4xl font-light text-white">
                360° Virtual Tour
              </h3>
            </div>

            <div className="relative w-full aspect-video overflow-hidden rounded-2xl border border-white/10">
              <iframe
                src={virtualTour}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        )}

      </div>
    </section>
  )
}