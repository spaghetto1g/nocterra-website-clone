"use client"

import Link from "next/link"
import type { FormEvent, MouseEvent } from "react"
import { useEffect, useMemo, useState } from "react"

const FALLBACK_IMAGE = "/placeholder.jpg"

type VillaClientProps = {
  villa: any
}

function safeText(value: unknown, fallback = "-") {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback
}

function safeNumber(value: unknown) {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0
}

function safeBoolean(value: unknown) {
  if (value === true) return true
  if (typeof value === "number") return value === 1
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()
    return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on"
  }
  return false
}

function safeImageUrl(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : FALLBACK_IMAGE
}

function safeStringArray(value: unknown) {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
}

type TourRenderData =
  | { kind: "iframe"; src: string; openUrl: string }
  | { kind: "image"; src: string; openUrl: string }
  | { kind: "external"; openUrl: string }

function extractIframeSrc(input: string) {
  const srcMatch = input.match(/src=["']([^"']+)["']/i)
  return srcMatch?.[1]?.trim() || ""
}

function isImageUrl(input: string) {
  return /\.(jpg|jpeg|png|webp|gif|avif)(\?.*)?$/i.test(input)
}

function normalizeTourUrl(input: string) {
  const trimmed = input.trim()

  const matterportIdPatterns = [
    /discover\.matterport\.com\/space\/([A-Za-z0-9_-]+)/i,
    /my\.matterport\.com\/show\/\?m=([A-Za-z0-9_-]+)/i,
    /my\.matterport\.com\/work\/\?m=([A-Za-z0-9_-]+)/i,
    /[?&]m=([A-Za-z0-9_-]+)/i,
  ]

  for (const pattern of matterportIdPatterns) {
    const match = trimmed.match(pattern)
    if (match?.[1]) {
      return `https://my.matterport.com/show/?m=${encodeURIComponent(match[1])}`
    }
  }

  const youtubePatterns = [
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/i,
    /youtu\.be\/([A-Za-z0-9_-]+)/i,
    /youtube\.com\/embed\/([A-Za-z0-9_-]+)/i,
  ]

  for (const pattern of youtubePatterns) {
    const match = trimmed.match(pattern)
    if (match?.[1]) {
      return `https://www.youtube.com/embed/${encodeURIComponent(match[1])}`
    }
  }

  const vimeoPatterns = [
    /vimeo\.com\/(\d+)/i,
    /player\.vimeo\.com\/video\/(\d+)/i,
  ]

  for (const pattern of vimeoPatterns) {
    const match = trimmed.match(pattern)
    if (match?.[1]) {
      return `https://player.vimeo.com/video/${encodeURIComponent(match[1])}`
    }
  }

  const kuulaMatch = trimmed.match(/kuula\.co\/(?:post|share)\/([A-Za-z0-9]+)/i)
  if (kuulaMatch?.[1]) {
    return `https://kuula.co/share/${encodeURIComponent(kuulaMatch[1])}?logo=0&info=0&fs=1&vr=0&sd=1&thumbs=1`
  }

  if (/app\.cloudpano\.com\/tours\//i.test(trimmed)) return trimmed
  if (/momento360\.com\/e\/u\//i.test(trimmed)) return trimmed
  if (/roundme\.com\/embed\//i.test(trimmed)) return trimmed

  return trimmed
}

function getTourData(value: unknown): TourRenderData | null {
  if (typeof value !== "string") return null

  const raw = value.trim()
  if (!raw) return null

  const iframeSrc = extractIframeSrc(raw)
  const input = iframeSrc || raw

  if (!/^https?:\/\//i.test(input) && !input.startsWith("/")) return null

  if (isImageUrl(input)) {
    return { kind: "image", src: input, openUrl: input }
  }

  const normalized = normalizeTourUrl(input)

  const knownEmbeddable =
    /my\.matterport\.com\/show/i.test(normalized) ||
    /youtube\.com\/embed/i.test(normalized) ||
    /player\.vimeo\.com\/video/i.test(normalized) ||
    /kuula\.co\/share/i.test(normalized) ||
    /app\.cloudpano\.com\/tours\//i.test(normalized) ||
    /momento360\.com\/e\/u\//i.test(normalized) ||
    /roundme\.com\/embed\//i.test(normalized)

  if (knownEmbeddable) {
    return { kind: "iframe", src: normalized, openUrl: normalized }
  }

  return { kind: "external", openUrl: normalized }
}


type VideoRenderData =
  | { kind: "iframe"; src: string; openUrl: string }
  | { kind: "video"; src: string }

function isVideoFileUrl(input: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(input)
}

function getHeroVideoUrl(value: unknown) {
  if (typeof value !== "string") return ""
  const input = value.trim()
  if (!input) return ""
  if (!/^https?:\/\//i.test(input) && !input.startsWith("/")) return ""
  return isVideoFileUrl(input) ? input : ""
}

function getHeroMediaMode(value: unknown) {
  return value === "fit" || value === "video" ? value : "cover"
}

function normalizeVideoUrl(input: string) {
  const trimmed = input.trim()

  const youtubePatterns = [
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/i,
    /youtu\.be\/([A-Za-z0-9_-]+)/i,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]+)/i,
    /youtube\.com\/embed\/([A-Za-z0-9_-]+)/i,
  ]

  for (const pattern of youtubePatterns) {
    const match = trimmed.match(pattern)
    if (match?.[1]) {
      return `https://www.youtube.com/embed/${encodeURIComponent(match[1])}?rel=0&modestbranding=1&playsinline=1`
    }
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i)
  if (vimeoMatch?.[1]) {
    return `https://player.vimeo.com/video/${encodeURIComponent(vimeoMatch[1])}`
  }

  return trimmed
}

function getVideoData(value: unknown): VideoRenderData | null {
  if (typeof value !== "string") return null

  const raw = value.trim()
  if (!raw) return null

  const iframeSrc = extractIframeSrc(raw)
  const input = iframeSrc || raw

  if (!/^https?:\/\//i.test(input) && !input.startsWith("/")) return null

  const normalized = normalizeVideoUrl(input)

  if (isVideoFileUrl(normalized)) {
    return { kind: "video", src: normalized }
  }

  const embeddable =
    /youtube\.com\/embed/i.test(normalized) ||
    /player\.vimeo\.com\/video/i.test(normalized)

  if (embeddable) {
    return { kind: "iframe", src: normalized, openUrl: normalized }
  }

  if (/^https?:\/\//i.test(normalized)) {
    return { kind: "iframe", src: normalized, openUrl: normalized }
  }

  return null
}

function safeExternalUrl(value: unknown) {
  if (typeof value !== "string") return ""

  const input = value.trim()
  if (!input) return ""

  if (/^https?:\/\//i.test(input)) return input

  return ""
}


function safeCoordinate(value: unknown) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

function createMapData(latitude: number | null, longitude: number | null) {
  if (latitude === null || longitude === null) return null

  const delta = 0.01
  const bbox = [
    longitude - delta,
    latitude - delta,
    longitude + delta,
    latitude + delta,
  ].join(",")

  return {
    embedUrl: `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(`${latitude},${longitude}`)}`,
    openUrl: `https://www.openstreetmap.org/?mlat=${encodeURIComponent(String(latitude))}&mlon=${encodeURIComponent(String(longitude))}#map=15/${encodeURIComponent(String(latitude))}/${encodeURIComponent(String(longitude))}`,
  }
}

function createSpecialRequestMailto(email: string, title: string, location: string, form: { name: string; email: string; phone: string; dates: string; message: string }) {
  const to = email || "info@nocterra.gr"
  const subject = `Special request for ${title}`
  const body = [
    `Property: ${title}`,
    location ? `Location: ${location}` : null,
    "",
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `Phone / WhatsApp: ${form.phone}`,
    `Preferred dates: ${form.dates}`,
    "",
    "Request:",
    form.message,
  ].filter(Boolean).join("\n")

  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function createPurchaseMailto(title: string, location: string) {
  const subject = `Purchase interest: ${title}`
  const body = [
    `Hello NOCTERRA,`,
    ``,
    `I am interested in buying this property:`,
    `Property: ${title}`,
    `Location: ${location}`,
    ``,
    `Please contact me with more information.`,
    ``,
    `Name:`,
    `Phone:`,
    `Email:`,
  ].join("\n")

  return `mailto:info@nocterra.gr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function ImageWithFallback({
  src,
  alt,
  className,
  onClick,
}: {
  src: string
  alt: string
  className: string
  onClick?: (event: MouseEvent<HTMLImageElement>) => void
}) {
  const [imageSrc, setImageSrc] = useState(src || FALLBACK_IMAGE)

  useEffect(() => {
    setImageSrc(src || FALLBACK_IMAGE)
  }, [src])

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onClick={onClick}
      onError={() => setImageSrc(FALLBACK_IMAGE)}
    />
  )
}

export default function VillaClient({ villa }: VillaClientProps) {
  const [activeImage, setActiveImage] = useState(0)
  const [heroImageIndex, setHeroImageIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [isSpecialRequestOpen, setIsSpecialRequestOpen] = useState(false)
  const [specialRequestForm, setSpecialRequestForm] = useState({
    name: "",
    email: "",
    phone: "",
    dates: "",
    message: "",
  })
  const [homeHref, setHomeHref] = useState("/")

  useEffect(() => {
    const hostname = window.location.hostname.toLowerCase()
    const isNocterraSubdomain =
      hostname.endsWith(".nocterra.gr") && hostname !== "nocterra.gr" && hostname !== "www.nocterra.gr"

    setHomeHref(isNocterraSubdomain ? "https://nocterra.gr/" : "/")
  }, [])

  const title = safeText(villa?.title, "NOCTERRA Villa")
  const location = safeText(villa?.location)
  const description = safeText(villa?.description, "Details coming soon.")
  const heroImage = safeImageUrl(villa?.hero_image || villa?.heroImage)
  const amenities = safeStringArray(villa?.amenities)
  const tourData = getTourData(villa?.tour_link || villa?.tourLink)
  const videoData = getVideoData(villa?.video_embed)
  const rentUrl = safeExternalUrl(villa?.rent_url)
  const socialUrl = safeExternalUrl(villa?.social_url)
  const saleInterestEnabled = Boolean(villa?.sale_interest_enabled)
  const specialRequestEnabled = safeBoolean(villa?.special_request_enabled)
  const specialRequestLabel = safeText(villa?.special_request_label, "Special Request")
  const specialRequestEmail = safeText(villa?.special_request_email, "info@nocterra.gr")
  const showPropertyActions = Boolean(rentUrl || socialUrl || saleInterestEnabled || specialRequestEnabled)
  const purchaseMailto = createPurchaseMailto(title, location)
  const specialRequestMailto = createSpecialRequestMailto(specialRequestEmail, title, location, specialRequestForm)
  const submitSpecialRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.location.href = specialRequestMailto
    setIsSpecialRequestOpen(false)
  }
  const propertyType = safeText(villa?.property_type, "villa").toLowerCase()
  const latitude = safeCoordinate(villa?.latitude)
  const longitude = safeCoordinate(villa?.longitude)
  const mapData = createMapData(latitude, longitude)
  const isYacht = propertyType === "yacht" || propertyType === "luxury_boat"
  const yachtDetails = [
    villa?.departure_port ? { label: "Departure", value: villa.departure_port } : null,
    villa?.yacht_route ? { label: "Route", value: villa.yacht_route } : null,
    safeNumber(villa?.max_passengers) ? { label: "Passengers", value: safeNumber(villa.max_passengers) } : null,
    safeNumber(villa?.crew) ? { label: "Crew", value: safeNumber(villa.crew) } : null,
    safeNumber(villa?.cabins) ? { label: "Cabins", value: safeNumber(villa.cabins) } : null,
    villa?.yacht_length ? { label: "Length", value: villa.yacht_length } : null,
    villa?.charter_price ? { label: "Charter", value: villa.charter_price } : null,
  ].filter(Boolean) as { label: string; value: string | number }[]

  const heroImages = useMemo(() => {
    const savedHeroImages = safeStringArray(villa?.hero_images)
    const unique = [...savedHeroImages, heroImage]
      .filter(Boolean)
      .filter((image, index, array) => array.indexOf(image) === index)

    return unique.length > 0 ? unique : [FALLBACK_IMAGE]
  }, [villa?.hero_images, heroImage])

  const images = useMemo(() => {
    const gallery = safeStringArray(villa?.gallery)
    const unique = [...heroImages, ...gallery]
      .filter(Boolean)
      .filter((image, index, array) => array.indexOf(image) === index)

    return unique.length > 0 ? unique : [FALLBACK_IMAGE]
  }, [villa?.gallery, heroImages])

  const heroActiveImage = heroImages[heroImageIndex] || heroImages[0] || FALLBACK_IMAGE
  const heroMediaMode = getHeroMediaMode(villa?.hero_media_mode)
  const heroVideoUrl = getHeroVideoUrl(villa?.hero_video_url)
  const heroPoster = safeImageUrl(villa?.hero_video_poster || heroActiveImage)
  const shouldRenderHeroVideo = heroMediaMode === "video" && Boolean(heroVideoUrl)
  const shouldRenderHeroFit = heroMediaMode === "fit"
  const safeImage = images[activeImage] || images[0] || FALLBACK_IMAGE
  const sideImages = [1, 2, 3].map((offset) => images[(activeImage + offset) % images.length])

  function nextImage() {
    setActiveImage((prev) => (prev + 1 >= images.length ? 0 : prev + 1))
  }

  function prevImage() {
    setActiveImage((prev) => (prev - 1 < 0 ? images.length - 1 : prev - 1))
  }

  function openImage(index: number) {
    setActiveImage(index)
    setOpen(true)
  }

  function nextHeroImage() {
    setHeroImageIndex((prev) => (prev + 1 >= heroImages.length ? 0 : prev + 1))
  }

  function prevHeroImage() {
    setHeroImageIndex((prev) => (prev - 1 < 0 ? heroImages.length - 1 : prev - 1))
  }

  useEffect(() => {
    if (activeImage >= images.length) setActiveImage(0)
  }, [activeImage, images.length])

  useEffect(() => {
    if (heroImageIndex >= heroImages.length) setHeroImageIndex(0)
  }, [heroImageIndex, heroImages.length])

  useEffect(() => {
    if (heroImages.length <= 1) return

    const interval = window.setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1 >= heroImages.length ? 0 : prev + 1))
    }, 6000)

    return () => window.clearInterval(interval)
  }, [heroImages.length])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!open) return

      if (e.key === "Escape") setOpen(false)
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "ArrowLeft") prevImage()
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, images.length])

  return (
    <div className="text-white bg-black">
      <div className="relative min-h-[100svh] w-full overflow-hidden bg-black">
        <Link href={homeHref} className="absolute top-5 left-4 sm:top-6 sm:left-6 z-20 flex items-center">
          <span className="text-base sm:text-lg tracking-[0.24em] sm:tracking-[0.3em] font-light">
            <span className="text-[#c9a962]">N</span>
            <span className="text-white">OCTERRA</span>
          </span>
        </Link>

        {shouldRenderHeroVideo ? (
          <div className="relative h-full w-full bg-black">
            <video
              key={heroVideoUrl}
              className="relative z-[1] h-full w-full object-contain md:object-cover"
              src={heroVideoUrl}
              poster={heroPoster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
        ) : shouldRenderHeroFit ? (
          <>
            <ImageWithFallback src={heroActiveImage} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-35" />
            <ImageWithFallback src={heroActiveImage} alt={title} className="relative z-[1] h-full w-full object-contain transition-opacity duration-1000" />
          </>
        ) : (
          <ImageWithFallback src={heroActiveImage} alt={title} className="w-full h-full object-cover transition-opacity duration-1000" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-black/65" />

        {heroImages.length > 1 && !shouldRenderHeroVideo && (
          <>
            <button type="button" onClick={prevHeroImage} className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 text-4xl text-white/70 hover:text-white">
              ‹
            </button>
            <button type="button" onClick={nextHeroImage} className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 text-4xl text-white/70 hover:text-white">
              ›
            </button>

            <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-end gap-4 z-20">
              {heroImages.map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <span className={`text-xs transition-all duration-300 ${heroImageIndex === index ? "text-white" : "text-white/40"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {heroImageIndex === index && <div className="w-px h-8 bg-white/60" />}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="absolute bottom-8 left-4 right-4 sm:bottom-10 sm:left-10 sm:right-auto z-20">
          <h1 className="text-3xl sm:text-4xl font-light">{title}</h1>
          <p className="text-gray-300">{location}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6 grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-0 text-center border-b border-white/10 text-xs sm:text-sm text-white/75">
        {isYacht ? (
          <>
            <div>Cabins: {safeNumber(villa?.cabins)}</div>
            <div>Crew: {safeNumber(villa?.crew)}</div>
            <div>Guests: {safeNumber(villa?.max_passengers) || safeNumber(villa?.guests)}</div>
            <div>Length: {safeText(villa?.yacht_length, "-")}</div>
            <div>360: {tourData ? "Yes" : "Soon"}</div>
          </>
        ) : (
          <>
            <div>Bedrooms: {safeNumber(villa?.bedrooms)}</div>
            <div>Bathrooms: {safeNumber(villa?.bathrooms)}</div>
            <div>Guests: {safeNumber(villa?.guests)}</div>
            <div>Sqft: {safeNumber(villa?.sqft)}</div>
            <div>Pool: {villa?.pool ? "Yes" : "No"}</div>
          </>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
          <div className="md:col-span-2 relative h-[340px] sm:h-[430px] md:h-[500px] overflow-hidden bg-black">
            <ImageWithFallback
              src={safeImage}
              alt={title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => openImage(activeImage)}
            />

            <button type="button" onClick={prevImage} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-4xl text-white/80 hover:text-white">
              ‹
            </button>
            <button type="button" onClick={nextImage} className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-4xl text-white/80 hover:text-white">
              ›
            </button>
          </div>

          <div className="grid grid-cols-3 md:flex md:flex-col gap-2 h-[110px] sm:h-[140px] md:h-[500px] overflow-hidden">
            {sideImages.map((img, i) => {
              const imageIndex = (activeImage + i + 1) % images.length

              return (
                <ImageWithFallback
                  key={`${img}-${i}`}
                  src={img}
                  alt={`${title} gallery ${i + 1}`}
                  onClick={() => openImage(imageIndex)}
                  className="h-full md:h-[161px] w-full object-cover cursor-pointer border border-transparent hover:border-yellow-500"
                />
              )
            })}
          </div>
        </div>
      </div>



      {isYacht && yachtDetails.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 border-t border-white/10">
          <p className="text-[#c9a962] text-[11px] tracking-[0.3em] uppercase mb-5">Yacht Details</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {yachtDetails.map((detail) => (
              <div key={detail.label} className="border border-white/10 bg-[#0b0b0b] px-5 py-4">
                <p className="text-white/35 text-xs uppercase tracking-[0.2em] mb-2">{detail.label}</p>
                <p className="text-white/80">{detail.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap gap-2 border-t border-white/10 py-6">
        {amenities.length > 0 ? (
          amenities.map((a, i) => (
            <span key={`${a}-${i}`} className="px-3 py-1 border border-white/20 text-sm">
              {a}
            </span>
          ))
        ) : (
          <span className="px-3 py-1 border border-white/20 text-sm text-white/50">Amenities coming soon</span>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 border-t border-white/10">
        <div>
          <h2 className="text-2xl mb-3">About</h2>
          <p className="text-gray-300">{description}</p>
        </div>

        <div>
          <h2 className="text-2xl mb-3">360</h2>

          {tourData ? (
            <div className="relative h-[300px] sm:h-[360px] lg:h-[400px] w-full overflow-hidden border border-white/10 bg-black">
              {tourData.kind === "iframe" ? (
                <iframe
                  src={tourData.src}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="fullscreen; gyroscope; accelerometer; magnetometer; vr; xr-spatial-tracking"
                  allowFullScreen
                  loading="lazy"
                />
              ) : tourData.kind === "image" ? (
                <img
                  src={tourData.src}
                  alt="360 preview"
                  className="absolute inset-0 h-full w-full object-contain bg-black"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center bg-black">
                  <p className="text-[#c9a962] text-[11px] tracking-[0.3em] uppercase mb-4">External 360 Experience</p>
                  <p className="text-white/55 text-sm leading-6 max-w-sm mb-6">
                    This provider does not allow embedded viewing. Open the immersive tour in a new secure tab.
                  </p>
                  <a
                    href={tourData.openUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center border border-[#c9a962]/50 px-6 py-3 text-xs tracking-[0.25em] uppercase text-[#c9a962] hover:bg-[#c9a962] hover:text-black transition"
                  >
                    Open 360 Tour
                  </a>
                </div>
              )}

              <a
                href={tourData.openUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute right-3 bottom-3 bg-black/70 border border-white/15 px-3 py-2 text-[10px] tracking-[0.18em] uppercase text-white/70 hover:text-[#c9a962] hover:border-[#c9a962]/50 transition"
              >
                Open
              </a>
            </div>
          ) : (
            <div className="h-[300px] sm:h-[360px] lg:h-[400px] flex items-center justify-center border border-white/20 text-gray-500 bg-black overflow-hidden">
              360 Tour Coming Soon
            </div>
          )}
        </div>
      </div>

      {videoData && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 sm:pb-12 border-t border-white/10">
          <div className="pt-10 sm:pt-12">
            <p className="text-[#c9a962] text-[11px] tracking-[0.3em] uppercase mb-4">Video</p>
            <div className="relative aspect-video w-full overflow-hidden border border-white/10 bg-black shadow-2xl shadow-black/30">
              {videoData.kind === "iframe" ? (
                <iframe
                  src={videoData.src}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  loading="lazy"
                  title={`${title} video`}
                />
              ) : (
                <video
                  src={videoData.src}
                  className="absolute inset-0 h-full w-full object-contain bg-black"
                  controls
                  playsInline
                  preload="metadata"
                  title={`${title} video`}
                />
              )}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.4fr] gap-6 items-stretch">
          <div className="bg-[#0b0b0b] border border-white/10 px-6 md:px-8 py-8 flex flex-col justify-between">
            <div>
              <p className="text-[#c9a962] text-[11px] tracking-[0.3em] uppercase mb-4">Location</p>
              <h2 className="text-2xl md:text-3xl font-light text-white">{location}</h2>
              <p className="text-white/45 text-sm mt-4 leading-6">
                {mapData
                  ? "Explore the property's location through the map below."
                  : "Location details are available upon request."}
              </p>
            </div>

            {mapData && (
              <a
                href={mapData.openUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-fit items-center justify-center border border-[#c9a962]/70 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-[#c9a962] transition-all duration-300 hover:bg-[#c9a962] hover:text-black"
              >
                Open map
              </a>
            )}
          </div>

          <div className="relative h-[320px] lg:h-[360px] overflow-hidden border border-white/10 bg-black">
            {mapData ? (
              <iframe
                src={mapData.embedUrl}
                className="absolute inset-0 h-full w-full border-0 grayscale invert-[0.9] contrast-[0.9] opacity-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${title} location map`}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#070707] text-center text-sm uppercase tracking-[0.25em] text-white/35">
                Location available upon request
              </div>
            )}
          </div>
        </div>
      </section>


      {showPropertyActions && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 border-t border-white/10">
          <div className="bg-[#0b0b0b] border border-white/10 px-6 md:px-10 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <p className="text-[#c9a962] text-[11px] tracking-[0.3em] uppercase mb-3">Private Access</p>
              <h2 className="text-2xl md:text-3xl font-light text-white">Reserve or enquire about {title}</h2>
              <p className="text-white/45 text-sm mt-3 max-w-2xl">Choose the available rental link, view the property's social presence, or send a private purchase interest request to NOCTERRA.</p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 shrink-0">
              {rentUrl && (
                <a
                  href={rentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border border-[#c9a962] bg-[#c9a962] px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-black transition-all duration-300 hover:bg-transparent hover:text-[#c9a962]"
                >
                  Rent it now
                </a>
              )}

              {socialUrl && (
                <a
                  href={socialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border border-white/20 px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-white transition-all duration-300 hover:border-[#c9a962]/70 hover:text-[#c9a962]"
                >
                  View social
                </a>
              )}

              {saleInterestEnabled && (
                <a
                  href={purchaseMailto}
                  className="inline-flex items-center justify-center border border-white/20 px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-white transition-all duration-300 hover:border-[#c9a962]/70 hover:text-[#c9a962]"
                >
                  Interested in buying
                </a>
              )}

              {specialRequestEnabled && (
                <button
                  type="button"
                  onClick={() => setIsSpecialRequestOpen(true)}
                  className="inline-flex items-center justify-center border border-white/20 px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-white transition-all duration-300 hover:border-[#c9a962]/70 hover:text-[#c9a962]"
                >
                  {specialRequestLabel}
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 px-4" onClick={() => setOpen(false)}>
          <button type="button" className="absolute top-5 right-5 sm:top-6 sm:right-6 text-4xl text-white/80 hover:text-white" onClick={() => setOpen(false)}>
            ×
          </button>

          <button
            type="button"
            className="absolute left-3 sm:left-5 text-4xl text-white/80 hover:text-white"
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
          >
            ‹
          </button>

          <ImageWithFallback
            src={safeImage}
            alt={title}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(event) => event.stopPropagation()}
          />

          <button
            type="button"
            className="absolute right-3 sm:right-5 text-4xl text-white/80 hover:text-white"
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
          >
            ›
          </button>
        </div>
      )}
      {isSpecialRequestOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm">
          <div className="w-full max-w-xl border border-[#c9a962]/25 bg-[#070707] p-6 shadow-2xl md:p-8">
            <div className="mb-6 flex items-start justify-between gap-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#c9a962]">Concierge Request</p>
                <h3 className="mt-3 text-2xl font-light tracking-[0.12em] text-white">{title}</h3>
                {location ? <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/45">{location}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => setIsSpecialRequestOpen(false)}
                className="border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/60 transition hover:border-[#c9a962]/60 hover:text-[#c9a962]"
              >
                Close
              </button>
            </div>
            <form onSubmit={submitSpecialRequest} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input required placeholder="Name" value={specialRequestForm.name} onChange={(e) => setSpecialRequestForm((prev) => ({ ...prev, name: e.target.value }))} className="border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#c9a962]/60" />
                <input required type="email" placeholder="Email" value={specialRequestForm.email} onChange={(e) => setSpecialRequestForm((prev) => ({ ...prev, email: e.target.value }))} className="border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#c9a962]/60" />
                <input placeholder="Phone / WhatsApp" value={specialRequestForm.phone} onChange={(e) => setSpecialRequestForm((prev) => ({ ...prev, phone: e.target.value }))} className="border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#c9a962]/60" />
                <input placeholder="Preferred dates" value={specialRequestForm.dates} onChange={(e) => setSpecialRequestForm((prev) => ({ ...prev, dates: e.target.value }))} className="border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#c9a962]/60" />
              </div>
              <textarea required placeholder="Tell us what you would like prepared before arrival..." value={specialRequestForm.message} onChange={(e) => setSpecialRequestForm((prev) => ({ ...prev, message: e.target.value }))} rows={5} className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#c9a962]/60" />
              <button type="submit" className="w-full border border-[#c9a962] bg-[#c9a962] px-6 py-4 text-[10px] uppercase tracking-[0.3em] text-black transition hover:bg-transparent hover:text-[#c9a962]">
                Send Request
              </button>
              <p className="text-center text-[11px] leading-5 text-white/35">Your request will open as a prepared email to our concierge team.</p>
            </form>
          </div>
        </div>
      ) : null}

    </div>
  )
}
