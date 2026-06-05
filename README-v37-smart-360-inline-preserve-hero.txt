NOCTERRA v37 - Smart 360 Inline Preserve Hero

Changes:
- Restores original inline behavior for direct 360 links.
- Supports pasted iframe embed code by extracting src and rendering inline.
- Keeps image URL preview behavior.
- Preserves existing Hero Media options in Admin: Cover / Full Image / Hero Video.
- No redesign. No layout changes. No special request changes. No subdomain changes.

Deployment:
cd ~/nocterra-website-clone
git pull
rm -rf .next
npm install
npm run build
pm2 restart nocterra --update-env
