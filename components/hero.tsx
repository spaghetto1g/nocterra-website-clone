"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

type HeroProps = {
  images?: string[]
  tagline?: string
  ctaLabel?: string
  sideLines?: string[]
}

const fallbackImages = ["/villa-new-1.png", "/villa-new-2.png", "/villa-new-3.png"]

export default function Hero({ images, tagline, ctaLabel, sideLines }: HeroProps) {
  const heroImages = images?.filter(Boolean).length ? images.filter(Boolean) : fallbackImages
  const lines = sideLines?.filter(Boolean).length ? sideLines.filter(Boolean) : ["Immersive", "Luxury", "Visual Storytelling"]
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    setCurrentImage(0)
  }, [heroImages.length])

  useEffect(() => {
    if (heroImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1))
    }, 6000)

    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={heroImages[currentImage] || fallbackImages[0]}
          alt="Luxury villa"
          fill
          className="object-cover object-center transition-opacity duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/85 md:from-black/40 md:via-black/10 md:to-black/70" />
      </div>

      <div className="relative z-10 min-h-[100svh] flex flex-col items-center justify-center text-center px-5 pt-24 pb-24 sm:px-6 md:px-6 md:pt-0 md:pb-0">
        <h1 className="text-[#c9a962] text-[clamp(2.2rem,12vw,4.2rem)] md:text-7xl tracking-[0.18em] md:tracking-[0.4em] font-light mb-5 md:mb-6 font-serif leading-none">
          NOCTERRA
        </h1>

        <p className="text-[#c9a962]/90 text-[10px] sm:text-xs md:text-base tracking-[0.16em] sm:tracking-[0.22em] md:tracking-[0.25em] uppercase mb-7 md:mb-12 max-w-[19rem] sm:max-w-[30rem] md:max-w-[90vw] leading-[1.9]">
          {tagline || "Immersive Spaces. Timeless Experiences."}
        </p>

        <div className="md:hidden mb-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 max-w-[19rem] text-white/60 text-[9px] tracking-[0.2em] uppercase leading-relaxed">
          {lines.slice(0, 3).map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>

        <Link href="/properties" className="border border-[#c9a962]/55 text-white/90 px-6 md:px-10 py-3.5 md:py-4 text-[10px] md:text-xs tracking-[0.18em] sm:tracking-[0.22em] md:tracking-[0.25em] uppercase hover:bg-[#c9a962]/20 transition-all duration-500 min-w-[210px] md:min-w-0">
          {ctaLabel || "Discover Properties"}
        </Link>
      </div>

      <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 hidden md:block z-10">
        <div className="flex items-start gap-3">
          <div className="w-px h-16 bg-white/40" />
          <div className="text-white/70 text-[10px] tracking-[0.15em] uppercase leading-relaxed">
            {lines.slice(0, 4).map((line) => <p key={line}>{line}</p>)}
          </div>
        </div>
      </div>

      <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-end gap-4 z-10">
        {heroImages.map((_, index) => (
          <button key={index} type="button" onClick={() => setCurrentImage(index)} className="flex flex-col items-center gap-2" aria-label={`Show hero image ${index + 1}`}>
            <span className={`text-xs transition-all duration-300 ${currentImage === index ? "text-white" : "text-white/40"}`}>
              {String(index + 1).padStart(2, "0")}
            </span>
            {currentImage === index && <div className="w-px h-8 bg-white/60" />}
          </button>
        ))}
      </div>

      {heroImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 md:hidden">
          {heroImages.map((_, index) => (
            <button key={index} type="button" onClick={() => setCurrentImage(index)} className="flex items-center gap-2" aria-label={`Show hero image ${index + 1}`}>
              <span className={`text-[10px] transition-all duration-300 ${currentImage === index ? "text-white" : "text-white/35"}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              {currentImage === index && <span className="h-px w-8 bg-white/60" />}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
