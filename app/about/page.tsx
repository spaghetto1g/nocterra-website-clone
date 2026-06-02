import Header from "@/components/header"
import Footer from "@/components/footer"
import { getSiteSettings } from "@/lib/site-settings"

export default async function AboutPage() {
  const settings = await getSiteSettings()

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <section className="pt-32 sm:pt-40 pb-24 md:pb-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <p className="text-[#c9a962] uppercase tracking-[0.4em] text-xs mb-5 opacity-80">{settings.about_subtitle}</p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-light leading-tight">{settings.about_title}</h1>
          </div>
          <div className="space-y-6 text-white/55 leading-relaxed pt-4">
            <p>{settings.about_body_1}</p>
            <p>{settings.about_body_2}</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
