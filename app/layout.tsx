import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import GrainOverlay from '@/components/GrainOverlay'
import CustomCursor from '@/components/CustomCursor'

const sfProDisplay = localFont({
  src: [
    { path: './fonts/SF-Pro-Display-Regular.otf', weight: '400', style: 'normal' },
    { path: './fonts/SF-Pro-Display-RegularItalic.otf', weight: '400', style: 'italic' },
    { path: './fonts/SF-Pro-Display-Medium.otf', weight: '500', style: 'normal' },
    { path: './fonts/SF-Pro-Display-MediumItalic.otf', weight: '500', style: 'italic' },
    { path: './fonts/SF-Pro-Display-Semibold.otf', weight: '600', style: 'normal' },
    { path: './fonts/SF-Pro-Display-SemiboldItalic.otf', weight: '600', style: 'italic' },
    { path: './fonts/SF-Pro-Display-Bold.otf', weight: '700', style: 'normal' },
    { path: './fonts/SF-Pro-Display-BoldItalic.otf', weight: '700', style: 'italic' },
  ],
  variable: '--font-sf-pro-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Michael Truong — Design Engineer',
  description: 'Portfolio of Michael Truong, Design Engineer.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sfProDisplay.variable}>
      <body className="bg-base text-[#F0EDE8] antialiased font-sans">
        <CustomCursor />
        <GrainOverlay />
        {children}
      </body>
    </html>
  )
}
