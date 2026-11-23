# ETHCAT — Embedded art cleanup (November 22, 2026)

The original hero crop contained unrelated strokes from another panel: a partial Ethereum logo on the left, a horizontal page separator at the top, and a severed box at upper right. These markings were part of the **ink source** as well as the color raster; merely making the color overlay transparent did not remove them.

This revision extracts only the desired portrait/cat/annotations/box illustration into RGBA layers using a feathered content mask. The logo, header wordmark, decorative ETH icon and title are also converted into alpha-backed line drawings, removing pasted paper rectangles.

- `assets/mobile/hero-ink-clean.png`: 576 × 438 transparent pencil stroke layer.
- `assets/mobile/hero-color-clean.png`: 576 × 438 registered transparent pigment layer.
- `assets/mobile/hero-spatial-mask.png`: diagnostic content mask.
- Other `*-clean.png` files: transparent lettering/decorations.

The actual portrait pixels are retained from the existing design (no regeneration or altered facial features). The illustration is still an artistic composite, **not a genuine photo of Vitalik holding Hemule**.
