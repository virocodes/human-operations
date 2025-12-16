# Progressive Web App (PWA) Setup

Human Operations is now configured as a Progressive Web App! This allows users to install the app on their phones and computers for a native app-like experience.

## What's Been Configured

✅ **Service Worker** - Auto-generated for offline caching
✅ **Web App Manifest** - Defines app metadata and install behavior
✅ **PWA Metadata** - Apple-specific tags for iOS support
✅ **Offline Page** - Fallback when user loses connection
✅ **Install Prompt** - Custom UI for app installation
✅ **TypeScript Support** - Proper types for service worker APIs

## Installation Flow

### Desktop (Chrome/Edge)
1. Visit the app in browser
2. Look for install icon in address bar (⊕)
3. Click to install as desktop app

### Android
1. Visit app in Chrome
2. Tap "Add to Home Screen" from menu
3. Or use the in-app install prompt

### iOS (Safari)
1. Visit app in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. Note: iOS has limited PWA support (no service worker background features)

## Features

### Works Offline
- Static assets (CSS, JS, images) are cached
- Previously visited pages load offline
- API responses cached for 24 hours
- Shows offline page for uncached routes

### Native App Experience
- Launches in standalone mode (no browser UI)
- Custom splash screen
- Appears in app drawer/home screen
- Receives app-level permissions

### Automatic Updates
- New version activates on page refresh
- No user action required

## Testing Your PWA

### 1. Build for Production
PWA features are disabled in development mode to avoid caching issues.

```bash
# Build the app
npm run build

# Start production server
npm run start
```

### 2. Test Installation
- Open http://localhost:3000 in Chrome
- Look for install icon in address bar
- Click to install and test

### 3. Run Lighthouse Audit
```bash
# Chrome DevTools
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Progressive Web App"
4. Click "Generate report"
```

**Target Score**: 90+ for full PWA compliance

### 4. Test Offline Mode
```bash
# Chrome DevTools
1. Open DevTools (F12)
2. Go to "Network" tab
3. Check "Offline" checkbox
4. Refresh page
5. Navigate to previously visited pages
```

## Required: Create Icons

⚠️ **Action Required** - You must create PWA icons before the app is installable.

See `/public/ICONS_README.md` for detailed instructions.

**Quick Start:**
1. Visit https://www.pwabuilder.com/imageGenerator
2. Upload a 512×512px logo
3. Download generated icons
4. Copy `icon-192.png` and `icon-512.png` to `/public/`
5. Rebuild the app

## Deployment Checklist

Before deploying to production:

- [ ] Create icon-192.png and icon-512.png
- [ ] Test installation on Android device
- [ ] Test installation on iOS device (Safari)
- [ ] Run Lighthouse PWA audit (score 90+)
- [ ] Test offline functionality
- [ ] Verify manifest loads correctly
- [ ] Test update mechanism
- [ ] Check app appears in app drawer

## Configuration Files

### `/next.config.ts`
- PWA wrapper configuration
- Service worker settings
- Caching disabled in dev mode

### `/app/manifest.ts`
- App name and description
- Icons and display mode
- Theme colors
- Start URL and scope

### `/app/layout.tsx`
- PWA metadata tags
- Apple Web App settings
- Viewport configuration

### `/components/InstallPrompt.tsx`
- Custom install UI
- User-friendly installation flow
- Dismissible with localStorage

### `/app/offline/page.tsx`
- Fallback page when offline
- Consistent with app aesthetic
- Retry functionality

## Customization

### Update App Info
Edit `/app/manifest.ts`:
```typescript
{
  name: 'Your App Name',
  short_name: 'ShortName', // Max 12 chars
  description: 'Your description',
  theme_color: '#000000', // Your primary color
  background_color: '#ffffff' // Splash screen bg
}
```

### Modify Caching Strategy
Edit `/next.config.ts` caching rules:
- **CacheFirst**: Check cache, then network (static assets)
- **NetworkFirst**: Try network, fallback to cache (dynamic pages)
- **StaleWhileRevalidate**: Return cache, update in background

### Add Install Prompt to UI
Add to any page:
```tsx
import { InstallPrompt } from '@/components/InstallPrompt'

export default function Page() {
  return (
    <>
      <InstallPrompt />
      {/* your content */}
    </>
  )
}
```

## Troubleshooting

### "Not installable" error
- Ensure icons exist (icon-192.png, icon-512.png)
- Check manifest loads at `/manifest.webmanifest`
- Verify HTTPS in production (localhost is OK for dev)
- Run Lighthouse audit to see specific issues

### Service worker not registering
- Check browser console for errors
- Ensure running production build (`npm run build`)
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Verify service worker in DevTools → Application → Service Workers

### Updates not applying
- Hard refresh (Ctrl+Shift+R)
- Clear service worker in DevTools
- Check `skipWaiting: true` in config
- Verify new build has different hash

### Icons not showing
- Ensure correct file names (icon-192.png, icon-512.png)
- Check files are in /public/ directory
- Verify manifest references correct paths
- Clear browser cache

## Resources

- [PWA Documentation](https://web.dev/explore/progressive-web-apps)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://web.dev/add-manifest/)
- [Workbox (Caching Library)](https://developer.chrome.com/docs/workbox/)
- [PWA Builder](https://www.pwabuilder.com/)

## Support

### Browser Compatibility
- ✅ Chrome/Edge (Desktop & Android) - Full support
- ✅ Safari (iOS) - Limited support (no background sync)
- ✅ Firefox (Desktop & Android) - Full support
- ⚠️ Safari (Desktop) - Limited support

### Known Limitations
- iOS doesn't support service worker background features
- Push notifications not included (requires separate setup)
- Background sync limited on iOS
- Some browsers require user gesture for install prompt

---

**Status**: PWA configured ✅ | Icons needed ⚠️ | Ready to deploy once icons added
