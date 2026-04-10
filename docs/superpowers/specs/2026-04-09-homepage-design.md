# Homepage Design Spec — Michael Truong Portfolio
**Date:** 2026-04-09
**Scope:** Main homepage only (`/`). Case study pages (`/work/[slug]`) are out of scope for this phase.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation (complex) | GSAP + ScrollTrigger |
| Animation (React) | Framer Motion |

---

## Visual Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `bg-base` | `#080808` | Page background |
| `text-primary` | `#F0EDE8` | Headings, name, hero text |
| `text-secondary` | `#A09890` | Subheadings, metadata |
| `text-muted` | `#605850` | Labels, tags, nav links |
| `border-subtle` | `#141414` | Cell borders, nav border |
| `border-hover` | `#242420` | Cell hover borders |

**Film grain:** SVG fractal noise overlay, `opacity: 0.055`, animated at `0.7s steps(1)` to simulate analog texture. Applied as a fixed `position: fixed` layer at `z-index: 100`, `pointer-events: none`.

**Typography:**
- Display / hero: `font-weight: 700`, `letter-spacing: -0.8px`, Georgia or similar editorial serif
- Labels / nav / metadata: `font-family: 'Courier New', monospace`, `letter-spacing: 2-4px`, uppercase
- No pure `#ffffff` anywhere — all text uses warm off-white palette above

---

## Layout

### Nav (48px height)
- `position: fixed` or `sticky`, `z-index: 50`
- Left: `Michael Truong` — uppercase monospace, `#F0EDE8`, `letter-spacing: 3px`
- Right: LinkedIn icon + label, GitHub icon + label — muted, hover to `#C8C0B0`
- Bottom border: `1px solid #141414`
- Background: `#080808`

### 3×3 Grid
- `display: grid`, `grid-template-columns: repeat(3, 33.333vw)`, `grid-template-rows: repeat(3, calc((100vh - 48px) / 3))`
- 9 cells: positions 1–9 left-to-right, top-to-bottom
- Cell 5 (center) = video/hero cell
- Cells 1,2,3,4,6,7,8,9 = project cards

---

## Loader Sequence (3 phases)

### Phase 1 — Initial Load
- All 8 surrounding cells: `opacity: 0`, `transform: scale(0.86)`, hidden
- Center cell: fully visible, contains `<video>` element at **66% width × 66% height** of the cell
- Video: `autoplay`, `muted`, `playsInline`, `loop={false}`
- Entire page is the loader — no scroll, `overflow: hidden` on body

### Phase 2 — Transition (triggered by `video.onEnded`)
1. Center video box animates from `66%` → `100%` width/height over `0.9s cubic-bezier(0.16,1,0.3,1)`
2. After `500ms` delay, surrounding cells animate in via GSAP stagger timeline
3. **Reveal order:** `2 → 3 → 6 → 9 → 8 → 7 → 4 → 1` (clockwise from top-center)
4. Each cell: `opacity: 0, scale: 0.86` → `opacity: 1, scale: 1` over `0.65s cubic-bezier(0.16,1,0.3,1)`
5. Stagger: `110ms` between each cell

### Phase 3 — Final State
- All 8 cells fully visible
- Center video fades out, center hero block fades in (`0.7s ease`)
- Hero block content: `Michael Truong` (large serif) / divider / `Design Engineer` (monospace uppercase) / `scroll ↓`
- Body `overflow` restored to enable scroll

---

## Project Cards (8 surrounding cells)

Each card has two states:

**Resting:**
- Cell number (`01`–`08`), project category title, year tag — all in muted tones
- `opacity: 0.6` on inner content

**Hover:**
- Overlay fades in (`#0C0C0A` background, `0.35s ease`)
- Shows: project title (larger, `#F0EDE8`), discipline + year (`#605048`, monospace), `↗` arrow top-right
- Cursor: custom cursor reacts (see Cursor section)
- On click: navigate to `/work/[slug]`

**Project slots (placeholder content, to be replaced):**
| Position | Category |
|----------|----------|
| 1 (top-left) | Experimental Code |
| 2 (top-center) | Product Design |
| 3 (top-right) | Motion Work |
| 4 (mid-left) | Brand Design |
| 6 (mid-right) | Front-End Engineering |
| 7 (bottom-left) | Creative Direction |
| 8 (bottom-center) | UI Systems |
| 9 (bottom-right) | Web Experience |

---

## Custom Cursor

- Hide native cursor on desktop (`cursor: none`)
- Render a custom cursor component: small dot (4px) + larger ring (40px), both follow mouse with lag
- Ring uses `lerp` (linear interpolation) for smooth trailing effect
- On hovering project cards: ring expands, slight glow `box-shadow: 0 0 20px rgba(240,237,232,0.08)`
- Implemented with `requestAnimationFrame` loop, positioned via `transform: translate(x, y)`

---

## Scroll (below the grid)

After the grid, the page continues scrolling with GSAP ScrollTrigger sections:

1. **About** — text reveal, letter-by-letter or line-by-line unmask animation
2. **Skills** — `Front-End Development`, `Product Design` + placeholders, each line draws in on scroll
3. **Contact / Footer** — minimal: email link, social links, copyright

Each section uses GSAP `ScrollTrigger` with `scrub` or `once: true` reveals.

---

## File Structure

```
michael-truong-portfolio/
├── app/
│   ├── layout.tsx          # Root layout: font, grain overlay, custom cursor
│   ├── page.tsx            # Homepage: loader + grid + scroll sections
│   └── globals.css         # Base styles, Tailwind directives
├── components/
│   ├── Loader.tsx          # 3×3 grid loader component
│   ├── GridCell.tsx        # Individual project card cell
│   ├── HeroCell.tsx        # Center cell (video → hero)
│   ├── Nav.tsx             # Top navigation bar
│   ├── GrainOverlay.tsx    # Film grain fixed overlay
│   ├── CustomCursor.tsx    # Custom cursor with lerp
│   └── ScrollSections.tsx  # About + Skills + Contact below grid
├── lib/
│   └── gsap.ts             # GSAP registration (ScrollTrigger, etc.)
├── public/
│   └── intro.mp4           # Intro video (placeholder)
└── README.md
```

---

## Constraints & Notes

- Mobile: grid collapses to single-column scroll on `< 768px`; loader plays video centered, then reveals cards stacked vertically
- No pure `#ffffff` anywhere
- Film grain overlay must not intercept pointer events
- GSAP registered once in `lib/gsap.ts`, imported where needed — avoid duplicate registrations
- Framer Motion used for page-level `AnimatePresence` and simple component transitions only; GSAP owns all scroll and stagger work
