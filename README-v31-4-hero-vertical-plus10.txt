NOCTERRA v31.4 - Villa Detail Hero Vertical +10%

Purpose:
- Increase the vertical height of the detail-page hero by approximately 10%.
- Applies to all listing detail pages that use app/villas/[slug]/VillaClient.tsx, including slug routes and villa subdomain routes.
- This is a vertical height-only adjustment.

Changed:
- app/villas/[slug]/VillaClient.tsx
  From: h-[70svh] md:h-[80vh]
  To:   h-[77svh] sm:h-[77svh] md:h-[88vh]

Not changed:
- Homepage hero
- Admin panel
- Supabase schema / SQL
- Routing
- Subdomains
- Video Embed section
- Hero Media Mode logic
- Special Request system
- Typography / overlay / navigation / luxury design structure

Deployment:
1. Replace project files from this ZIP in the local GitHub repository.
2. Commit and push to main.
3. On VPS run:

cd /home/ubuntu/nocterra-website-clone

git pull origin main

npm run build

pm2 restart nocterra

pm2 list

curl -I https://nocterra.gr

Rollback:
- Revert this commit in GitHub Desktop or run git revert <commit> on the VPS/local repository, then build and restart PM2.
