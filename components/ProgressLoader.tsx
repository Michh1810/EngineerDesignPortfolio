'use client'

interface ProgressLoaderProps {
  activeIndex: number
  totalCards: number
  isVisible?: boolean
}

export default function ProgressLoader({ activeIndex, totalCards, isVisible = true }: ProgressLoaderProps) {
  // Calculate progress percentage
  const progress = ((activeIndex + 1) / totalCards) * 100

  return (
    <div
      className={`absolute bottom-8 md:bottom-12 left-1/2 z-30 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-700 ease-out ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
    >
      <div className="flex items-center justify-center px-4 py-1.5 md:px-5 md:py-2  backdrop-blur-md rounded-[15px] border border-white/10 shadow-lg">
        <span className="text-footnote md:text-footnote font-medium tracking-medium">
          <span className="text-[#AEA9A3]">{activeIndex + 1}</span>
          <span className="text-[#AEA9A3] mx-2">of</span>
          <span className="text-[#AEA9A3]">{totalCards}</span>
        </span>
      </div>
    </div>
  )
}
