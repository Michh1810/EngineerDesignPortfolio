'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

// ─── Loader ───────────────────────────────────────────────────────────────────
// onCardStart fires when M draw completes — card begins materializing while
// loader is still fading, creating a ~0.6s overlap so the glow never gaps.

function Loader({ onCardStart, onDone }: { onCardStart: () => void; onDone: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const pathRef   = useRef<SVGPathElement>(null)
  const glowRef   = useRef<SVGEllipseElement>(null)

  useEffect(() => {
    const path    = pathRef.current
    const overlay = overlayRef.current
    const glow    = glowRef.current
    if (!path || !overlay || !glow) return

    const length = path.getTotalLength()

    gsap.set(path,    { strokeDasharray: length, strokeDashoffset: length, opacity: 1 })
    gsap.set(glow,    { opacity: 0 })
    gsap.set(overlay, { opacity: 1 })

    const tl = gsap.timeline()
    tl
      // 1. Draw M + pulse glow in sync
      .to(path, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' })
      .to(glow, { opacity: 0.6, duration: 1.1, ease: 'power2.inOut', yoyo: true, repeat: 1 }, '<')
      // 2. Short pause, then fire card — card starts while overlay still visible
      .call(onCardStart)
      .to({}, { duration: 0.15 })
      // 3. Fade loader overlay (card is now ~0.6s into its own animation)
      .to(overlay, { opacity: 0, duration: 0.6, ease: 'power2.in', onComplete: onDone })

    return () => { tl.kill() }
  }, [onCardStart, onDone])

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: '#080808',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <svg width="220" height="200" viewBox="0 0 220 200" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="sb-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#f0abfc" />
            <stop offset="50%"  stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <radialGradient id="sb-glow" cx="50%" cy="60%" r="50%">
            <stop offset="0%"   stopColor="#d946ef" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"   />
          </radialGradient>
        </defs>
        <ellipse ref={glowRef} cx="110" cy="130" rx="80" ry="55" fill="url(#sb-glow)" />
        <path
          ref={pathRef}
          d="M 42,160 C 40,135 41,100 46,70 C 50,50 58,40 64,44 C 70,48 74,65 76,85
             C 78,100 80,115 84,108 C 90,96 96,68 102,52 C 108,36 116,33 122,40
             C 128,47 130,66 130,88 C 130,110 130,130 133,148 C 134,153 136,158 140,162"
          stroke="url(#sb-stroke)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  )
}

// ─── Aura Card ────────────────────────────────────────────────────────────────
// Matches the Figma reference: animated gradient mesh, grain, rounded corners,
// centered text, ambient outer glow.

function AuraCard({ visible, animKey }: { visible: boolean; animKey: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  // Reset to pre-materialization state on replay
  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    gsap.set(card, { scale: 0.72, filter: 'blur(16px)', opacity: 0, boxShadow: 'none' })
    if (textRef.current) gsap.set(textRef.current, { opacity: 0, y: 12 })
  }, [animKey])

  // Materialize when loader signals card start
  useEffect(() => {
    if (!visible) return
    const card = cardRef.current
    if (!card) return

    const tl = gsap.timeline()

    // Card body: scale + unblur + glow bloom
    tl.to(card, {
      scale: 1,
      filter: 'blur(0px)',
      opacity: 1,
      boxShadow: '0 0 100px 32px rgba(168, 85, 247, 0.45), 0 0 40px 8px rgba(217, 70, 239, 0.2)',
      duration: 0.95,
      ease: 'power2.out',
    })
    // Glow settles to ambient level
    tl.to(card, {
      boxShadow: '0 0 60px 16px rgba(168, 85, 247, 0.18), 0 0 20px 4px rgba(217, 70, 239, 0.1)',
      duration: 1.2,
      ease: 'power2.out',
    }, '>0.05')
    // Text fades in last
    if (textRef.current) {
      tl.to(textRef.current, {
        opacity: 1, y: 0,
        duration: 0.5, ease: 'power2.out',
      }, '<-0.6')
    }

    return () => { tl.kill() }
  }, [visible])

  return (
    <>
      {/* CSS animations for gradient mesh blobs */}
      <style>{`
        @keyframes sb-blob1 {
          0%,100% { transform: translate(0,    0)    scale(1);    }
          33%      { transform: translate(40px, -30px) scale(1.15); }
          66%      { transform: translate(-25px, 20px) scale(0.9);  }
        }
        @keyframes sb-blob2 {
          0%,100% { transform: translate(0,     0)    scale(1);   }
          50%     { transform: translate(-50px,  30px) scale(1.2); }
        }
        @keyframes sb-blob3 {
          0%,100% { transform: translate(0,    0)     scale(1);    }
          40%     { transform: translate(30px, -40px)  scale(1.1);  }
          80%     { transform: translate(-20px, 25px)  scale(0.95); }
        }
        @keyframes sb-blob4 {
          0%,100% { transform: translate(0,     0)    scale(1);    }
          60%     { transform: translate(-30px, -20px) scale(1.05); }
        }
        @keyframes sb-grain {
          0%,100% { transform: translate(0,    0)   scale(1.05); }
          10%     { transform: translate(-2%, -3%)  scale(1.05); }
          30%     { transform: translate(2%,   2%)  scale(1.05); }
          50%     { transform: translate(-1%,  3%)  scale(1.05); }
          70%     { transform: translate(3%,  -1%)  scale(1.05); }
          90%     { transform: translate(-2%,  1%)  scale(1.05); }
        }
      `}</style>

      <div
        ref={cardRef}
        style={{
          width: '100%',
          maxWidth: 780,
          borderRadius: 24,
          overflow: 'hidden',
          position: 'relative',
          transformOrigin: 'center center',
        }}
      >
        {/* Gradient mesh container */}
        <div style={{ position: 'relative', height: 420, background: '#5b21b6', overflow: 'hidden' }}>

          {/* Blob 1 — magenta, left */}
          <div style={{
            position: 'absolute', width: 480, height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #c026d3 0%, transparent 70%)',
            left: '-10%', top: '-20%',
            animation: 'sb-blob1 9s ease-in-out infinite',
            opacity: 0.9,
          }} />

          {/* Blob 2 — dark violet swirl, center-right */}
          <div style={{
            position: 'absolute', width: 520, height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #3b0764 0%, transparent 65%)',
            right: '-15%', top: '10%',
            animation: 'sb-blob2 12s ease-in-out infinite',
            opacity: 0.85,
          }} />

          {/* Blob 3 — silver/white, right-center */}
          <div style={{
            position: 'absolute', width: 340, height: 340,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(226,232,240,0.75) 0%, transparent 70%)',
            right: '5%', top: '20%',
            animation: 'sb-blob3 10s ease-in-out infinite',
          }} />

          {/* Blob 4 — warm amber hint, center */}
          <div style={{
            position: 'absolute', width: 260, height: 260,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(180,120,60,0.45) 0%, transparent 70%)',
            left: '30%', top: '30%',
            animation: 'sb-blob4 14s ease-in-out infinite',
          }} />

          {/* Blob 5 — violet, bottom-right */}
          <div style={{
            position: 'absolute', width: 380, height: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #7c3aed 0%, transparent 65%)',
            right: '-5%', bottom: '-20%',
            opacity: 0.7,
          }} />

          {/* Grain overlay */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', inset: '-5%',
              backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='300' height='300' filter='url(%23n)' opacity='0.09'/></svg>")`,
              animation: 'sb-grain 0.7s steps(1) infinite',
              pointerEvents: 'none',
            }}
          />

          {/* Centered text */}
          <div
            ref={textRef}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{
              color: '#fff',
              fontSize: 32,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              fontFamily: 'var(--font-sf-pro-display), -apple-system, sans-serif',
              textShadow: '0 1px 20px rgba(0,0,0,0.3)',
            }}>
              It&apos;s Michael!
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Sandbox ──────────────────────────────────────────────────────────────────

export default function CardAnimation() {
  const [cardVisible,  setCardVisible]  = useState(false)
  const [loaderDone,   setLoaderDone]   = useState(false)
  const [animKey,      setAnimKey]      = useState(0)

  const replay = () => {
    setCardVisible(false)
    setLoaderDone(false)
    setAnimKey(k => k + 1)
  }

  return (
    <div style={{
      background: '#080808',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 32,
      padding: '0 48px',
    }}>
      {!loaderDone && (
        <Loader
          key={animKey}
          onCardStart={() => setCardVisible(true)}
          onDone={() => setLoaderDone(true)}
        />
      )}

      <AuraCard key={animKey} visible={cardVisible} animKey={animKey} />

      {loaderDone && (
        <button
          onClick={replay}
          style={{
            background: 'none',
            border: '1px solid #2a2a2a',
            color: '#605850',
            borderRadius: 8,
            padding: '6px 16px',
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s, color 0.2s',
          }}
        >
          ↺ Replay
        </button>
      )}
    </div>
  )
}
