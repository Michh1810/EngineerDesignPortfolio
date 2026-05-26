'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { gsap } from 'gsap'
import StatementCard from './StatementCard'

// Project card data
export const CARDS = [
  { id: 1, category: 'Taperk', title: 'Built a B2B marketing site and real-time analytics dashboard from scratch that helped land the company\'s first 5 clients.', number: '01', video: '/taperk.mp4' },
  { id: 2, category: 'Simpia', title: 'Built the component library that unlocked $40K in funding and lifted onboarding conversion by 25%.', number: '02', video: '/simpia.mp4' },
  { id: 3, category: 'Bullish.io', title: 'Shipped a full-scale AI voice interview platform in 24 hours, integrating OpenAI and ElevenLabs APIs as lead front-end engineer.', number: '03', video: '/bullishaio.mp4' },
  { id: 4, category: 'Emology', title: 'Engineered a multi-agent AI pipeline and custom Three.js rendering engine achieving stable 60fps across 6 emotion state models.', number: '04', video: '/emology.mp4' },
]

// Stack visual offsets per card position relative to active (same as WorkList)
// These define how the cards look when they are stacked behind the active card.
// Index 0 is the active card (front), Index 1 is the card behind it, and so on.
const STACK = [
  { y: 0, scale: 1, opacity: 1, zIndex: 10 }, // active
  { y: 40, scale: 0.95, opacity: 1, zIndex: 9 }, // +1 (first card behind)
  { y: 80, scale: 0.90, opacity: 0.6, zIndex: 8 }, // +2 (second card behind)
  { y: 110, scale: 0.87, opacity: 0, zIndex: 7 }, // +3 (hidden)
]

// Returns a multiplier for stack y-offsets based on screen width.
// Smaller screens need tighter stacking so cards don't overflow.
function getStackScale() {
  if (typeof window === 'undefined') return 1
  const w = window.innerWidth
  if (w < 768) return 0.6   // mobile
  if (w < 1024) return 0.8  // tablet
  return 1                  // desktop
}

// Calculates the target transform properties for a card given its offset from the active card.
function getProps(offset: number) {
  const yScale = getStackScale()
  // Negative offset means the card has already been scrolled past.
  // It moves up off the screen.
  if (offset < 0) {
    return {
      y: -window.innerHeight * 0.95, // move way up off-screen
      scale: 0.95,
      opacity: 0,
      zIndex: 20 + offset, // higher z-index so it overlays the active cards as it exits
    }
  }
  // Clamp the offset to the maximum stack depth we have defined.
  const s = STACK[Math.min(offset, STACK.length - 1)]
  return { y: s.y * yScale, scale: s.scale, opacity: s.opacity, zIndex: s.zIndex }
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
  const [activeIndex, setActiveIndex] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const isScrollingRef = useRef(false)
  const lastTimeRef = useRef(performance.now())
  const prevVelocityRef = useRef(0)
  const lastFiredAtRef = useRef(0)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const introDoneRef = useRef(false)

  // Called when StatementCard's animation finishes — reveal stacked cards
  const handleIntroComplete = useCallback(() => {
    introDoneRef.current = true
    cardRefs.current.forEach((card, i) => {
      if (!card || i === 0) return
      const { y, opacity } = getProps(i)
      gsap.to(card, {
        y,
        opacity,
        duration: 1,
        ease: 'back.out(0.5)',
      })
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
        // Stacked cards start hidden and tucked directly behind the main card (y: 0)
        gsap.set(card, { y: 0, scale, opacity: 0, zIndex })
      }
    })
  }, [])

  // Watch activeIndex to play/pause videos
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      if (i === activeIndex) {
        video.play().catch(e => console.log('Video autoplay blocked or interrupted:', e))
      } else {
        video.pause()
      }
    })
  }, [activeIndex])

  // Scroll-driven card navigation
  useEffect(() => {
    // animateTo handles the GSAP transitions for all cards when the active index changes.
    const animateTo = (newIndex: number, prevIndex: number) => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return

        const offset = i - newIndex // How far this card is from the NEW active card
        const prevOffset = i - prevIndex // How far this card WAS from the OLD active card
        const { y, scale, opacity, zIndex } = getProps(offset)

        gsap.set(card, { zIndex })

        // Exit (Scroll Up) Animation Timing: Card is moving from active (or stacked) to off-screen top.
        if (offset < 0 && prevOffset >= 0) {
          gsap.killTweensOf(card)
          gsap.to(card, { y, scale, duration: 1.0, ease: 'expo.out' })// Cards scalling a bit smaller when exiting, Duration = total slide up time!
          gsap.to(card, { opacity, duration: 0.3, delay: 0.5, ease: 'expo.out' })
        }
        // Return (Scroll Down) Animation Timing: Card is returning from off-screen top back to active stack.
        else if (offset >= 0 && prevOffset < 0) {
          gsap.killTweensOf(card)
          gsap.set(card, { opacity })
          gsap.to(card, { y, scale, duration: 0.8, ease: 'expo.out' })
        }
        // Normal stack shifting: Card is just moving up or down within the visible stack.
        else {
          gsap.to(card, { y, scale, opacity, duration: 0.6, ease: 'expo.out', overwrite: true })
        }
      })
    }

    // goTo triggers the transition to a specific card index, bounded by 0 and max cards.
    const goTo = (index: number) => {
      const clamped = Math.max(0, Math.min(index, total - 1))
      if (clamped === activeIndexRef.current) return
      const prev = activeIndexRef.current
      activeIndexRef.current = clamped
      setActiveIndex(clamped)
      onActiveChange?.(clamped) // Notify parent if provided
      animateTo(clamped, prev)
    }

    // Handle scroll wheel events to trigger navigation
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()

      const now = performance.now()
      // Calculate scroll velocity (pixels per millisecond)
      const absVelocity = Math.abs(e.deltaY) / (now - lastTimeRef.current)

      // Determine if this is a new "flick" on a trackpad
      const isFastFlick =
        prevVelocityRef.current > 0 &&
        absVelocity > 2 * prevVelocityRef.current &&
        absVelocity > 1

      // Ensure we don't fire too rapidly (debounce)
      const cooldownPassed = now - lastFiredAtRef.current >= 225

      // Trigger if we are not currently scrolling, OR it's a fast flick, AND enough time has passed
      if ((!isScrollingRef.current || isFastFlick) && cooldownPassed) {
        isScrollingRef.current = true
        lastFiredAtRef.current = now
        if (e.deltaY > 0) {
          goTo(activeIndexRef.current + 1) // Scrolled down -> move to next card
        } else {
          goTo(activeIndexRef.current - 1) // Scrolled up -> move to previous card
        }
      }

      // Update refs for next event
      prevVelocityRef.current = absVelocity
      lastTimeRef.current = now

      // Reset scrolling state after a delay
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
    <div className="absolute inset-0 flex items-center justify-center px-4 md:px-8 lg:px-12 transition-[padding] duration-300 ease-out">
      {/* Signature Card at index 0 */}
      <div
        ref={el => { cardRefs.current[0] = el }}
        className="absolute w-full max-w-[calc(100%-2rem)] md:max-w-[680px] lg:max-w-[780px]"
        style={{ transformOrigin: 'top center' }}
        data-cursor-text="Let's Scroll Down"
      >
        <StatementCard loaderDone={true} onIntroComplete={handleIntroComplete} />
      </div>

      {/* Placeholder cards at indices 1+ */}
      {CARDS.map((card, i) => {
        const index = i + 1 // shift by 1 since signature card is at 0
        return (
          <div
            key={card.id}
            ref={el => { cardRefs.current[index] = el }}
            className="absolute w-full max-w-[calc(100%-2rem)] md:max-w-[680px] lg:max-w-[780px] transition-[max-width] duration-300 ease-out cursor-pointer"
            style={{ transformOrigin: 'top center', opacity: 0 }}
            data-cursor-text="Click to Open"
          >
            <div
              className="relative block border border-[#2A2A2A]/80 rounded-[12px] md:rounded-[14px] lg:rounded-[16px] overflow-hidden h-[280px] md:h-[340px] lg:h-[390px] transition-[height,border-radius] duration-300 ease-out"
            >
              {card.video ? (
                <div className="absolute inset-0 w-full h-full">
                  <video
                    ref={el => { videoRefs.current[index] = el }}
                    src={card.video}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                  />

                </div>
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#B6B6B6] to-[#8A8A8A]" />
              )}
              {/* Title & Subtitle & Blurbackground div*/}
              <div className="absolute bottom-0 left-0 w-full z-10 p-4 pt-16 md:p-6 md:pt-20 lg:p-8 lg:pt-24 transition-[padding] duration-300 ease-out">
                {/* Faded blur background to highlight title and subtitle */}
                <div
                  className="absolute top-0 bottom-[-4px] left-[-4px] right-[-4px] bg-gradient-to-t from-black/70 to-transparent backdrop-blur-md"
                  style={{
                    maskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
                    transform: 'translateZ(0)',
                    willChange: 'transform'
                  }}
                />

                {/* Text Content */}
                <div className="relative">
                  <h3 className="font-sans font-medium text-[20px] md:text-[26px] lg:text-[30px] leading-[1.15] text-[#F5F5F5] transition-[font-size] duration-300 ease-out">
                    {card.category}
                  </h3>
                  <p className="mt-1.5 md:mt-2 text-[14px] md:text-[15px] lg:text-body text-[#EFEFEF]/95 max-w-[95%] md:max-w-[90%] transition-[font-size,margin] duration-300 ease-out">
                    {card.title}
                  </p>
                </div>
              </div>

            </div>
          </div>
        )
      })}
    </div>
  )
}
