# Navfolio cat assets

The white cat, lavender forehead patch, navy outline, pink cheeks, and purple
scarf form the shared identity for the UI, browser icons, and README header.

- `public/images/logo-cat.png`: transparent generated master.
- `public/images/avatar.webp`: pale lavender background for profile/author cards.
- `public/images/logo-with-name.png`: generated README lockup, shared by both languages.
- `logo.png`, `logo-thin.webp`, and `logo-in-one.png`: compatible legacy URLs.
- `public/favicon*`, `apple-*`, `android-*`, `ms-*`, and `web-app-manifest-*`:
  size-specific exports. Maskable icons have extra safe-area padding.

Regenerate exports from the repository root with:

```sh
node scripts/branding/generate.mjs
node scripts/branding/verify-ico.mjs
```

The ICO verifier checks directory field bytes, payload bounds, and decoding of all
three PNG images. Each directory entry starts with four one-byte fields, followed
by the two-byte planes field at offset `+4` and the two-byte bit-count field at
`+6`. The image length starts at `+8`; writing the bit count at `+7` would corrupt
that length. See Microsoft's [ICO format description](https://devblogs.microsoft.com/oldnewthing/20101018-00/?p=12513).

The master and README lockup were created with the built-in image generation tool,
using the previous `logo-cat.png` as the character reference. Sharp handles
delivery sizes, backgrounds, compression, and format packaging. Existing website
screenshots are historical UI previews, not icon sources.

## Master prompt

Use case: logo-brand. Create one polished square cat mascot master icon for Navfolio
based closely on the reference image. Preserve its exact identity: warm white cat,
lavender patch over viewer-right forehead and ear, pink inner ears and cheek blush,
very dark navy rounded outline, big dark oval eyes with one white glint each, tiny
smiling w mouth, purple scarf tied on viewer-right. Simplify into a clean flat
vector-like head-and-scarf bust for avatars and small browser favicons. Remove paws,
remove scenery, remove paper texture and gradients. Bold smooth consistent outlines,
balanced near-symmetric frontal head with small cheek tufts, friendly calm expression.
Single centered mascot occupying about 84 percent of a 1024x1024 square, all ears and
scarf inside frame, comfortable equal margins. Actual transparent background. No text,
no border, no tile background, no shadows, no additional objects. This is the canonical
identity from which all icon sizes will be derived.

## README lockup prompt

Use case: logo-brand. Create a README logo lockup on a solid pure white background.
Reuse this exact cat mascot with its dark navy outline, lavender forehead patch,
pink cheeks and purple scarf. Center cat above clean lowercase text 'navfolio'.
Text in bold rounded sans serif, nav dark navy and folio purple. Compact square
composition. Cat upper 70%, wordmark bottom 20%. Flat, clean crisp solid colors.
No glow, NO shadows, no lighting effects, no haze, no additional icons, no props.
Cat and letters must have sharply defined boundaries on PURE WHITE background.
Keep the reference cat identity and outline unchanged. Leave generous 8% outer margins.
