NOCTERRA v30 - Video Embed

Production-safe update adding an optional admin-managed video_embed field to villas.

Included:
- Admin VillaForm field: Video Embed
- New/edit villa save support
- Public villa/subdomain render support
- Hidden when empty/null
- Responsive luxury aspect-ratio frame
- YouTube URL, Vimeo URL, iframe src/embed, MP4/WebM support

Required Supabase SQL before saving video values:
alter table public.villas
add column if not exists video_embed text;

Deploy:
1. Upload source to /home/ubuntu/nocterra-website-clone
2. Run Supabase SQL above
3. cd /home/ubuntu/nocterra-website-clone
4. npm run build
5. pm2 restart nocterra
6. pm2 list && pm2 logs nocterra --lines 50
7. Test admin edit/new villa, empty field hidden, populated field visible.

Rollback:
- Restore previous source checkpoint and run npm run build && pm2 restart nocterra.
- DB column can remain safely unused; no rollback needed for database.
