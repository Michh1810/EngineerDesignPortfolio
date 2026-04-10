'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import GridCell from './GridCell'
import HeroCell from './HeroCell'
import { projectsByPosition } from '@/data/projects'

// Clockwise from top-center: 2→3→6→9→8→7→4→1
const REVEAL_ORDER = [2, 3, 6, 9, 8, 7, 4, 1]
const STAGGER_DELAY = 0.11 // seconds between each cell

type LoaderPhase = 'loading' | 'revealing' | 'complete'

export default function Loader() {
  const [phase, setPhase] = useState<LoaderPhase>('loading')
  const [heroPhase, setHeroPhase] = useState<'video' | 'hero'>('video')
  const cellRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const handleVideoEnd = () => setPhase('revealing')

  useEffect(() => {
    if (phase !== 'revealing') return

    const tl = gsap.timeline({
      delay: 0.5,
      onComplete: () => {
        setPhase('complete')
        setHeroPhase('hero')
        document.body.style.overflow = 'auto'
      },
    })

    REVEAL_ORDER.forEach((pos, i) => {
      const el = cellRefs.current.get(pos)
      if (!el) return
      tl.to(
        el,
        { opacity: 1, scale: 1, duration: 0.65, ease: 'power3.out' },
        i * STAGGER_DELAY
      )
    })

    return () => { tl.kill() }
  }, [phase])

  // Lock scroll during loader
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'auto' }
  }, [])

  const setRef = (pos: number) => (el: HTMLDivElement | null) => {
    if (el) cellRefs.current.set(pos, el)
    else cellRefs.current.delete(pos)
  }

  return (
    <div
      data-testid="grid"
      className="grid w-screen"
      style={{
        gridTemplateColumns: 'repeat(3, 33.333vw)',
        gridTemplateRows: 'repeat(3, calc((100vh - 48px) / 3))',
        height: 'calc(100vh - 48px)',
      }}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((pos) => {
        if (pos === 5) {
          return (
            <div key={5} className="w-full h-full">
              <HeroCell onVideoEnd={handleVideoEnd} phase={heroPhase} />
            </div>
          )
        }

        const project = projectsByPosition[pos]
        return (
          <div
            key={pos}
            ref={setRef(pos)}
            className="w-full h-full"
            style={{ opacity: 0, transform: 'scale(0.86)' }}
          >
            <GridCell project={project} />
          </div>
        )
      })}
    </div>
  )
}
