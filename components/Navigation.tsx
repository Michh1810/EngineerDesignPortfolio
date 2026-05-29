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
      return pathname === '/'
    }
    return pathname === href
  }

  const getLinkClass = (href: string) => {
    const active = isActive(href)
    return `text-subtext hover-text-fade ${active ? 'text-text-primary' : 'text-text-secondary'}`
  }

  const getMobileLinkClass = (href: string) => {
    const active = isActive(href)
    return `text-subtext px-3 py-1 rounded-full ${active
      ? 'text-text-primary bg-white/10'
      : 'text-text-secondary hover-text-fade'
      }`
  }

  const isClient = typeof window !== 'undefined'
  const hasPlayedGlobal = isClient ? sessionStorage.getItem('introPlayed') : null

  return (
    <>
      {/* Desktop nav — top center */}
      <aside
        suppressHydrationWarning
        className={`absolute top-8 left-1/2 z-30 hidden md:flex flex-row items-center gap-8 ease-out -translate-x-1/2 ${hasPlayedGlobal ? '' : 'transition-all duration-[1000ms]'
          } ${isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
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
          className="text-subtext text-text-secondary hover-text-fade"
        >
          Resume
        </a>
      </aside>

      {/* Mobile nav — bottom pill */}
      <nav
        suppressHydrationWarning
        className={`fixed bottom-6 left-1/2 z-30 flex md:hidden flex-row items-center gap-1 px-3 py-2 rounded-full border border-white/10 ease-out -translate-x-1/2 ${hasPlayedGlobal ? '' : 'transition-all duration-[1000ms]'
          } ${isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        style={{
          background: 'rgba(12, 12, 12, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <Link href="/" className={getMobileLinkClass('/')}>
          Work
        </Link>
        <Link href="/about" className={getMobileLinkClass('/about')}>
          About
        </Link>
        <Link href="/playground" className={getMobileLinkClass('/playground')}>
          Playground
        </Link>
        <a
          href="https://drive.google.com/file/d/1tVDk23d2qJtXlljUBH_DCXF4TPI5DHDc/view"
          target="_blank"
          rel="noopener noreferrer"
          className={getMobileLinkClass('')}
        >
          Resume
        </a>
      </nav>
    </>
  )
}
