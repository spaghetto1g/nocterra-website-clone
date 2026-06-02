import Header from "@/components/header"
import FeaturedProperties from "@/components/featured-properties"
import Footer from "@/components/footer"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <section className="pt-24">
        <FeaturedProperties />
      </section>
      <Footer />
    </main>
  )
}
