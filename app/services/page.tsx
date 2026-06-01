import Header from "@/components/header"
import Services from "@/components/services"
import Footer from "@/components/footer"

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <section className="pt-36">
        <Services />
      </section>
      <Footer />
    </main>
  )
}
