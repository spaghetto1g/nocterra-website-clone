NOCTERRA v31.1 — Hero Video Mobile Fit Patch

Purpose:
- Fixes Hero Video behavior on mobile so drone footage is displayed 100% without crop/zoom.
- Desktop remains cinematic cover behavior.
- Mobile uses object-contain with black luxury background.

Impact:
- No database changes.
- No admin changes.
- No routing changes.
- No subdomain changes.
- No change to regular Hero Cover Image.
- No change to Hero Fit Image.
- No change to Video Embed section.

Changed file:
- app/villas/[slug]/VillaClient.tsx

Deployment:
1. Replace project files with this ZIP content.
2. Commit + Push to GitHub.
3. On VPS:
   cd /home/ubuntu/nocterra-website-clone
   git pull origin main
   npm run build
   pm2 restart nocterra
   pm2 list
   curl -I https://nocterra.gr

Test:
- Set Hero Media Mode = Video.
- Use a direct MP4/WebM URL.
- On mobile, video should show complete frame without crop.
- On desktop, video keeps full hero cinematic behavior.
