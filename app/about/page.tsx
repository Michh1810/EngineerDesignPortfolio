'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Navigation from '@/components/Navigation'

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current?.children ? Array.from(contentRef.current.children) : [],
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power2.out', delay: 0.1 }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const experience = [
    {
      role: 'Software Engineering Intern',
      company: 'FPT Software',
      year: 'Summer 2025'
    },
    {
      role: 'Software Developer Intern',
      company: 'Taperk Inc',
      year: 'Summer 2024'
    },
    {
      role: 'UX Research Assistant',
      company: 'EnCoDe Lab',
      year: '2024'
    }
  ]

  return (
    <main ref={containerRef} className="min-h-screen bg-base relative selection:bg-white/10 selection:text-white pb-24">
      {/* Background Noise - Kept extremely subtle for texture */}

      <Navigation isVisible={true} isSignatureActive={false} />

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-32 md:pt-48 flex flex-col">
        <div ref={contentRef} className="flex flex-col gap-16 md:gap-24">

          {/* Header */}
          <section className="flex flex-col gap-6">
            <h1 className="text-h1 text-text-primary tracking-tight">
              Michael Truong
            </h1>
            <p className="text-body text-text-primary leading-relaxed">
              I love it when I can actually build and ship my own design. It's like turning dreams into life.
            </p>
            <p className="text-body text-text-primary leading-relaxed">
              Recently at FPT Software in Vietnam, I rebuilt an onboarding flow for a music edtech app named Simpia that improved retention rates from 10% to 19% after 3 months of internship. Previously, at the Taperk startup, I was one of the founding design engineers who designed the entire marketing site end-to-end, then worked with the engineering team to ship.
            </p>
            <p className="text-body text-text-primary leading-relaxed">
              Outside of technology, I'm probably seeking opportunities to build my own F&B startup.
            </p>
          </section>

          {/* Experience */}
          <section className="flex flex-col gap-8">
            <h2 className="text-subtext text-[#605850] uppercase tracking-widest">Experience</h2>
            <div className="flex flex-col gap-6">
              {experience.map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row md:justify-between gap-1 md:gap-8 group">
                  <div className="flex flex-col md:w-2/3">
                    <h3 className="text-body text-text-primary">
                      <span className="opacity-100">{item.company}</span>
                      <span className="opacity-70">, {item.role}</span>
                    </h3>
                    <span className="text-body text-text-primary opacity-70 md:hidden mt-1">{item.year}</span>
                  </div>
                  <div className="hidden md:block md:w-1/3 text-right">
                    <span className="text-body text-text-primary opacity-70">{item.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Connect */}
          <section className="flex flex-col gap-4">
            <h2 className="text-subtext text-[#605850] uppercase tracking-widest">Connect</h2>
            <div className="flex flex-row flex-wrap items-center gap-3 text-body">
              <a href="https://www.linkedin.com/in/michael-truongg/" target="_blank" rel="noopener noreferrer" className="text-text-primary hover-text-fade w-fit">LinkedIn</a>
              <span className="text-[#605850]">|</span>
              <a href="https://github.com/Michh1810" target="_blank" rel="noopener noreferrer" className="text-text-primary hover-text-fade w-fit">GitHub</a>
              <span className="text-[#605850]">|</span>
              <a href="https://x.com/MikeSocTrang" target="_blank" rel="noopener noreferrer" className="text-text-primary hover-text-fade w-fit">Twitter</a>
              <span className="text-[#605850]">|</span>
              <a href="mailto:michaeltruonggg@gmail.com" className="text-text-primary hover-text-fade w-fit">michaeltruonggg@gmail.com</a>
            </div>
          </section>



        </div>
      </div>
    </main>
  )
}
