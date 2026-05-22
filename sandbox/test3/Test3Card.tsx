'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'

interface Test3CardProps {
  loaderDone?: boolean
  onIntroComplete?: () => void
}

export default function Test3Card({ loaderDone = true, onIntroComplete }: Test3CardProps) {

  // Set up gsap animation for svg draw
  const pathRefs = useRef<(SVGPathElement | null)[]>([]) // pathRefs is for the lining and position of all SVG with the same shape.
  const svgRef = useRef<HTMLDivElement>(null) //The svgRef is attached to the <div> that wraps both the Base SVG and the Highlight1 mesh.
  const highlightRef = useRef<SVGSVGElement>(null) // highlightRef is for the Highlight1 SVG.
  const highlight2Ref = useRef<HTMLDivElement>(null) // highlight2Ref is for the outer SVG Highlight2.
  const baseSvgRef = useRef<SVGSVGElement>(null) // baseSvgRef is for the Base SVG.
  const cardBgRef = useRef<HTMLDivElement>(null) // cardBgRef is for the Card background shell (glow + noise).
  const hasPlayedRef = useRef(false)

  const runIntro = useCallback(() => {
    if (hasPlayedRef.current) return
    hasPlayedRef.current = true

    const paths = pathRefs.current.filter(Boolean) as SVGPathElement[]
    if (paths.length === 0) return

    // Get the total length of the path for the dash array
    const length = paths[0].getTotalLength()

    // Set initial state: stroke is fully offset (hidden) and all layers below
    gsap.set(paths, { strokeDasharray: length, strokeDashoffset: length })
    // Hide Highlight1 & Highlight2 SVGs initially
    if (highlightRef.current) {
      gsap.set(highlightRef.current, { opacity: 0 })
    }
    if (highlight2Ref.current) {
      gsap.set(highlight2Ref.current, { opacity: 0 })
    }
    if (cardBgRef.current) {
      gsap.set(cardBgRef.current, { opacity: 0 })
    }

    // Create a timeline for sequential animations
    const tl = gsap.timeline({
      onComplete: () => onIntroComplete?.(),
    })

    // Animate the stroke drawing in (Base SVG only)
    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 2.8,
      ease: 'power2.inOut',
    })

    // Scale the SVG to 400px (scale of 2 since base is 200px) and fade in Highlight1
    if (svgRef.current) {
      tl.to(svgRef.current, {
        scale: 3.2,
        duration: 1.2,
        ease: 'power2.inOut',
      })

      if (highlightRef.current) {
        tl.to(highlightRef.current, {
          opacity: 1,
          duration: 1.2,
          ease: 'power2.inOut',
        }, "<") // Start fading in exactly when scaling starts
      }

      if (highlight2Ref.current) { //animation timeline for SVG Highlight2
        tl.to(highlight2Ref.current, {
          opacity: 1,
          duration: 1.2,
          ease: 'power2.inOut',
        }, "<+0.3") // Start at the same time at previous but offset by + ..s
      }

      if (cardBgRef.current) {
        tl.to(cardBgRef.current, {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        }, "<+0.5")
      }

      // Blur the base SVG out at the same time
      if (baseSvgRef.current) {
        tl.to(baseSvgRef.current, {
          filter: 'blur(10px)',
          duration: 1.2,
          ease: 'power2.inOut',
        }, "<-0.8")
      }
    }
  }, [onIntroComplete])

  // Set initial hidden state on mount (before animation)
  useEffect(() => {
    const paths = pathRefs.current.filter(Boolean) as SVGPathElement[]
    if (paths.length > 0) {
      const length = paths[0].getTotalLength()
      gsap.set(paths, { strokeDasharray: length, strokeDashoffset: length })
    }
    if (highlightRef.current) gsap.set(highlightRef.current, { opacity: 0 })
    if (highlight2Ref.current) gsap.set(highlight2Ref.current, { opacity: 0 })
    if (cardBgRef.current) gsap.set(cardBgRef.current, { opacity: 0 })
  }, [])

  // Trigger animation when loaderDone is true
  useEffect(() => {
    if (loaderDone) {
      runIntro()
    }
  }, [loaderDone, runIntro])

  // ----WHAT IS SHOWN ON THE SCREEN -------------------------------------------
  return (
    <div
      className="relative w-full"
      style={{
        height: '390px',
        borderRadius: '16px',
        overflow: 'hidden',
        transform: 'translateZ(0)',
        isolation: 'isolate',
      }}
    >
      {/* Card background shell: glow + noise (hidden initially, fades in after drawing) */}
      <div ref={cardBgRef}>
        {/* Glowing Background Rectangle (Bottom Layer) */}
        <div
          className="absolute inset-0 rounded-[16px]"
          style={{
            border: '0.2px solid rgba(0, 0, 0, 0.50)',
            background: '#111212',
            boxShadow: '0 0 20px 0 rgba(255, 37, 215, 0.25) inset, 0 4px 60px 0 #5630FF inset, 0 17px 39.8px -10px rgba(0, 0, 0, 0.70), 0 20px 35px 0 rgba(0, 0, 0, 0.15)'
          }}
        />

        {/* Noise Overlay Layer */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[16px] overflow-hidden"
          style={{ opacity: 1, mixBlendMode: 'overlay' }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">{/* baseFrequency(Size) changes how big the pixels are. 0.8 is bigger pixels. 1 is smaller pixels. 8 is even smaller pixels */}
              {/* numOctaves: Density of noise; Range 1-5*/}
              {/* Noise Overlay Layer */}
              <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="1" stitchTiles="stitch" />
              {/* This matrix forces the noise to be pure black (RGB=0) and maps the noise brightness to the Alpha channel */}
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.33 0.33 0.33 0 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        {/* Top-left: Name */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: '50px',
            top: '50px'
          }}
        >
          <span style={{
            fontFamily: 'SF Pro Display',
            fontWeight: '500',
            fontSize: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            background: 'linear-gradient(270deg, #D99DFF 10.26%, #8FABF3 95.97%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Michael Truong
          </span>
        </div>

        {/* Mid-left: I'm a full-stack developer with a strong background in UX design. */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: '50px',
            top: '100px',
            right: '50px',
          }}
        >
          <p style={{
            fontFamily: 'SF Pro Display',
            fontWeight: '500',
            fontSize: '40px',
            lineHeight: '119.5%',
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            opacity: 1,
          }}>
            I'm a full-stack developer with a
            <br />
            strong background in UX design.
          </p>
        </div>

        {/* Bottom-mid/right: Detail-obsessed, open for new grad full time roles */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            right: '50px',
            bottom: '40px'
          }}
        >
          <span style={{
            fontFamily: 'SF Pro Display',
            fontWeight: '400',
            fontSize: '18px',
            color: '#FFFFFF',
            opacity: 1,
            letterSpacing: '-0.01em'
          }}>
            Detail-obsessed, open for new grad full-time roles!
          </span>
        </div>
      </div>

      {/* SVG Container (Top Layer) */}
      <div
        ref={svgRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
      >
        {/* The Base SVG Start */}
        <div style={{ mixBlendMode: 'plus-lighter' }}>
          <svg ref={baseSvgRef} xmlns="http://www.w3.org/2000/svg" width="200" height="152" viewBox="0 0 200 152" fill="none" overflow="visible">
            <g filter="url(#filter1_i_59_209)" style={{ mixBlendMode: 'plus-lighter' } as React.CSSProperties}>
              <path ref={el => { pathRefs.current[0] = el }} d="M5 136.75C9.50003 131.725 16.2736 127.769 22.2423 111.75C27.3824 97.9548 32.5384 78.624 31.2609 52.2501C28.5 -4.74991 104.196 -33.7538 47.1908 115.684C36.4259 143.904 73.8794 163.42 76.6491 111.75C80.1907 45.6841 131.508 13.3442 148.999 37.6748C154.986 46.0031 151.5 64.5031 132.999 78.6747C113.881 93.3197 100.201 117.308 106.5 131.75C110 139.775 127.299 152.751 146.499 139.775C170.499 123.555 158.499 102.175 195.999 102.175" stroke="url(#paint0_radial_59_209)" strokeWidth="12" />
              <path ref={el => { pathRefs.current[1] = el }} d="M5 136.75C9.50003 131.725 16.2736 127.769 22.2423 111.75C27.3824 97.9548 32.5384 78.624 31.2609 52.2501C28.5 -4.74991 104.196 -33.7538 47.1908 115.684C36.4259 143.904 73.8794 163.42 76.6491 111.75C80.1907 45.6841 131.508 13.3442 148.999 37.6748C154.986 46.0031 151.5 64.5031 132.999 78.6747C113.881 93.3197 100.201 117.308 106.5 131.75C110 139.775 127.299 152.751 146.499 139.775C170.499 123.555 158.499 102.175 195.999 102.175" stroke="url(#paint1_radial_59_209)" style={{ mixBlendMode: 'plus-lighter' } as React.CSSProperties} strokeWidth="12" />
            </g>
            <defs>
              <filter id="filter1_i_59_209" x="-20" y="-20" width="240" height="200" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dx="1" dy="3" />
                <feGaussianBlur stdDeviation="1.35" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.849427 0 0 0 0 0.835355 0 0 0 0 1 0 0 0 1 0" />
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
              </filter>
              <radialGradient id="paint0_radial_59_209" cx="0" cy="0" r="1" gradientTransform="matrix(-59.0001 87.5001 -116.854 -78.656 170.5 93.174)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2A70EB" />
                <stop offset="1" stopColor="#6329FF" />
              </radialGradient>
              <radialGradient id="paint1_radial_59_209" cx="0" cy="0" r="1" gradientTransform="matrix(239.406 -236.542 315.729 719.64 134.947 202.272)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFEBDC" stopOpacity="0" />
                <stop offset="1" stopColor="#FFEBDC" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Highlight1 SVG Start */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'plus-lighter' }}>
          <svg
            ref={highlightRef}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', overflow: 'visible' }}
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="152"
            viewBox="0 0 200 152"
            fill="none"
            overflow="visible"
          >
            <defs>
              {/* Single blur filter */}
              <filter id="blur_highlight_v2" x="-200" y="-200" width="600" height="552" filterUnits="userSpaceOnUse">
                <feGaussianBlur stdDeviation="20" /> {/* Adjust blurriness here */}
              </filter>

              <radialGradient id="paint0_radial_highlight" cx="0" cy="0" r="1" gradientTransform="matrix(-59.0001 87.5001 -116.854 -78.656 170.5 93.174)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2A70EB" />
                <stop offset="1" stopColor="#6329FF" />
              </radialGradient>
              <radialGradient id="paint1_radial_highlight" cx="0" cy="0" r="1" gradientTransform="matrix(239.406 -236.542 315.729 719.64 134.947 202.272)" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFEBDC" stopOpacity="0" />
                <stop offset="1" stopColor="#FFEBDC" />
              </radialGradient>
            </defs>

            {/* Single blurred layer */}
            <g filter="url(#blur_highlight_v2)" style={{ mixBlendMode: 'plus-lighter' }}>
              <path d="M5 136.75C9.50003 131.725 16.2736 127.769 22.2423 111.75C27.3824 97.9548 32.5384 78.624 31.2609 52.2501C28.5 -4.74991 104.196 -33.7538 47.1908 115.684C36.4259 143.904 73.8794 163.42 76.6491 111.75C80.1907 45.6841 131.508 13.3442 148.999 37.6748C154.986 46.0031 151.5 64.5031 132.999 78.6747C113.881 93.3197 100.201 117.308 106.5 131.75C110 139.775 127.299 152.751 146.499 139.775C170.499 123.555 158.499 102.175 195.999 102.175" stroke="url(#paint0_radial_highlight)" strokeWidth="12" fill="none" />
              <path d="M5 136.75C9.50003 131.725 16.2736 127.769 22.2423 111.75C27.3824 97.9548 32.5384 78.624 31.2609 52.2501C28.5 -4.74991 104.196 -33.7538 47.1908 115.684C36.4259 143.904 73.8794 163.42 76.6491 111.75C80.1907 45.6841 131.508 13.3442 148.999 37.6748C154.986 46.0031 151.5 64.5031 132.999 78.6747C113.881 93.3197 100.201 117.308 106.5 131.75C110 139.775 127.299 152.751 146.499 139.775C170.499 123.555 158.499 102.175 195.999 102.175" stroke="url(#paint1_radial_highlight)" style={{ mixBlendMode: 'plus-lighter' }} strokeWidth="12" fill="none" />
            </g>

          </svg>
        </div>
      </div>

      {/* SVG Highlight2 (outer one) */}
      <div ref={highlight2Ref} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', mixBlendMode: 'plus-lighter', zIndex: 20 }}>
        <svg
          style={{ overflow: 'visible' }}
          xmlns="http://www.w3.org/2000/svg"
          width="640"
          height="486.4"
          viewBox="0 0 200 152"
          fill="none"
          overflow="visible"
        >
          <defs>
            <filter id="blur_aura_60" x="-300" y="-300" width="800" height="752" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="50" /> {/* Adjust blurriness here */}
            </filter>
            <radialGradient id="paint0_radial_aura" cx="0" cy="0" r="1" gradientTransform="matrix(-59.0001 87.5001 -116.854 -78.656 170.5 93.174)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2A70EB" />
              <stop offset="1" stopColor="#6329FF" />
            </radialGradient>
            <radialGradient id="paint1_radial_aura" cx="0" cy="0" r="1" gradientTransform="matrix(239.406 -236.542 315.729 719.64 134.947 202.272)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFEBDC" stopOpacity="0" />
              <stop offset="1" stopColor="#FFEBDC" />
            </radialGradient>
          </defs>
          <g filter="url(#blur_aura_60)" style={{ mixBlendMode: 'plus-lighter' }}>
            <path d="M5 136.75C9.50003 131.725 16.2736 127.769 22.2423 111.75C27.3824 97.9548 32.5384 78.624 31.2609 52.2501C28.5 -4.74991 104.196 -33.7538 47.1908 115.684C36.4259 143.904 73.8794 163.42 76.6491 111.75C80.1907 45.6841 131.508 13.3442 148.999 37.6748C154.986 46.0031 151.5 64.5031 132.999 78.6747C113.881 93.3197 100.201 117.308 106.5 131.75C110 139.775 127.299 152.751 146.499 139.775C170.499 123.555 158.499 102.175 195.999 102.175" stroke="url(#paint0_radial_aura)" strokeWidth="12" fill="none" /> {/* Stroke adjust must adjust two layers, representing two colors gradients */}
            <path d="M5 136.75C9.50003 131.725 16.2736 127.769 22.2423 111.75C27.3824 97.9548 32.5384 78.624 31.2609 52.2501C28.5 -4.74991 104.196 -33.7538 47.1908 115.684C36.4259 143.904 73.8794 163.42 76.6491 111.75C80.1907 45.6841 131.508 13.3442 148.999 37.6748C154.986 46.0031 151.5 64.5031 132.999 78.6747C113.881 93.3197 100.201 117.308 106.5 131.75C110 139.775 127.299 152.751 146.499 139.775C170.499 123.555 158.499 102.175 195.999 102.175" stroke="url(#paint1_radial_aura)" style={{ mixBlendMode: 'plus-lighter' }} strokeWidth="12" fill="none" />
          </g>
        </svg>
      </div>
    </div>
  )
}
