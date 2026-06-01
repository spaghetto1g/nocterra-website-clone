interface VillaCTAProps {
  title: string
}

export default function VillaCTA({
  title,
}: VillaCTAProps) {
  return (
    <section className="bg-[#111] py-24 px-6 md:px-16 lg:px-24">

      <div className="max-w-5xl mx-auto text-center">

        <span className="text-[#c9a962] text-[11px] tracking-[0.3em] uppercase block mb-6">
          Exclusive Presentation
        </span>

        <h2 className="text-4xl md:text-5xl font-light text-white mb-8">
          Interested in {title}?
        </h2>

        <p className="text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
          Contact NOCTERRA for immersive presentations, cinematic showcases,
          and private luxury property experiences.
        </p>

        <button className="border border-[#c9a962]/60 text-white px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#c9a962]/20 transition-all duration-300">
          Request Private Viewing
        </button>

      </div>
    </section>
  )
}