# ETHCAT — Clean Artwork Website Source

Open `index.html` directly or serve this folder with any static web server. To test with Python:

```bash
python -m http.server 8080
```

Visit http://localhost:8080. Keep all `src/` and `assets/` folders together.

## The November 22 image cleanup

The original hero source contained a leftover partial Ethereum emblem and a horizontal
header rule that were embedded in the raster itself. The original website simply pasted
that rectangular artwork over a paper background; making a second layer transparent did
not erase the artifact.

This version uses `hero-ink-clean.png` and `hero-color-clean.png`, both exact 576×438
RGBA layers with a matching feathered contour. The artwork keeps the same pose,
lettering, and right-side block imagery, but no longer carries the stray left-hand rays,
sliced top border or visible rectangular paper patch. The site wordmark, hero title and
small ETH sigil also use true alpha-backed graphic exports.

## Original features retained

- Sticky navigation with consistent active underline
- Full-width responsive layout with larger independently sized sections
- Ink drawing + aligned color-wash sequence, Replay / Skip / Pencil-Color controls
- Live Ethereum block display (best effort RPC)
- Cat portraits, the three-step Block Room, token data and meme gallery
- Launch details configurable via `src/config.js`

`PREVIEW_DESKTOP.png`, `PREVIEW_MOBILE.png` and `PREVIEW_HERO_FIXED.png` are
browser-rendered review images. `ARTWORK_FIX.md` and `QA_REPORT.md` describe technical
changes and remaining limitations.

This design is an independent artwork. The image of Vitalik and Hemule together is an
artistic composite, not an authentic photograph; it does not imply endorsement.
