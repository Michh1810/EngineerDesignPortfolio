'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // Only run on non-touch devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return

    const cursor = cursorRef.current
    if (!cursor) return

    // Offset the cursor to be below and to the right of the mouse
    // We don't center it, we let it trail off to the bottom-right
    const xOffset = 16
    const yOffset = 24

    // QuickTo for high performance following
    // Decrease the duration here to make it follow faster (e.g., 0.15 is snappy, 1 is very slow)
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'power3.out' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'power3.out' })

    let isHovering = false

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX + xOffset)
      yTo(e.clientY + yOffset)

      const target = e.target as HTMLElement
      const textElement = target?.closest?.('[data-cursor-text]') as HTMLElement

      if (textElement) {
        const text = textElement.getAttribute('data-cursor-text') || ''
        if (textRef.current && textRef.current.innerText !== text) {
          textRef.current.innerText = text
        }

        if (!isHovering) {
          isHovering = true
          gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(0.5)', overwrite: 'auto' })
        }
      } else {
        if (isHovering) {
          isHovering = false
          gsap.to(cursor, { opacity: 0, scale: 0.8, duration: 0.2, ease: 'power2.out', overwrite: 'auto' })
        }
      }
    }

    const onMouseLeave = () => {
      if (isHovering) {
        isHovering = false
        gsap.to(cursor, { opacity: 0, scale: 0.8, duration: 0.2, ease: 'power2.out', overwrite: 'auto' })
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[100] hidden md:flex items-center justify-center rounded-[10px] bg-[#7E50ED] px-4 py-2 opacity-0 shadow-lg"
      style={{
        willChange: 'transform, opacity',
        transform: 'scale(0.8)'
      }}
    >
      <span
        ref={textRef}
        className="text-[14px] md:text-[15px] lg:text-body text-[#EFEFEF]/95 whitespace-nowrap"
      >
      </span>
    </div>
  )
}
