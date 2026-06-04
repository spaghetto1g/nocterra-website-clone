NOCTERRA v31 - Hero Media Mode

Production-safe extension layer for villa/property hero media.

Adds optional admin fields:
- hero_media_mode: cover | fit | video
- hero_video_url: direct MP4/WebM URL
- hero_video_poster: optional fallback poster image

Default is cover, so all existing villas keep the current hero behavior unless changed manually in admin.

Behavior:
- Cover Image: existing full hero with object-cover and luxury crop.
- Full Image / Fit: shows the full image without crop, with a blurred cinematic background layer to preserve the luxury layout.
- Hero Video: plays native self-hosted MP4/WebM with autoplay, muted, loop, playsInline; falls back to the poster/first hero image if needed.

Recommended video hosting:
Use self-hosted MP4/WebM or CDN URLs to avoid YouTube/Vimeo logos and player chrome.

SQL:
database/2026-06-04_add_hero_media_mode_to_villas.sql
