# Site Design Tokens Reference

## 1. Color Palette (HSL & Hex)
- **Background**: `hsl(335 45% 12%)` — Deep wine/rose romantic base
- **Foreground / Text**: `hsl(45 100% 96%)` — Soft warm cream
- **Card Surface**: `hsl(335 30% 16%)` — Velvet rose-tinted surface
- **Card Foreground**: `hsl(45 100% 96%)`
- **Border / Outline**: `hsl(335 30% 28%)` — Subtle rose border
- **Primary Accent**: `hsl(335 85% 60%)` (#f2417e / #e84393) — Hot romantic pink
- **Secondary Accent**: `hsl(270 60% 55%)` — Deep royal purple
- **Gold Accent / Tertiary**: `hsl(45 100% 60%)` (#ffd233) — Warm glowing gold
- **Muted**: `hsl(335 25% 22%)` / Muted Text: `hsl(335 15% 75%)`
- **Confetti Colors**: `["#e84393", "#a855f7", "#f59e0b", "#38bdf8", "#f97316", "#34d399"]`

## 2. Typography
- **Headings / Hero Title**: `'Playfair Display', serif` (font-bold, elegant editorial serif)
- **Body & Buttons**: `'Quicksand', sans-serif` (font-medium, soft rounded terminals)
- **Decorative / Handwritten**: `'Dancing Script', cursive` & `'Caveat', cursive`
- **Subtitles & Badges**: `'Outfit', sans-serif` or `'Cinzel', serif`

## 3. Textures & Overlays
- **Grain Overlay**: SVG fractal noise filter overlay on `body::after` (`opacity: 0.04`, `mix-blend-mode: overlay`, fixed inset)
- **Vignette**: Radial gradient (`radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)`)
- **Card Shadows / Glows**: Soft outer glows `0 0 20px -5px hsl(335 85% 60% / 0.3)` or `text-shadow: 0 0 20px hsl(330 85% 60% / 0.5)`

## 4. Shapes & Spacing
- **Border Radius**: `0.75rem` (12px) standard elements, `1.5rem` (24px) for cards/containers, `9999px` for pill action buttons
- **Base Grid / Rhythm**: 4px unit, generous breathing room with centered layouts

## 5. Motion Style
- **Transitions**: Framer Motion fade + scale (`initial: { opacity: 0, scale: 0.95 }`, `animate: { opacity: 1, scale: 1 }`, duration `0.4s - 0.8s`, `ease: "easeOut"`)
- **Springs**: `{ damping: 20, stiffness: 150 }`
