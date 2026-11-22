# Scan & Create Branding Kit

This document records the current product identity and approved creator portrait asset. Keep product branding consistent across the application, repository, and public project materials.

## Product identity

- **Product name:** Scan & Create
- **Descriptor:** Your Digital Toolkit
- **Product line:** “Made for simplicity. Designed for privacy.”
- **Direction:** Premium Minimal: calm, precise, practical, and friendly.
- **Creator:** NasirPintu (Mohammad Nasiruddin Pintu), Creator & Product Architect.

## Logo and color

- Use the Scan & Create wordmark with the scan-frame mark. The scan-frame favicon is in [`public/favicon.svg`](../public/favicon.svg).
- The PWA icon artwork source is [`public/branding/app-icon.svg`](../public/branding/app-icon.svg). Generated install assets are kept in `public/branding/` (64, 192, and 512 px icons, a maskable 512 px icon, an Apple touch icon, and an ICO favicon). Regenerate these with `npm run generate-pwa-assets`; keep the product purple, scan-frame mark, and sufficient safe-zone padding for maskable use.
- Light theme accent: `#7057E8`; hover: `#5E46D2`; soft accent: `#F0EDFF`.
- Dark theme accent: `#9B87FF`; hover: `#B0A1FF`; soft accent: `#30294C`.
- Light canvas: `#F7F7FA`; dark canvas: `#111218`.
- Use Inter when available with system sans-serif fallbacks. Do not require a remote font.
- Lucide icons use a consistent stroke weight. Keep supporting colors for status and data, not as alternate brand accents.

## Creator portrait

![NasirPintu creator portrait](../public/branding/nasirpintu.jpg)

- **Asset:** [`public/branding/nasirpintu.jpg`](../public/branding/nasirpintu.jpg)
- **Format and dimensions:** JPEG, 400 × 400 pixels.
- **Source:** Supplied by the creator for Scan & Create branding on 2026-11-23.
- **Intended use:** Creator attribution, About & Credits, and project introductions.
- Keep the square crop and natural colors. Do not stretch, recolor, add filters, or place text across the face. A circular crop is suitable for compact profile UI.
- This portrait is a creator identity asset, not a product logo. Keep the scan-frame mark for product identity.
- The application currently uses the initials treatment in its About dialog; this asset is available for a future portrait update.

## Voice and use

- Keep copy clear, warm, and practical. Emphasize privacy only when it accurately describes the feature in use.
- PWA metadata and static asset caching are configured. Do not claim install or offline behavior is verified until manual device/browser acceptance is complete.
- Do not imply that accounts, cloud sync, or analytics exist.
- Preserve the exact spelling “Scan & Create” and creator name “NasirPintu.”
