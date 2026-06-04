# NOCTERRA v30 — Optional Video Embed

## What changed

Adds an optional `video_embed` field for villas/properties.

Public property pages now render a luxury responsive video section below the existing About / 360 area only when `video_embed` has a valid value.

## Supported values

- YouTube watch URL
- YouTube embed URL
- YouTube shorts URL
- Vimeo URL
- Vimeo player URL
- iframe embed code from YouTube/Vimeo
- direct MP4 / WebM / OGG / MOV URL

## Hidden behavior

If `video_embed` is empty, null, or invalid, nothing is rendered on the public page.

## Database migration

Run this in Supabase SQL editor before deploying the code:

```sql
alter table public.villas
add column if not exists video_embed text;

comment on column public.villas.video_embed is
'Optional video embed for NOCTERRA property pages. Supports YouTube/Vimeo URLs, iframe embed code, and direct MP4/WebM URLs. Empty values are hidden.';
```

## Files changed

- `lib/villas.ts`
- `lib/vila-safe-ts`
- `app/villas/[slug]/VillaClient.tsx`
- `app/admin/components/VillaForm.tsx`
- `app/admin/properties/new/page.tsx`
- `app/admin/properties/edit/[id]/page.tsx`
- `database/2026-06-04_add_video_embed_to_villas.sql`

## Production impact

- No redesign
- No route changes
- No subdomain changes
- No special request changes
- No hero media changes
- No favicon changes
- Backward compatible if SQL is applied before deployment
