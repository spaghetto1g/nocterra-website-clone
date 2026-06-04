NOCTERRA v31.3 — Villa Hero Balanced Height Patch

Purpose:
- Adjusts only the villa detail hero height after v31.2 was too tall.
- Keeps the hero slightly larger than the original baseline, but not full-screen.

Change:
- From v31.2: min-h-[100svh]
- To v31.3: h-[72svh] sm:h-[74svh] md:h-[84vh]

Original reference before v31.2:
- h-[70svh] md:h-[80vh]

Impact:
- Homepage: unchanged
- Admin: unchanged
- Database: unchanged
- Subdomains/routing: unchanged
- Video Embed: unchanged
- Hero Media Mode fields: unchanged
- Mobile video fit behavior: preserved

No SQL required.

Deployment:
cd /home/ubuntu/nocterra-website-clone
git pull origin main
npm run build
pm2 restart nocterra
pm2 list
curl -I https://nocterra.gr
