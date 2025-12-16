# PWA Icons Required

To complete the PWA setup, you need to create the following icon files and place them in the `/public/` directory:

## Required Icons

### Minimum Requirements (MUST HAVE):
- **icon-192.png** (192×192px) - Android Chrome standard icon
- **icon-512.png** (512×512px) - Android Chrome splash screen icon

These two icons are the minimum required for PWA installation on Android devices.

## Icon Design Guidelines

1. **Simple & Recognizable**: Use a clear logo that works at small sizes
2. **Safe Zone**: Leave 10-20% padding around edges for maskable icons
3. **Solid Background**: Avoid transparency (required for maskable icons on Android)
4. **Consistent Branding**: Match your app's theme colors

## Recommended Design for Human Operations

Since Human Operations has a brutalist/minimalist aesthetic:
- Use a simple geometric icon or monogram (e.g., "HO" or "H")
- Black or dark grey icon on white background (light mode)
- White icon on black background (dark mode alternative)
- Consider using corner brackets motif from your UI: ⌜H⌟ or similar

## How to Create Icons

### Option 1: Use an Icon Generator (Easiest)
1. Visit https://www.pwabuilder.com/imageGenerator
2. Upload a square logo (at least 512×512px)
3. Download the generated icon pack
4. Copy icon-192.png and icon-512.png to /public/

### Option 2: Use Figma/Photoshop
1. Create a 512×512px artboard
2. Design your icon with 20% padding (safe zone)
3. Export as PNG:
   - 192×192px → icon-192.png
   - 512×512px → icon-512.png
4. Place files in /public/

### Option 3: CLI Tool (For Developers)
```bash
npm install -g @pwa-builder/pwa-asset-generator

# Generate icons from a source image
pwa-asset-generator logo.svg ./public --manifest manifest.json
```

## Current Status

❌ **Icons are missing** - The app will build but won't be installable until you add:
- /public/icon-192.png
- /public/icon-512.png

After adding icons, rebuild the app:
```bash
npm run build
npm run start
```

## Testing

Once icons are in place:
1. Build the app: `npm run build && npm run start`
2. Open Chrome DevTools → Application → Manifest
3. Verify icons appear correctly
4. Test installation on mobile device
