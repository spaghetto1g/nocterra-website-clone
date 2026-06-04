NOCTERRA v32 - Concierge Admin System

Production-safe feature extension. No redesign.

Adds:
- Admin dashboard card: Concierge
- New protected admin route: /admin/concierge
- Curated concierge item management
- Fixed luxury categories:
  Restaurants
  VIP Transport
  Yacht Charter
  Private Chef
  Wellness
  Massage
  Helicopter
  Security
  Custom Experiences
- Optional targeting by property type
- Optional targeting by specific villa/property IDs
- Frontend concierge section appears only when active matching items exist
- If no matching active items exist, nothing appears

Database:
Run database/2026-06-04_create_concierge_items.sql in Supabase SQL editor before using admin concierge.

Deployment:
1. Extract ZIP into local repo.
2. Confirm changed files in GitHub Desktop.
3. Commit and push.
4. On VPS:
   cd /home/ubuntu/nocterra-website-clone
   git pull origin main
   npm run build
   pm2 restart nocterra
   pm2 list
   curl -I https://nocterra.gr

Rollback:
- Revert GitHub commit and pull/rebuild/restart.
- DB table can remain safely unused.
- If needed later: drop table public.concierge_items;

Impact:
- Homepage unchanged
- Villa/property detail design extended only when concierge items exist
- Existing villas remain unchanged until active concierge items are added
- Admin properties/villas/media/settings unchanged
- Subdomains use the same concierge matching logic
- No changes to special request, video embed, hero media, routing, SSL, PM2 or Nginx
