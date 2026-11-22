# Scan & Create

A privacy-first QR and barcode toolkit. The live site includes QR Studio, Barcode Studio, a camera/image scanner, and browser-local history and favorites. A PWA manifest, product icon set, service worker, and update prompt are now configured; install and offline behavior still need manual device/browser verification.

## Project principles

- Local-first processing: scanning and generation are designed to happen on the user's device.
- No accounts, tracking, analytics, or application backend.
- No automatic opening or execution of scanned content.
- Accessible, responsive interface with English and Bangla planned.
- Open-source dependencies are acknowledged in the application's About & Credits dialog.

## Development

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Production build and checks:

```bash
npm run lint
npm test
npm run build
npm run format:check
```

## Current status

The application shell, QR Studio, Barcode Studio, scanner, and local history/favorites are available on the live site. Camera/image scanning and saved-item persistence need manual Android/browser verification. PWA installation and static app-shell caching are configured; verify installation, first-load caching, offline startup, and update handling on Android and desktop before claiming offline acceptance.

Regenerate the product's PWA icon files after changing the source artwork:

```bash
npm run generate-pwa-assets
```

See the [branding kit](docs/BRANDING_KIT.md) for approved logo, color, typography, and creator portrait guidance.

## Creator & Vision

**NasirPintu** (Mohammad Nasiruddin Pintu)  
_Creator, Product Architect & Open-Source Builder_

- **GitHub:** [@nasiropintu](https://github.com/nasiropintu)
- **X:** [@nasiropintu](https://x.com/nasiropintu)
- **Instagram:** [@the_np2](https://www.instagram.com/the_np2/)
- **Facebook:** [mohammadnasiruddin.pintu](https://www.facebook.com/mohammadnasiruddin.pintu/)

## Human + AI Collaboration Credits

Conceived and guided by **NasirPintu** in collaboration with AI assistants:

- **Gemini** (Google DeepMind) — Architecture and agentic workflows.
- **Manus** (Manus AI) — Autonomous planning and synthesis.
- **ChatGPT** (OpenAI) — Logic synthesis and reasoning.
- **DeepSeek** — Algorithmic problem-solving.
- **Claude** (Anthropic) — Systems reasoning and technical drafting.
- **Vibe by Mistral** (Mistral AI) — Code generation and pragmatic engineering.

## Open-source acknowledgements

React, Vite, TypeScript, Tailwind CSS, and Lucide are used in the current application foundation. Their respective licenses and notices remain with their upstream projects.

## License

MIT License. See [LICENSE](./LICENSE).
