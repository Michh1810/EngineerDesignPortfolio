# Loader + Card Materialization — Design Spec
_2026-04-27_

## Overview

A full-screen intro loader featuring an SVG fluid-script "M" signature that draws itself with a pink→purple gradient stroke, followed by a GSAP-sequenced transition where the first work-list card materializes from the void.

---

## Phase 1 — Loader

**Component:** `components/Loader.tsx`

- Full-screen fixed overlay, `z-50`, background `#080808`
- Centered SVG canvas (~220×200px viewBox)
- **M path:** Fluid script cursive (single continuous bezier path, forward-leaning arches with looping entry)
- **Stroke:** `linearGradient` — `#f0abfc` → `#c084fc` → `#7c3aed`, left-to-right
- **Glow:** `radialGradient` ellipse underneath the M, `#d946ef` → transparent
- **Animation sequence (GSAP):**
  1. `gsap.set` — `strokeDasharray` and `strokeDashoffset` to full path length
  2. Tween `strokeDashoffset` → 0 over 2.2s (`power2.inOut`) — draws the M
  3. Glow opacity pulses 0.2 → 0.6 in sync (1.1s yoyo repeat)
  4. Hold 300ms after draw completes
  5. Fade entire loader opacity 1 → 0 over 0.6s (`power2.in`)
  6. `onComplete` → call `onDone()` prop to signal parent

**Props:** `{ onDone: () => void }`

---

## Phase 2 — Card Materialization

**Modified:** `components/WorkList.tsx` and `app/page.tsx`

### State coordination

`app/page.tsx` holds `loaderDone: boolean` (default `false`). Passes `onDone` to `<Loader>` and `loaderDone` to `<WorkList>`.

### WorkList initial state

When `loaderDone === false`, the active card (index 0) is initialized via `gsap.set` to:
- `scale: 0.6`
- `filter: blur(14px)`
- `opacity: 0`

All other cards keep their normal stacked positions but `opacity: 0` until materialization completes.

### Materialization sequence (triggered when `loaderDone` flips to `true`)

1. **Card body** — scale `0.6 → 1.0`, blur `14px → 0px`, opacity `0 → 1` — duration 0.9s, `power2.out`
2. **Outer glow** — a separate `div` wrapper with `box-shadow` transitions from `0` to the ambient pink/purple shadow — duration 0.9s in sync
3. **Card text** (title + number) — opacity `0 → 1`, translateY `8px → 0` — duration 0.4s, delay 0.5s
4. **Stack cards** (index 1, 2) — fade in to their normal stacked opacity — duration 0.4s, delay 0.6s

---

## Component Tree

```
app/page.tsx
  ├── <Loader onDone={...} />        (conditionally rendered while !loaderDone)
  └── <WorkList loaderDone={...} />
```

---

## Constraints

- No new npm dependencies — GSAP already installed
- SVG path length computed via `getTotalLength()` at mount, not hardcoded
- Loader is a client component (`'use client'`)
- WorkList already `'use client'` — no change needed
- `.superpowers/` added to `.gitignore`
