interface VillaLocationProps {
  location?: string
  coordinates?: {
    lat?: number
    lng?: number
  }
}

export default function VillaLocation({
  location,
  coordinates,
}: VillaLocationProps) {
  return (
    <section className="py-16 md:py-24 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <p className="text-[#C6A66B] uppercase tracking-[0.3em] text-xs mb-6">
              Location
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-6xl font-light text-white mb-8">
              {location || "Luxury Destination"}
            </h2>

            <p className="text-white/60 text-base md:text-lg leading-relaxed">
              Positioned in one of the world’s most breathtaking landscapes,
              offering privacy, cinematic architecture, and immersive luxury
              experiences.
            </p>
          </div>

          <div className="border border-white/10 bg-[#0A0A0A] p-5 sm:p-7 md:p-10 rounded-sm">
            <div className="space-y-6">
              <div>
                <p className="text-white/40 uppercase tracking-[0.2em] text-xs mb-2">
                  Destination
                </p>

                <p className="text-white text-xl">
                  {location || "Unknown Location"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                <div>
                  <p className="text-white/40 uppercase tracking-[0.2em] text-xs mb-2">
                    Latitude
                  </p>

                  <p className="text-white">
                    {coordinates?.lat || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-white/40 uppercase tracking-[0.2em] text-xs mb-2">
                    Longitude
                  </p>

                  <p className="text-white">
                    {coordinates?.lng || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}