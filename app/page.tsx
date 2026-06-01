import Header from "@/components/header"
import Hero from "@/components/hero"
import FeaturedProperties from "@/components/featured-properties"
import Services from "@/components/services"
import Footer from "@/components/footer"
import { getSiteSettings } from "@/lib/site-settings"

export default async function Home() {
  const settings = await getSiteSettings()

  const sections = {
    hero: (
      <Hero
        key="hero"
        images={settings.homepage_hero_images}
        tagline={settings.homepage_hero_tagline}
        ctaLabel={settings.homepage_hero_cta_label}
        sideLines={settings.homepage_side_lines}
      />
    ),
    featured: <FeaturedProperties key="featured" />,
    services: <Services key="services" />,
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />
      {settings.homepage_section_order.map((section) => sections[section as keyof typeof sections]).filter(Boolean)}
      <Footer partners={settings.homepage_footer_partners} tagline={settings.homepage_footer_tagline} />
    </main>
  )
}
