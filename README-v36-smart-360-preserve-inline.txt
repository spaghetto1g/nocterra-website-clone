NOCTERRA v36 - Smart 360 Preserve Inline Behavior

Purpose:
- Restore the previous behavior where a normal 360 tour link loads inline inside the existing 360 frame.
- Keep the new smart support for iframe embed code.
- Do not alter hero media/admin design/layout/subdomains/special requests/video embed.

Behavior:
- iframe embed code -> extracts src and renders inline.
- normal http/https 360 link -> renders inline in the existing iframe frame, like before.
- image URL -> renders as preview image.
- invalid/empty -> existing fallback remains.

Deployment:
cd ~/nocterra-website-clone
git pull
rm -rf .next
npm install
npm run build
pm2 restart nocterra --update-env
