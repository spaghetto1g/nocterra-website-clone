import Header from "@/components/header"
import Footer from "@/components/footer"
import { getSiteSettings } from "@/lib/site-settings"
import { Instagram, Mail, MessageCircle, Phone } from "lucide-react"

function phoneHref(phone: string) {
  const cleaned = phone.replace(/[^+\d]/g, "")
  return cleaned ? `tel:${cleaned}` : ""
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  const contactOptions = [
    {
      title: "Social",
      description: settings.contact_social_description,
      href: settings.instagram_url,
      label: "Open Instagram",
      icon: Instagram,
      enabled: Boolean(settings.instagram_url),
    },
    {
      title: "Email",
      description: settings.contact_email_description,
      href: `mailto:${settings.email}`,
      label: settings.email,
      icon: Mail,
      enabled: Boolean(settings.email),
    },
    {
      title: "WhatsApp",
      description: settings.contact_whatsapp_description,
      href: settings.whatsapp_url,
      label: "Open WhatsApp",
      icon: MessageCircle,
      enabled: Boolean(settings.whatsapp_url),
    },
    {
      title: "Direct Call",
      description: settings.contact_phone_description,
      href: phoneHref(settings.phone_number),
      label: settings.phone_number || "Call NOCTERRA",
      icon: Phone,
      enabled: Boolean(settings.phone_number),
    },
  ]

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />
      <section className="pt-32 sm:pt-40 pb-24 md:pb-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl mb-10 md:mb-16">
            <p className="text-[#c9a962] uppercase tracking-[0.4em] text-xs mb-5 opacity-80">Contact</p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-light leading-tight mb-6 md:mb-8">{settings.contact_title}</h1>
            <p className="text-white/55 leading-relaxed text-base sm:text-lg max-w-3xl">{settings.contact_subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {contactOptions.map((option) => {
              const Icon = option.icon

              return option.enabled ? (
                <a
                  key={option.title}
                  href={option.href}
                  target={option.href.startsWith("http") ? "_blank" : undefined}
                  rel={option.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group min-h-[230px] sm:min-h-[260px] rounded-2xl border border-white/10 bg-[#0f0f0f] p-7 hover:border-[#c9a962]/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-12 w-12 rounded-full border border-[#c9a962]/30 flex items-center justify-center text-[#c9a962] mb-8">
                      <Icon size={20} />
                    </div>
                    <h2 className="text-2xl font-light mb-4">{option.title}</h2>
                    <p className="text-white/45 text-sm leading-relaxed">{option.description}</p>
                  </div>
                  <span className="mt-8 text-[#c9a962] text-xs uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                    {option.label}
                  </span>
                </a>
              ) : (
                <div
                  key={option.title}
                  className="min-h-[230px] sm:min-h-[260px] rounded-2xl border border-white/5 bg-[#0f0f0f]/40 p-7 opacity-45 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-white/30 mb-8">
                      <Icon size={20} />
                    </div>
                    <h2 className="text-2xl font-light mb-4">{option.title}</h2>
                    <p className="text-white/35 text-sm leading-relaxed">This contact channel can be enabled from the admin settings.</p>
                  </div>
                  <span className="mt-8 text-white/25 text-xs uppercase tracking-[0.2em]">Not configured</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
