"use client"

import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"

import { useState, useEffect } from "react"

interface VillaGalleryProps {
  gallery: string[]
  title: string
}

export default function VillaGallery({
  gallery,
  title,
}: VillaGalleryProps) {
  const [current, setCurrent] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === gallery.length - 1 ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? gallery.length - 1 : prev - 1
    )
  }

  // KEYBOARD CONTROLS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fullscreen) return

      if (e.key === "ArrowRight") {
        nextSlide()
      }

      if (e.key === "ArrowLeft") {
        prevSlide()
      }

      if (e.key === "Escape") {
        setFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [fullscreen])

  // DYNAMIC PREVIEWS
  const previewImages = []

  for (let i = 1; i <= 3; i++) {
    previewImages.push(
      gallery[(current + i) % gallery.length]
    )
  }

  return (
    <>
      {/* SECTION */}
      <section className="bg-[#0a0a0a] py-32 overflow-hidden">

        {/* HEADER */}
        <div className="px-6 md:px-16 lg:px-24 mb-16">
          <span className="text-[#c9a962] text-[11px] tracking-[0.3em] uppercase block mb-6">
            Gallery
          </span>

          <h2 className="text-4xl md:text-6xl font-light text-white">
            Cinematic Perspectives
          </h2>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-[1.6fr_0.7fr] gap-6 px-6 md:px-16 lg:px-24">

          {/* MAIN IMAGE */}
          <div
            className="relative h-[760px] bg-black overflow-hidden cursor-pointer group"
            onClick={() => setFullscreen(true)}
          >
            <Image
              src={gallery[current]}
              alt={title}
              fill
              className="object-contain group-hover:scale-[1.01] transition-transform duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

            {/* IMAGE COUNT */}
            <div className="absolute bottom-6 left-6 text-white/70 text-xs tracking-[0.25em] uppercase">
              {String(current + 1).padStart(2, "0")} /{" "}
              {String(gallery.length).padStart(2, "0")}
            </div>
          </div>

          {/* SIDE PREVIEWS */}
          <div className="flex flex-col gap-6">

            {previewImages.map((image, index) => (
              <div
                key={index}
                className="relative h-[242px] bg-black overflow-hidden cursor-pointer group"
                onClick={nextSlide}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-all duration-500" />

                {/* LAST IMAGE OVERLAY */}
                {index === 2 && gallery.length > 4 && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="text-white text-lg tracking-[0.3em] uppercase">
                      Explore More
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex justify-between items-center mt-12 px-6 md:px-16 lg:px-24">

          {/* ARROWS */}
          <div className="flex items-center gap-4">
            <button
              onClick={prevSlide}
              className="w-12 h-12 border border-white/10 flex items-center justify-center text-white hover:border-[#c9a962] hover:text-[#c9a962] transition-all duration-300"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={nextSlide}
              className="w-12 h-12 border border-white/10 flex items-center justify-center text-white hover:border-[#c9a962] hover:text-[#c9a962] transition-all duration-300"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center gap-3">
            {gallery.map((_, index) => (
              <div
                key={index}
                className={`h-[2px] transition-all duration-500 ${
                  current === index
                    ? "w-16 bg-[#c9a962]"
                    : "w-8 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FULLSCREEN */}
      {fullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">

          {/* IMAGE */}
          <div className="relative w-full h-full flex items-center justify-center p-16">
            <Image
              src={gallery[current]}
              alt={title}
              fill
              className="object-contain"
            />
          </div>

          {/* CLOSE */}
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-8 right-8 z-[10000] text-white hover:text-[#c9a962] transition-colors"
          >
            <X size={34} />
          </button>

          {/* LEFT */}
          <button
            onClick={prevSlide}
            className="absolute left-8 z-[10000] text-white hover:text-[#c9a962] transition-colors"
          >
            <ChevronLeft size={46} />
          </button>

          {/* RIGHT */}
          <button
            onClick={nextSlide}
            className="absolute right-8 z-[10000] text-white hover:text-[#c9a962] transition-colors"
          >
            <ChevronRight size={46} />
          </button>
        </div>
      )}
    </>
  )
}