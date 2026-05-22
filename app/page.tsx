'use client'

import { useState } from 'react'
import CardsList, { CARDS } from '@/components/CardsList'
import Navigation from '@/components/Navigation'
import ProgressLoader from '@/components/ProgressLoader'

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isForming, setIsForming] = useState(true)

  const totalCards = CARDS.length + 1 // +1 for the signature card

  return (
    <section className="fixed inset-0 overflow-hidden bg-black">
      <Navigation isSignatureActive={activeIndex === 0} isVisible={!isForming} />
      <CardsList 
        onActiveChange={setActiveIndex} 
        onIntroComplete={() => setIsForming(false)}
      />
      <ProgressLoader 
        activeIndex={activeIndex} 
        totalCards={totalCards} 
        isVisible={!isForming} 
      />
    </section>
  )
}
