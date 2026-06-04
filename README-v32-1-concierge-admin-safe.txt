NOCTERRA v32.1 Concierge Admin System - SAFE PATCH

This version intentionally installs the Concierge admin management area only.
It DOES NOT modify VillaClient.tsx, villa frontend rendering, subdomain rendering, Special Request modal, hero media, video embed, routing, or existing design.

Reason: v32 caused a runtime ReferenceError in VillaClient.tsx involving isSpecialRequestOpen.
This safe patch avoids that file completely so production stays stable while the admin data model is prepared.

Included:
- app/admin/concierge/page.tsx
- lib/concierge.ts
- Admin dashboard link to /admin/concierge
- database/2026-06-04_create_concierge_items.sql

SQL:
Run the SQL only if it has not already been run. It uses IF NOT EXISTS and is safe to rerun.

Deployment:
cd /home/ubuntu/nocterra-website-clone
git pull origin main
npm run build
pm2 restart nocterra
pm2 list
curl -I https://nocterra.gr

Functional test:
- Open /admin
- Open Concierge
- Add/edit an item
- Confirm public site remains 200 OK

Frontend display of concierge recommendations will be a separate v32.2 patch after the admin is verified stable.
