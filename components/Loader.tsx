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

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1,
    })
    gsap.set(glow, { opacity: 0 })

    tl
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
      .to({}, { duration: 0.3 })
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

        <ellipse
          ref={glowRef}
          cx="110"
          cy="130"
          rx="80"
          ry="55"
          fill="url(#loader-glow-grad)"
        />

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
