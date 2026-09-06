# Art direction and asset provenance

## Invitation ornaments — drawn, not sourced

The peony spray, the divider rosette and the paper grain on `/i/...` are generated in `src/components/invitation/Ornaments.tsx` and `invitation.css`: rings of petal paths computed from one primitive, so the corner spray, the section rosette and the bud are visibly the same plant at three sizes. Nothing is traced from or copied out of another template's assets.

`public/fonts/double-happiness.woff2` (1.1 KB) is a single-codepoint subset of **Noto Serif TC**, SIL Open Font License, holding only U+56CD (囍). It is set with `font-display: block` so the wax seal stays empty rather than flashing a fallback or a tofu box. Drawing the glyph from rectangles was tried first and abandoned — it loses the tapered serif strokes that make the character legible at seal size.

Generated specifically for this demo with the built-in image generator. Final JPEGs live in `public/images`; no third-party stock downloads or hotlinks.

## editorial.jpg

Photorealistic luxury wedding editorial, landscape 3:2. Young Vietnamese bride in flowing ivory silk and groom in black tuxedo, walking together through an old French villa garden. Pale limestone balustrade, cypress trees, soft late-afternoon sunlight. Warm ivory and muted olive, subtle analog film grain. Intimate candid full-body composition toward center-right. Natural faces, no logos or text. Used for cover, hero and couple-story photography to preserve identity continuity.

## details.jpg

Luxury wedding editorial still life, portrait 2:3. Ivory silk on an antique limestone table, two simple gold wedding bands, one white calla lily, folded blank handmade cream invitation paper. Natural golden-hour window light, muted olive background and subtle film grain. Same restrained romantic villa atmosphere. No writing, logos or collage.
