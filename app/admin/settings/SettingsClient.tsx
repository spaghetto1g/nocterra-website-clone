"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { defaultSiteSettings, normalizeSiteSettings, type SiteSettings } from "@/lib/site-settings-shared"

type Props = {
  initialSettings: SiteSettings
  userEmail?: string | null
}

function cleanUrl(value: string | null | undefined) {
  const trimmed = String(value || "").trim()
  if (!trimmed) return ""
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("tel:") || trimmed.startsWith("mailto:")) {
    return trimmed
  }
  return `https://${trimmed}`
}

function textValue(value: string | null | undefined) {
  return value || ""
}

function linesValue(value: string[] | null | undefined) {
  return Array.isArray(value) ? value.join("\n") : ""
}

function parseLines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean)
}

const sectionLabels: Record<string, string> = {
  hero: "Hero",
  featured: "Featured Properties",
  services: "Services",
}

function moveItem(items: string[], from: number, to: number) {
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export default function SettingsClient({ initialSettings, userEmail }: Props) {
  const supabase = useMemo(() => createClient(), [])
  const [settings, setSettings] = useState<SiteSettings>(() => normalizeSiteSettings(initialSettings))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  function updateField<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }))
  }

  function updateStringArrayField(key: "homepage_hero_images" | "homepage_side_lines" | "homepage_footer_partners", value: string) {
    setSettings((current) => ({ ...current, [key]: parseLines(value) }))
  }

  function moveHomepageSection(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= settings.homepage_section_order.length) return
    updateField("homepage_section_order", moveItem(settings.homepage_section_order, index, target))
  }

  function removeHeroImage(image: string) {
    updateField("homepage_hero_images", settings.homepage_hero_images.filter((item) => item !== image))
  }

  async function uploadHomepageHeroImages(files: FileList | null) {
    if (!files?.length) return
    setSaving(true)
    setMessage("")

    const uploaded: string[] = []

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")
      const path = `homepage/hero/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}.${extension}`.replace(`.${extension}.${extension}`, `.${extension}`)

      const { error } = await supabase.storage.from("villa-images").upload(path, file, { upsert: false })
      if (error) {
        setMessage(error.message)
        setSaving(false)
        return
      }

      const { data } = supabase.storage.from("villa-images").getPublicUrl(path)
      if (data.publicUrl) uploaded.push(data.publicUrl)
    }

    if (uploaded.length) {
      updateField("homepage_hero_images", [...settings.homepage_hero_images, ...uploaded])
      setMessage("Homepage hero image uploaded. Press Save Settings to store it.")
    }

    setSaving(false)
  }

  async function handleSave() {
    setSaving(true)
    setMessage("")

    const payload: SiteSettings & { id: boolean; updated_at: string } = {
      ...settings,
      email: textValue(settings.email).trim() || defaultSiteSettings.email,
      instagram_url: cleanUrl(settings.instagram_url),
      whatsapp_url: cleanUrl(settings.whatsapp_url),
      phone_number: textValue(settings.phone_number).trim(),
      id: true,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("site_settings").upsert(payload, { onConflict: "id" })

    if (error) {
      setMessage(error.message)
      setSaving(false)
      return
    }

    setSettings(payload)
    setMessage("Settings saved successfully.")
    setSaving(false)
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-white mb-2">Settings</h1>
          <p className="text-white/40 text-sm">Manage homepage, contact links, about content and public page details.</p>
        </div>
        <Link href="/admin" className="inline-flex items-center gap-2 border border-white/10 px-4 py-3 rounded-lg text-white/60 text-xs uppercase tracking-[0.2em] hover:text-[#c9a962] hover:border-[#c9a962]/40 transition-colors">
          <ArrowLeft size={14} />
          Admin Home
        </Link>
      </div>

      <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-8">
        <h2 className="text-white text-lg font-light mb-6">Account</h2>
        <div>
          <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Logged in as</label>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white/60 text-sm">
            {userEmail || "Authenticated admin"}
          </div>
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-8">
        <h2 className="text-white text-lg font-light mb-2">Homepage Configuration</h2>
        <p className="text-white/40 text-sm mb-8">Control only homepage content/order. The existing visual design remains unchanged.</p>

        <div className="space-y-8">
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-3">Homepage Section Order</label>
            <div className="space-y-3">
              {settings.homepage_section_order.map((section, index) => (
                <div key={section} className="flex items-center justify-between gap-4 bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3">
                  <span className="text-white/80 text-sm">{index + 1}. {sectionLabels[section] || section}</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => moveHomepageSection(index, -1)} disabled={index === 0} className="border border-white/10 px-3 py-2 text-white/50 text-xs rounded disabled:opacity-25 hover:text-[#c9a962]">Up</button>
                    <button type="button" onClick={() => moveHomepageSection(index, 1)} disabled={index === settings.homepage_section_order.length - 1} className="border border-white/10 px-3 py-2 text-white/50 text-xs rounded disabled:opacity-25 hover:text-[#c9a962]">Down</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Homepage Hero Images</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {settings.homepage_hero_images.map((image, index) => (
                <div key={`${image}-${index}`} className="border border-white/10 rounded-lg overflow-hidden bg-[#1a1a1a]">
                  <div className="relative aspect-video bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={`Homepage hero ${index + 1}`} className="h-full w-full object-cover" />
                  </div>
                  <button type="button" onClick={() => removeHeroImage(image)} className="w-full px-3 py-2 text-xs text-white/50 hover:text-red-300 transition-colors">Remove from carousel</button>
                </div>
              ))}
            </div>
            <label className="inline-flex items-center gap-2 border border-[#c9a962]/40 text-[#c9a962] px-4 py-3 rounded-lg text-xs uppercase tracking-[0.2em] cursor-pointer hover:bg-[#c9a962]/10 transition-colors">
              <Upload size={14} />
              Upload Hero Images
              <input type="file" accept="image/*" multiple className="hidden" onChange={(event) => uploadHomepageHeroImages(event.target.files)} />
            </label>
            <textarea
              value={linesValue(settings.homepage_hero_images)}
              onChange={(event) => updateStringArrayField("homepage_hero_images", event.target.value)}
              rows={4}
              className="mt-4 w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
            <p className="text-white/35 text-xs mt-2">One URL per line. If you add a 4th image, the right-side 01/02/03/04 pagination updates automatically.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Hero Tagline</label>
              <input value={textValue(settings.homepage_hero_tagline)} onChange={(event) => updateField("homepage_hero_tagline", event.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors" />
            </div>
            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Hero Button Text</label>
              <input value={textValue(settings.homepage_hero_cta_label)} onChange={(event) => updateField("homepage_hero_cta_label", event.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Hero Left Side Lines</label>
            <textarea value={linesValue(settings.homepage_side_lines)} onChange={(event) => updateStringArrayField("homepage_side_lines", event.target.value)} rows={3} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors" />
          </div>

          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Footer / Bottom Partner Line</label>
            <textarea value={linesValue(settings.homepage_footer_partners)} onChange={(event) => updateStringArrayField("homepage_footer_partners", event.target.value)} rows={5} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors" />
            <p className="text-white/35 text-xs mt-2">One item per line. Examples: ◎ Insta360, dji, Canon, A Adobe.</p>
          </div>

          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Footer Tagline</label>
            <input value={textValue(settings.homepage_footer_tagline)} onChange={(event) => updateField("homepage_footer_tagline", event.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors" />
          </div>
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-8">
        <h2 className="text-white text-lg font-light mb-6">Contact Channels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Email</label>
            <input
              value={textValue(settings.email)}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="info@nocterra.gr"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Instagram / Social URL</label>
            <input
              value={textValue(settings.instagram_url)}
              onChange={(event) => updateField("instagram_url", event.target.value)}
              placeholder="https://instagram.com/nocterra"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">WhatsApp Link</label>
            <input
              value={textValue(settings.whatsapp_url)}
              onChange={(event) => updateField("whatsapp_url", event.target.value)}
              placeholder="https://wa.me/306900000000"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Direct Call Number</label>
            <input
              value={textValue(settings.phone_number)}
              onChange={(event) => updateField("phone_number", event.target.value)}
              placeholder="+30 690 000 0000"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-8">
        <h2 className="text-white text-lg font-light mb-6">Contact Page Text</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Contact Title</label>
            <input
              value={textValue(settings.contact_title)}
              onChange={(event) => updateField("contact_title", event.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Contact Description</label>
            <textarea
              value={textValue(settings.contact_subtitle)}
              onChange={(event) => updateField("contact_subtitle", event.target.value)}
              rows={4}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Social Card Paragraph</label>
            <textarea
              value={textValue(settings.contact_social_description)}
              onChange={(event) => updateField("contact_social_description", event.target.value)}
              rows={3}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Email Card Paragraph</label>
            <textarea
              value={textValue(settings.contact_email_description)}
              onChange={(event) => updateField("contact_email_description", event.target.value)}
              rows={3}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">WhatsApp Card Paragraph</label>
            <textarea
              value={textValue(settings.contact_whatsapp_description)}
              onChange={(event) => updateField("contact_whatsapp_description", event.target.value)}
              rows={3}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Direct Call Card Paragraph</label>
            <textarea
              value={textValue(settings.contact_phone_description)}
              onChange={(event) => updateField("contact_phone_description", event.target.value)}
              rows={3}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-8">
        <h2 className="text-white text-lg font-light mb-6">About Page Text</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Small Label</label>
            <input
              value={textValue(settings.about_subtitle)}
              onChange={(event) => updateField("about_subtitle", event.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Main Title</label>
            <input
              value={textValue(settings.about_title)}
              onChange={(event) => updateField("about_title", event.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Paragraph 1</label>
            <textarea
              value={textValue(settings.about_body_1)}
              onChange={(event) => updateField("about_body_1", event.target.value)}
              rows={4}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Paragraph 2</label>
            <textarea
              value={textValue(settings.about_body_2)}
              onChange={(event) => updateField("about_body_2", event.target.value)}
              rows={4}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
        </div>
      </div>



      <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-8">
        <h2 className="text-white text-lg font-light mb-6">Properties Page Text</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Top Small Label</label>
            <input
              value={textValue(settings.properties_eyebrow)}
              onChange={(event) => updateField("properties_eyebrow", event.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Main Title</label>
            <input
              value={textValue(settings.properties_title)}
              onChange={(event) => updateField("properties_title", event.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Intro Paragraph</label>
            <textarea
              value={textValue(settings.properties_description)}
              onChange={(event) => updateField("properties_description", event.target.value)}
              rows={4}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Collection Navigation Paragraph</label>
            <textarea
              value={textValue(settings.properties_nav_description)}
              onChange={(event) => updateField("properties_nav_description", event.target.value)}
              rows={3}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Villas Collection Paragraph</label>
            <textarea
              value={textValue(settings.villas_collection_description)}
              onChange={(event) => updateField("villas_collection_description", event.target.value)}
              rows={3}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Apartments & Suites Collection Paragraph</label>
            <textarea
              value={textValue(settings.stays_collection_description)}
              onChange={(event) => updateField("stays_collection_description", event.target.value)}
              rows={3}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Yachts Collection Paragraph</label>
            <textarea
              value={textValue(settings.yachts_collection_description)}
              onChange={(event) => updateField("yachts_collection_description", event.target.value)}
              rows={3}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Yachts Coming Soon Paragraph</label>
            <textarea
              value={textValue(settings.yachts_coming_soon_description)}
              onChange={(event) => updateField("yachts_coming_soon_description", event.target.value)}
              rows={3}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a962]/50 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#c9a962] text-black px-6 py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {message && <p className="text-sm text-white/55">{message}</p>}
      </div>
    </div>
  )
}
