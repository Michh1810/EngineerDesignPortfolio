import Link from 'next/link'
import { Project } from '@/data/projects'

interface GridCellProps {
  project: Project
}

export default function GridCell({ project }: GridCellProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="relative w-full h-full border border-[#141414] overflow-hidden group block hover:border-[#242420] transition-colors duration-300"
    >
      {/* Resting state */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-60 group-hover:opacity-0 transition-opacity duration-300">
        <span className="font-mono text-[8px] tracking-[3px] text-[#3A3830] uppercase">
          {project.number}
        </span>
        <span className="text-[11px] tracking-[0.5px] text-[#787060] text-center leading-relaxed">
          {project.category}
        </span>
        <span className="font-mono text-[7px] tracking-[2px] text-[#302E28] uppercase">
          {project.year}
        </span>
      </div>

      {/* Hover reveal */}
      <div className="absolute inset-0 bg-[#0C0C0A] opacity-0 group-hover:opacity-100 transition-opacity duration-[350ms] flex flex-col justify-end p-[18px]">
        <span className="absolute top-4 right-4 text-[12px] text-[#303028]">↗</span>
        <p className="text-[13px] text-[#F0EDE8] tracking-[-0.3px] leading-[1.35]">
          {project.title}
        </p>
        <p className="font-mono text-[8px] text-[#605048] tracking-[2px] uppercase mt-1.5">
          {project.discipline} · {project.year}
        </p>
      </div>
    </Link>
  )
}
