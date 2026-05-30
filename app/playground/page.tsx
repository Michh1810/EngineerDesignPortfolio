'use client'

import Navigation from '@/components/Navigation'

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen bg-base relative selection:bg-white/10 selection:text-white pb-24">
      <Navigation isVisible={true} isSignatureActive={false} />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 md:pt-40 flex flex-col gap-12">
        <h1 className="text-h1 text-text-primary tracking-tight">
          Playground
        </h1>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* Empty placeholders for the gallery */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className="w-full aspect-square bg-[#1A1816] rounded-2xl border border-white/5 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </main>
  )
}
