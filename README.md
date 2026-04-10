# Michael Truong — Portfolio

Personal portfolio for **Michael Truong**, Design Engineer.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | [Next.js 14](https://nextjs.org) (App Router) | Routing, SSG, performance |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Utility-first styling |
| Animation (complex) | [GSAP](https://gsap.com) + ScrollTrigger | Scroll-driven reveals, stagger timelines, custom cursor, loader sequence |
| Animation (React) | [Framer Motion](https://www.framer.com/motion) | Component transitions, page-level motion |

---

## Design Direction

- **Aesthetic:** Dark minimal editorial with film grain / analog texture
- **Motion:** Scroll-driven reveals + cursor interactions
- **Typography:** Warm off-white (`#F0EDE8`) primary, muted warm tones for secondary text — no pure white
- **Base color:** `#080808`

---

## Layout

Homepage uses a custom **3×3 CSS Grid** that doubles as both the intro loader and the main portfolio view:

- **Loader state** — only the center cell is visible, playing a muted autoplay intro clip at 66% size
- **Reveal sequence** — video ends → center scales to 100% → 8 surrounding cells animate in clockwise order (`2→3→6→9→8→7→4→1`) via GSAP stagger timeline
- **Final state** — center cell becomes the hero block (`Michael Truong / Design Engineer`), surrounding 8 cells are project cards with hover interactions

---

## Routes

```
/                  → Homepage (3×3 grid loader + portfolio)
/work/[slug]       → Individual project case study
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
