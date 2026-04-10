interface HeroCellProps {
  onVideoEnd: () => void
  phase: 'video' | 'hero'
}

export default function HeroCell({ onVideoEnd, phase }: HeroCellProps) {
  const isVideo = phase === 'video'
  const isHero = phase === 'hero'

  return (
    <div className="relative w-full h-full border border-[#181816] overflow-hidden flex items-center justify-center">
      {/* Video box — starts at 66%, expands to 100% */}
      <div
        data-testid="video-box"
        className="absolute overflow-hidden transition-[width,height] duration-[900ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: isVideo ? '66%' : '100%',
          height: isVideo ? '66%' : '100%',
        }}
      >
        <div className="relative w-full h-full bg-[radial-gradient(ellipse_at_center,#181008_0%,#050505_100%)] flex flex-col items-center justify-center gap-2.5">
          <video
            autoPlay
            muted
            playsInline
            onEnded={onVideoEnd}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/intro.mp4" type="video/mp4" />
          </video>
          {/* Placeholder shown when no video file present */}
          <div className="relative z-10 flex flex-col items-center gap-2.5">
            <div className="w-10 h-10 rounded-full border border-[#F0EDE8]/15 flex items-center justify-center animate-pulse">
              <div className="w-0 h-0 border-l-[13px] border-l-[rgba(240,237,232,0.5)] border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent ml-0.5" />
            </div>
            <span className="font-mono text-[8px] tracking-[3px] text-[#302820] uppercase">intro · autoplay</span>
          </div>
        </div>
      </div>

      {/* Hero block */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-5 transition-opacity duration-700"
        style={{
          opacity: isHero ? 1 : 0,
          pointerEvents: isHero ? 'auto' : 'none',
        }}
      >
        <h1
          className="font-serif font-bold text-[#F0EDE8] tracking-[-0.8px] leading-[1.05]"
          style={{ fontSize: 'clamp(16px, 1.8vw, 26px)' }}
        >
          Michael<br />Truong
        </h1>
        <div className="w-[18px] h-px bg-[#282420] my-2.5" />
        <p className="font-mono text-[8px] tracking-[4px] text-[#605040] uppercase">Design Engineer</p>
        <div className="w-[18px] h-px bg-[#282420] my-2.5" />
        <span className="font-mono text-[7px] tracking-[3px] text-[#242018] uppercase animate-pulse">scroll ↓</span>
      </div>
    </div>
  )
}
