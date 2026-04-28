# Loader Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-screen SVG script-M loader that draws itself with a pink→purple gradient, then transitions into the work-list card stack via a GSAP scale/blur/glow materialization.

**Architecture:** `Loader.tsx` manages its own GSAP timeline and calls `onDone()` when complete. `page.tsx` becomes a client component owning `loaderDone` state, rendering `<Loader>` until done and passing `loaderDone` to `<WorkList>`. `WorkList` initialises the first card at scale 0.6 / blur 14px / opacity 0 when the loader is present, then runs the materialization timeline when `loaderDone` flips to `true`.

**Tech Stack:** Next.js 14, React 18, GSAP 3, TypeScript, Jest + Testing Library, Playwright

---

## File Map

| File | Status | Responsibility |
|---|---|---|
| `components/Loader.tsx` | **Create** | SVG M draw animation + fade-out + `onDone` callback |
| `__tests__/Loader.test.tsx` | **Create** | Unit tests for Loader render + callback |
| `app/page.tsx` | **Modify** | Add `'use client'`, `loaderDone` state, render Loader conditionally |
| `components/WorkList.tsx` | **Modify** | Accept `loaderDone` prop, set initial card state, run materialization |

---

## Task 1: Create Loader component

**Files:**
- Create: `components/Loader.tsx`

- [ ] **Step 1: Create the file**

```tsx
// components/Loader.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface LoaderProps {
  onDone: () => void
}

export default function Loader({ onDone }: LoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<SVGEllipseElement>(null)

  useEffect(() => {
    const path = pathRef.current
    const overlay = overlayRef.current
    const glow = glowRef.current
    if (!path || !overlay || !glow) return

    const length = path.getTotalLength()

    const tl = gsap.timeline()

    // Set up stroke draw starting state
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1,
    })
    gsap.set(glow, { opacity: 0 })

    tl
      // Draw M and pulse glow simultaneously
      .to(path, {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: 'power2.inOut',
      })
      .to(glow, {
        opacity: 0.5,
        duration: 1.1,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1,
      }, '<')
      // Hold 300ms
      .to({}, { duration: 0.3 })
      // Fade out entire overlay
      .to(overlay, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.in',
        onComplete: onDone,
      })

    return () => { tl.kill() }
  }, [onDone])

  return (
    <div
      ref={overlayRef}
      data-testid="loader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: '#080808',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width="220"
        height="200"
        viewBox="0 0 220 200"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="loader-stroke-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f0abfc" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <radialGradient id="loader-glow-grad" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#d946ef" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Radial glow underneath */}
        <ellipse
          ref={glowRef}
          cx="110"
          cy="130"
          rx="80"
          ry="55"
          fill="url(#loader-glow-grad)"
        />

        {/* Fluid script M — single continuous bezier path */}
        <path
          ref={pathRef}
          d="M 42,160 C 40,135 41,100 46,70 C 50,50 58,40 64,44 C 70,48 74,65 76,85 C 78,100 80,115 84,108 C 90,96 96,68 102,52 C 108,36 116,33 122,40 C 128,47 130,66 130,88 C 130,110 130,130 133,148 C 134,153 136,158 140,162"
          stroke="url(#loader-stroke-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/ngutruong/Desktop/CURRENT PROJECTS - CLAUDE/michael-truong-portfolio" && npx tsc --noEmit
```

Expected: no errors related to `Loader.tsx`

- [ ] **Step 3: Commit**

```bash
cd "/Users/ngutruong/Desktop/CURRENT PROJECTS - CLAUDE/michael-truong-portfolio" && git add components/Loader.tsx && git commit -m "feat: add Loader component with SVG script-M draw animation"
```

---

## Task 2: Write and pass Loader unit tests

**Files:**
- Create: `__tests__/Loader.test.tsx`

GSAP and SVG `getTotalLength` don't work in jsdom. We mock both and verify render + callback behaviour.

- [ ] **Step 1: Create the test file**

```tsx
// __tests__/Loader.test.tsx
import React from 'react'
import { render, screen, act } from '@testing-library/react'
import Loader from '@/components/Loader'

// Mock GSAP — jsdom has no layout engine, animations are no-ops
jest.mock('gsap', () => ({
  gsap: {
    timeline: jest.fn(() => {
      const tl = {
        to: jest.fn().mockReturnThis(),
        kill: jest.fn(),
      }
      return tl
    }),
    set: jest.fn(),
    to: jest.fn(),
  },
}))

// SVGPathElement.getTotalLength doesn't exist in jsdom
beforeAll(() => {
  Object.defineProperty(SVGPathElement.prototype, 'getTotalLength', {
    value: () => 600,
    configurable: true,
  })
})

describe('Loader', () => {
  it('renders the loader overlay', () => {
    render(<Loader onDone={jest.fn()} />)
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('renders the SVG element', () => {
    const { container } = render(<Loader onDone={jest.fn()} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders the M path', () => {
    const { container } = render(<Loader onDone={jest.fn()} />)
    expect(container.querySelector('path')).toBeInTheDocument()
  })

  it('renders the glow ellipse', () => {
    const { container } = render(<Loader onDone={jest.fn()} />)
    expect(container.querySelector('ellipse')).toBeInTheDocument()
  })

  it('accepts onDone prop without throwing', () => {
    const onDone = jest.fn()
    expect(() => render(<Loader onDone={onDone} />)).not.toThrow()
  })
})
```

- [ ] **Step 2: Run tests and confirm they pass**

```bash
cd "/Users/ngutruong/Desktop/CURRENT PROJECTS - CLAUDE/michael-truong-portfolio" && npx jest __tests__/Loader.test.tsx --no-coverage
```

Expected output: `5 passed`

- [ ] **Step 3: Commit**

```bash
cd "/Users/ngutruong/Desktop/CURRENT PROJECTS - CLAUDE/michael-truong-portfolio" && git add __tests__/Loader.test.tsx && git commit -m "test: add Loader unit tests"
```

---

## Task 3: Wire loader state in page.tsx

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace page.tsx**

```tsx
// app/page.tsx
'use client'

import { useState } from 'react'
import WorkList from '@/components/WorkList'
import Loader from '@/components/Loader'

export default function HomePage() {
  const [loaderDone, setLoaderDone] = useState(false)

  return (
    <main>
      {!loaderDone && <Loader onDone={() => setLoaderDone(true)} />}
      <WorkList loaderDone={loaderDone} />
    </main>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/ngutruong/Desktop/CURRENT PROJECTS - CLAUDE/michael-truong-portfolio" && npx tsc --noEmit
```

Expected: type error on WorkList because it doesn't accept `loaderDone` yet — **this is expected at this step**, continue to Task 4.

- [ ] **Step 3: Commit**

```bash
cd "/Users/ngutruong/Desktop/CURRENT PROJECTS - CLAUDE/michael-truong-portfolio" && git add app/page.tsx && git commit -m "feat: wire loaderDone state in page.tsx"
```

---

## Task 4: Update WorkList to accept loaderDone and run materialization

**Files:**
- Modify: `components/WorkList.tsx`

The changes are:
1. Accept `loaderDone: boolean` prop
2. Add `textRef` for the first card's text block
3. In the initial-positions `useEffect`, set card 0 to the pre-materialization state when `!loaderDone`
4. Add a new `useEffect` that fires when `loaderDone` becomes `true` and runs the materialization timeline

- [ ] **Step 1: Replace the top of WorkList.tsx (imports + STACK + getProps — unchanged) and the component signature**

Open `components/WorkList.tsx`. Change line 31:

```tsx
// FROM:
export default function WorkList() {
// TO:
export default function WorkList({ loaderDone }: { loaderDone: boolean }) {
```

- [ ] **Step 2: Add textRef after the existing refs (after line 47, `const playgroundRef`)**

```tsx
  const textRef = useRef<HTMLDivElement>(null)
```

- [ ] **Step 3: Replace the initial-positions useEffect (lines 54–60) with a loaderDone-aware version**

```tsx
  // Set initial positions — card 0 starts hidden when loader is present
  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const { y, scale, opacity, zIndex } = getProps(i)
      if (!loaderDone && i === 0) {
        gsap.set(card, { y, zIndex, scale: 0.6, filter: 'blur(14px)', opacity: 0 })
      } else if (!loaderDone) {
        gsap.set(card, { y, scale, zIndex, opacity: 0 })
      } else {
        gsap.set(card, { y, scale, opacity, zIndex })
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
```

- [ ] **Step 4: Add the materialization useEffect after the initial-positions useEffect**

```tsx
  // Materialize card stack when loader completes
  useEffect(() => {
    if (!loaderDone) return

    const card0 = cardRefs.current[0]
    if (!card0) return

    // Prepare text: hidden and shifted down
    if (textRef.current) {
      gsap.set(textRef.current, { opacity: 0, y: 10 })
    }

    const tl = gsap.timeline()

    // 1. Card materialises — scale, unblur, fade in, glow blooms then settles
    tl.to(card0, {
      scale: 1,
      filter: 'blur(0px)',
      opacity: 1,
      boxShadow: '0 0 90px 24px rgba(168, 85, 247, 0.35)',
      duration: 0.9,
      ease: 'power2.out',
    })
    // 2. Glow settles to ambient level
    tl.to(card0, {
      boxShadow: '0 0 40px 8px rgba(168, 85, 247, 0.12)',
      duration: 1.0,
      ease: 'power2.out',
    }, '>0.05')
    // 3. Text fades in (delayed 0.5s from card start)
    if (textRef.current) {
      tl.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      }, '<-0.5')
    }
    // 4. Stack cards fade in
    cardRefs.current.slice(1).forEach((card, i) => {
      if (!card) return
      const stackProps = getProps(i + 1)
      tl.to(card, {
        opacity: stackProps.opacity,
        duration: 0.4,
        ease: 'power2.out',
      }, i === 0 ? '<0.1' : '<0.05')
    })

    return () => { tl.kill() }
  }, [loaderDone])
```

- [ ] **Step 5: Add textRef to the first card's text block in JSX**

Find the text div inside the card map (around line 261):

```tsx
// FROM:
              <div className="absolute left-8 bottom-8">
// TO:
              <div ref={index === 0 ? textRef : undefined} className="absolute left-8 bottom-8">
```

- [ ] **Step 6: Verify TypeScript compiles cleanly**

```bash
cd "/Users/ngutruong/Desktop/CURRENT PROJECTS - CLAUDE/michael-truong-portfolio" && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 7: Run all Jest tests**

```bash
cd "/Users/ngutruong/Desktop/CURRENT PROJECTS - CLAUDE/michael-truong-portfolio" && npx jest --no-coverage
```

Expected: all tests pass

- [ ] **Step 8: Commit**

```bash
cd "/Users/ngutruong/Desktop/CURRENT PROJECTS - CLAUDE/michael-truong-portfolio" && git add components/WorkList.tsx && git commit -m "feat: add card materialization sequence on loader complete"
```

---

## Task 5: Update Playwright e2e test

**Files:**
- Modify: `e2e/homepage.spec.ts`

The existing tests check for text that appears after the loader. Since the loader now overlays the page, we must wait for it to clear before asserting on card content.

- [ ] **Step 1: Update homepage.spec.ts**

```ts
// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('renders nav links', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="loader"]', { state: 'detached', timeout: 8000 })
    await expect(page.getByText('Michael Truong')).toBeVisible({ timeout: 4000 })
    await expect(page.getByText('Work')).toBeVisible()
    await expect(page.getByText('Creative')).toBeVisible()
  })

  test('renders project cards from project data', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="loader"]', { state: 'detached', timeout: 8000 })
    await expect(page.getByText('Product Design')).toBeVisible({ timeout: 4000 })
    await expect(page.getByText('Redesigning the checkout flow')).toBeVisible()
  })
})
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/ngutruong/Desktop/CURRENT PROJECTS - CLAUDE/michael-truong-portfolio" && git add e2e/homepage.spec.ts && git commit -m "test: update e2e tests to wait for loader to complete"
```

---

## Task 6: Add .superpowers to .gitignore

**Files:**
- Modify: `.gitignore` (or create if missing)

- [ ] **Step 1: Check if .gitignore exists and add entry**

```bash
cd "/Users/ngutruong/Desktop/CURRENT PROJECTS - CLAUDE/michael-truong-portfolio" && grep -q '.superpowers' .gitignore 2>/dev/null || echo '.superpowers/' >> .gitignore
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/ngutruong/Desktop/CURRENT PROJECTS - CLAUDE/michael-truong-portfolio" && git add .gitignore && git commit -m "chore: ignore .superpowers brainstorm directory"
```

---

## Task 7: Visual smoke test in browser

- [ ] **Step 1: Start dev server**

```bash
cd "/Users/ngutruong/Desktop/CURRENT PROJECTS - CLAUDE/michael-truong-portfolio" && npm run dev
```

- [ ] **Step 2: Open http://localhost:3000 and verify**

Check:
1. Black screen appears with centered SVG "M" that draws itself left-to-right with pink→purple gradient
2. Radial purple glow pulses underneath during draw
3. Loader fades to black at ~3s
4. First card materializes from center — starts small+blurry, scales to full, purple glow blooms then settles
5. Card text fades in ~0.5s after card appears
6. Stack cards (positions 1, 2) fade into view behind the active card
7. Scroll behaviour works normally after materialization

- [ ] **Step 3: Stop dev server and commit any fixes**

```bash
# Ctrl+C to stop
```
