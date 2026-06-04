-- NOCTERRA production-safe migration
-- Adds an optional admin-managed video embed field to public property pages.
-- Empty/null values remain hidden on the frontend.

alter table public.villas
add column if not exists video_embed text;

comment on column public.villas.video_embed is
'Optional video embed for NOCTERRA property pages. Supports YouTube/Vimeo URLs, iframe embed code, and direct MP4/WebM URLs. Empty values are hidden.';
