'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationProps {
  isSignatureActive?: boolean
  isVisible?: boolean
}

export default function Navigation({ isSignatureActive = true, isVisible = true }: NavigationProps) {
  const pathname = usePathname()

  // Detect which route is active
  const isActive = (href: string) => {
    if (href === '/') {
      // Treat the home page and sandbox test3 page both as 'Work' context
      return pathname === '/' || pathname === '/sandbox/test3'
    }
    return pathname === href
  }

  const getLinkClass = (href: string) => {
    const active = isActive(href)
    return `text-footnote transition-colors ${
      active ? 'text-[#F0EDE8] hover:text-[#D8D3CC]' : 'text-[#5B5650] hover:text-[#7A746D]'
    }`
  }

  return (
    <aside
      className={`absolute top-8 left-1/2 z-30 hidden md:flex flex-row items-center gap-8 transition-all duration-700 ease-out -translate-x-1/2 ${
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <Link href="/" className={getLinkClass('/')}>
        Work
      </Link>
      <Link href="/about" className={getLinkClass('/about')}>
        About
      </Link>
      <Link href="/playground" className={getLinkClass('/playground')}>
        Playground
      </Link>
      <a
        href="https://drive.google.com/file/d/1tVDk23d2qJtXlljUBH_DCXF4TPI5DHDc/view"
        target="_blank"
        rel="noopener noreferrer"
        className="text-footnote text-[#5B5650] hover:text-[#7A746D] transition-colors"
      >
        Resume
      </a>
    </aside>
  )
}
