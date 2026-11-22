# Scan & Create

A privacy-first QR and barcode toolkit in development. The current preview includes the application shell and dashboard; scanning, code generation, and offline/PWA support are planned.

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
npm run build
npm run format:check
```

## Current status

The project currently contains the application shell and dashboard. Scanner, QR/barcode generation, local history, and offline/PWA functionality are planned implementation milestones and should not be considered complete yet.

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
