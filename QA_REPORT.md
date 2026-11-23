# Final ETHCAT Artwork/Browser QA

## Source artifact resolution

- Removed the partial ETH emblem/rays on the hero's upper-left side, including their
  influence on the color-overlay layer.
- Removed the top border and clipped box segment that came from the original mockup crop.
- Re-extracted the hero headline and wordmark without rectangular paper backdrops.
- Preserved the pixel registration of the 576×438 ink and color layers.
- Ensured the ink base layer remains visible if coloring cannot initialize.

## Browser tests performed

An inline-data local Chromium browser check was used because navigating to local
`file://` and loopback URLs is blocked in this test environment. This renders the actual
HTML/CSS/JS and images with their native dimensions.

- Desktop: 1440px — no JavaScript page errors; hero animation finishes; no horizontal overflow.
- Tablet: 768px — no JavaScript page errors; hero animation finishes; no horizontal overflow.
- Mobile: 390px — no JavaScript page errors; hero animation finishes; no horizontal overflow.
- All images visible after scrolling to their respective sections load successfully.
- Opened `PREVIEW_HERO_FIXED.png` and reviewed the problem area visually.

## Limits

- The handwriting/font raster and some picture frames intentionally retain a pencil look.
- The animation remains a raster brush reveal, not individually vector-traced pen strokes.
- Actual public RPC connectivity and token trading URLs cannot be validated offline.
- Hosting over a static web server is preferred; deploying a new folder avoids stale caches.
