import type { Metadata } from 'next'
import './globals.css'
import GrainOverlay from '@/components/GrainOverlay'
import CustomCursor from '@/components/CustomCursor'

export const metadata: Metadata = {
  title: 'Michael Truong — Design Engineer',
  description: 'Portfolio of Michael Truong, Design Engineer.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-base text-[#F0EDE8] antialiased">
        <GrainOverlay />
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}
