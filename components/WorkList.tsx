'use client'

import { useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { projects } from '@/data/projects'
import PlaygroundSection, { PlaygroundSectionHandle } from './PlaygroundSection'

// Stack visual offsets per card position relative to active
const STACK = [
  { y: 0,   scale: 1,    opacity: 1,   zIndex: 10 }, // active
  { y: 48,  scale: 0.95, opacity: 1,   zIndex: 9  }, // +1
  { y: 84,  scale: 0.90, opacity: 0.6, zIndex: 8  }, // +2
  { y: 110, scale: 0.87, opacity: 0,   zIndex: 7  }, // +3 (hidden but in position)
]

function getProps(offset: number) {
  if (offset < 0) {
    // Exited cards sit above the resting stack (peaks at 10): stagger 19, 18, 17, …
    return {
      y: -window.innerHeight * 0.95,
      scale: 0.95,
      opacity: 0,
      zIndex: 20 + offset,
    }
  }
  const s = STACK[Math.min(offset, STACK.length - 1)]
  return { y: s.y, scale: s.scale, opacity: s.opacity, zIndex: s.zIndex }
}

export default function WorkList({ loaderDone }: { loaderDone: boolean }) {
  const orderedProjects = useMemo(
    () => [...projects].sort((a, b) => Number(a.number) - Number(b.number)),
    []
  )
  const total = orderedProjects.length

  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeIndexRef = useRef(0)
  const isScrollingRef = useRef(false)
  const lastTimeRef = useRef(performance.now())
  const prevVelocityRef = useRef(0)
  const lastFiredAtRef = useRef(0)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inPlaygroundRef = useRef(false)
  const enteredPlaygroundAtRef = useRef(0)
  const playgroundRef = useRef<PlaygroundSectionHandle>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const PLAYGROUND_TRIGGER_ID = 'experimental-code'
  const RETURN_COOLDOWN_MS = 400
  const RETURN_LOCK_AFTER_ENTER_MS = 800
  const RETURN_DELTA_THRESHOLD = 28

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

  // Materialize card stack when loader completes
  useEffect(() => {
    if (!loaderDone) return

    const card0 = cardRefs.current[0]
    if (!card0) return

    if (textRef.current) {
      gsap.set(textRef.current, { opacity: 0, y: 10 })
    }

    const tl = gsap.timeline()

    tl.to(card0, {
      scale: 1,
      filter: 'blur(0px)',
      opacity: 1,
      boxShadow: '0 0 90px 24px rgba(168, 85, 247, 0.35)',
      duration: 0.9,
      ease: 'power2.out',
    })
    tl.to(card0, {
      boxShadow: '0 0 40px 8px rgba(168, 85, 247, 0.12)',
      duration: 1.0,
      ease: 'power2.out',
    }, '>0.05')
    if (textRef.current) {
      tl.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      }, '<-0.5')
    }
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

  useEffect(() => {
    const animateTo = (newIndex: number, prevIndex: number) => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return

        const offset = i - newIndex
        const prevOffset = i - prevIndex

        const { y, scale, opacity, zIndex } = getProps(offset)

        // Synchronously lock in the layer order
        gsap.set(card, { zIndex })

        // --- 1. THE EXIT CHOREOGRAPHY ---
        if (offset < 0 && prevOffset >= 0) {
          gsap.killTweensOf(card)

          gsap.to(card, {
            y,
            scale,
            duration: 0.9,
            ease: 'power2.out',
          })

          gsap.to(card, {
            opacity,
            duration: 0.2,
            delay: 0.5,
            ease: 'power2.out',
          })
        }

        // --- 2. THE RETURN CHOREOGRAPHY ---
        else if (offset >= 0 && prevOffset < 0) {
          gsap.killTweensOf(card)
          gsap.set(card, { opacity: opacity })
      
    

          gsap.to(card, {
            y,
            scale,
            duration: 0.5,
            ease: 'power2.out',
          })
        }

        // --- 3. NORMAL STACK SHIFTING ---
        else {
          gsap.to(card, {
            y,
            scale,
            opacity,
            duration: 0.5,
            ease: 'power2.inOut',
            overwrite: true,
          })
        }
      })
    }

    const goTo = (index: number) => {
      const clamped = Math.max(0, Math.min(index, total - 1))
      if (clamped === activeIndexRef.current) return

      const prev = activeIndexRef.current
      activeIndexRef.current = clamped

      animateTo(clamped, prev)
    }

    const exitToPlayground = () => {
      const activeCard = cardRefs.current[activeIndexRef.current]
      enteredPlaygroundAtRef.current = performance.now()
      if (!activeCard) {
        playgroundRef.current?.enter()
        return
      }

      gsap.killTweensOf(activeCard)
      // Match the existing exit choreography from animateTo
      gsap.to(activeCard, {
        y: -window.innerHeight * 0.95,
        scale: 0.95,
        duration: 0.9,
        ease: 'power2.out',
      })
      gsap.to(activeCard, {
        opacity: 0,
        duration: 0.2,
        delay: 0,
        ease: 'power2.out',
        onComplete: () => playgroundRef.current?.enter(),
      })
    }

    const returnToWork = () => {
      playgroundRef.current?.exit(() => {
        // Snap active card back to stack position while playground is hidden
        const activeCard = cardRefs.current[activeIndexRef.current]
        if (activeCard) {
          const { y, scale, opacity, zIndex } = getProps(0)
          gsap.set(activeCard, { y, scale, opacity, zIndex })
        }
        // Reset cooldown so the continuing scroll gesture can't immediately fire goTo
        lastFiredAtRef.current = performance.now() + 500
        inPlaygroundRef.current = false
      })
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()

      // In playground — only handle scroll-up to return
      if (inPlaygroundRef.current) {
        const now = performance.now()
        const canReturnAfterLock = now - enteredPlaygroundAtRef.current >= RETURN_LOCK_AFTER_ENTER_MS
        const cooldownPassed = now - lastFiredAtRef.current >= RETURN_COOLDOWN_MS
        const isIntentionalScrollUp = e.deltaY <= -RETURN_DELTA_THRESHOLD
        if (canReturnAfterLock && cooldownPassed && isIntentionalScrollUp) {
          lastFiredAtRef.current = now
          returnToWork()
        }
        return
      }

      const now = performance.now()
      const absVelocity = Math.abs(e.deltaY) / (now - lastTimeRef.current)
      const isFastFlick =
        prevVelocityRef.current > 0 &&
        absVelocity > 2 * prevVelocityRef.current &&
        absVelocity > 1
      const cooldownPassed = now - lastFiredAtRef.current >= 225

      if ((!isScrollingRef.current || isFastFlick) && cooldownPassed) {
        isScrollingRef.current = true
        lastFiredAtRef.current = now
        if (e.deltaY > 0) {
          const activeProject = orderedProjects[activeIndexRef.current]
          if (activeProject?.id === PLAYGROUND_TRIGGER_ID) {
            inPlaygroundRef.current = true
            exitToPlayground()
          } else {
            goTo(activeIndexRef.current + 1)
          }
        } else {
          goTo(activeIndexRef.current - 1)
        }
      }

      prevVelocityRef.current = absVelocity
      lastTimeRef.current = now

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false
      }, 200)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWheel)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [total])

  return (
    <>
    <PlaygroundSection ref={playgroundRef} />
    <section className="fixed inset-0 z-10 overflow-hidden bg-base">
      <nav
        aria-label="Primary navigation"
        className="absolute top-8 left-8 z-30 hidden md:flex flex-col gap-3"
      >
        <Link href="/" className="text-h3 text-[#5B5650] hover:text-[#7A746D] transition-colors">
          Michael Truong
        </Link>
        <Link href="/work" className="text-h3 text-[#F0EDE8] hover:text-[#D8D3CC] transition-colors">
          Work
        </Link>
        <Link href="/creative" className="text-h3 text-[#4E4943] hover:text-[#6A655F] transition-colors">
          Creative
        </Link>
      </nav>

      {/* Card stack — all cards rendered, GSAP controls position */}
      <div className="absolute inset-0 flex items-center justify-center px-12">
        {orderedProjects.map((project, index) => (
          <div
            key={project.id}
            ref={el => { cardRefs.current[index] = el }}
            className="absolute w-full max-w-[780px]"
            style={{ transformOrigin: 'top center' }}
          >
            <Link
              href={`/work/${project.slug}`}
              className="relative block border border-[#2A2A2A] bg-[#9A9A9A] hover:bg-[#A5A5A5] transition-colors duration-300"
            >
              <div className="h-[320px] md:h-[420px] w-full bg-gradient-to-b from-[#B6B6B6] to-[#8A8A8A]" />
              <div ref={index === 0 ? textRef : undefined} className="absolute left-8 bottom-8">
                <h3 className="text-h1 text-[#F5F5F5]">{project.category}</h3>
                <p className="mt-2 text-body text-[#EFEFEF]/95 max-w-[90%]">
                  {project.title}
                </p>
              </div>
              <span className="absolute top-5 right-6 text-footnote text-[#F5F5F5]">
                {project.number}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </section>
    </>
  )
}
