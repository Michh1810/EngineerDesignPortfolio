'use client'

import { useState } from 'react'
import CardsList from '@/components/CardsList'
import Navigation from '@/components/Navigation'

export default function Test3Page() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isForming, setIsForming] = useState(true)

  return (
    <section className="fixed inset-0 overflow-hidden bg-black">
      <Navigation isSignatureActive={activeIndex === 0} isVisible={!isForming} />
      <CardsList 
        onActiveChange={setActiveIndex} 
        onIntroComplete={() => setIsForming(false)}
      />
    </section>
  )
}
