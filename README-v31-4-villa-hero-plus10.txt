NOCTERRA v31.4 - Villa Hero Controlled +10% Height

Purpose:
- Adjust villa/detail hero height to match the requested small red extra area from the screenshot.
- Keeps the v31.3 balanced layout, but adds a controlled extra height instead of full-screen v31.2.

Change:
- app/villas/[slug]/VillaClient.tsx
- Hero wrapper height changed from h-[72svh] sm:h-[74svh] md:h-[84vh] to h-[76svh] sm:h-[78svh] md:h-[88vh].

Impact:
- No SQL required.
- No admin change.
- No homepage change.
- No routing/subdomain change.
- No special request change.
- Keeps hero video mobile fit behavior and hero media mode.

Deploy:
cd /home/ubuntu/nocterra-website-clone
git pull origin main
npm run build
pm2 restart nocterra
pm2 list
curl -I https://nocterra.gr
