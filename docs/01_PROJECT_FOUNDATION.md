Scan & Create
Product Vision, Technical Specification & Development Roadmap
Document version: 1.1  
Status: Active baseline, reconciled with repository on 2026-11-23  
Target platform: Progressive Web App (PWA)  
Initial deployment: GitHub Pages  
Primary development environment: Windows PC, PowerShell 7, Node.js,
npm, Git  
Companion test device: Android phone  
Cost target: Zero additional recurring or service cost
---

1. Executive Summary
   Scan & Create is a privacy-focused, offline-first QR code and
   barcode scanner and generator. It will be delivered as a responsive
   Progressive Web App that works in modern desktop and mobile browsers and
   can be installed on supported devices.
   The product combines four core jobs in one simple interface:
   Scan QR codes and supported barcodes using a device camera or an
   imported image.
   Understand scan results and present safe, useful actions.
   Create customizable QR codes for common information types.
   Generate printable and shareable barcodes.
   The application should feel like a polished, dependable utility rather
   than a technical demo. Its interface should be minimal, fast,
   accessible, and easy to understand for first-time users.
   Non-negotiable principles
   Zero additional cost: use free, open-source tools and static
   hosting.
   Privacy first: scanning and generation happen on the user's
   device.
   No account required: no sign-up, login, or user profile.
   No backend in the MVP: no server, paid API, or cloud database.
   Offline-first: core app functionality should remain available
   after the app has been loaded and installed.
   Safe by default: never automatically open or execute scanned
   content.
   Mobile-first, responsive: prioritize camera-based use on phones
   while supporting desktop browsers.
   Maintainable code: modular architecture, typed interfaces,
   tests, and clear documentation.

---

Repository snapshot (2026-11-23)

This project has moved beyond the original Vite starter, but remains an early UI preview. Repository inspection confirms React 19 + TypeScript + Vite, Tailwind CSS 4 integration, Lucide icons, an application shell and dashboard, light/dark color tokens, responsive desktop/mobile navigation, and an About & Credits dialog. The project also has a README, MIT license, favicon, and npm scripts for development, linting, formatting, and production builds.

Camera scanning, QR/barcode generation, result handling, history, favorites, settings, translations, persistence, service worker, manifest, and deployment workflow are not implemented. The feature and test folders are empty or absent. There is no test script or test file. The initial `main` commit is pushed to the private GitHub repository `https://github.com/nasiropintu/scan-and-create`; GitHub Pages remains a plan, not a deployment. The current Vite config has no GitHub Pages base path. Mark a capability complete only after implementation and acceptance checks exist in the repository.

2. Product Goals and Non-Goals
   2.1 Goals
   Provide a reliable QR and barcode scanning experience.
   Generate common QR formats without sending data to a server.
   Generate common retail and industrial barcode formats.
   Keep recent scan and creation history locally on the device.
   Support English and Bangla interface languages.
   Support light and dark themes.
   Work offline for the app shell and core local features.
   Be installable as a PWA where the browser supports installation.
   Deploy from a GitHub repository to GitHub Pages without a paid
   hosting service.
   Keep the interface fast and usable on modest Android devices.
   2.2 Non-goals for the first release
   The MVP will not include:
   User accounts, authentication, or cloud synchronization.
   A hosted API, backend, or remote database.
   Paid APIs, paid hosting, paid analytics, or subscriptions.
   Cross-device history synchronization.
   Automatic URL opening or automatic execution of scanned data.
   Social features, public profiles, or shared cloud collections.
   A native Android/iOS application distributed through an app store.
   Advanced enterprise inventory management or product catalog
   management.
   These can be reconsidered only if the product's needs change and a
   genuinely free, privacy-respecting approach is available.

---

3. Target Users and Main Use Cases
   Primary users
   People who need to scan QR codes and barcodes quickly.
   Shopkeepers and small businesses that need to create product or
   information codes.
   Students and everyday users who need to share Wi-Fi, contact,
   website, or text information.
   Users who prefer a simple utility that does not require an account.
   Main user journeys
   A. Scan a code
   Open Scan & Create.
   Choose Scan.
   Grant camera permission when prompted.
   Point the camera at a QR code or supported barcode.
   Review the detected value and its type.
   Choose an explicit action such as copy, open link, call, email, or
   save.
   Optionally add the result to local history or favorites.
   B. Scan an image
   Open Scan.
   Choose an image from the device.
   Decode supported codes from the image.
   Review the result.
   Copy, share, or save it.
   C. Create a QR code
   Open QR Studio.
   Choose a content type.
   Enter the required information.
   Preview the QR code.
   Customize supported visual options.
   Download or share the result.
   Optionally save it locally.
   D. Create a barcode
   Open Barcode Studio.
   Choose a barcode format.
   Enter the data.
   Validate the data for the selected format.
   Preview the barcode.
   Download or print it.
   Optionally save it locally.

---

4. Feature Scope
   Feature priorities:
   P0 --- MVP requirement: needed for the first useful release.
   P1 --- Important: should follow the core MVP.
   P2 --- Later: optional enhancement after the application is
   stable.
   4.1 Dashboard
   Priority: P0
   Clear Scan, Create QR, and Create Barcode entry points.
   Shortcuts to recent activity and favorites.
   Compact explanation of the app's privacy/offline approach.
   Responsive layout for mobile, tablet, and desktop.
   No unnecessary dashboard clutter.
   4.2 QR and Barcode Scanner
   Priority: P0
   Live camera scanning.
   Request camera permission only when the user starts scanning.
   Prefer the rear/environment-facing camera on mobile when available.
   Support QR codes and the selected barcode formats.
   Show a clear scanning frame and scanning status.
   Provide a manual stop control.
   Stop all camera tracks when the user leaves the scanner or scanning
   ends.
   Prevent duplicate results from flooding the result screen.
   Allow image upload and decode where supported by the selected
   scanning engine.
   Handle permission denial, unavailable cameras, unsupported formats,
   and decode failures gracefully.
   Priority: P1
   Continuous scanning mode.
   Torch/flashlight control where the browser and device expose it.
   Camera selection where available.
   Zoom control where supported.
   Haptic or sound feedback only if it can be implemented accessibly
   and with user control.
   Scanner compatibility note: browser camera and barcode capabilities
   vary by browser and device. The implementation must feature-detect
   capabilities and provide a useful fallback. Do not promise torch, zoom,
   or every barcode format on every device.
   4.3 Smart Scan Results
   Priority: P0
   Classify decoded content and show suitable actions without automatically
   performing them.
   Examples:
   URL: display the address and offer Copy and Open.
   Plain text: display and offer Copy and Share.
   Phone number: offer Copy and Call.
   Email: offer Copy and Compose email.
   SMS: offer Copy and Compose message.
   Wi-Fi payload: display network details carefully and offer
   copy/share where appropriate.
   Contact/vCard: display parsed contact fields and offer save/share
   where supported.
   Unknown or unsupported payload: display the raw decoded value
   safely.
   Security requirements:
   Never automatically navigate to a scanned URL.
   Never execute scanned JavaScript, HTML, or other active content.
   Treat all decoded content as untrusted input.
   Escape text when rendering it.
   Validate and normalize URLs before offering an Open action.
   Make external navigation an explicit user action.
   Avoid rendering arbitrary HTML from a scan result.
   4.4 QR Studio
   Priority: P0
   Initial QR content types:
   Plain text.
   Website URL.
   Phone number.
   Email address.
   SMS.
   Wi-Fi network credentials.
   Contact card (vCard).
   Core capabilities:
   Live preview.
   Input validation.
   Copy generated content.
   Download QR image (PNG at minimum).
   Save locally to history/favorites.
   Share through the Web Share API when available, with download/copy
   fallback.
   Useful validation messages.
   Priority: P1
   SVG export.
   QR foreground/background color controls.
   Optional margin/quiet-zone controls.
   Error-correction level selection, with safe defaults.
   Logo overlay only if implemented without compromising scan
   reliability; include warnings and sensible limits.
   Preset styles that preserve sufficient contrast and quiet zone.
   4.5 Barcode Studio
   Priority: P0
   Initial formats to evaluate and support:
   Code 128.
   EAN-13.
   EAN-8.
   UPC-A.
   UPC-E, if the selected library supports it reliably.
   Code 39.
   ITF.
   ITF-14, if supported and validated.
   Core capabilities:
   Format selector.
   Format-specific validation.
   Clear error messages for invalid length, characters, or check
   digits.
   Preview.
   Download as SVG or PNG.
   Print-friendly layout.
   Save locally to history/favorites.
   Important: barcode format support and validation rules must be
   verified against the chosen generation library. Do not silently modify a
   user's product code. If a format requires a check digit, clearly explain
   whether the app validates, calculates, or expects the user to supply it.
   4.6 History and Favorites
   Priority: P0
   Local history of scans and generated items.
   Store type, value/content, action category, and timestamp as
   appropriate.
   Favorite/unfavorite items.
   Search and filter history.
   Delete one item.
   Clear all history.
   No cloud synchronization.
   Avoid storing more sensitive data than necessary.
   Priority: P1
   Export and import a user-controlled backup file.
   Optional history grouping by date or item type.
   User setting to disable scan history.
   4.7 Settings and Personalization
   Priority: P0
   English and Bangla language selection.
   Light, dark, and system theme.
   Privacy controls for local history.
   Clear local application data.
   About, help, and privacy information.
   Camera capability and permission guidance.
   Language behavior:
   All interface text must use translation keys.
   The default language may be English, with Bangla available.
   Changing language updates the entire interface immediately.
   Generated QR/barcode content must not be translated or altered
   automatically; only labels and UI text change.
   Export/print labels may follow the selected app language where
   applicable.
   4.8 PWA and Offline Experience
   Priority: P0
   Web app manifest.
   App icons and install metadata.
   Service worker.
   Cache the application shell and static dependencies.
   Make the app load offline after a successful initial load.
   Provide a clear offline/online status only where useful.
   Handle updates without unexpectedly losing user work.
   Do not cache private user content or camera frames in the service
   worker. Local history belongs in IndexedDB, not in the static asset
   cache.

---

5. Technology Stack
   The project has already been scaffolded using Vite with React and
   TypeScript.

The table below is a proposal for future feature work unless a technology is explicitly listed in the repository snapshot or decisions register as installed. Current tooling uses Oxlint, not ESLint. No proposed generator, scanner, database, PWA, schema-validation, or test library has been installed.

---

Area Proposed technology Purpose
---

UI framework React Component-based
interface
Language TypeScript Type safety and
maintainability
Build tool Vite Development server and
production build
Styling Tailwind CSS Consistent responsive
styling
Icons Lucide React Consistent interface
icons
QR generation `qrcode` Generate QR codes
Barcode generation `JsBarcode` Generate supported
barcodes
Scanning Scanner adapter around Decode QR and barcodes
ZXing/browser  
capabilities
Browser-native scanning `BarcodeDetector` when Optional native
supported acceleration
Local database IndexedDB through Dexie Local history and
favorites
PWA `vite-plugin-pwa` Manifest and service
worker
Validation Zod Validate forms and
structured input
Unit tests Vitest Test core logic
Component tests React Testing Library Test UI behavior
End-to-end tests Playwright Test important user
journeys
Linting ESLint Catch code issues
Formatting Prettier Consistent formatting
Version control Git + GitHub Source control and
collaboration
Hosting GitHub Pages Free static deployment
Dependency selection rules
Prefer mature, actively maintained, open-source libraries.
Check license, bundle size, browser support, and maintenance
activity before adding a dependency.
Avoid adding packages for trivial features that can be implemented
safely with browser APIs.
Pin and review dependency updates.
Keep the scanning library behind an adapter so it can be replaced
without rewriting the UI.
Do not add a dependency merely because it is fashionable.
Scanning-engine strategy
Use a small scanner interface between the UI and decoding
implementation. Evaluate the current browser support and maintenance
status of:
Native `BarcodeDetector` where available.
A maintained browser-compatible decoding library, such as
ZXing-based tooling, for fallback.
The app should not assume `BarcodeDetector` exists. Keep format support
explicit and test it on the target Android browser and desktop browser.
---

6. System Architecture
   6.1 Architecture overview
   The MVP is a client-side modular monolith. It is one static web
   application with clearly separated features and core services.
   There is no backend service in the MVP.

```text
User
 |
 v
React Application
 |
 +-- Dashboard
 +-- Scanner
 |    +-- Camera lifecycle
 |    +-- Scanner adapter
 |    +-- Result normalization
 |
 +-- Results
 |    +-- Content classification
 |    +-- Safe action handling
 |
 +-- QR Studio
 |    +-- QR payload builders
 |    +-- QR rendering/export
 |
 +-- Barcode Studio
 |    +-- Format validation
 |    +-- Barcode rendering/export
 |
 +-- History & Favorites
 |
 +-- Settings & i18n
 |
 v
Core Services
 |
 +-- IndexedDB (local only)
 +-- Browser APIs (camera, download, share)
 +-- Validation
 +-- Export/print
 |
 v
Static PWA Assets + Service Worker
 |
 v
GitHub Pages
```

6.2 Architectural boundaries
UI components should not directly manage IndexedDB transactions.
Feature screens should call service functions/hooks.
Scanner implementation should not be coupled to the result screen.
QR payload construction should be separate from QR rendering.
Barcode validation should be separate from barcode rendering.
Translation strings should not be embedded throughout components.
Local storage schema changes should use explicit database
migrations.
Export logic should be reusable by QR and barcode features.
6.3 Scanner adapter contract
Define a stable interface for scanner engines. The interface should
support:
Start scanning with a video element or supported image source.
Stop scanning and release resources.
Report normalized decoded results.
Report errors and capability information.
Expose supported formats.
Avoid leaking library-specific result objects into the rest of the
application.
The UI should depend on this contract, not on a specific scanner
package.
6.4 Local data model (initial proposal)
Use Dexie over IndexedDB. Start with a small schema and evolve it
through versioned migrations.
History record
`id`: unique local identifier.
`kind`: scan, QR, or barcode.
`format`: QR or barcode format where known.
`value`: decoded or generated content.
`label`: optional user-provided label.
`createdAt`: timestamp.
`isFavorite`: boolean.
`metadata`: optional safe, typed metadata.
Settings record
`key`: setting identifier.
`value`: validated setting value.
Do not store camera images or video frames in history. Do not store
secrets unless the user explicitly chooses to save the relevant
generated item. Explain that browser-local storage is not encrypted by
this app and can be cleared by the browser or device.
---

7. Privacy, Security, and Reliability Requirements
   Privacy is a product feature, not just a marketing statement.
   Privacy requirements
   All scanning and generation happen locally.
   No account, remote database, or cloud sync.
   No analytics or tracking scripts.
   No advertising SDKs.
   No automatic upload of scan data.
   No transmission of scan content to external services.
   Ask for camera permission only when scanning starts.
   Stop camera streams as soon as scanning ends or the screen is left.
   Provide a clear control to delete local history and app data.
   Explain what is stored locally and why.
   Browser storage limitations
   IndexedDB is local browser storage, not a guaranteed permanent or
   encrypted vault. Browser settings, storage pressure, private browsing,
   or user actions may remove it. The app must not promise permanent
   retention or encryption. A future backup/export feature can help users
   preserve their own data.
   Input and navigation safety
   Treat every scanned value as untrusted.
   Do not inject scanned content as HTML.
   Do not execute scripts or commands.
   Validate URLs before showing an Open action.
   Use explicit user confirmation before external navigation.
   Avoid unsafe use of `dangerouslySetInnerHTML`.
   Validate imported backup files before writing to IndexedDB.
   Do not trust file extensions alone when importing files.
   Camera lifecycle
   Request access only after a user action.
   Handle permission denied and camera unavailable states.
   Stop every active `MediaStreamTrack` on cleanup.
   Avoid leaving camera capture active in the background.
   Prevent duplicate processing of the same code during a single scan
   session unless continuous mode is intentionally enabled.
   Accessibility
   Keyboard-accessible controls.
   Visible focus indicators.
   Proper labels for form controls.
   Sufficient text/background contrast.
   Do not communicate status using color alone.
   Respect reduced-motion preferences.
   Use clear error messages and accessible status announcements.
   Ensure touch targets are comfortable on mobile.

---

8. Design Direction
   Design concept: Premium Minimal
   The product should look calm, modern, precise, and trustworthy.
   Design principles:
   Strong visual hierarchy.
   Generous but disciplined spacing.
   Clear typography.
   Minimal decoration.
   Consistent iconography.
   Rounded surfaces used purposefully.
   Subtle borders and shadows.
   High contrast for scan results and generated codes.
   Fast transitions, not distracting animations.
   Mobile-first navigation and controls.
   Core application layout
   Mobile
   Compact top bar with app identity and settings.
   Main content area.
   Clear primary actions.
   Bottom navigation for the main destinations, if usability testing
   supports it.
   Scanner screen with camera preview taking priority.
   Desktop
   Sidebar or compact navigation rail.
   Centered content area with a sensible maximum width.
   Studio preview and controls arranged side by side when space
   permits.
   Scanner view that uses available screen space without stretching the
   camera image unnaturally.
   Suggested navigation
   Home
   Scan
   QR Studio
   Barcode Studio
   History
   Settings
   Design system to define before feature screens
   Color tokens for light and dark themes.
   Typography scale.
   Spacing scale.
   Border radius scale.
   Elevation/border tokens.
   Button variants and sizes.
   Input, select, and form field patterns.
   Dialog, toast, empty state, loading state, and error state.
   Responsive breakpoints.
   Icon sizing rules.
   Do not over-design the dashboard before the core scanner and generator
   flows are proven.

---

Current brand identity (verified against the application)

- Product name and spelling: Scan & Create. Use the ampersand consistently.
- Product descriptor: Your Digital Toolkit.
- Product line: “Made for simplicity. Designed for privacy.”
- Visual direction: Premium Minimal: calm, precise, practical, and friendly; restrained decoration, generous spacing, rounded cards, subtle borders, and clear hierarchy.
- Logo treatment: the interface pairs the Scan & Create wordmark with a scan-frame icon. The favicon now uses a matching scan-frame mark in the primary brand purple. Do not substitute Vite or React marks for product branding.
- Existing color tokens: light accent `#7057E8`, hover `#5E46D2`, soft accent `#F0EDFF`; dark accent `#9B87FF`, hover `#B0A1FF`, soft accent `#30294C`. Light surfaces use `#F7F7FA` and white; dark canvas uses `#111218`. Green, blue, and orange are supporting status or metric colors, not alternate brand accents.
- Typography: Inter first, with system sans-serif fallbacks. Avoid requiring a remote font for offline use.
- Icons: Lucide React, used with consistent stroke weight and size.
- Creator: NasirPintu (Mohammad Nasiruddin Pintu), Creator & Product Architect. README/About credits and social handles are attribution content, not product feature claims.
- English UI exists; Bangla is planned, not implemented. Light/dark themes exist; system-following mode is planned.

Accuracy fixes applied in this update: replaced the unsupported “Offline-ready” label with “No tracking”; clarified that core features are in progress; removed the unavailable portrait dependency and use the creator initials; scoped the About privacy statement to what is actually in this preview; replaced the mismatched lightning favicon with the app's scan-frame mark and linked it using Vite's base URL token. Prepare correctly sized PWA icons during the PWA phase. Avoid implying accounts or signed-in profiles. Do not imply scanning or generation is available while screens remain placeholders. Privacy-first local processing is a product requirement, not proof that those features have shipped.

---

9. Proposed Repository Structure
   The following is the intended structure. It is a target architecture,
   not a claim that all folders already exist.

```text
scan-and-create/
|
|-- .github/
|   |-- workflows/
|       |-- ci.yml
|       |-- deploy.yml
|
|-- public/
|   |-- icons/
|   |-- favicon.svg
|   |-- robots.txt
|
|-- docs/
|   |-- 01_PROJECT_FOUNDATION.md
|   |-- 02_DEVELOPMENT_ROADMAP.md
|   |-- 03_TEST_PLAN.md
|   |-- 04_RELEASE_CHECKLIST.md
|
|-- src/
|   |-- app/
|   |   |-- App.tsx
|   |   |-- router.tsx
|   |   |-- providers/
|   |
|   |-- components/
|   |   |-- ui/
|   |   |-- layout/
|   |   |-- feedback/
|   |
|   |-- features/
|   |   |-- dashboard/
|   |   |-- scanner/
|   |   |-- results/
|   |   |-- qr-generator/
|   |   |-- barcode-generator/
|   |   |-- history/
|   |   |-- favorites/
|   |   |-- settings/
|   |
|   |-- core/
|   |   |-- database/
|   |   |-- storage/
|   |   |-- validation/
|   |   |-- export/
|   |   |-- privacy/
|   |   |-- platform/
|   |
|   |-- hooks/
|   |-- i18n/
|   |   |-- en/
|   |   |-- bn/
|   |
|   |-- styles/
|   |-- types/
|   |-- utils/
|
|-- tests/
|   |-- unit/
|   |-- components/
|   |-- e2e/
|
|-- .gitignore
|-- .prettierrc
|-- eslint.config.js
|-- index.html
|-- package.json
|-- package-lock.json
|-- README.md
|-- tsconfig.json
|-- vite.config.ts
```

Folder rules
`features/`: feature-specific screens, components, hooks, and logic.
`components/ui/`: reusable design-system components with no
business-specific behavior.
`core/`: shared services and platform integrations.
`i18n/`: English and Bangla translations.
`types/`: shared TypeScript types only when they are genuinely
shared.
`utils/`: small pure helpers; avoid turning this into a
miscellaneous dumping ground.
`tests/`: tests organized by test type.
---

10. Coding Standards
    TypeScript
    Keep TypeScript strict mode enabled.
    Avoid `any`; use `unknown` and narrow types when needed.
    Define explicit interfaces for scanner results, database records,
    and feature boundaries.
    Avoid duplicated types.
    Keep functions focused and small.
    React
    Use functional components and hooks.
    Keep components focused on presentation and interaction.
    Move non-UI logic into services or feature hooks.
    Avoid unnecessary global state.
    Clean up event listeners, camera tracks, and object URLs.
    Do not store derived values in state when they can be computed.
    Styling
    Use shared design tokens.
    Avoid arbitrary one-off values when a token exists.
    Ensure all screens work at mobile and desktop sizes.
    Test both themes.
    Keep focus, hover, disabled, loading, and error states consistent.
    Git
    Use meaningful commits, for example:
    `chore: scaffold application`
    `feat: add application shell`
    `feat(scanner): add camera scanning`
    `feat(qr): add wifi qr generation`
    `fix(scanner): release camera on navigation`
    `test: cover barcode validation`
    Create a feature branch for substantial changes when useful. Keep `main`
    in a buildable state.

---

11. Development Roadmap
    The roadmap is staged so every phase ends with a working, testable
    result.
    Estimated effort: approximately 19--30 focused working days for one
    developer, depending on browser compatibility issues, learning time,
    testing depth, and design refinement. This is a planning estimate, not a
    delivery guarantee.
    Phase 0 --- Project foundation (partially complete)
    Remaining tasks:
    Run and record the existing build, lint, and format checks.
    Add the plan and create the initial Git commit when ready.
    Confirm repository owner, URL, and visibility before deployment work.
    Acceptance criteria: existing scripts pass and the foundation is committed.
    Phase 1 --- Application shell and design system (partially complete)
    Existing: branded dashboard shell, responsive navigation, light/dark
    tokens, theme toggle, and About dialog.
    Remaining tasks:
    Refine shared components and accessibility patterns.
    Add system theme behavior and English/Bangla translation support.
    Replace placeholder destinations only as functional features are built.
    Acceptance criteria: responsive layout, consistent theme and language
    behavior, visible keyboard focus, and no misleading capability claims.
    Phase 2 --- QR Studio
    Estimated effort: 2--3 days
    Tasks:
    Add QR generation dependency.
    Implement payload builders for text, URL, phone, email, SMS, Wi-Fi,
    and vCard.
    Add form validation.
    Build live QR preview.
    Implement PNG export.
    Add copy and share fallbacks.
    Add save-to-history integration once database is ready, or keep a
    temporary feature interface until then.
    Acceptance criteria
    Each supported payload generates a valid QR code.
    Invalid inputs show clear errors.
    Exported QR codes can be scanned by independent scanner apps.
    UI remains responsive while editing.
    Phase 3 --- Barcode Studio
    Estimated effort: 2--3 days
    Tasks:
    Add JsBarcode.
    Verify supported formats and limitations.
    Implement format selector.
    Implement format-specific validation.
    Build preview and download.
    Add print-friendly output.
    Test generated codes using more than one scanner where possible.
    Acceptance criteria
    Every listed MVP format is either verified as supported or
    explicitly removed from the MVP scope.
    Invalid data is rejected with a useful explanation.
    Downloaded barcodes remain readable at intended print sizes.
    The app never silently changes product identifiers.
    Phase 4 --- Scanner engine
    Estimated effort: 3--5 days
    Tasks:
    Define scanner adapter interface.
    Evaluate native `BarcodeDetector` support.
    Integrate a browser-compatible fallback decoder.
    Implement camera permission flow.
    Implement camera selection where supported.
    Implement scan lifecycle and cleanup.
    Add duplicate-result protection.
    Add image upload scanning.
    Add camera error and unsupported-browser states.
    Test on Android and desktop.
    Acceptance criteria
    Camera starts only after user action.
    QR and agreed barcode formats decode on supported test devices.
    Camera stops on exit and unmount.
    Permission denial is handled clearly.
    Unsupported capabilities do not crash the application.
    Image scanning works for supported image types and formats.
    Phase 5 --- Results, history, and favorites
    Estimated effort: 2--4 days
    Tasks:
    Implement safe content classification.
    Implement explicit result actions.
    Add Dexie/IndexedDB database.
    Add versioned schema.
    Store scan and generated records.
    Implement search, filter, favorite, delete, and clear.
    Add user-facing local storage explanation.
    Acceptance criteria
    Scanned URLs are never opened automatically.
    Result content is rendered safely.
    History persists across normal reloads.
    Favorite and delete actions work.
    Clear history removes the expected local records.
    No scan content is sent over the network.
    Phase 6 --- PWA and offline support
    Estimated effort: 2--3 days
    Tasks:
    Add `vite-plugin-pwa`.
    Configure manifest and icons.
    Configure service worker and Workbox caching.
    Cache app shell and static assets.
    Exclude private/user-generated data from service-worker caching.
    Test install flow on supported browsers.
    Test offline startup after first successful load.
    Add update handling.
    Acceptance criteria
    Production build includes the expected PWA assets.
    App can be installed where supported.
    App shell loads offline after initial caching.
    User history remains in IndexedDB and is not copied into static
    caches.
    Updates do not unexpectedly erase user data.
    Phase 7 --- QA, accessibility, and hardening
    Estimated effort: 3--4 days
    Tasks:
    Add unit tests for validation and payload builders.
    Add component tests for key forms and actions.
    Add end-to-end tests for critical journeys.
    Test small and large screens.
    Test English and Bangla.
    Test light and dark themes.
    Test permission denial and no-camera scenarios.
    Test offline behavior.
    Test keyboard navigation and contrast.
    Review bundle size and performance.
    Review privacy and security requirements.
    Acceptance criteria
    Critical user journeys pass.
    No known high-severity privacy or security issue remains.
    No major mobile layout issue remains.
    Build and lint pass.
    Errors are handled without uncaught application crashes.
    Phase 8 --- GitHub Pages release
    Estimated effort: 1--2 days
    Tasks:
    Configure Vite base path for the repository deployment URL.
    Add GitHub Actions build/deploy workflow.
    Configure GitHub Pages to use the deployment workflow.
    Deploy production build.
    Test the deployed URL on desktop and Android.
    Verify HTTPS, camera permission behavior, PWA installation, and
    offline behavior.
    Tag the first release.
    Acceptance criteria
    GitHub Actions deployment succeeds.
    Public deployment loads correctly under the repository path.
    Camera access works over HTTPS on supported browsers.
    PWA assets use correct paths.
    No secrets or local development files are committed.

---

12. Testing Strategy
    Unit tests
    Prioritize pure logic:
    URL normalization and validation.
    QR payload construction.
    Barcode format validation.
    Result classification.
    Date formatting.
    Translation key completeness.
    Database record normalization.
    Component tests
    Test:
    Form validation messages.
    QR and barcode format selection.
    Theme switching.
    Language switching.
    Result action visibility.
    History filters and delete controls.
    Empty, loading, and error states.
    End-to-end tests
    Critical flows:
    Load dashboard.
    Generate a text QR code and download it.
    Generate a Wi-Fi QR code.
    Generate a supported barcode.
    Deny camera permission and verify graceful handling.
    Scan a code where the test environment supports camera input, or
    test scanner adapter behavior with a controlled fixture.
    Save and delete history.
    Change language and theme.
    Reload and verify local data persistence.
    Load the deployed app offline after the initial cache is
    established.
    Manual device testing
    At minimum:
    Desktop: current Chrome or Edge.
    Android: current Chrome.
    Additional browsers only as available.
    Test actual camera hardware; simulated browser environments cannot fully
    validate camera behavior.

---

13. Deployment and Zero-Cost Operating Model
    Hosting
    Use GitHub Pages for the static production build.
    GitHub Pages does not run a Node backend. This is suitable because the
    MVP is client-side only.
    Repository
    Current repository:
    Name: `scan-and-create`
    URL: `https://github.com/nasiropintu/scan-and-create`
    Branch: `main`
    Visibility: private (created 2026-11-23).
    The repository includes the README, MIT license, and this plan.
    Confirm intended public-release visibility before publishing the app.
    Review GitHub's current plan limits and acceptable-use terms before
    publishing. Free service availability and limits can change.
    Cost assumptions
    The project should not require payment for:
    Hosting.
    Database.
    API access.
    Authentication.
    Analytics.
    QR generation.
    Barcode generation.
    Development software.
    The zero-cost target does not eliminate the user's existing costs for
    electricity, internet access, computer/phone ownership, or any optional
    domain name. No paid service should be introduced without explicit
    approval.
    GitHub Pages technical notes
    Configure Vite's `base` path for the repository name when deploying
    to a project site.
    Use relative-safe asset paths.
    Test direct page refreshes if client-side routing is introduced.
    Prefer hash routing or configure a compatible static-hosting
    fallback if deep links are needed.
    Use HTTPS deployment because camera APIs generally require a secure
    context (localhost is also treated as secure for development).

---

14. Risks and Mitigations

---

Risk Impact Mitigation
---

Browser scanner support Some devices cannot Feature detection,
differs scan certain formats scanner adapter,
fallback library,
device testing
Camera permission Scanning unavailable Explain permission
denied steps and offer image
scanning
Barcode library lacks a Requested barcode Verify formats early;
format cannot be generated adjust MVP scope
transparently
Poor print quality Generated barcode Correct dimensions,
cannot be read quiet zones, contrast,
print tests
QR styling harms QR becomes difficult to Preserve contrast and
readability scan quiet zone; test every
style
Browser clears local History can be lost Explain storage
data limitations; later add
export/import
GitHub Pages path Deployed app assets Configure Vite base and
errors fail test production
deployment
Service worker serves Users see an old Use controlled update
stale files version flow and versioned
assets
Scope grows too quickly Release is delayed Protect P0 scope; defer
P1/P2 features
Dependency becomes Security or Review maintenance and
unmaintained compatibility problems keep adapters around
replaceable libraries
---

15. Release Definition
    The first public MVP is ready when:
    [ ] Dashboard and navigation are complete.
    [ ] English and Bangla UI are available.
    [ ] Light, dark, and system themes work.
    [ ] QR generation supports the agreed P0 content types.
    [ ] Barcode generation supports the verified P0 formats.
    [ ] Camera scanning works on the agreed target browsers/devices.
    [ ] Image scanning works for supported formats.
    [ ] Scan results have safe, explicit actions.
    [ ] History and favorites work locally.
    [ ] User can clear local history.
    [ ] Camera streams are released correctly.
    [ ] No scan data is transmitted to a server.
    [ ] PWA manifest and service worker work.
    [ ] Offline app-shell behavior is verified.
    [ ] Accessibility and responsive checks are complete.
    [ ] Tests, lint, and production build pass.
    [ ] GitHub Pages deployment works over HTTPS.
    [ ] README and privacy explanation are published.

---

16. Current Project Status and Immediate Checklist

The repository has a working branded dashboard preview. The foundation phase is partially complete; feature implementation has not begun.

Complete by repository inspection:

- [x] React + TypeScript + Vite project and dependencies are present.
- [x] Tailwind CSS 4 Vite plugin and Lucide React are installed.
- [x] Branded dashboard shell, responsive navigation, and About & Credits dialog exist.
- [x] Light/dark color tokens and product favicon exist.
- [x] README, MIT license, Oxlint configuration, Prettier configuration, and npm scripts exist.

Next actions:

- [x] Replace the unsupported “Offline-ready” label with an accurate no-tracking statement.
- [x] Remove the unavailable portrait dependency and show the existing initials treatment.
- [x] Replace the mismatched favicon and add the app favicon link.
- [ ] Prepare app/PWA icon sizes in the PWA milestone.
- [x] Production build passes (`npm run build`, 2026-11-23).
- [x] Run lint and format checks; both pass (`npm run lint`, `npm run format:check`, 2026-11-23).
- [x] Add the plan and create the initial `main` commit (`6209577`); push to the private GitHub repository.
- [ ] Finish shared design tokens and accessible UI patterns against the existing shell.
- [ ] Implement and verify roadmap milestones; do not describe placeholders as working features.
- [ ] Configure the GitHub Pages base path and deployment after PWA work and release-visibility review.

Available PowerShell commands from `D:\Projects\scan-and-create`:

```powershell
npm run dev
npm run lint
npm run format:check
npm run build
npm run preview
```

There is currently no test script or test file. Add automated coverage as feature logic is implemented.

---

17. Decisions Register

| Decision                   | Current choice                                         | Status                                        |
| -------------------------- | ------------------------------------------------------ | --------------------------------------------- |
| Product name               | Scan & Create                                          | Selected; exact spelling                      |
| Brand direction            | Premium Minimal; purple-led                            | In use; see Section 8                         |
| Platform                   | Responsive React PWA                                   | PWA not implemented                           |
| UI framework               | React 19 + TypeScript + Vite                           | Scaffolded; dashboard exists                  |
| Styling                    | Tailwind CSS 4 plugin plus authored CSS tokens         | Installed and in use                          |
| Icons                      | Lucide React                                           | Installed and in use                          |
| Lint/format                | Oxlint and Prettier                                    | Configured; lint and format checks pass       |
| Repository                 | `nasiropintu/scan-and-create`                          | Created private; `main` pushed                |
| Hosting                    | GitHub Pages                                           | Planned; base path and deployment unset       |
| Backend/accounts/analytics | None in MVP                                            | Selected exclusions                           |
| Local database             | IndexedDB; Dexie was proposed                          | Not selected or installed                     |
| QR/barcode libraries       | `qrcode` and `JsBarcode` were proposed                 | Not installed; evaluate before implementation |
| Scanner                    | Capability detection plus replaceable fallback adapter | Planned; no scanner code                      |
| Languages                  | English and Bangla                                     | Planned; no translation system or selector    |
| Themes                     | Light and dark                                         | Tokens and toggle exist; system mode planned  |
| Offline/PWA                | Manifest, icons, service worker                        | Planned; do not claim offline-ready           |
| Creator identity           | NasirPintu (Mohammad Nasiruddin Pintu)                 | Verified in README and About dialog           |

---

18. Working Agreement for Development
    To keep the project understandable and stable:
    Work in small phases.
    Do not introduce several new dependencies at once.
    Before editing, identify the exact files being changed.
    After each meaningful change, run the relevant checks.
    Do not proceed past a failing build without understanding the error.
    Test on the actual Android device, especially camera features.
    Keep this document updated when important architecture or scope
    decisions change.
    Ask before adding any paid service, external data transmission,
    analytics, or account system.
    Prefer simple, maintainable solutions over unnecessary complexity.
    Keep the `main` branch deployable.

---

19. Next Milestone

Milestone 1: Accurate preview and reconciled foundation

1. Continue refining accessible shared UI patterns against the existing branded shell.
2. Start the QR Studio milestone and proceed to scanner and other features in roadmap order.
3. Configure Pages only after PWA work and a public-release visibility decision.

---

End of document.
