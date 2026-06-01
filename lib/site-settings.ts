import { createClient } from "@/lib/supabase/server"
import {
  defaultSiteSettings,
  normalizeSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings-shared"

export { defaultSiteSettings, type SiteSettings } from "@/lib/site-settings-shared"

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select(
        "email, instagram_url, whatsapp_url, phone_number, about_title, about_subtitle, about_body_1, about_body_2, contact_title, contact_subtitle, contact_social_description, contact_email_description, contact_whatsapp_description, contact_phone_description, properties_eyebrow, properties_title, properties_description, properties_nav_description, villas_collection_description, stays_collection_description, yachts_collection_description, yachts_coming_soon_description, homepage_section_order, homepage_hero_images, homepage_hero_tagline, homepage_hero_cta_label, homepage_side_lines, homepage_footer_partners, homepage_footer_tagline"
      )
      .eq("id", true)
      .maybeSingle()

    if (error) {
      return defaultSiteSettings
    }

    return normalizeSiteSettings(data)
  } catch {
    return defaultSiteSettings
  }
}
