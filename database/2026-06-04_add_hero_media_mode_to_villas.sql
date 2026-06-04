alter table public.villas
add column if not exists hero_media_mode text default 'cover';

alter table public.villas
add column if not exists hero_video_url text;

alter table public.villas
add column if not exists hero_video_poster text;

update public.villas
set hero_media_mode = 'cover'
where hero_media_mode is null;
