NOCTERRA v31.2 - Villa Hero Homepage Height Match

Scope:
- Matches villa detail hero wrapper height/aspect behavior to the homepage hero baseline.
- Changes only app/villas/[slug]/VillaClient.tsx.
- No database changes.
- No admin changes.
- No routing/subdomain/special request/video embed changes.

Changed:
- Villa hero wrapper changed from fixed 70svh/mobile and 80vh/desktop height to min-h-[100svh], matching the homepage hero architecture.

Expected result:
- Villa hero appears with the same full-screen luxury hero proportion as homepage.
- Existing Hero Media Mode remains unchanged:
  - Cover Image remains cover.
  - Fit Image remains contain with background layer.
  - Hero Video remains desktop cinematic and mobile full-frame from v31.1.

Deployment:
No SQL required. Commit/push, then on VPS run:

cd /home/ubuntu/nocterra-website-clone
git pull origin main
npm run build
pm2 restart nocterra
pm2 list
curl -I https://nocterra.gr
