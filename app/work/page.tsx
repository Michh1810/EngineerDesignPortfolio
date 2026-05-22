import Link from 'next/link'

export default function WorkPage() {
  return (
    <section className="fixed inset-0 overflow-hidden bg-base">
      <nav
        aria-label="Primary navigation"
        className="absolute top-8 left-8 z-30 hidden md:flex flex-col gap-3"
      >
        <Link href="/" className="text-h3 text-[#5B5650] hover:text-[#7A746D] transition-colors">
          Michael Truong
        </Link>
        <Link href="/work" className="text-h3 text-[#F0EDE8] hover:text-[#D8D3CC] transition-colors">
          Work
        </Link>
        <Link href="/creative" className="text-h3 text-[#4E4943] hover:text-[#6A655F] transition-colors">
          Creative
        </Link>
      </nav>

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <h1 className="text-h1 text-[#F0EDE8]">Work</h1>
      </div>
    </section>
  )
}
