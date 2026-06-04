-- NOCTERRA v30 - Optional property video embed
-- Safe, backward-compatible migration. Existing villas remain unchanged.
alter table public.villas
add column if not exists video_embed text;

comment on column public.villas.video_embed is 'Optional video embed for public villa pages. Supports YouTube, Vimeo, iframe embed, MP4/WebM URL. Empty/null stays hidden.';
