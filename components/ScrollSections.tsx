'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const SKILLS = [
  'Front-End Development',
  'Product Design',
  'Motion Design',
  'Creative Direction',
  'UI Systems',
]

export default function ScrollSections() {
  const aboutRef = useRef<HTMLElement>(null)
  const skillLineRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // About: fade up on scroll
      if (aboutRef.current) {
        gsap.from(aboutRef.current.querySelectorAll('[data-reveal]'), {
          opacity: 0,
          y: 24,
          stagger: 0.1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: aboutRef.current,
            start: 'top 80%',
            once: true,
          },
        })
      }

      // Skills: each line reveals left-to-right
      skillLineRefs.current.forEach((el) => {
        if (!el) return
        gsap.from(el, {
          opacity: 0,
          x: -20,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen">
      {/* About */}
      <section
        ref={aboutRef}
        className="min-h-screen flex flex-col justify-center px-12 md:px-24 py-32 border-t border-[#141414]"
      >
        <span data-reveal className="font-mono text-[9px] tracking-[4px] text-[#605850] uppercase mb-8">
          About
        </span>
        <p
          data-reveal
          className="font-serif text-[clamp(24px,3.5vw,52px)] text-[#F0EDE8] font-light leading-[1.2] tracking-[-0.5px] max-w-3xl"
        >
          Design Engineer building at the intersection of craft and engineering.
        </p>
        <p
          data-reveal
          className="mt-8 text-[14px] text-[#A09890] leading-relaxed max-w-lg"
        >
          I care deeply about motion, detail, and the space between design and code. Every pixel is a decision.
        </p>
      </section>

      {/* Skills */}
      <section className="min-h-screen flex flex-col justify-center px-12 md:px-24 py-32 border-t border-[#141414]">
        <span className="font-mono text-[9px] tracking-[4px] text-[#605850] uppercase mb-12">
          Skills
        </span>
        <ul className="flex flex-col gap-6">
          {SKILLS.map((skill, i) => (
            <li key={skill} className="overflow-hidden">
              <span
                ref={(el) => { skillLineRefs.current[i] = el }}
                className="block font-serif text-[clamp(20px,2.8vw,44px)] text-[#F0EDE8] font-light tracking-[-0.3px]"
              >
                {skill}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Contact */}
      <section className="min-h-[60vh] flex flex-col justify-center px-12 md:px-24 py-32 border-t border-[#141414]">
        <span className="font-mono text-[9px] tracking-[4px] text-[#605850] uppercase mb-8">
          Contact
        </span>
        <a
          href="mailto:hello@michaeltruong.com"
          className="font-serif text-[clamp(20px,3vw,48px)] text-[#F0EDE8] font-light tracking-[-0.3px] hover:text-[#A09890] transition-colors duration-300"
        >
          hello@michaeltruong.com
        </a>
        <div className="flex gap-8 mt-12">
          <a
            href="https://linkedin.com/in/michaeltruong"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[9px] tracking-[3px] text-[#504840] uppercase hover:text-[#C8C0B0] transition-colors duration-200"
          >
            LinkedIn ↗
          </a>
          <a
            href="https://github.com/michaeltruong"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[9px] tracking-[3px] text-[#504840] uppercase hover:text-[#C8C0B0] transition-colors duration-200"
          >
            GitHub ↗
          </a>
        </div>
        <p className="font-mono text-[8px] tracking-[2px] text-[#282420] uppercase mt-24">
          © {new Date().getFullYear()} Michael Truong
        </p>
      </section>
    </div>
  )
}
