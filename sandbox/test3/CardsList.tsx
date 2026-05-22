'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import Test3Card from './Test3Card'

// Placeholder card data
const CARDS = [
  { id: 1, category: 'Product Design', title: 'Redesigning the checkout flow', number: '01' },
  { id: 2, category: 'Motion Work', title: 'Kinetic brand identity system', number: '02' },
  { id: 3, category: 'Front-End Engineering', title: 'Interactive data dashboard', number: '03' },
  { id: 4, category: 'Brand Design', title: 'Visual identity for a fintech startup', number: '04' },
  { id: 5, category: 'Web Experience', title: 'Award-winning campaign site', number: '05' },
]

// Stack visual offsets per card position relative to active (same as WorkList)
const STACK = [
  { y: 0, scale: 1, opacity: 1, zIndex: 10 }, // active
  { y: 48, scale: 0.95, opacity: 1, zIndex: 9 }, // +1
  { y: 84, scale: 0.90, opacity: 0.6, zIndex: 8 }, // +2
  { y: 110, scale: 0.87, opacity: 0, zIndex: 7 }, // +3 (hidden)
]

function getProps(offset: number) {
  if (offset < 0) {
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

interface CardsListProps {
  onActiveChange?: (index: number) => void
  onIntroComplete?: () => void
}

export default function CardsList({ onActiveChange, onIntroComplete }: CardsListProps) {
  // +1 for the signature card at index 0
  const total = CARDS.length + 1
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeIndexRef = useRef(0)
  const isScrollingRef = useRef(false)
  const lastTimeRef = useRef(performance.now())
  const prevVelocityRef = useRef(0)
  const lastFiredAtRef = useRef(0)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const introDoneRef = useRef(false)

  // Called when Test3Card's animation finishes — reveal stacked cards
  const handleIntroComplete = useCallback(() => {
    introDoneRef.current = true
    cardRefs.current.forEach((card, i) => {
      if (!card || i === 0) return
      const { opacity } = getProps(i)
      gsap.to(card, { opacity, duration: 0.4, ease: 'power2.out' })
    })
    onIntroComplete?.()
  }, [onIntroComplete])

  // Set initial stack positions — hide stacked cards until intro completes
  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const { y, scale, opacity, zIndex } = getProps(i)
      if (i === 0) {
        gsap.set(card, { y, scale, opacity, zIndex })
      } else {
        // Stacked cards start hidden
        gsap.set(card, { y, scale, opacity: 0, zIndex })
      }
    })
  }, [])

  // Scroll-driven card navigation
  useEffect(() => {
    const animateTo = (newIndex: number, prevIndex: number) => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return

        const offset = i - newIndex
        const prevOffset = i - prevIndex
        const { y, scale, opacity, zIndex } = getProps(offset)

        gsap.set(card, { zIndex })

        // Exit (Scroll Up) Animation Timing
        if (offset < 0 && prevOffset >= 0) {
          gsap.killTweensOf(card)
          gsap.to(card, { y, scale, duration: 0.9, ease: 'power2.out' })// Cards scalling a bit smaller when exiting, Duration = total slide up time!
          gsap.to(card, { opacity, duration: 0.2, delay: 0.5, ease: 'power2.out' })
        }
        // Return (Scroll Down) Animation Timing
        else if (offset >= 0 && prevOffset < 0) {
          gsap.killTweensOf(card)
          gsap.set(card, { opacity })
          gsap.to(card, { y, scale, duration: 0.5, ease: 'power2.out' })
        }
        // Normal stack shifting
        else {
          gsap.to(card, { y, scale, opacity, duration: 0.2, ease: 'power2.inOut', overwrite: true })
        }
      })
    }

    const goTo = (index: number) => {
      const clamped = Math.max(0, Math.min(index, total - 1))
      if (clamped === activeIndexRef.current) return
      const prev = activeIndexRef.current
      activeIndexRef.current = clamped
      onActiveChange?.(clamped)
      animateTo(clamped, prev)
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()

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
          goTo(activeIndexRef.current + 1)
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
    <div className="absolute inset-0 flex items-center justify-center px-12">
      {/* Signature Card at index 0 */}
      <div
        ref={el => { cardRefs.current[0] = el }}
        className="absolute w-full max-w-[780px]"
        style={{ transformOrigin: 'top center' }}
      >
        <Test3Card loaderDone={true} onIntroComplete={handleIntroComplete} />
      </div>

      {/* Placeholder cards at indices 1+ */}
      {CARDS.map((card, i) => {
        const index = i + 1 // shift by 1 since signature card is at 0
        return (
          <div
            key={card.id}
            ref={el => { cardRefs.current[index] = el }}
            className="absolute w-full max-w-[780px]"
            style={{ transformOrigin: 'top center' }}
          >
            <div
              className="relative block border border-[#2A2A2A] bg-[#9A9A9A] rounded-[16px] overflow-hidden"
              style={{ height: '390px' }}
            >
              <div className="h-full w-full bg-gradient-to-b from-[#B6B6B6] to-[#8A8A8A]" />
              <div className="absolute left-8 bottom-8">
                <h3
                  style={{
                    fontFamily: 'SF Pro Display',
                    fontWeight: '500',
                    fontSize: '30px',
                    lineHeight: '1.15',
                    color: '#F5F5F5',
                  }}
                >
                  {card.category}
                </h3>
                <p className="mt-2 text-body text-[#EFEFEF]/95 max-w-[90%]">
                  {card.title}
                </p>
              </div>
              <span className="absolute top-5 right-6 text-footnote text-[#F5F5F5]">
                {card.number}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
