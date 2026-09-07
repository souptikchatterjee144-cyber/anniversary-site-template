# Project Performance, Size & Dead Code Audit

> **Audit Mode:** STRICTLY READ-ONLY (No modifications, deletions, or refactors were made to existing project code or dependencies during this pass).

---

## Executive Summary

| Category | Current State | Target / Optimization Potential | Key Opportunities |
| :--- | :--- | :--- | :--- |
| **Total Disk Footprint** | **~488 MB** | **~45 MB** (excl. node_modules) | Delete ~19.5 MB unused doc PNGs in `src/assets/`, prune dead components |
| **node_modules Size** | **431.8 MB** | **~180–220 MB** | Remove unused heavy libs (`recharts`, `stats-gl`, Radix UI suites, `hls.js`) |
| **Production JS Bundle** | **1.75 MB** (499.5 kB gzip) | **< 650 kB** (< 180 kB gzip) | Dynamic `React.lazy()` for Three.js (`918 kB`), remove unused Radix (`178 kB`) |
| **Production CSS** | **113.7 kB** (18.3 kB gzip) | **~35 kB** (~8 kB gzip) | Purge unused CSS rules & animations from legacy components |
| **Mobile Runtime FPS** | Dropping on older GPUs | **Solid 60 FPS** | Replace `backdrop-blur` with solid/tinted RGBA on mobile, canvas emoji trail |

---

## 1. Size Breakdown

### 1.1 Directory Breakdown (Top-Level)

```text
.
├── node_modules/         431.78 MB   (88.4% of total project size)
├── src/                   24.59 MB    (5.0% of total project size)
│   ├── src/assets/        23.49 MB    (95.5% of src/)
│   ├── src/components/     0.52 MB
│   ├── src/test/           0.27 MB
│   └── src/config/         0.16 MB
├── .git/                  25.20 MB    (5.2% of total project size)
├── dist/                   5.17 MB    (Production output)
├── public/                 0.73 MB
├── obsidian-docs/          0.26 MB
├── .github/                0.09 MB
└── skills/                 0.04 MB
```

---

### 1.2 Asset Size Deep-Dive (`src/assets/` & `public/`)

#### 🔴 Unused High-Resolution Documentation PNGs in `src/assets/` (~19.5 MB)
Eleven full-resolution desktop screenshot PNGs are stored directly inside `src/assets/`. None of these are imported or referenced anywhere in application code:

| File Path | Size (KB) | Size (MB) | Status / Purpose |
| :--- | :--- | :--- | :--- |
| `src/assets/Memeory album.png` | 2,237.5 KB | **2.24 MB** | ❌ Unreferenced screenshot |
| `src/assets/cake cutting.png` | 2,115.2 KB | **2.12 MB** | ❌ Unreferenced screenshot |
| `src/assets/contribute.png` | 1,960.3 KB | **1.96 MB** | ❌ Unreferenced screenshot |
| `src/assets/faq.png` | 1,898.7 KB | **1.90 MB** | ❌ Unreferenced screenshot |
| `src/assets/birthday-boom.png` | 1,897.5 KB | **1.90 MB** | ❌ Unreferenced screenshot |
| `src/assets/file-by-file.png` | 1,886.8 KB | **1.89 MB** | ❌ Unreferenced screenshot |
| `src/assets/env.png` | 1,846.1 KB | **1.85 MB** | ❌ Unreferenced screenshot |
| `src/assets/why.png` | 1,777.9 KB | **1.78 MB** | ❌ Unreferenced screenshot |
| `src/assets/mastering-the-lifecycle.png` | 1,754.8 KB | **1.75 MB** | ❌ Unreferenced screenshot |
| `src/assets/footer.png` | 1,485.3 KB | **1.49 MB** | ❌ Unreferenced screenshot |
| `src/assets/starting.png` | 1,167.0 KB | **1.17 MB** | ❌ Unreferenced screenshot |
| **Subtotal Unused Docs** | | **~19.5 MB** | |

#### 🟡 Birthday & Cake Theme Assets in `src/assets/birthday/` & `public/`
| File Path | Size (KB) | Referenced In | Optimization Potential |
| :--- | :--- | :--- | :--- |
| `src/assets/birthday/cake-maroon.png` | 845.9 KB | `CakeTypes.ts` | Convert to WebP (~65 KB) |
| `src/assets/birthday/birthday-maroon.png` | 845.9 KB | ❌ Unused | Delete or compress |
| `src/assets/birthday/cake-pink.png` | 647.5 KB | `CakeTypes.ts` | Convert to WebP (~50 KB) |
| `src/assets/birthday/cake-green.png` | 644.8 KB | `CakeTypes.ts` | Convert to WebP (~50 KB) |
| `src/assets/birthday/birthday-gold.png` | 571.0 KB | `CakeTypes.ts`, `index.css` | Convert to WebP (~45 KB) |
| `src/assets/birthday/birthday-cute.png` | 436.9 KB | ❌ Unused | Delete |
| `public/assets/cakes/chocolate/whole.png` | 568.5 KB | Cake static fallback | Convert to WebP (~45 KB) |
| `src/assets/photo-1.jpg` – `photo-3.jpg` | 30.0 KB | ❌ Unused dummy photos | Delete |

---

### 1.3 Production Bundle Breakdown (`dist/`)

Running `npm run build` generates **5.17 MB** of assets:

```text
dist/
├── three.C2gSP6Pm.js              918.49 kB  (gzip: 248.93 kB)  <-- Three.js, R3F, Drei, Spring
├── vendor.D3Kt0aSk.js             349.14 kB  (gzip:  95.79 kB)  <-- React, Tone.js, Zustand
├── radix-ui.CijCvFcT.js           177.89 kB  (gzip:  59.03 kB)  <-- 20+ Unused Radix UI Primitives
├── index.TJ0W1OT4.js              174.07 kB  (gzip:  49.76 kB)  <-- Core App Code & Scenes
├── framer-motion.BIsPxkIj.js      139.56 kB  (gzip:  45.98 kB)  <-- Framer Motion Animation Engine
├── index.BhXXy22U.css             113.73 kB  (gzip:  18.26 kB)  <-- Global CSS + Tailwind Utilities
├── cake-maroon.CrnqlWVY.png       866.15 kB  (Image asset)
├── cake-pink.Bnof7J6c.png         663.06 kB  (Image asset)
├── cake-green.NO8zVsof.png        660.27 kB  (Image asset)
├── birthday-gold.D9QHkwH2.png     584.72 kB  (Image asset)
├── whole.png (public)             582.18 kB  (Image asset)
└── index.html                      14.16 kB  (gzip:   4.06 kB)
```

**Key Finding:** `three.js` (918 kB) is bundled synchronously into initial page load even though the cake scene is only reached in Phase 5 ("cake").

---

### 1.4 Top 15 Dependencies in `node_modules/` by Disk Size

| Dependency | Disk Size | Required for App Runtime? | Notes |
| :--- | :--- | :---: | :--- |
| `lucide-react` | 27.18 MB | ✅ (Tree-shaken) | Icons (only imported ones bundled) |
| `@swc/*` | 26.83 MB | 🛠️ Dev only | Vite React SWC compiler |
| `.vite/` | 26.71 MB | ⚡ Dev cache | Local pre-bundle cache |
| `stats-gl` | 26.27 MB | ❌ **Unused** | Transitive / debug GL stats |
| `three-stdlib` | 25.68 MB | 🟡 (Drei dependency) | Needed only for 3D helpers |
| `hls.js` | 23.64 MB | ❌ **Unused** | Video streaming lib (no HLS streams used) |
| `typescript` | 22.53 MB | 🛠️ Dev only | Compiler |
| `three` | 22.10 MB | ✅ (Cake scene) | Core 3D engine |
| `date-fns` | 21.13 MB | ❌ **Unused** | App uses native `Intl` and countdown math |
| `@rolldown/*` | 20.01 MB | 🛠️ Dev only | Bundler internal |
| `@mediapipe/*` | 19.47 MB | ❌ **Unused** | Face/hand tracking dependency (never called) |
| `@esbuild/*` | 11.15 MB | 🛠️ Dev only | Vite build tool |
| `lightningcss-*` | 9.06 MB | 🛠️ Dev only | CSS parser |
| `@dimforge/*` | 7.17 MB | ❌ **Unused** | Physics engine (not used in cake scene) |
| `recharts` | 7.11 MB | ❌ **Unused** | Charting library (never imported in active code) |

---

## 2. Dead Code Audit

### 2.1 Unused & Legacy Birthday Components in `src/components/birthday/`

The application was transitioned from a monolithic `MainBirthday.tsx` container to the phase-driven `Index.tsx` state machine (`countdown` → `loveqa` → `bigquestion` → `balloons` → `cake` → `puzzles` → `scratch` → `gallery` → `letter` → `goodbye`).

As a result, the following 19 components are completely bypassed in the active user flow:

| Component File | Size | Where Referenced | Status |
| :--- | :--- | :--- | :--- |
| `CinematicIntro.tsx` | 48.5 KB | Self / test files | ❌ Dead component |
| `FakeChatScene.tsx` | 39.4 KB | `CinematicIntro.tsx`, test | ❌ Dead component |
| `WishDeck.tsx` | 28.6 KB | `MainBirthday.tsx` only | ❌ Dead component |
| `EnvelopeLetterScene.tsx` | 27.2 KB | `MainBirthday.tsx` only | ❌ Replaced by `FinalLetterSection.tsx` |
| `HeartTree.tsx` | 26.4 KB | `MainBirthday.tsx` only | ❌ Dead component |
| `MainBirthday.tsx` | 23.3 KB | None (bypassed by `Index.tsx`) | ❌ Dead legacy container |
| `BirthdayQuiz.tsx` | 20.4 KB | `MainBirthday.tsx` only | ❌ Dead component |
| `ShareCelebrationModal.tsx` | 19.4 KB | `MainBirthday.tsx` only | ❌ Dead component |
| `PhotoGallery.tsx` | 18.2 KB | `MainBirthday.tsx` only | ❌ Replaced by `FinalGallerySection.tsx` |
| `BalloonPopGame.tsx` | 17.5 KB | `MainBirthday.tsx` only | ❌ Dead component |
| `VideoGallery.tsx` | 17.2 KB | `MainBirthday.tsx` only | ❌ Dead component |
| `PasswordUnlock.tsx` | 13.9 KB | Test only | ❌ Dead component |
| `HeartProgression.tsx` | 12.7 KB | `MainBirthday.tsx` only | ❌ Dead component |
| `FinalSurprise.tsx` | 11.3 KB | `MainBirthday.tsx` only | ❌ Dead component |
| `PremiumFireworks.tsx` | 9.6 KB | Test only | ❌ Dead component |
| `HighlightedText.tsx` | 7.1 KB | `CinematicIntro.tsx` only | ❌ Dead component |
| `FloatingElements.tsx` | 6.0 KB | None | ❌ Dead component |
| `SplashScreen.tsx` | 5.8 KB | None | ❌ Dead component |
| `FireflyEffect.tsx` | 1.4 KB | Test only | ❌ Dead component |
| `ShootingStars.tsx` | 1.7 KB | Test only | ❌ Dead component |
| `SparkleRain.tsx` | 1.4 KB | Test only | ❌ Dead component |

---

### 2.2 Unused Dependencies in `package.json`

The following packages are installed in `dependencies` but are not part of the active anniversary experience:

1. **`recharts` (3.10.1)**: Zero references in active app.
2. **`@radix-ui/react-*`**: 22 separate Radix UI packages are listed in `package.json` (`react-accordion`, `react-alert-dialog`, `react-aspect-ratio`, `react-avatar`, `react-checkbox`, `react-collapsible`, `react-context-menu`, `react-hover-card`, `react-menubar`, `react-navigation-menu`, `react-popover`, `react-progress`, `react-radio-group`, `react-scroll-area`, `react-select`, `react-separator`, `react-slider`, `react-switch`, `react-toggle`, `react-toggle-group`). They account for **177.9 kB** of production JavaScript chunking.
3. **`react-day-picker` (8.10.1)**: Unused.
4. **`react-hook-form` (7.84.0)**: Unused.
5. **`react-resizable-panels` (2.1.9)**: Unused.
6. **`cmdk` (1.1.1)**: Unused.
7. **`input-otp` (1.4.2)**: Unused.
8. **`embla-carousel-react` (8.6.0)**: Unused.
9. **`vaul` (1.1.2)**: Unused drawer library.

---

## 3. Runtime Performance Audit

### 3.1 Three.js Cake Scene (`Cake3D.tsx` & `CakeCutting.tsx`)
- **Mesh & Geometry Complexity**:
  - `Cake3D` renders:
    - 250 individual `Sprinkles` (instanced via `@react-three/drei` `Instances`, which is good).
    - 36 capsule meshes for drips (`capsuleGeometry` with `meshPhysicalMaterial`).
    - 28 sphere meshes for frosting rosettes.
    - `ContactShadows` plane underneath.
    - `Float` continuous physics animation container.
- **Mobile GPU Bottlenecks**:
  - `meshPhysicalMaterial` with `clearcoat: 1` and `roughness: 0.05` triggers high-precision specular calculations and reflection probes on every frame.
  - `ContactShadows` executes an off-screen render pass with 512x512 depth map filtering.
  - **Recommendation**: For mobile devices (`isMobile = true`), swap `meshPhysicalMaterial` to `meshStandardMaterial` with `clearcoat: 0` and disable `ContactShadows` or reduce blur resolution.

---

### 3.2 3D Transforms & Perspective (`FinalLetterSection.tsx`)
- **Interaction Mechanics**:
  - Heart seal dragging (`useTransform(sealDragY, [-85, 0], [180, 0])`) manipulates 3D `rotateX` on the envelope flap.
  - Scroll extraction (`scrollDragY`) and knot untying (`ribbonStretchY`).
- **Performance Evaluation**:
  - Animations are strictly bound to `transform` and `opacity` (compositor-friendly).
  - Perspective transforms are isolated to `#final-letter-stage` container (`perspective: 1200px`).
  - No continuous background loops run when off-screen.

---

### 3.3 Canvas Performance (`ScratchReveal.tsx`)
- **Canvas Operations**:
  - `initCanvas()` renders metallic gradient and 45 sparkle circles once.
  - `checkScratchPercentage()` runs `ctx.getImageData(0, 0, canvas.width, canvas.height)` during touch drag.
- **Status**:
  - Optimizations are already present: samples every 4th pixel (`i += 16`) and uses `willReadFrequently: true`.
  - Throttle safety: runs only during active dragging.

---

### 3.4 Particle & Gesture Systems (`EmojiCursorTrail.tsx` & `Confetti.tsx`)
- **Emoji Cursor Trail**:
  - Uses Framer Motion `motion.span` elements with React state updates (`setParticles`).
  - Mobile parameters: max 10 particles, 32ms throttle, 5-particle burst on tap.
  - While throttled, React reconciliation on `pointermove` can cause frame drops on low-tier mobile CPUs. A direct `<canvas>` or lightweight pooling approach is even lighter.
- **Confetti**:
  - `canvas-confetti` renders on dedicated HTML5 canvas.
  - Mobile limits particle counts to 18–30 (down from 100 on desktop) and reduces tick duration to 80.

---

### 3.5 Heavy CSS `backdrop-filter: blur(...)` Usage
- **Problem**:
  - Ripgrep search found **40+ DOM elements** actively applying `backdrop-blur-md`, `backdrop-blur-xl`, `backdrop-blur-2xl`, and `backdrop-blur-3xl`.
  - On mobile GPUs (especially Android devices and iOS Safari in low power mode), backdrop filters force real-time rasterization of all layers underneath for every frame of movement or touch scrolling.
- **Recommendation**:
  - On mobile screens, replace heavy `backdrop-blur-2xl` with semi-opaque tinted backgrounds: e.g. `bg-black/90` or `bg-pink-950/80` without `backdrop-filter`.

---

## 4. Ranked Action Plan (Impact vs. Effort)

| Priority & Rank | Action Item | Expected Impact | Implementation Effort | Safe to Automate? | Details / Approval Notes |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **#1** | **Lazy-load Three.js (`Cake3D`)** | 🟢 **CRITICAL** (~918 kB JS deferred) | ⚡ Low (15 mins) | 🤖 **Safe** | Use `React.lazy()` for `Cake3D.tsx` so 3D engine is only downloaded when user reaches cake phase. |
| **#2** | **Delete ~19.5 MB unused doc PNGs** in `src/assets/` | 🟢 **CRITICAL** (Repo size -20 MB) | ⚡ Low (5 mins) | 🤖 **Safe** | Remove 11 unused screenshot files in `src/assets/`. |
| **#3** | **Convert Cake PNGs to WebP** | 🟡 **HIGH** (~2.8 MB → ~220 KB dist size) | ⚡ Low (10 mins) | 🤖 **Safe** | Convert `cake-maroon.png`, `cake-pink.png`, `cake-green.png`, `birthday-gold.png` to `.webp`. |
| **#4** | **Prune unused npm dependencies** | 🟡 **HIGH** (node_modules -80 MB, bundle -180 kB) | ⏳ Medium (20 mins) | 👤 **Manual Review** | Uninstall `recharts`, unused `@radix-ui/*` packages, `cmdk`, `vaul`, `input-otp`, `embla-carousel-react`. |
| **#5** | **Mobile CSS `backdrop-blur` bypass** | 🟡 **HIGH** (Mobile GPU FPS boost) | ⏳ Medium (30 mins) | 🤖 **Safe** | Add `@media (max-width: 768px)` override to suppress expensive `backdrop-filter` in favor of solid background colors. |
| **#6** | **Prune dead birthday components** | 🔵 **MEDIUM** (Clean codebase, -350 KB source) | ⏳ Medium (25 mins) | 👤 **Manual Review** | Remove unused legacy files (`CinematicIntro.tsx`, `MainBirthday.tsx`, `FakeChatScene.tsx`, etc.) after verifying no future dependency. |
| **#7** | **Optimize Three.js Materials on Mobile** | 🔵 **MEDIUM** (Lower shader overhead on phone) | ⏳ Medium (20 mins) | 🤖 **Safe** | Switch `meshPhysicalMaterial` to `meshStandardMaterial` and disable contact shadows when `isMobile` is true. |

---

## 5. Next Steps for Approval

To proceed with optimizations, please review the ranked action items above and specify which phases you would like implemented:
- **Phase A (Zero Risk / Immediate Wins)**: Items #1 (Lazy load Three.js), #2 (Remove unused doc PNGs), and #3 (Convert cake PNGs to WebP).
- **Phase B (Runtime Polish)**: Items #5 (Mobile backdrop-blur bypass) and #7 (Mobile 3D shader optimization).
- **Phase C (Dependency & Dead Code Cleanup)**: Items #4 (Prune unused npm packages) and #6 (Remove dead legacy components).
