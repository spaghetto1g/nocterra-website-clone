export type SiteSettings = {
  email: string
  instagram_url: string
  whatsapp_url: string
  phone_number: string
  about_title: string
  about_subtitle: string
  about_body_1: string
  about_body_2: string
  contact_title: string
  contact_subtitle: string
  contact_social_description: string
  contact_email_description: string
  contact_whatsapp_description: string
  contact_phone_description: string
  properties_eyebrow: string
  properties_title: string
  properties_description: string
  properties_nav_description: string
  villas_collection_description: string
  stays_collection_description: string
  yachts_collection_description: string
  yachts_coming_soon_description: string
  homepage_section_order: string[]
  homepage_hero_images: string[]
  homepage_hero_tagline: string
  homepage_hero_cta_label: string
  homepage_side_lines: string[]
  homepage_footer_partners: string[]
  homepage_footer_tagline: string
}

export const defaultHomepageOrder = ["hero", "featured", "services"]

export const defaultSiteSettings: SiteSettings = {
  email: "info@nocterra.gr",
  instagram_url: "",
  whatsapp_url: "",
  phone_number: "",
  about_title: "Immersive spaces. Timeless experiences.",
  about_subtitle: "About NOCTERRA",
  about_body_1:
    "NOCTERRA presents luxury villas, residences and private experiences through a cinematic, minimal and immersive digital experience. The platform is designed to let each property breathe, keeping the focus on atmosphere, detail and visual storytelling.",
  about_body_2:
    "Every property page is structured around hero imagery, essential stats, gallery interaction, description and 360 tour support, while keeping the same understated luxury identity across the entire site.",
  contact_title: "Begin your NOCTERRA experience.",
  contact_subtitle:
    "For private stays, curated residences, yacht experiences and investment enquiries, contact the NOCTERRA concierge team.",
  contact_social_description: "Follow NOCTERRA and discover new curated properties and private experiences.",
  contact_email_description: "Send a private enquiry for villas, residences, yacht experiences or investment interest.",
  contact_whatsapp_description: "Start a direct conversation with the NOCTERRA concierge team.",
  contact_phone_description: "Call directly for private consultation and availability details.",
  properties_eyebrow: "Properties",
  properties_title: "Curated luxury properties for immersive stays.",
  properties_description:
    "Explore all active NOCTERRA villas, residences, apartments, suites and future yacht experiences, each presented with cinematic visuals, detailed stats and immersive tour support.",
  properties_nav_description: "Choose an active NOCTERRA collection and jump directly to its curated properties.",
  villas_collection_description:
    "The core NOCTERRA villa collection, always presented first and kept separate from every other category.",
  stays_collection_description:
    "Premium apartments, residences, penthouses and signature suites curated under the same luxury standard.",
  yachts_collection_description:
    "Private yacht and luxury boat experiences with cinematic media, 360 tour support and charter-ready details.",
  yachts_coming_soon_description:
    "A future NOCTERRA collection for private yacht charters, luxury boats, immersive 360 tours, route previews and curated sea experiences.",
  homepage_section_order: defaultHomepageOrder,
  homepage_hero_images: ["/villa-new-1.png", "/villa-new-2.png", "/villa-new-3.png"],
  homepage_hero_tagline: "Immersive Spaces. Timeless Experiences.",
  homepage_hero_cta_label: "Discover Properties",
  homepage_side_lines: ["Immersive", "Luxury", "Visual Storytelling"],
  homepage_footer_partners: ["◎ Insta360", "dji", "◎ KUULA", "◎ ClearPano", "Canon", "A Adobe"],
  homepage_footer_tagline: "Let's create something timeless.",
}

function normalizeStringArray(value: unknown, fallback: string[]) {
  if (Array.isArray(value)) {
    const cleaned = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim())
    return cleaned.length ? cleaned : fallback
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const cleaned = value.split("\n").map((item) => item.trim()).filter(Boolean)
    return cleaned.length ? cleaned : fallback
  }

  return fallback
}

function normalizeSectionOrder(value: unknown) {
  const allowed = new Set(defaultHomepageOrder)
  const raw = normalizeStringArray(value, defaultHomepageOrder).filter((item) => allowed.has(item))
  const merged = [...raw]
  defaultHomepageOrder.forEach((item) => {
    if (!merged.includes(item)) merged.push(item)
  })
  return merged
}

export function normalizeSiteSettings(data: Partial<SiteSettings> | null | undefined): SiteSettings {
  return {
    email: data?.email || defaultSiteSettings.email,
    instagram_url: data?.instagram_url || defaultSiteSettings.instagram_url,
    whatsapp_url: data?.whatsapp_url || defaultSiteSettings.whatsapp_url,
    phone_number: data?.phone_number || defaultSiteSettings.phone_number,
    about_title: data?.about_title || defaultSiteSettings.about_title,
    about_subtitle: data?.about_subtitle || defaultSiteSettings.about_subtitle,
    about_body_1: data?.about_body_1 || defaultSiteSettings.about_body_1,
    about_body_2: data?.about_body_2 || defaultSiteSettings.about_body_2,
    contact_title: data?.contact_title || defaultSiteSettings.contact_title,
    contact_subtitle: data?.contact_subtitle || defaultSiteSettings.contact_subtitle,
    contact_social_description: data?.contact_social_description || defaultSiteSettings.contact_social_description,
    contact_email_description: data?.contact_email_description || defaultSiteSettings.contact_email_description,
    contact_whatsapp_description: data?.contact_whatsapp_description || defaultSiteSettings.contact_whatsapp_description,
    contact_phone_description: data?.contact_phone_description || defaultSiteSettings.contact_phone_description,
    properties_eyebrow: data?.properties_eyebrow || defaultSiteSettings.properties_eyebrow,
    properties_title: data?.properties_title || defaultSiteSettings.properties_title,
    properties_description: data?.properties_description || defaultSiteSettings.properties_description,
    properties_nav_description: data?.properties_nav_description || defaultSiteSettings.properties_nav_description,
    villas_collection_description: data?.villas_collection_description || defaultSiteSettings.villas_collection_description,
    stays_collection_description: data?.stays_collection_description || defaultSiteSettings.stays_collection_description,
    yachts_collection_description: data?.yachts_collection_description || defaultSiteSettings.yachts_collection_description,
    yachts_coming_soon_description: data?.yachts_coming_soon_description || defaultSiteSettings.yachts_coming_soon_description,
    homepage_section_order: normalizeSectionOrder(data?.homepage_section_order),
    homepage_hero_images: normalizeStringArray(data?.homepage_hero_images, defaultSiteSettings.homepage_hero_images),
    homepage_hero_tagline: data?.homepage_hero_tagline || defaultSiteSettings.homepage_hero_tagline,
    homepage_hero_cta_label: data?.homepage_hero_cta_label || defaultSiteSettings.homepage_hero_cta_label,
    homepage_side_lines: normalizeStringArray(data?.homepage_side_lines, defaultSiteSettings.homepage_side_lines),
    homepage_footer_partners: normalizeStringArray(data?.homepage_footer_partners, defaultSiteSettings.homepage_footer_partners),
    homepage_footer_tagline: data?.homepage_footer_tagline || defaultSiteSettings.homepage_footer_tagline,
  }
}
