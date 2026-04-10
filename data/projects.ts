export interface Project {
  id: string
  slug: string
  position: number
  number: string
  category: string
  title: string
  discipline: string
  year: string
}

export const projects: Project[] = [
  {
    id: 'experimental-code',
    slug: 'experimental-code',
    position: 1,
    number: '08',
    category: 'Experimental Code',
    title: 'Generative visual system',
    discipline: 'Experiment',
    year: '2024',
  },
  {
    id: 'product-design',
    slug: 'product-design',
    position: 2,
    number: '01',
    category: 'Product Design',
    title: 'Redesigning the checkout flow',
    discipline: 'Product',
    year: '2024',
  },
  {
    id: 'motion-work',
    slug: 'motion-work',
    position: 3,
    number: '02',
    category: 'Motion Work',
    title: 'Kinetic brand identity system',
    discipline: 'Motion',
    year: '2024',
  },
  {
    id: 'brand-design',
    slug: 'brand-design',
    position: 4,
    number: '04',
    category: 'Brand Design',
    title: 'Visual identity for a fintech startup',
    discipline: 'Brand',
    year: '2023',
  },
  {
    id: 'frontend-engineering',
    slug: 'frontend-engineering',
    position: 6,
    number: '03',
    category: 'Front-End Engineering',
    title: 'Interactive data dashboard',
    discipline: 'Frontend',
    year: '2024',
  },
  {
    id: 'creative-direction',
    slug: 'creative-direction',
    position: 7,
    number: '07',
    category: 'Creative Direction',
    title: 'Art direction for a fashion brand',
    discipline: 'Direction',
    year: '2023',
  },
  {
    id: 'ui-systems',
    slug: 'ui-systems',
    position: 8,
    number: '06',
    category: 'UI Systems',
    title: 'Design system at scale',
    discipline: 'System',
    year: '2023',
  },
  {
    id: 'web-experience',
    slug: 'web-experience',
    position: 9,
    number: '05',
    category: 'Web Experience',
    title: 'Award-winning campaign site',
    discipline: 'Frontend',
    year: '2023',
  },
]

export const projectsByPosition = Object.fromEntries(
  projects.map(p => [p.position, p])
) as Record<number, Project>
