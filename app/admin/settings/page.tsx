import { createClient } from "@/lib/supabase/server"
import { defaultSiteSettings, normalizeSiteSettings, type SiteSettings } from "@/lib/site-settings-shared"
import SettingsClient from "./SettingsClient"

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let settings: SiteSettings = defaultSiteSettings

  try {
    const { data } = await supabase
      .from("site_settings")
      .select(
        "email, instagram_url, whatsapp_url, phone_number, about_title, about_subtitle, about_body_1, about_body_2, contact_title, contact_subtitle, contact_social_description, contact_email_description, contact_whatsapp_description, contact_phone_description, properties_eyebrow, properties_title, properties_description, properties_nav_description, villas_collection_description, stays_collection_description, yachts_collection_description, yachts_coming_soon_description"
      )
      .eq("id", true)
      .maybeSingle()

    settings = normalizeSiteSettings(data)
  } catch {
    settings = defaultSiteSettings
  }

  return <SettingsClient initialSettings={settings} userEmail={user?.email} />
}
